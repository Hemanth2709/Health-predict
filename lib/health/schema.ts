import { z } from "zod"

/**
 * Single source of truth for the assessment form. Used by the multi-step form
 * (per-step validation) and by `POST /api/predict` (server-side validation).
 */

export const FAMILY_HISTORY_OPTIONS = [
  "Heart Disease",
  "Diabetes",
  "Cancer",
  "High Blood Pressure",
  "Stroke",
  "Mental Health Conditions",
  "Alzheimer's/Dementia",
  "Autoimmune Disorders",
] as const

export const EXISTING_CONDITION_OPTIONS = [
  "Heart Disease",
  "Diabetes",
  "Cancer",
  "High Blood Pressure",
  "Stroke",
  "Mental Health Conditions",
  "Asthma/COPD",
  "Thyroid Disorder",
  "Arthritis",
  "Digestive Disorders",
  "Kidney Disease",
  "Liver Disease",
] as const

export const EXERCISE_TYPE_OPTIONS = ["Cardio", "Strength Training", "Flexibility/Yoga", "Sports", "Walking"] as const

export const NONE_OPTION = "None of the above"

export const MIN_AGE = 18
export const MAX_AGE = 114

/** Accepts "42" or 42, rejects "", NaN and out-of-range values. */
const numeric = (label: string, min: number, max: number, opts: { int?: boolean } = {}) =>
  z
    .union([z.string(), z.number()], { message: `${label} is required` })
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .refine((v) => v !== "", { message: `${label} is required` })
    .transform((v) => Number(v))
    .pipe(
      z
        .number({ message: `${label} must be a number` })
        .refine((n) => Number.isFinite(n), { message: `${label} must be a number` })
        .refine((n) => !opts.int || Number.isInteger(n), { message: `${label} must be a whole number` })
        .refine((n) => n >= min && n <= max, { message: `${label} must be between ${min} and ${max}` }),
    )

const choice = <T extends readonly [string, ...string[]]>(label: string, values: T) =>
  z.enum(values, { message: `Please select your ${label}` })

const multiChoice = <T extends readonly [string, ...string[]]>(label: string, values: T) =>
  z
    .array(z.enum([...values, NONE_OPTION] as [string, ...string[]]))
    .max(values.length + 1)
    .min(1, { message: `Please select at least one ${label} option or '${NONE_OPTION}'` })

export const personalSchema = z.object({
  age: numeric("Age", MIN_AGE, MAX_AGE, { int: true }),
  gender: choice("gender", ["male", "female", "other"]),
  weight: numeric("Weight (kg)", 25, 300),
  heightFeet: numeric("Height (feet)", 3, 8, { int: true }),
  heightInches: numeric("Height (inches)", 0, 11, { int: true }),
  bloodPressure: choice("blood pressure", ["low", "normal", "elevated", "high-stage1", "high-stage2", "unknown"]),
  cholesterolLevels: choice("cholesterol level", ["normal", "borderline", "high", "unknown"]),
  lastCheckup: choice("last checkup", [
    "less-than-6-months",
    "6-12-months",
    "1-2-years",
    "2-5-years",
    "more-than-5-years",
    "never",
  ]),
})

export const lifestyleSchema = z.object({
  exerciseFrequency: choice("exercise frequency", ["sedentary", "light", "moderate", "active", "very-active"]),
  exerciseTypes: z.array(z.enum(EXERCISE_TYPE_OPTIONS)).max(EXERCISE_TYPE_OPTIONS.length).default([]),
  sleepHours: numeric("Sleep hours", 3, 16),
  sleepQuality: choice("sleep quality", ["poor", "fair", "average", "good", "excellent"]),
  dietType: choice("diet type", ["vegetarian", "non-vegetarian", "vegan", "mediterranean", "others"]),
  waterIntake: choice("water intake", ["low", "moderate", "high"]),
  fastFoodFrequency: choice("fast food frequency", ["never", "sometimes", "often", "frequently"]),
  screenTime: choice("screen time", ["minimal", "moderate", "high", "very-high"]),
  outdoorTime: choice("outdoor time", ["minimal", "moderate", "high", "very-high"]),
})

export const medicalSchema = z
  .object({
    stressLevel: numeric("Stress level", 1, 10, { int: true }),
    smokingStatus: choice("smoking status", ["non-smoker", "former-smoker", "occasional", "regular"]),
    alcoholConsumption: choice("alcohol consumption", ["none", "occasional", "moderate", "heavy"]),
    chronicPain: choice("chronic pain answer", ["yes", "no"]),
    painLevel: z.union([z.string(), z.number()]).optional(),
    vaccinationStatus: choice("vaccination status", ["yes", "partial", "no", "unknown"]),
    familyHistory: multiChoice("family history", FAMILY_HISTORY_OPTIONS),
    existingConditions: multiChoice("existing condition", EXISTING_CONDITION_OPTIONS),
  })
  .superRefine((val, ctx) => {
    if (val.chronicPain !== "yes") return
    const level = Number(val.painLevel)
    if (val.painLevel === undefined || val.painLevel === "" || !Number.isFinite(level) || level < 1 || level > 10) {
      ctx.addIssue({ code: "custom", path: ["painLevel"], message: "Please rate your pain level from 1 to 10" })
    }
  })
  .transform(({ painLevel, ...rest }) => ({
    ...rest,
    painLevel: rest.chronicPain === "yes" ? Number(painLevel) : undefined,
  }))

export const healthFormSchema = z
  .object({
    ...personalSchema.shape,
    ...lifestyleSchema.shape,
  })
  .and(medicalSchema)

export type HealthFormInput = z.input<typeof healthFormSchema>
export type HealthFormData = z.output<typeof healthFormSchema>

export const STEP_SCHEMAS = { 1: personalSchema, 2: lifestyleSchema, 3: medicalSchema } as const

export type FieldErrors = Record<string, string[]>

/** Flattens zod issues to `{ field: [messages] }`, keyed by the top-level field name. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "general")
    ;(errors[field] ??= []).push(issue.message)
  }
  return errors
}

export function heightInCm(data: Pick<HealthFormData, "heightFeet" | "heightInches">): number {
  return Math.round(data.heightFeet * 30.48 + data.heightInches * 2.54)
}

export function bmiOf(data: Pick<HealthFormData, "weight" | "heightFeet" | "heightInches">): number {
  const meters = heightInCm(data) / 100
  return data.weight / (meters * meters)
}
