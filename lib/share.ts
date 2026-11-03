import type { AssessmentResult, CategoryId, RiskLevel } from "./risk/types"

/**
 * Share links carry only the six scores and their levels, never the answers
 * that produced them, so a shared URL does not leak health data.
 */
export interface SharedSummary {
  generatedAt: string
  overall: { risk: number; level: RiskLevel }
  categories: { id: CategoryId; category: string; risk: number; level: RiskLevel; method: "ml" | "guideline" }[]
}

const LEVELS: RiskLevel[] = ["Low Risk", "Moderate Risk", "High Risk", "Very High Risk", "Diagnosed"]
const CATEGORIES: Record<CategoryId, string> = {
  cardiovascular: "Cardiovascular",
  metabolic: "Metabolic",
  sleep: "Sleep",
  mental: "Mental",
  immune: "Immune",
  chronic: "Chronic",
}
const ML_IDS = new Set<CategoryId>(["cardiovascular", "metabolic"])

const toBase64Url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
const fromBase64Url = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"))

export function encodeShare(result: AssessmentResult): string {
  const payload = {
    v: 1,
    t: result.generatedAt.slice(0, 10),
    c: result.categories.map((c) => [c.id, c.risk, LEVELS.indexOf(c.level)]),
  }
  return toBase64Url(JSON.stringify(payload))
}

export function decodeShare(token: string | null): SharedSummary | null {
  if (!token || token.length > 1000) return null
  try {
    const payload = JSON.parse(fromBase64Url(token))
    if (payload?.v !== 1 || !Array.isArray(payload.c)) return null
    const categories = payload.c
      .filter(
        (row: unknown): row is [CategoryId, number, number] =>
          Array.isArray(row) &&
          typeof row[0] === "string" &&
          row[0] in CATEGORIES &&
          Number.isFinite(row[1]) &&
          Number.isInteger(row[2]) &&
          row[2] >= 0 &&
          row[2] < LEVELS.length,
      )
      .slice(0, 6)
      .map(([id, risk, level]: [CategoryId, number, number]) => ({
        id,
        category: CATEGORIES[id],
        risk: Math.max(0, Math.min(100, Math.round(risk))),
        level: LEVELS[level],
        method: ML_IDS.has(id) ? ("ml" as const) : ("guideline" as const),
      }))
    if (categories.length === 0) return null
    const scored = categories.filter((c: { level: RiskLevel }) => c.level !== "Diagnosed")
    const overall = scored.length
      ? Math.round(scored.reduce((s: number, c: { risk: number }) => s + c.risk, 0) / scored.length)
      : 100
    const overallLevel: RiskLevel =
      overall < 25 ? "Low Risk" : overall < 50 ? "Moderate Risk" : overall < 75 ? "High Risk" : "Very High Risk"
    return {
      generatedAt: typeof payload.t === "string" ? payload.t.slice(0, 10) : "",
      overall: { risk: overall, level: overallLevel },
      categories,
    }
  } catch {
    return null
  }
}
