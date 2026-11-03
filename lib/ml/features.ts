import type { HealthFormData } from "../health/schema"
import { bmiOf } from "../health/schema"

/**
 * Maps form answers onto the BRFSS 2015 features the models were trained on.
 * Must stay in sync with `build_features()` in `ml/train.py`.
 *
 * A value of `null` means "unknown": the model then uses the training-set mean
 * for that feature, so the feature contributes nothing to the explanation.
 */
export type RawFeatures = Record<string, number | null>

/** BRFSS `_AGEG5YR`: 1 = 18-24, 2 = 25-29, ... 12 = 75-79, 13 = 80+. */
export function brfssAgeBucket(age: number): number {
  if (age < 25) return 1
  return Math.min(13, Math.floor((age - 25) / 5) + 2)
}

const has = (list: readonly string[], value: string) => list.includes(value)

export function extractFeatures(data: HealthFormData): RawFeatures {
  const highBp =
    data.bloodPressure === "high-stage1" ||
    data.bloodPressure === "high-stage2" ||
    has(data.existingConditions, "High Blood Pressure")
      ? 1
      : data.bloodPressure === "unknown"
        ? null
        : 0

  const highChol =
    data.cholesterolLevels === "high"
      ? 1
      : data.cholesterolLevels === "borderline"
        ? 0.5
        : data.cholesterolLevels === "unknown"
          ? null
          : 0

  const plantForward = data.dietType === "vegetarian" || data.dietType === "vegan" || data.dietType === "mediterranean"

  return {
    BMI: bmiOf(data),
    Age: brfssAgeBucket(data.age),
    HighBP: highBp,
    HighChol: highChol,
    // BRFSS "Smoker" = smoked at least 100 cigarettes in your life.
    Smoker: data.smokingStatus === "non-smoker" ? 0 : 1,
    Stroke: has(data.existingConditions, "Stroke") ? 1 : 0,
    // BRFSS "PhysActivity" = any exercise outside of work in the past 30 days.
    PhysActivity: data.exerciseFrequency === "sedentary" ? 0 : 1,
    Fruits: plantForward ? 1 : null,
    Veggies: plantForward ? 1 : null,
    Sex: data.gender === "male" ? 1 : data.gender === "female" ? 0 : null,
    HeartDiseaseorAttack: has(data.existingConditions, "Heart Disease") ? 1 : 0,
    Diabetes_binary: has(data.existingConditions, "Diabetes") ? 1 : 0,
  }
}

/** Expands raw features into the model's design-matrix columns. */
export function designColumn(
  name: string,
  raw: RawFeatures,
  bmiCenter: number,
  bmiScale: number,
): number | null {
  const bmi = raw.BMI === null ? null : (Math.min(60, Math.max(12, raw.BMI)) - bmiCenter) / bmiScale
  if (name === "bmi") return bmi
  if (name === "bmi_sq") return bmi === null ? null : bmi * bmi
  const age = /^age_(\d+)$/.exec(name)
  if (age) return raw.Age === null ? null : raw.Age === Number(age[1]) ? 1 : 0
  if (!(name in raw)) throw new Error(`Unknown model feature: ${name}`)
  return raw[name]
}
