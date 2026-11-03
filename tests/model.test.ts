import { describe, expect, it } from "vitest"
import parity from "./fixtures/model_parity.json"
import { healthFormSchema } from "@/lib/health/schema"
import { brfssAgeBucket, extractFeatures } from "@/lib/ml/features"
import { levelFromRelativeRisk, percentileOf, predict, scoreRaw, type ModelName } from "@/lib/ml/predict"
import { sampleInput } from "./helpers"

const parse = (overrides = {}) => healthFormSchema.parse(sampleInput(overrides))

describe("TypeScript inference matches scikit-learn", () => {
  for (const model of ["metabolic", "cardiovascular"] as ModelName[]) {
    it(`${model}: 50 held-out rows agree to 1e-9`, () => {
      const rows = (parity as Record<string, { raw: Record<string, number>; probability: number }[]>)[model]
      expect(rows).toHaveLength(50)
      for (const row of rows) {
        expect(scoreRaw(model, row.raw).probability).toBeCloseTo(row.probability, 9)
      }
    })
  }
})

describe("feature mapping", () => {
  it("maps ages to BRFSS 5-year buckets", () => {
    expect(brfssAgeBucket(18)).toBe(1)
    expect(brfssAgeBucket(24)).toBe(1)
    expect(brfssAgeBucket(25)).toBe(2)
    expect(brfssAgeBucket(44)).toBe(5)
    expect(brfssAgeBucket(79)).toBe(12)
    expect(brfssAgeBucket(95)).toBe(13)
  })

  it("treats unknown blood pressure / cholesterol as missing", () => {
    const raw = extractFeatures(parse({ bloodPressure: "unknown", cholesterolLevels: "unknown" }))
    expect(raw.HighBP).toBeNull()
    expect(raw.HighChol).toBeNull()
  })

  it("flags high blood pressure from the condition list", () => {
    const raw = extractFeatures(parse({ existingConditions: ["High Blood Pressure"] }))
    expect(raw.HighBP).toBe(1)
  })

  it("computes BMI from kg and feet/inches", () => {
    const raw = extractFeatures(parse({ weight: "70", heightFeet: "5", heightInches: "9" }))
    expect(raw.BMI).toBeCloseTo(70 / 1.75 ** 2, 1)
  })
})

describe("predictions", () => {
  it("is monotonic in the obvious risk factors", () => {
    const healthy = predict("cardiovascular", parse())
    const risky = predict(
      "cardiovascular",
      parse({
        age: "68",
        gender: "male",
        weight: "105",
        bloodPressure: "high-stage2",
        cholesterolLevels: "high",
        smokingStatus: "regular",
        exerciseFrequency: "sedentary",
      }),
    )
    expect(risky.probability).toBeGreaterThan(healthy.probability * 5)
    expect(risky.percentile).toBeGreaterThan(90)
    expect(healthy.percentile).toBeLessThan(30)
  })

  it("explains the prediction with signed factors", () => {
    const p = predict("metabolic", parse({ weight: "110", bloodPressure: "high-stage1" }))
    const bmi = p.factors.find((f) => f.name === "Weight (BMI)")
    const bp = p.factors.find((f) => f.name === "Blood Pressure")
    expect(bmi?.impact).toMatch(/negative/)
    expect(bp?.impact).toMatch(/negative/)
    expect(p.factors.every((f) => f.suggestion.length > 0)).toBe(true)
  })

  it("marks the target condition as diagnosed when already reported", () => {
    expect(predict("metabolic", parse({ existingConditions: ["Diabetes"] })).diagnosed).toBe(true)
    expect(predict("cardiovascular", parse({ existingConditions: ["Heart Disease"] })).diagnosed).toBe(true)
  })
})

describe("helpers", () => {
  it("interpolates percentiles", () => {
    const q = Array.from({ length: 101 }, (_, i) => i / 100)
    expect(percentileOf(-1, q)).toBe(0)
    expect(percentileOf(2, q)).toBe(100)
    expect(percentileOf(0.425, q)).toBeCloseTo(42.5, 6)
  })

  it("maps relative risk to levels", () => {
    expect(levelFromRelativeRisk(0.5)).toBe("Low Risk")
    expect(levelFromRelativeRisk(1)).toBe("Moderate Risk")
    expect(levelFromRelativeRisk(2)).toBe("High Risk")
    expect(levelFromRelativeRisk(4)).toBe("Very High Risk")
  })
})

describe("explanations", () => {
  it("does not list the absence of a condition as a factor", () => {
    const p = predict("cardiovascular", parse())
    expect(p.factors.map((f) => f.name)).not.toContain("Diabetes")
    expect(p.factors.map((f) => f.name)).not.toContain("Stroke History")
  })

  it("lists an existing condition as a risk-raising factor", () => {
    const p = predict("cardiovascular", parse({ existingConditions: ["Diabetes"] }))
    expect(p.factors.find((f) => f.name === "Diabetes")?.impact).toMatch(/negative/)
  })
})
