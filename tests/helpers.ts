import type { HealthFormInput } from "@/lib/health/schema"

/** A complete, valid form submission. Override fields per test. */
export function sampleInput(overrides: Partial<HealthFormInput> = {}): HealthFormInput {
  return {
    age: "35",
    gender: "female",
    weight: "62",
    heightFeet: "5",
    heightInches: "5",
    bloodPressure: "normal",
    cholesterolLevels: "normal",
    lastCheckup: "6-12-months",
    exerciseFrequency: "moderate",
    exerciseTypes: ["Walking"],
    sleepHours: "7",
    sleepQuality: "good",
    dietType: "vegetarian",
    waterIntake: "moderate",
    fastFoodFrequency: "sometimes",
    screenTime: "moderate",
    outdoorTime: "moderate",
    stressLevel: "4",
    smokingStatus: "non-smoker",
    alcoholConsumption: "occasional",
    chronicPain: "no",
    painLevel: "",
    vaccinationStatus: "yes",
    familyHistory: ["None of the above"],
    existingConditions: ["None of the above"],
    ...overrides,
  }
}
