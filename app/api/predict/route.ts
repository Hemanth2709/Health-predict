import { NextResponse, type NextRequest } from "next/server"
import { healthFormSchema, toFieldErrors } from "@/lib/health/schema"
import { assessHealth } from "@/lib/risk/assess"

const MAX_BODY_BYTES = 16 * 1024

const noStore = { "Cache-Control": "no-store" }

/**
 * Validates the assessment form and returns risk scores.
 *
 * Privacy: the request body is processed in memory and never stored or logged.
 */
export async function POST(request: NextRequest) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413, headers: noStore })
  }

  let body: unknown
  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413, headers: noStore })
    }
    body = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: noStore })
  }

  const parsed = healthFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: toFieldErrors(parsed.error) },
      { status: 422, headers: noStore },
    )
  }

  try {
    return NextResponse.json(assessHealth(parsed.data), { headers: noStore })
  } catch {
    console.error("Assessment failed")
    return NextResponse.json({ error: "Could not compute your assessment" }, { status: 500, headers: noStore })
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } })
}
