import { NextRequest, NextResponse } from "next/server"
import { runOrthogonal, type OrthogonalResult } from "@/lib/orthogonal"
import { hasFallback, getFallback } from "@/lib/fallback-data"
import { PROVIDERS } from "@/lib/providers"
import type { AccountBrief, ProviderCall } from "@/lib/types"

const SYSTEM_PROMPT = `You are a B2B sales research analyst. Given data about a company from multiple sources, synthesize it into a structured account brief.

CRITICAL RULES:
1. The target company is identified by its DOMAIN. Only use information that clearly relates to the company at the given domain. Discard data about other companies with similar names.
2. People in TESTIMONIALS, QUOTES, or REVIEWS on the website are CUSTOMERS, not employees. Never include them as key hires or contacts. Only include people who actually work at the target company.
3. People shown in EXAMPLE code, DEMO data, or PLACEHOLDER content (e.g. "Jane Doe", "John Smith", sample API responses) are NOT real. Never include them.
4. If you cannot confidently identify real employees of the target company, return fewer contacts rather than wrong ones.

Return ONLY valid JSON matching this exact schema — no markdown, no commentary:

{
  "companySnapshot": {
    "name": "string",
    "description": "string (2-3 sentences)",
    "hq": "string (City, State or City, Country)",
    "employeeCount": "string (e.g. '500+' or '1,000-5,000')",
    "industryTags": ["string array, 3-5 tags"]
  },
  "fundingSignals": [
    {
      "date": "YYYY-MM-DD",
      "summary": "string (1-2 sentences)",
      "sourceUrl": "string (URL or empty string if unknown)"
    }
  ],
  "keyHires": [
    {
      "name": "string",
      "title": "string",
      "startDate": "YYYY-MM-DD (approximate if needed)",
      "linkedInUrl": "string (URL or empty string if unknown)"
    }
  ],
  "buyingTriggers": [
    {
      "title": "string (short label)",
      "whyItMatters": "string (2-3 sentences explaining relevance to the seller)"
    }
  ],
  "contacts": [
    {
      "name": "string",
      "title": "string",
      "linkedInUrl": "string (URL or empty string if unknown)",
      "email": "string (optional, omit if unknown)"
    }
  ],
  "outreachAngle": "string (2-4 sentences suggesting how to approach this account)"
}

Guidelines:
- Include 2-4 funding signals, 3-5 key hires (leadership team members), 2-4 buying triggers, and 2-4 contacts.
- For keyHires: list the known leadership team and senior executives (CEO, CTO, VP, etc.). Use their actual start dates if known, otherwise approximate. Always include founders as key hires.
- For contacts: these should be the same people or a subset. Leave linkedInUrl and email as empty strings — they will be enriched by Apollo separately.
- For buying triggers, consider the seller's ICP and product when provided.
- For the outreach angle, reference specific signals that create a timely reason to reach out.
- If you cannot identify real team members, return empty arrays for keyHires and contacts. Never use placeholder names like "Unknown", "John Doe", or "Jane Smith". Only include people you can name with confidence.
- Dates should be ISO format. Use approximate dates if exact ones aren't available.`

export async function POST(req: NextRequest) {
  try {
    const { url, icp, product } = await req.json()

    const domain = parseDomain(url)
    if (!domain) {
      return NextResponse.json(
        { error: "Enter a full URL including https://" },
        { status: 400 }
      )
    }

    if (process.env.FALLBACK_MODE === "on" && hasFallback(domain)) {
      return NextResponse.json(getFallback(domain))
    }

    const providerCalls: ProviderCall[] = []

    const fullUrl = url.startsWith("http") ? url : `https://${url}`

    const actions = [
      "linkup.search",
      "peopledatalabs.v5/company/enrich",
      "scrapegraphai.api/scrape",
    ] as const

    const tasks = [
      runOrthogonal(actions[0], {
        q: `"${domain}" OR site:${domain} recent news funding`,
        outputType: "searchResults",
        depth: "standard",
      }),
      runOrthogonal(actions[1], { website: domain }, { method: "GET" }),
      runOrthogonal(actions[2], {
        url: fullUrl,
        output_format: ["summary", "json"],
      }),
    ]

    const settled = await Promise.allSettled(tasks)

    const results: (OrthogonalResult | null)[] = settled.map((s, i) => {
      const info = PROVIDERS[actions[i]]
      if (s.status === "fulfilled") {
        providerCalls.push({
          provider: info.label,
          purpose: info.purpose,
          status: "success",
          price: s.value.price,
          latencyMs: s.value.latencyMs,
        })
        return s.value
      }
      providerCalls.push({
        provider: info.label,
        purpose: info.purpose,
        status: "error",
        price: 0,
        latencyMs: 0,
      })
      return null
    })

    const [linkup, pdl, scrape] = results

    const filteredLinkup = filterLinkupResults(linkup?.data ?? null, domain)

    const contextMessage = assembleContext({
      domain,
      icp,
      product,
      linkup: filteredLinkup,
      pdl: pdl?.data ?? null,
      scrape: scrape?.data ?? null,
    })

    const synthesis = await runOrthogonal("openai.chat/completions", {
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: contextMessage },
      ],
    })

    providerCalls.push({
      provider: PROVIDERS["openai.chat/completions"].label,
      purpose: PROVIDERS["openai.chat/completions"].purpose,
      status: "success",
      price: synthesis.price,
      latencyMs: synthesis.latencyMs,
    })

    let brief: Omit<AccountBrief, "providerCalls">
    try {
      brief = parseStructured(synthesis.data)
    } catch {
      if (hasFallback(domain)) {
        return NextResponse.json(getFallback(domain))
      }
      return NextResponse.json(
        { error: "Could not synthesize a clean brief. Try again." },
        { status: 500 }
      )
    }

    const companyName = brief.companySnapshot.name

    const apolloStart = Date.now()
    const enriched = await Promise.allSettled(
      brief.contacts.map((contact) => {
        const [firstName, ...rest] = contact.name.split(" ")
        const lastName = rest.join(" ")
        return runOrthogonal("apollo.api/v1/people/match", {
          first_name: firstName,
          last_name: lastName,
          organization_name: companyName,
          domain,
        })
      })
    )
    const apolloLatency = Date.now() - apolloStart

    let apolloPrice = 0
    brief.contacts = brief.contacts.map((contact, i) => {
      const result = enriched[i]
      if (result.status !== "fulfilled") return contact
      const person = result.value.data?.person as Record<string, unknown> | undefined
      if (!person) return contact
      apolloPrice += result.value.price

      const orgDomain = String(
        (person.organization as Record<string, unknown>)?.website_url ??
        person.organization_domain ?? ""
      ).replace(/^https?:\/\//, "").replace(/\/$/, "")

      if (orgDomain && !orgDomain.includes(domain) && !domain.includes(orgDomain)) {
        return contact
      }

      return {
        ...contact,
        linkedInUrl: (person.linkedin_url as string) || contact.linkedInUrl,
        email: (person.email as string) || contact.email,
      }
    })

    brief.keyHires = brief.keyHires.map((hire) => {
      const matchingContact = brief.contacts.find((c) => c.name === hire.name)
      if (matchingContact?.linkedInUrl) {
        return { ...hire, linkedInUrl: matchingContact.linkedInUrl }
      }
      return hire
    })

    const apolloSuccesses = enriched.filter((r) => r.status === "fulfilled").length
    providerCalls.push({
      provider: PROVIDERS["apollo.api/v1/people/match"].label,
      purpose: PROVIDERS["apollo.api/v1/people/match"].purpose,
      status: apolloSuccesses > 0 ? "success" : "error",
      price: apolloPrice,
      latencyMs: apolloLatency,
    })

    const response: AccountBrief = {
      ...brief,
      providerCalls,
    }

    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Research API error:", message)
    return NextResponse.json(
      { error: "Failed to generate account brief", detail: message },
      { status: 500 }
    )
  }
}

