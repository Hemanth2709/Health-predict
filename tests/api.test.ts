import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/predict/route"
import type { AssessmentResult } from "@/lib/risk/types"
import { sampleInput } from "./helpers"

const request = (body: string) =>
  new NextRequest("http://localhost/api/predict", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  })

describe("POST /api/predict", () => {
  it("returns six categories, two of them from the ML model", async () => {
    const res = await POST(request(JSON.stringify(sampleInput())))
    expect(res.status).toBe(200)
    expect(res.headers.get("cache-control")).toBe("no-store")
    const body = (await res.json()) as AssessmentResult
    expect(body.categories.map((c) => c.id)).toEqual([
      "cardiovascular",
      "metabolic",
      "sleep",
      "mental",
      "immune",
      "chronic",
    ])
    expect(body.categories.filter((c) => c.method === "ml")).toHaveLength(2)
    for (const c of body.categories) {
      expect(c.risk).toBeGreaterThanOrEqual(0)
      expect(c.risk).toBeLessThanOrEqual(100)
      expect(c.factors.length).toBeGreaterThan(0)
    }
  })

  it("is deterministic", async () => {
    const a = (await (await POST(request(JSON.stringify(sampleInput())))).json()) as AssessmentResult
    const b = (await (await POST(request(JSON.stringify(sampleInput())))).json()) as AssessmentResult
    expect(a.categories).toEqual(b.categories)
  })

  it("returns 422 with field errors for invalid input", async () => {
    const res = await POST(request(JSON.stringify({ ...sampleInput(), age: "abc" })))
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.fieldErrors.age).toBeDefined()
  })

  it("returns 400 for malformed JSON and 413 for oversized bodies", async () => {
    expect((await POST(request("{not json"))).status).toBe(400)
    expect((await POST(request(JSON.stringify({ pad: "x".repeat(20_000) })))).status).toBe(413)
  })
})
