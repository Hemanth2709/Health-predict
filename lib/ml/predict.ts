import modelFile from "./model.json"
import type { HealthFormData } from "../health/schema"
import { designColumn, extractFeatures, type RawFeatures } from "./features"
import type { RiskFactor, RiskLevel } from "../risk/types"

export type ModelName = "metabolic" | "cardiovascular"

interface LogisticModel {
  target: string
  prevalence: number
  intercept: number
  features: string[]
  coefficients: number[]
  means: number[]
  percentiles: number[]
  metrics: { roc_auc: number; pr_auc: number; brier: number; cv5_roc_auc_mean: number }
}

interface ModelFile {
  trained_on: string
  trained_at: string
  n_rows: number
  bmi_center: number
  bmi_scale: number
  models: Record<ModelName, LogisticModel>
}

const MODEL = modelFile as unknown as ModelFile

export const MODEL_INFO = {
  dataset: MODEL.trained_on,
  trainedAt: MODEL.trained_at,
  rows: MODEL.n_rows,
  metrics: {
    metabolic: MODEL.models.metabolic.metrics,
    cardiovascular: MODEL.models.cardiovascular.metrics,
  },
}

export interface ModelPrediction {
  model: ModelName
  /** Calibrated probability (0-1) of the target condition for this profile. */
  probability: number
  /** Share of surveyed adults with a lower predicted probability (0-100). */
  percentile: number
  /** probability / population prevalence. */
  relativeRisk: number
  prevalence: number
  level: RiskLevel
  /** True if the user already reported the condition the model predicts. */
  diagnosed: boolean
  factors: RiskFactor[]
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

/** Linear interpolation of `p` within the 101 test-set quantiles. */
export function percentileOf(p: number, quantiles: number[]): number {
  if (p <= quantiles[0]) return 0
  const last = quantiles.length - 1
  if (p >= quantiles[last]) return 100
  let lo = 0
  let hi = last
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (quantiles[mid] <= p) lo = mid
    else hi = mid
  }
  const span = quantiles[hi] - quantiles[lo]
  const frac = span > 0 ? (p - quantiles[lo]) / span : 0
  return ((lo + frac) / last) * 100
}

export function levelFromRelativeRisk(rr: number): RiskLevel {
  if (rr < 0.8) return "Low Risk"
  if (rr < 1.5) return "Moderate Risk"
  if (rr < 2.5) return "High Risk"
  return "Very High Risk"
}

/** Which human-readable factor each model column belongs to. */
function groupOf(feature: string): string {
  if (feature.startsWith("age_")) return "Age"
  if (feature === "bmi" || feature === "bmi_sq") return "Weight (BMI)"
  return (
    {
      HighBP: "Blood Pressure",
      HighChol: "Cholesterol",
      Smoker: "Smoking",
      Stroke: "Stroke History",
      PhysActivity: "Physical Activity",
      Fruits: "Fruits & Vegetables",
      Veggies: "Fruits & Vegetables",
      Sex: "Sex",
      HeartDiseaseorAttack: "Heart Disease History",
      Diabetes_binary: "Diabetes",
    } as Record<string, string>
  )[feature] ?? feature
}

function suggestionFor(group: string, raises: boolean, raw: RawFeatures): string {
  const bmi = raw.BMI === null ? null : raw.BMI.toFixed(1)
  switch (group) {
    case "Age":
      return raises
        ? "Risk naturally rises with age. Regular screenings help catch problems early."
        : "Your age group has a lower baseline risk than the average adult."
    case "Weight (BMI)":
      return raises
        ? `Your BMI of ${bmi} adds to your risk. Losing 5-10% of body weight measurably lowers it.`
        : `Your BMI of ${bmi} is helping keep this risk down.`
    case "Blood Pressure":
      return raises
        ? "High blood pressure is one of the strongest drivers here. Talk to a clinician about managing it."
        : "Normal blood pressure is protective. Keep checking it at least once a year."
    case "Cholesterol":
      return raises
        ? "Raised cholesterol increases risk. Consider a lipid panel and diet changes such as more fibre and less saturated fat."
        : "Healthy cholesterol is working in your favour."
    case "Smoking":
      return raises
        ? "A smoking history raises risk. If you still smoke, quitting is the single most effective change."
        : "Not smoking is one of the best things you can do for this risk."
    case "Stroke History":
      return "A previous stroke raises risk. Stick closely to your follow-up and medication plan."
    case "Physical Activity":
      return raises
        ? "No regular exercise raises risk. Aim for 150 minutes of moderate activity a week."
        : "Regular physical activity is lowering your risk. Keep it up."
    case "Fruits & Vegetables":
      return "Eating fruit and vegetables daily is linked with lower risk."
    case "Sex":
      return raises
        ? "Men have a higher baseline risk for this condition in the survey data. This can't be changed, but it's worth knowing."
        : "Women have a lower baseline risk for this condition in the survey data."
    case "Heart Disease History":
      return "Existing heart disease is linked with higher metabolic risk. Ask about glucose screening at your next visit."
    case "Diabetes":
      return "Diabetes roughly doubles cardiovascular risk. Good glucose control and blood pressure management help."
    default:
      return ""
  }
}

const HISTORY_GROUPS = new Set(["Stroke History", "Heart Disease History", "Diabetes"])

function impactLabel(contribution: number): string {
  const magnitude = Math.abs(contribution)
  const strength = magnitude >= 0.5 ? "High" : magnitude >= 0.2 ? "Medium" : "Low"
  return `${strength} ${contribution > 0 ? "negative" : "positive"} impact`
}

/**
 * Logistic-regression inference on BRFSS-style raw features. Unknown values
 * (`null`) fall back to the training mean. Returns the probability and the
 * per-factor contributions to the log-odds relative to the average adult.
 */
export function scoreRaw(model: ModelName, raw: RawFeatures) {
  const m = MODEL.models[model]
  let logit = m.intercept
  const contributions = new Map<string, number>()
  m.features.forEach((feature, i) => {
    const value = designColumn(feature, raw, MODEL.bmi_center, MODEL.bmi_scale) ?? m.means[i]
    logit += m.coefficients[i] * value
    const group = groupOf(feature)
    contributions.set(group, (contributions.get(group) ?? 0) + m.coefficients[i] * (value - m.means[i]))
  })
  return { probability: sigmoid(logit), contributions }
}

export function predict(model: ModelName, data: HealthFormData): ModelPrediction {
  const m = MODEL.models[model]
  const raw = extractFeatures(data)
  const { probability, contributions } = scoreRaw(model, raw)
  const relativeRisk = probability / m.prevalence
  const diagnosed = raw[m.target] === 1

  const factors: RiskFactor[] = [...contributions.entries()]
    .filter(([, c]) => Math.abs(c) >= 0.05)
    // "You don't have condition X" is not useful advice, so only show history factors that raise risk.
    .filter(([group, c]) => c > 0 || !HISTORY_GROUPS.has(group))
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .map(([group, c]) => ({
      name: group,
      impact: impactLabel(c),
      suggestion: suggestionFor(group, c > 0, raw),
      source: "model" as const,
      weight: Number(c.toFixed(3)),
    }))

  return {
    model,
    probability,
    percentile: percentileOf(probability, m.percentiles),
    relativeRisk,
    prevalence: m.prevalence,
    level: levelFromRelativeRisk(relativeRisk),
    diagnosed,
    factors,
  }
}