function filterLinkupResults(
  data: Record<string, unknown> | null,
  domain: string
): Record<string, unknown> | null {
  if (!data) return null
  const results = data.results as Array<Record<string, unknown>> | undefined
  if (!Array.isArray(results)) return data

  const baseDomain = domain.replace(/^www\./, "")
  const filtered = results.filter((r) => {
    const url = String(r.url ?? "")
    const name = String(r.name ?? "").toLowerCase()
    return url.includes(baseDomain) || name.includes(baseDomain)
  })

  return { ...data, results: filtered }
}

function parseDomain(url: string | undefined): string | null {
  if (!url) return null
  try {
    const full = url.startsWith("http") ? url : `https://${url}`
    const hostname = new URL(full).hostname.replace(/^www\./, "")
    if (!hostname.includes(".")) return null
    return hostname
  } catch {
    return null
  }
}

function assembleContext({
  domain,
  icp,
  product,
  linkup,
  pdl,
  scrape,
}: {
  domain: string
  icp?: string
  product?: string
  linkup: unknown
  pdl: unknown
  scrape: unknown
}): string {
  const parts: string[] = [`## Target Company\nDomain: ${domain}\nIMPORTANT: This brief is ONLY about the company at ${domain}. Ignore any data below that refers to a different company, even if the name is similar.`]

  if (icp) parts.push(`## Seller's Ideal Customer Profile\n${icp}`)
  if (product) parts.push(`## Seller's Product\n${product}`)

  if (linkup) {
    parts.push(
      `## Recent News & Funding (via Linkup)\n${JSON.stringify(linkup, null, 2)}`
    )
  }
  if (pdl) {
    parts.push(
      `## Company Profile (via People Data Labs)\n${JSON.stringify(pdl, null, 2)}`
    )
  }
  if (scrape) {
    parts.push(
      `## Website Positioning (via ScrapeGraph)\n${JSON.stringify(scrape, null, 2)}`
    )
  }

  return parts.join("\n\n")
}

function parseStructured(
  data: Record<string, unknown>
): Omit<AccountBrief, "providerCalls"> {
  let text = ""

  const choices = data?.choices as Array<{ message?: { content?: string } }> | undefined
  if (choices?.[0]?.message?.content) {
    text = choices[0].message.content
  } else if (Array.isArray(data?.content)) {
    const block = (data.content as Array<{ type: string; text?: string }>).find(
      (b) => b.type === "text"
    )
    text = block?.text ?? ""
  } else if (typeof data?.content === "string") {
    text = data.content
  } else if (typeof data?.text === "string") {
    text = data.text
  } else {
    text = JSON.stringify(data)
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("No JSON object found in model output")

  const parsed = JSON.parse(jsonMatch[0])

  if (!parsed.companySnapshot || !parsed.outreachAngle) {
    throw new Error("Missing required fields in parsed brief")
  }

  return {
    companySnapshot: parsed.companySnapshot,
    fundingSignals: parsed.fundingSignals ?? [],
    keyHires: parsed.keyHires ?? [],
    buyingTriggers: parsed.buyingTriggers ?? [],
    contacts: parsed.contacts ?? [],
    outreachAngle: parsed.outreachAngle,
  }
}
