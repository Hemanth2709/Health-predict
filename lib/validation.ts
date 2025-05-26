import { z } from "zod"

// Define validation schema for health data
export const healthDataSchema = z.object({
  age: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 120
    },
    { message: "Age must be a positive number between 0 and 120" },
  ),

  gender: z.string().min(1, { message: "Gender is required" }),

  weight: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num > 0 && num <= 500
    },
    { message: "Weight must be a positive number (in kg)" },
  ),

  heightFeet: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 10
    },
    { message: "Height (feet) must be a positive number between 0 and 10" },
  ),

  heightInches: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num < 12
    },
    { message: "Height (inches) must be a number between 0 and 11" },
  ),

  exerciseFrequency: z.string().min(1, { message: "Exercise frequency is required" }),

  exerciseTypes: z.array(z.string()).optional(),

  sleepHours: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 24
    },
    { message: "Sleep hours must be a positive number between 0 and 24" },
  ),

  sleepQuality: z.string().min(1, { message: "Sleep quality is required" }),

  dietType: z.string().min(1, { message: "Diet type is required" }),

  waterIntake: z.string().min(1, { message: "Water intake is required" }),

  stressLevel: z.string().refine(
    (val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 1 && num <= 10
    },
    { message: "Stress level must be a number between 1 and 10" },
  ),

  smokingStatus: z.string().min(1, { message: "Smoking status is required" }),

  alcoholConsumption: z.string().min(1, { message: "Alcohol consumption is required" }),

  anxietyFrequency: z.string().min(1, { message: "Anxiety frequency is required" }),

  depressionFrequency: z.string().min(1, { message: "Depression frequency is required" }),

  socialConnections: z.string().min(1, { message: "Social connections is required" }),

  workLifeBalance: z.string().min(1, { message: "Work-life balance is required" }),

  mindfulnessPractice: z.string().min(1, { message: "Mindfulness practice is required" }),

  bloodPressure: z.string().min(1, { message: "Blood pressure is required" }),

  cholesterolLevels: z.string().min(1, { message: "Cholesterol levels is required" }),

  familyHistory: z.array(z.string()).optional(),

  existingConditions: z.array(z.string()).optional(),
})

// Type for validation errors
export type ValidationErrors = {
  [key: string]: string[]
}

// Function to validate health data
export function validateHealthData(data: any): {
  success: boolean
  errors?: ValidationErrors
  data?: z.infer<typeof healthDataSchema>
} {
  try {
    const validatedData = healthDataSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {}

      error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(err.message)
      })

      return { success: false, errors }
    }

    return {
      success: false,
      errors: { general: ["An unexpected error occurred during validation"] },
    }
  }
}
