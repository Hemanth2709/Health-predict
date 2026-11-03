import { describe, expect, it } from "vitest"
import { healthFormSchema, lifestyleSchema, medicalSchema, personalSchema, toFieldErrors } from "@/lib/health/schema"
import { sampleInput } from "./helpers"

describe("healthFormSchema", () => {
  it("accepts a complete submission and coerces numbers", () => {
    const data = healthFormSchema.parse(sampleInput())
    expect(data.age).toBe(35)
    expect(data.stressLevel).toBe(4)
    expect(data.painLevel).toBeUndefined()
  })

  it("rejects minors and out-of-range values", () => {
    const result = personalSchema.safeParse({ ...sampleInput(), age: "15", weight: "900" })
    expect(result.success).toBe(false)
    const errors = toFieldErrors(result.error!)
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(["age", "weight"]))
  })

  it("rejects unknown enum values (no arbitrary strings reach the model)", () => {
    const result = lifestyleSchema.safeParse({ ...sampleInput(), dietType: "<script>" })
    expect(result.success).toBe(false)
  })

  it("requires a pain level only when chronic pain is reported", () => {
    expect(medicalSchema.safeParse({ ...sampleInput(), chronicPain: "yes", painLevel: "" }).success).toBe(false)
    const ok = medicalSchema.parse({ ...sampleInput(), chronicPain: "yes", painLevel: 6 })
    expect(ok.painLevel).toBe(6)
  })

  it("requires at least one family-history and condition answer", () => {
    const result = medicalSchema.safeParse({ ...sampleInput(), familyHistory: [], existingConditions: [] })
    expect(result.success).toBe(false)
    expect(Object.keys(toFieldErrors(result.error!))).toEqual(["familyHistory", "existingConditions"])
  })

  it("caps array sizes", () => {
    const result = medicalSchema.safeParse({ ...sampleInput(), familyHistory: Array(500).fill("Diabetes") })
    expect(result.success).toBe(false)
  })
})

describe("error messages", () => {
  it("says a missing numeric field is required", () => {
    const result = personalSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(toFieldErrors(result.error!).weight).toEqual(["Weight (kg) is required"])
  })
})
