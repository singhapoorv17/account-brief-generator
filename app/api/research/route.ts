import { NextRequest, NextResponse } from "next/server"
import { runOrthogonal, type OrthogonalResult } from "@/lib/orthogonal"
import { hasFallback, getFallback } from "@/lib/fallback-data"
import { PROVIDERS } from "@/lib/providers"
import type { AccountBrief, ProviderCall } from "@/lib/types"

const SYSTEM_PROMPT = `You are a B2B sales research analyst. Given data about a company from multiple sources, synthesize it into a structured account brief.

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
- Include 2-4 funding signals, 3-5 key hires, 2-4 buying triggers, and 2-4 contacts.
- For buying triggers, consider the seller's ICP and product when provided.
- For the outreach angle, reference specific signals that create a timely reason to reach out.
- If data is sparse for a section, include what you can and note gaps honestly.
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
        q: `${domain} recent news funding`,
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

    const contextMessage = assembleContext({
      domain,
      icp,
      product,
      linkup: linkup?.data ?? null,
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
  const parts: string[] = [`## Target Company\nDomain: ${domain}`]

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
