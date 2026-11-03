import type { HealthFormData } from "../health/schema"
import type { GuidelineScore, RiskFactor } from "./types"

/**
 * Guideline-based scores for the categories that the CDC BRFSS dataset cannot
 * model (sleep, mental wellbeing, immune health, chronic disease). Points are
 * assigned using public-health guidance (e.g. 7-9 h sleep, 150 min/week of
 * activity, CDC alcohol limits). These are heuristics, not trained models, and
 * the UI labels them as such.
 */

export function calculateSleepRisk(userData: HealthFormData): GuidelineScore {
  let risk = 0
  const factors: RiskFactor[] = []

  // Sleep hours
  if (userData.sleepHours) {
    const sleepHours = userData.sleepHours
    if (sleepHours < 6) {
      risk += 30
      factors.push({
        name: "Sleep Duration",
        impact: "High negative impact",
        suggestion: `Aim for 7-8 hours of sleep instead of your current ${sleepHours} hours`,
      })
    } else if (sleepHours > 9) {
      risk += 15
      factors.push({
        name: "Sleep Duration",
        impact: "Medium negative impact",
        suggestion: "Excessive sleep can affect quality. Aim for 7-8 hours of quality sleep.",
      })
    } else if (sleepHours >= 7 && sleepHours <= 8) {
      factors.push({
        name: "Sleep Duration",
        impact: "High positive impact",
        suggestion: "Your sleep duration is optimal",
      })
    }
  }

  // Sleep quality
  if (userData.sleepQuality) {
    if (userData.sleepQuality === "poor") {
      risk += 25
      factors.push({
        name: "Sleep Quality",
        impact: "High negative impact",
        suggestion: "Create a dark, quiet, and cool sleeping environment",
      })
    } else if (userData.sleepQuality === "fair") {
      risk += 15
      factors.push({
        name: "Sleep Quality",
        impact: "Medium negative impact",
        suggestion: "Establish a consistent pre-sleep routine to improve sleep quality",
      })
    } else if (userData.sleepQuality === "excellent" || userData.sleepQuality === "good") {
      factors.push({
        name: "Sleep Quality",
        impact: "High positive impact",
        suggestion: "Continue maintaining your good sleep environment",
      })
    }
  }

  // Screen time
  if (userData.screenTime) {
    if (userData.screenTime === "high" || userData.screenTime === "very-high") {
      risk += 20
      factors.push({
        name: "Screen Time",
        impact: "High negative impact",
        suggestion: "Avoid screens 1-2 hours before bedtime",
      })
    } else if (userData.screenTime === "moderate") {
      risk += 10
      factors.push({
        name: "Screen Time",
        impact: "Medium negative impact",
        suggestion: "Try to reduce screen time, especially before bed",
      })
    }
  }

  // Stress level
  if (userData.stressLevel) {
    const stressLevel = userData.stressLevel
    if (stressLevel >= 7) {
      risk += 20
      factors.push({
        name: "Stress",
        impact: "Medium negative impact",
        suggestion: "Try meditation or deep breathing before sleep",
      })
    } else if (stressLevel >= 5) {
      risk += 10
      factors.push({
        name: "Stress",
        impact: "Low negative impact",
        suggestion: "Consider relaxation techniques to improve sleep",
      })
    }
  }

  // Alcohol consumption
  if (userData.alcoholConsumption) {
    if (userData.alcoholConsumption === "heavy" || userData.alcoholConsumption === "moderate") {
      risk += 15
      factors.push({
        name: "Alcohol Consumption",
        impact: "Medium negative impact",
        suggestion: "Alcohol disrupts sleep quality. Try to avoid alcohol close to bedtime.",
      })
    }
  }

  // Exercise timing
  if (userData.exerciseFrequency && userData.exerciseFrequency !== "sedentary") {
    factors.push({
      name: "Exercise Timing",
      impact: "Low negative impact",
      suggestion: "Avoid intense exercise 3 hours before bed",
    })
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Sleep Consistency",
      impact: "Medium negative impact",
      suggestion: "Try to go to bed at the same time each night",
    })
  }

  // Cap risk between 15 and 80
  risk = Math.max(15, Math.min(80, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5).map((f) => ({ ...f, source: "guideline" as const })) }
}

