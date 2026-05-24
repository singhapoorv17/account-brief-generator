export interface OrthogonalResult {
  data: Record<string, unknown>
  price: number
  latencyMs: number
}

interface RunPayload {
  api: string
  path: string
  method?: string
  body?: Record<string, unknown>
  query?: Record<string, unknown>
}

export async function runOrthogonal(
  action: string,
  params: Record<string, unknown>,
  options?: { method?: "GET" | "POST" }
): Promise<OrthogonalResult> {
  const apiKey = process.env.ORTHOGONAL_API_KEY
  if (!apiKey) throw new Error("ORTHOGONAL_API_KEY is not set")

  const baseUrl =
    process.env.ORTHOGONAL_BASE_URL || "https://api.orthogonal.com/v1"

  const dot = action.indexOf(".")
  if (dot === -1) throw new Error(`Invalid action format: "${action}" (expected "api.path")`)
  const api = action.substring(0, dot)
  const path = "/" + action.substring(dot + 1)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  const payload: RunPayload = { api, path }
  if (options?.method === "GET") {
    payload.method = "GET"
    payload.query = params
  } else {
    payload.body = params
  }

  const start = Date.now()
  try {
    const res = await fetch(`${baseUrl}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`Orthogonal ${action} failed (${res.status}): ${body}`)
    }

    const json = await res.json()
    const latencyMs = Date.now() - start

    const priceCents = json.priceCents ?? 0
    const price = parseFloat(json.price) || priceCents / 100

    return {
      data: json.data ?? json,
      price,
      latencyMs,
    }
  } finally {
    clearTimeout(timeout)
  }
}
