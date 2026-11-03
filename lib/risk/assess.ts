import { bmiOf, type HealthFormData } from "../health/schema"
import { predict, type ModelName, type ModelPrediction } from "../ml/predict"
import {
  calculateChronicRisk,
  calculateImmuneRisk,
  calculateMentalRisk,
  calculateSleepRisk,
  cardiovascularLifestyleTips,
  metabolicLifestyleTips,
} from "./guidelines"
import type { AssessmentResult, CategoryId, GuidelineScore, RiskCategoryResult, RiskFactor, RiskLevel } from "./types"

export function levelFromScore(score: number): RiskLevel {
  if (score < 25) return "Low Risk"
  if (score < 50) return "Moderate Risk"
  if (score < 75) return "High Risk"
  return "Very High Risk"
}

const MAX_FACTORS = 6

function mergeFactors(primary: RiskFactor[], extra: RiskFactor[]): RiskFactor[] {
  const seen = new Set(primary.map((f) => f.name))
  return [...primary, ...extra.filter((f) => !seen.has(f.name))].slice(0, MAX_FACTORS)
}

function mlCategory(
  id: CategoryId & ModelName,
  label: string,
  prediction: ModelPrediction,
  tips: RiskFactor[],
  target: string,
): RiskCategoryResult {
  if (prediction.diagnosed) {
    return {
      id,
      category: label,
      risk: 100,
      level: "Diagnosed",
      method: "ml",
      factors: mergeFactors(
        [
          {
            name: "Existing Diagnosis",
            impact: "High negative impact",
            suggestion: `You reported an existing ${target}, so a risk estimate doesn't apply. Keep following your care plan and go to your regular check-ups.`,
            source: "guideline",
          },
        ],
        tips,
      ),
      model: {
        probability: 1,
        prevalence: prediction.prevalence,
        relativeRisk: 1 / prediction.prevalence,
        target,
      },
    }
  }
  return {
    id,
    category: label,
    risk: Math.round(prediction.percentile),
    level: prediction.level,
    method: "ml",
    factors: mergeFactors(prediction.factors, tips),
    model: {
      probability: Number(prediction.probability.toFixed(4)),
      prevalence: Number(prediction.prevalence.toFixed(4)),
      relativeRisk: Number(prediction.relativeRisk.toFixed(2)),
      target,
    },
  }
}

function guidelineCategory(id: CategoryId, label: string, score: GuidelineScore): RiskCategoryResult {
  const risk = Math.max(0, Math.min(100, score.risk))
  return { id, category: label, risk, level: levelFromScore(risk), method: "guideline", factors: score.factors }
}

export function assessHealth(data: HealthFormData, now: Date = new Date()): AssessmentResult {
  const bmi = bmiOf(data)

  const categories: RiskCategoryResult[] = [
    mlCategory(
      "cardiovascular",
      "Cardiovascular",
      predict("cardiovascular", data),
      cardiovascularLifestyleTips(data),
      "coronary heart disease or heart attack",
    ),
    mlCategory(
      "metabolic",
      "Metabolic",
      predict("metabolic", data),
      metabolicLifestyleTips(data),
      "diabetes or prediabetes",
    ),
    guidelineCategory("sleep", "Sleep", calculateSleepRisk(data)),
    guidelineCategory("mental", "Mental", calculateMentalRisk(data)),
    guidelineCategory("immune", "Immune", calculateImmuneRisk(data)),
    guidelineCategory("chronic", "Chronic", calculateChronicRisk(data, bmi)),
  ]

  const scored = categories.filter((c) => c.level !== "Diagnosed")
  const overallRisk = scored.length
    ? Math.round(scored.reduce((sum, c) => sum + c.risk, 0) / scored.length)
    : 100

  return {
    version: 1,
    generatedAt: now.toISOString(),
    overall: { risk: overallRisk, level: levelFromScore(overallRisk) },
    bmi: Number(bmi.toFixed(1)),
    categories,
  }
}