export function calculateMentalRisk(userData: HealthFormData): GuidelineScore {
  let risk = 0
  const factors: RiskFactor[] = []

  // Stress level
  if (userData.stressLevel) {
    const stressLevel = userData.stressLevel
    if (stressLevel >= 8) {
      risk += 30
      factors.push({
        name: "Stress Management",
        impact: "High negative impact",
        suggestion: "Your stress levels are high. Consider professional support and stress reduction techniques.",
      })
    } else if (stressLevel >= 6) {
      risk += 20
      factors.push({
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Consider adding mindfulness practice to manage stress",
      })
    } else if (stressLevel <= 3) {
      factors.push({
        name: "Stress Management",
        impact: "High positive impact",
        suggestion: "Continue your effective stress management techniques",
      })
    }
  }

  // Time outdoors (the form does not ask about social connections directly)
  if (userData.outdoorTime === "minimal") {
    risk += 15
    factors.push({
      name: "Outdoor Time",
      impact: "Medium negative impact",
      suggestion: "Spending more time outdoors is linked with better mood and more social contact",
    })
  }

  // Sleep quality
  if (userData.sleepQuality) {
    if (userData.sleepQuality === "poor" || userData.sleepQuality === "fair") {
      risk += 20
      factors.push({
        name: "Sleep",
        impact: "Medium negative impact",
        suggestion: "Improve sleep quality with a consistent schedule",
      })
    }
  } else if (userData.sleepHours) {
    const sleepHours = userData.sleepHours
    if (sleepHours < 6) {
      risk += 20
      factors.push({
        name: "Sleep",
        impact: "Medium negative impact",
        suggestion: "Poor sleep affects mental health. Aim for 7-8 hours nightly.",
      })
    }
  }

  // Exercise
  if (userData.exerciseFrequency) {
    if (userData.exerciseFrequency === "sedentary" || userData.exerciseFrequency === "light") {
      risk += 15
      factors.push({
        name: "Physical Activity",
        impact: "Medium negative impact",
        suggestion: "Regular exercise can significantly improve mood and reduce anxiety",
      })
    } else if (userData.exerciseFrequency === "active" || userData.exerciseFrequency === "very-active") {
      risk -= 15
      factors.push({
        name: "Physical Activity",
        impact: "High positive impact",
        suggestion: "Exercise is benefiting your mental health",
      })
    }
  }

  // Outdoor time
  if (userData.outdoorTime) {
    if (userData.outdoorTime === "minimal") {
      risk += 15
      factors.push({
        name: "Outdoor Time",
        impact: "Medium negative impact",
        suggestion: "Spending time in nature can improve mental wellbeing",
      })
    } else if (userData.outdoorTime === "high" || userData.outdoorTime === "very-high") {
      risk -= 10
      factors.push({
        name: "Outdoor Time",
        impact: "Medium positive impact",
        suggestion: "Your time outdoors benefits your mental health",
      })
    }
  }

  // Family history
  if (userData.familyHistory && userData.familyHistory.includes("Mental Health Conditions")) {
    risk += 15
    factors.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "With your family history, be proactive about mental health care",
    })
  }

  // Existing conditions
  if (userData.existingConditions) {
    if (userData.existingConditions.includes("Mental Health Conditions")) {
      risk += 25
      factors.push({
        name: "Mental Health Condition",
        impact: "High negative impact",
        suggestion: "Continue with your treatment plan and regular check-ins with healthcare providers",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Mindfulness",
      impact: "Medium positive impact",
      suggestion: "Regular mindfulness practice can improve mental wellbeing",
    })
  }

  // Cap risk between 10 and 80
  risk = Math.max(10, Math.min(80, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5).map((f) => ({ ...f, source: "guideline" as const })) }
}

