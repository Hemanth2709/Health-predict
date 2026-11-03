import type { AssessmentResult } from "@/lib/risk/types"

/**
 * Keeps the latest assessment in sessionStorage so the results pages can read it
 * without putting health data in the URL. Storage can be unavailable (private
 * mode, blocked cookies), so every access is guarded and an in-memory copy is
 * kept as a fallback for the current tab.
 */
const KEY = "vitalscope:assessment:v1"
let memory: AssessmentResult | null = null

export function saveAssessment(result: AssessmentResult): void {
  memory = result
  try {
    sessionStorage.setItem(KEY, JSON.stringify(result))
  } catch {
    // ignore: in-memory fallback is used
  }
}

export function loadAssessment(): AssessmentResult | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AssessmentResult
      if (parsed?.version === 1 && Array.isArray(parsed.categories)) return parsed
    }
  } catch {
    // fall through
  }
  return memory
}

export function clearAssessment(): void {
  memory = null
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
