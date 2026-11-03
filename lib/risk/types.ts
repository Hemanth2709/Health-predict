export type RiskLevel = "Low Risk" | "Moderate Risk" | "High Risk" | "Very High Risk" | "Diagnosed"

export interface RiskFactor {
  name: string
  /** e.g. "High negative impact" (raises risk) or "Medium positive impact" (lowers risk). */
  impact: string
  suggestion: string
  /** "model" = derived from the ML model's feature contributions; "guideline" = rule-based tip. */
  source?: "model" | "guideline"
  /** Contribution to the model's log-odds (model factors only). */
  weight?: number
}

export type CategoryId = "cardiovascular" | "metabolic" | "sleep" | "mental" | "immune" | "chronic"

export interface RiskCategoryResult {
  id: CategoryId
  category: string
  /** 0-100. For ML categories this is the population percentile of the predicted probability. */
  risk: number
  level: RiskLevel
  method: "ml" | "guideline"
  factors: RiskFactor[]
  /** ML categories only. */
  model?: {
    probability: number
    prevalence: number
    relativeRisk: number
    target: string
  }
}

export interface AssessmentResult {
  version: 1
  generatedAt: string
  overall: { risk: number; level: RiskLevel }
  bmi: number
  categories: RiskCategoryResult[]
}

export interface GuidelineScore {
  risk: number
  factors: RiskFactor[]
}