export function calculateImmuneRisk(userData: HealthFormData): GuidelineScore {
  let risk = 0
  const factors: RiskFactor[] = []

  // Vaccination status
  if (userData.vaccinationStatus) {
    if (userData.vaccinationStatus === "yes") {
      risk -= 15
      factors.push({
        name: "Vaccination",
        impact: "High positive impact",
        suggestion: "Staying up-to-date with vaccinations strengthens your immune protection",
      })
    } else if (userData.vaccinationStatus === "no") {
      risk += 20
      factors.push({
        name: "Vaccination",
        impact: "High negative impact",
        suggestion: "Consider updating your vaccinations to improve immune protection",
      })
    } else if (userData.vaccinationStatus === "partial") {
      risk += 10
      factors.push({
        name: "Vaccination",
        impact: "Medium negative impact",
        suggestion: "Complete your vaccination schedule for better immune protection",
      })
    }
  }

  // Sleep quality
  if (userData.sleepQuality) {
    if (userData.sleepQuality === "poor") {
      risk += 15
      factors.push({
        name: "Sleep Quality",
        impact: "Medium negative impact",
        suggestion: "Poor sleep can weaken immune function; aim for 7-8 hours of quality sleep",
      })
    }
  } else if (userData.sleepHours) {
    const sleepHours = userData.sleepHours
    if (sleepHours < 6) {
      risk += 15
      factors.push({
        name: "Sleep Duration",
        impact: "Medium negative impact",
        suggestion: "Insufficient sleep weakens immunity. Aim for 7-8 hours nightly.",
      })
    }
  }

  // Stress level
  if (userData.stressLevel) {
    const stressLevel = userData.stressLevel
    if (stressLevel >= 7) {
      risk += 20
      factors.push({
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Chronic stress suppresses immune function; consider stress reduction techniques",
      })
    }
  }

  // Diet
  if (userData.dietType) {
    if (userData.dietType === "mediterranean" || userData.dietType === "vegetarian") {
      risk -= 10
      factors.push({
        name: "Nutrition",
        impact: "Medium positive impact",
        suggestion: "Continue consuming a variety of fruits and vegetables rich in antioxidants",
      })
    }
  } else if (userData.fastFoodFrequency === "frequently") {
    risk += 15
    factors.push({
      name: "Nutrition",
      impact: "Medium negative impact",
      suggestion: "A diet high in processed foods may weaken immunity. Increase fruits and vegetables.",
    })
  }

  // Exercise
  if (userData.exerciseFrequency) {
    if (userData.exerciseFrequency === "sedentary") {
      risk += 15
      factors.push({
        name: "Physical Activity",
        impact: "Medium negative impact",
        suggestion: "Regular moderate exercise supports immune health",
      })
    } else if (userData.exerciseFrequency === "moderate" || userData.exerciseFrequency === "active") {
      risk -= 10
      factors.push({
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Your exercise routine supports immune function",
      })
    } else if (userData.exerciseFrequency === "very-active") {
      risk += 5
      factors.push({
        name: "Physical Activity",
        impact: "Low negative impact",
        suggestion: "Very intense exercise may temporarily suppress immunity. Ensure adequate recovery.",
      })
    }
  }

  // Smoking
  if (userData.smokingStatus) {
    if (userData.smokingStatus === "regular" || userData.smokingStatus === "occasional") {
      risk += 20
      factors.push({
        name: "Smoking",
        impact: "High negative impact",
        suggestion: "Smoking weakens immune function and lung defenses",
      })
    }
  }

  // Alcohol
  if (userData.alcoholConsumption) {
    if (userData.alcoholConsumption === "heavy") {
      risk += 20
      factors.push({
        name: "Alcohol Consumption",
        impact: "High negative impact",
        suggestion: "Excessive alcohol weakens immune function",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Hydration",
      impact: "Medium positive impact",
      suggestion: "Staying well-hydrated supports immune function",
    })
  }

  // Cap risk between 15 and 75
  risk = Math.max(15, Math.min(75, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5).map((f) => ({ ...f, source: "guideline" as const })) }
}

export function calculateChronicRisk(userData: HealthFormData, bmi: number): GuidelineScore {
  let risk = 0
  const factors: RiskFactor[] = []

  // Age factor
  if (userData.age) {
    const age = userData.age
    if (age >= 60) {
      risk += 25
      factors.push({
        name: "Age",
        impact: "High negative impact",
        suggestion: "Regular preventive screenings are essential at your age",
      })
    } else if (age >= 45) {
      risk += 15
      factors.push({
        name: "Age",
        impact: "Medium negative impact",
        suggestion: "Begin regular screenings for common chronic conditions",
      })
    }
  }

  // Family history
  if (userData.familyHistory) {
    let familyRiskCount = 0
    if (userData.familyHistory.includes("Heart Disease")) familyRiskCount++
    if (userData.familyHistory.includes("Diabetes")) familyRiskCount++
    if (userData.familyHistory.includes("Cancer")) familyRiskCount++
    if (userData.familyHistory.includes("High Blood Pressure")) familyRiskCount++

    if (familyRiskCount >= 2) {
      risk += 25
      factors.push({
        name: "Family History",
        impact: "High negative impact",
        suggestion: "With your family history, regular preventive screenings are essential",
      })
    } else if (familyRiskCount === 1) {
      risk += 15
      factors.push({
        name: "Family History",
        impact: "Medium negative impact",
        suggestion: "Your family history increases risk for certain conditions. Regular check-ups are important.",
      })
    }
  }

  // BMI factor
  if (bmi) {
    if (bmi >= 30) {
      risk += 25
      factors.push({
        name: "Weight Management",
        impact: "Medium negative impact",
        suggestion: "Maintaining a healthy weight reduces risk of multiple chronic conditions",
      })
    } else if (bmi >= 25) {
      risk += 15
      factors.push({
        name: "Weight Management",
        impact: "Low negative impact",
        suggestion: "Even modest weight loss can reduce chronic disease risk",
      })
    }
  }

  // Diet quality
  if (userData.dietType) {
    if (userData.fastFoodFrequency === "frequently" || userData.fastFoodFrequency === "often") {
      risk += 20
      factors.push({
        name: "Diet Quality",
        impact: "Medium negative impact",
        suggestion: "Reducing processed foods can lower chronic disease risk",
      })
    } else if (userData.dietType === "mediterranean") {
      risk -= 15
      factors.push({
        name: "Diet Quality",
        impact: "High positive impact",
        suggestion: "Your diet helps protect against many chronic diseases",
      })
    }
  }

  // Physical activity
  if (userData.exerciseFrequency) {
    if (userData.exerciseFrequency === "sedentary" || userData.exerciseFrequency === "light") {
      risk += 20
      factors.push({
        name: "Physical Activity",
        impact: "Medium negative impact",
        suggestion: "Regular physical activity reduces risk of many chronic diseases",
      })
    } else if (userData.exerciseFrequency === "moderate" || userData.exerciseFrequency === "active") {
      risk -= 10
      factors.push({
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Your activity level helps prevent chronic conditions",
      })
    }
  }

  // Smoking
  if (userData.smokingStatus) {
    if (userData.smokingStatus === "regular") {
      risk += 30
      factors.push({
        name: "Smoking",
        impact: "High negative impact",
        suggestion: "Smoking increases risk for numerous chronic diseases",
      })
    } else if (userData.smokingStatus === "occasional") {
      risk += 15
      factors.push({
        name: "Smoking",
        impact: "Medium negative impact",
        suggestion: "Even occasional smoking increases chronic disease risk",
      })
    }
  }

  // Regular checkups
  if (userData.lastCheckup) {
    if (userData.lastCheckup === "less-than-6-months" || userData.lastCheckup === "6-12-months") {
      risk -= 10
      factors.push({
        name: "Regular Checkups",
        impact: "High positive impact",
        suggestion: "Continue with regular health screenings for early detection",
      })
    } else if (userData.lastCheckup === "more-than-5-years" || userData.lastCheckup === "never") {
      risk += 15
      factors.push({
        name: "Regular Checkups",
        impact: "Medium negative impact",
        suggestion: "Schedule a comprehensive health checkup soon",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Stress Management",
      impact: "Medium negative impact",
      suggestion: "Chronic stress contributes to many chronic diseases",
    })
  }

  // Cap risk between 15 and 85
  risk = Math.max(15, Math.min(85, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5).map((f) => ({ ...f, source: "guideline" as const })) }
}

/**
 * Extra lifestyle tips shown next to the ML factors for cardiovascular and
 * metabolic health. They cover inputs the model does not use (family history,
 * fast food, hydration, sleep) and do not change the model's score.
 */
export function cardiovascularLifestyleTips(userData: HealthFormData): RiskFactor[] {
  const tips: RiskFactor[] = []
  if (userData.familyHistory.some((c) => c === "Heart Disease" || c === "High Blood Pressure" || c === "Stroke")) {
    tips.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "With a family history of heart disease, ask for a cardiovascular check-up every year",
    })
  }
  if (userData.fastFoodFrequency === "frequently" || userData.fastFoodFrequency === "often") {
    tips.push({
      name: "Fast Food",
      impact: "Medium negative impact",
      suggestion: "Cutting back on fast food lowers your sodium and saturated fat intake",
    })
  }
  if (userData.dietType === "mediterranean") {
    tips.push({
      name: "Diet",
      impact: "High positive impact",
      suggestion: "A Mediterranean diet is one of the best-studied diets for heart health",
    })
  }
  if (userData.sleepHours < 6) {
    tips.push({
      name: "Sleep",
      impact: "Medium negative impact",
      suggestion: "Regularly sleeping less than 6 hours is linked with higher blood pressure",
    })
  }
  return tips.map((t) => ({ ...t, source: "guideline" as const }))
}

export function metabolicLifestyleTips(userData: HealthFormData): RiskFactor[] {
  const tips: RiskFactor[] = []
  if (userData.familyHistory.includes("Diabetes")) {
    tips.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "With a family history of diabetes, get an HbA1c or fasting glucose test every 1-3 years",
    })
  }
  if (userData.fastFoodFrequency === "frequently" || userData.fastFoodFrequency === "often") {
    tips.push({
      name: "Fast Food",
      impact: "Medium negative impact",
      suggestion: "Cut down on processed carbohydrates and sugary drinks",
    })
  }
  if (userData.waterIntake === "low") {
    tips.push({
      name: "Hydration",
      impact: "Low negative impact",
      suggestion: "Drink water instead of sugary drinks, and aim for 6-8 glasses a day",
    })
  }
  if (userData.sleepHours < 6 || userData.sleepQuality === "poor") {
    tips.push({
      name: "Sleep",
      impact: "Medium negative impact",
      suggestion: "Short or poor sleep affects insulin sensitivity. Aim for 7-9 hours of good-quality sleep",
    })
  }
  return tips.map((t) => ({ ...t, source: "guideline" as const }))
}
