"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo } from "react"

// Import the same icons and helper functions as in premium-results.tsx
import {
  Activity,
  Heart,
  Brain,
  Moon,
  Shield,
  Pill,
  AlertCircle,
  Utensils,
  Clock,
  Sun,
  Users,
  Thermometer,
  Droplets,
  Dumbbell,
} from "lucide-react"

// Define risk category type (same as in premium-results.tsx)
interface RiskCategory {
  id: string
  category: string
  risk: number
  previousRisk: number
  color: string
  icon: React.ReactNode
  factors: {
    name: string
    impact: string
    suggestion: string
  }[]
}

export default function DetailedAnalysisPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse user data from URL parameters
  const userData = useMemo(() => {
    const dataParam = searchParams.get("data")
    if (!dataParam) return null
    try {
      return JSON.parse(decodeURIComponent(dataParam))
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }, [searchParams])

  // This would normally come from a global state or API call with the user data
  // For now, we'll use the same risk calculation functions as in premium-results.tsx
  const riskData = useMemo(() => {
    if (!userData) {
      return [] // Return empty array if no user data
    }

    // Calculate BMI
    const bmi = userData.weight / (userData.height / 100) ** 2

    // Calculate risks using the same functions as in premium-results.tsx
    const cardiovascularRisk = calculateCardiovascularRisk(userData, bmi)
    const metabolicRisk = calculateMetabolicRisk(userData, bmi)
    const sleepRisk = calculateSleepRisk(userData)
    const mentalRisk = calculateMentalRisk(userData)
    const immuneRisk = calculateImmuneRisk(userData)
    const chronicRisk = calculateChronicRisk(userData, bmi)

    return [
      {
        id: "cardiovascular",
        category: "Cardiovascular",
        risk: cardiovascularRisk.risk,
        previousRisk: cardiovascularRisk.risk + 4, // Mock previous risk for demonstration
        color: "#e11d48", // rose-600
        icon: <Heart className="h-4 w-4" />,
        factors: cardiovascularRisk.factors,
      },
      {
        id: "metabolic",
        category: "Metabolic",
        risk: metabolicRisk.risk,
        previousRisk: metabolicRisk.risk + 3, // Mock previous risk for demonstration
        color: "#0891b2", // cyan-600
        icon: <Activity className="h-4 w-4" />,
        factors: metabolicRisk.factors,
      },
      {
        id: "sleep",
        category: "Sleep",
        risk: sleepRisk.risk,
        previousRisk: sleepRisk.risk + 3, // Mock previous risk for demonstration
        color: "#7c3aed", // violet-600
        icon: <Moon className="h-4 w-4" />,
        factors: sleepRisk.factors,
      },
      {
        id: "mental",
        category: "Mental",
        risk: mentalRisk.risk,
        previousRisk: mentalRisk.risk + 3, // Mock previous risk for demonstration
        color: "#8b5cf6", // violet-500
        icon: <Brain className="h-4 w-4" />,
        factors: mentalRisk.factors,
      },
      {
        id: "immune",
        category: "Immune",
        risk: immuneRisk.risk,
        previousRisk: immuneRisk.risk - 2, // Mock previous risk for demonstration
        color: "#16a34a", // green-600
        icon: <Shield className="h-4 w-4" />,
        factors: immuneRisk.factors,
      },
      {
        id: "chronic",
        category: "Chronic",
        risk: chronicRisk.risk,
        previousRisk: chronicRisk.risk - 2, // Mock previous risk for demonstration
        color: "#ea580c", // orange-600
        icon: <Pill className="h-4 w-4" />,
        factors: chronicRisk.factors,
      },
    ]
  }, [userData])

  // Get risk level based on score
  const getRiskLevel = (score: number) => {
    if (score < 25) return { label: "Low Risk", color: "text-green-600 bg-green-50" }
    if (score < 50) return { label: "Moderate Risk", color: "text-amber-600 bg-amber-50" }
    if (score < 75) return { label: "High Risk", color: "text-red-600 bg-red-50" }
    return { label: "Very High Risk", color: "text-red-700 bg-red-100" }
  }

  // Get icon for factor
  const getIconForFactor = (factor: string) => {
    const factorLower = factor.toLowerCase()
    if (factorLower.includes("exercise") || factorLower.includes("physical") || factorLower.includes("activity"))
      return <Dumbbell className="h-4 w-4 text-blue-500" />
    if (
      factorLower.includes("diet") ||
      factorLower.includes("food") ||
      factorLower.includes("eating") ||
      factorLower.includes("nutrition")
    )
      return <Utensils className="h-4 w-4 text-green-500" />
    if (factorLower.includes("sleep")) return <Moon className="h-4 w-4 text-indigo-500" />
    if (factorLower.includes("stress") || factorLower.includes("mental") || factorLower.includes("mindful"))
      return <Brain className="h-4 w-4 text-purple-500" />
    if (factorLower.includes("screen")) return <Clock className="h-4 w-4 text-orange-500" />
    if (factorLower.includes("outdoor")) return <Sun className="h-4 w-4 text-yellow-500" />
    if (factorLower.includes("social") || factorLower.includes("connection"))
      return <Users className="h-4 w-4 text-pink-500" />
    if (factorLower.includes("weight") || factorLower.includes("bmi"))
      return <Activity className="h-4 w-4 text-blue-500" />
    if (factorLower.includes("smoking") || factorLower.includes("alcohol"))
      return <AlertCircle className="h-4 w-4 text-red-500" />
    if (factorLower.includes("water") || factorLower.includes("hydration"))
      return <Droplets className="h-4 w-4 text-cyan-500" />
    if (factorLower.includes("medical") || factorLower.includes("checkup") || factorLower.includes("vaccination"))
      return <Thermometer className="h-4 w-4 text-red-500" />
    if (factorLower.includes("pain")) return <Thermometer className="h-4 w-4 text-red-500" />
    if (factorLower.includes("family")) return <Users className="h-4 w-4 text-blue-500" />

    return <Activity className="h-4 w-4 text-gray-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Overview
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Detailed Health Analysis</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {riskData.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border border-gray-200 shadow-md overflow-hidden">
                <div className="h-1" style={{ backgroundColor: category.color }}></div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-full text-white" style={{ backgroundColor: category.color }}>
                      {category.icon}
                    </span>
                    <CardTitle className="text-gray-900">{category.category} Health</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {getRiskLevel(category.risk).label} ({category.risk}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-gray-700">
                      Your {category.category.toLowerCase()} health risk score is{" "}
                      <span className="font-medium">{category.risk}%</span>, which is{" "}
                      {category.risk < category.previousRisk ? (
                        <span className="text-green-600">
                          {category.previousRisk - category.risk}% lower than your previous assessment
                        </span>
                      ) : category.risk > category.previousRisk ? (
                        <span className="text-red-600">
                          {category.risk - category.previousRisk}% higher than your previous assessment
                        </span>
                      ) : (
                        <span>unchanged from your previous assessment</span>
                      )}
                      .
                    </p>
                  </div>

                  <h4 className="font-medium text-lg mb-4 text-gray-900">Key Factors</h4>
                  <div className="space-y-4">
                    {category.factors.map((factor, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start">
                          <div className="mt-0.5">{getIconForFactor(factor.name)}</div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h5 className="font-medium text-gray-900">{factor.name}</h5>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  factor.impact.includes("positive")
                                    ? "bg-green-100 text-green-700"
                                    : factor.impact.includes("negative")
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {factor.impact}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{factor.suggestion}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Risk calculation functions
function calculateCardiovascularRisk(userData: any, bmi: number) {
  const { age, gender, cholesterol, smoking, bloodPressure, diabetes } = userData
  let risk = 0

  // Age
  if (age >= 60) risk += 15
  else if (age >= 40) risk += 8

  // Gender
  if (gender === "Male") risk += 7

  // Cholesterol
  if (cholesterol > 240) risk += 12
  else if (cholesterol > 200) risk += 6

  // Smoking
  if (smoking) risk += 10

  // Blood Pressure
  if (bloodPressure > 140) risk += 10
  else if (bloodPressure > 120) risk += 5

  // Diabetes
  if (diabetes) risk += 15

  // BMI
  if (bmi > 30) risk += 8

  risk = Math.min(risk, 100)

  const factors = [
    {
      name: "Age",
      impact: age >= 60 ? "High negative impact" : "Moderate impact",
      suggestion: "Regular checkups are important as you age.",
    },
    {
      name: "Gender",
      impact: gender === "Male" ? "Medium negative impact" : "Neutral",
      suggestion: "Consider gender-specific health screenings.",
    },
    {
      name: "Cholesterol",
      impact:
        cholesterol > 240 ? "High negative impact" : cholesterol > 200 ? "Medium negative impact" : "Positive impact",
      suggestion: cholesterol > 240 ? "Reduce saturated fats in your diet." : "Maintain a healthy diet.",
    },
    {
      name: "Smoking",
      impact: smoking ? "High negative impact" : "Positive impact",
      suggestion: smoking ? "Consider quitting smoking." : "Continue to avoid smoking.",
    },
    {
      name: "Blood Pressure",
      impact:
        bloodPressure > 140
          ? "High negative impact"
          : bloodPressure > 120
            ? "Medium negative impact"
            : "Positive impact",
      suggestion:
        bloodPressure > 140
          ? "Consult your doctor about managing blood pressure."
          : "Monitor your blood pressure regularly.",
    },
    {
      name: "Diabetes",
      impact: diabetes ? "High negative impact" : "Positive impact",
      suggestion: diabetes
        ? "Manage your blood sugar levels carefully."
        : "Maintain a healthy lifestyle to prevent diabetes.",
    },
    {
      name: "BMI",
      impact: bmi > 30 ? "Medium negative impact" : "Positive impact",
      suggestion: bmi > 30 ? "Consider a weight management program." : "Maintain a healthy weight.",
    },
  ]

  return { risk: Math.round(risk), factors }
}

function calculateMetabolicRisk(userData: any, bmi: number) {
  const { waistCircumference, triglycerides, hdlCholesterol, bloodPressure, fastingGlucose } = userData
  let risk = 0

  // Waist Circumference (in inches)
  if (waistCircumference > 40) risk += 10 // Men
  if (waistCircumference > 35) risk += 10 // Women

  // Triglycerides
  if (triglycerides > 150) risk += 10

  // HDL Cholesterol
  if (hdlCholesterol < 40) risk += 10 // Men
  if (hdlCholesterol < 50) risk += 10 // Women

  // Blood Pressure
  if (bloodPressure > 130) risk += 10

  // Fasting Glucose
  if (fastingGlucose > 100) risk += 10

  // BMI
  if (bmi > 25) risk += 5

  risk = Math.min(risk, 100)

  const factors = [
    {
      name: "Waist Circumference",
      impact: waistCircumference > 40 ? "High negative impact" : "Positive impact",
      suggestion:
        waistCircumference > 40 ? "Engage in regular aerobic exercise." : "Maintain a healthy waist circumference.",
    },
    {
      name: "Triglycerides",
      impact: triglycerides > 150 ? "High negative impact" : "Positive impact",
      suggestion:
        triglycerides > 150 ? "Reduce intake of sugary foods and alcohol." : "Maintain healthy triglyceride levels.",
    },
    {
      name: "HDL Cholesterol",
      impact: hdlCholesterol < 40 ? "High negative impact" : "Positive impact",
      suggestion: hdlCholesterol < 40 ? "Increase intake of healthy fats." : "Maintain healthy HDL cholesterol levels.",
    },
    {
      name: "Blood Pressure",
      impact: bloodPressure > 130 ? "High negative impact" : "Positive impact",
      suggestion: bloodPressure > 130 ? "Reduce sodium intake." : "Maintain healthy blood pressure.",
    },
    {
      name: "Fasting Glucose",
      impact: fastingGlucose > 100 ? "High negative impact" : "Positive impact",
      suggestion:
        fastingGlucose > 100
          ? "Consult a healthcare provider for diabetes screening."
          : "Maintain healthy fasting glucose levels.",
    },
    {
      name: "BMI",
      impact: bmi > 25 ? "Medium negative impact" : "Positive impact",
      suggestion: bmi > 25 ? "Adopt a balanced diet and exercise regularly." : "Maintain a healthy BMI.",
    },
  ]

  return { risk: Math.round(risk), factors }
}

function calculateSleepRisk(userData: any) {
  const { sleepDuration, sleepQuality, sleepLatency, daytimeSleepiness, sleepApneaRisk } = userData
  let risk = 0

  // Sleep Duration
  if (sleepDuration < 6) risk += 20
  else if (sleepDuration < 7) risk += 10

  // Sleep Quality
  if (sleepQuality === "Poor") risk += 20
  else if (sleepQuality === "Fair") risk += 10

  // Sleep Latency
  if (sleepLatency > 30) risk += 10

  // Daytime Sleepiness
  if (daytimeSleepiness === "Often") risk += 15
  else if (daytimeSleepiness === "Sometimes") risk += 8

  // Sleep Apnea Risk
  if (sleepApneaRisk === "High") risk += 20
  else if (sleepApneaRisk === "Moderate") risk += 10

  risk = Math.min(risk, 100)

  const factors = [
    {
      name: "Sleep Duration",
      impact:
        sleepDuration < 6 ? "High negative impact" : sleepDuration < 7 ? "Medium negative impact" : "Positive impact",
      suggestion:
        sleepDuration < 6 ? "Establish a consistent sleep schedule." : "Aim for 7-9 hours of sleep per night.",
    },
    {
      name: "Sleep Quality",
      impact:
        sleepQuality === "Poor"
          ? "High negative impact"
          : sleepQuality === "Fair"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion: sleepQuality === "Poor" ? "Create a relaxing bedtime routine." : "Improve sleep hygiene practices.",
    },
    {
      name: "Sleep Latency",
      impact: sleepLatency > 30 ? "Medium negative impact" : "Positive impact",
      suggestion:
        sleepLatency > 30 ? "Avoid caffeine and alcohol before bed." : "Maintain a consistent sleep environment.",
    },
    {
      name: "Daytime Sleepiness",
      impact:
        daytimeSleepiness === "Often"
          ? "High negative impact"
          : daytimeSleepiness === "Sometimes"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion: daytimeSleepiness === "Often" ? "Consult a healthcare provider." : "Ensure adequate sleep duration.",
    },
    {
      name: "Sleep Apnea Risk",
      impact:
        sleepApneaRisk === "High"
          ? "High negative impact"
          : sleepApneaRisk === "Moderate"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion: sleepApneaRisk === "High" ? "Undergo a sleep study." : "Manage risk factors for sleep apnea.",
    },
  ]

  return { risk: Math.round(risk), factors }
}

function calculateMentalRisk(userData: any) {
  const { stressLevel, mood, socialInteraction, cognitiveFunction, lifeSatisfaction } = userData
  let risk = 0

  // Stress Level
  if (stressLevel === "High") risk += 20
  else if (stressLevel === "Moderate") risk += 10

  // Mood
  if (mood === "Low") risk += 20
  else if (mood === "Neutral") risk += 10

  // Social Interaction
  if (socialInteraction === "Rarely") risk += 15
  else if (socialInteraction === "Sometimes") risk += 8

  // Cognitive Function
  if (cognitiveFunction === "Poor") risk += 15
  else if (cognitiveFunction === "Fair") risk += 8

  // Life Satisfaction
  if (lifeSatisfaction === "Low") risk += 20
  else if (lifeSatisfaction === "Neutral") risk += 10

  risk = Math.min(risk, 100)

  const factors = [
    {
      name: "Stress Level",
      impact:
        stressLevel === "High"
          ? "High negative impact"
          : stressLevel === "Moderate"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion: stressLevel === "High" ? "Practice relaxation techniques." : "Manage stressors effectively.",
    },
    {
      name: "Mood",
      impact:
        mood === "Low" ? "High negative impact" : mood === "Neutral" ? "Medium negative impact" : "Positive impact",
      suggestion: mood === "Low" ? "Seek support from friends and family." : "Engage in activities that boost mood.",
    },
    {
      name: "Social Interaction",
      impact:
        socialInteraction === "Rarely"
          ? "High negative impact"
          : socialInteraction === "Sometimes"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion:
        socialInteraction === "Rarely" ? "Join social groups or clubs." : "Maintain regular social connections.",
    },
    {
      name: "Cognitive Function",
      impact:
        cognitiveFunction === "Poor"
          ? "High negative impact"
          : cognitiveFunction === "Fair"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion:
        cognitiveFunction === "Poor" ? "Engage in brain-training exercises." : "Challenge your mind regularly.",
    },
    {
      name: "Life Satisfaction",
      impact:
        lifeSatisfaction === "Low"
          ? "High negative impact"
          : lifeSatisfaction === "Neutral"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion: lifeSatisfaction === "Low" ? "Set achievable goals." : "Practice gratitude.",
    },
  ]

  return { risk: Math.round(risk), factors }
}

function calculateImmuneRisk(userData: any) {
  const { vaccinationStatus, hygienePractices, exposureToInfections, autoimmuneConditions, inflammationMarkers } =
    userData
  let risk = 0

  // Vaccination Status
  if (vaccinationStatus === "Not vaccinated") risk += 20
  else if (vaccinationStatus === "Partially vaccinated") risk += 10

  // Hygiene Practices
  if (hygienePractices === "Poor") risk += 20
  else if (hygienePractices === "Fair") risk += 10

  // Exposure to Infections
  if (exposureToInfections === "High") risk += 15
  else if (exposureToInfections === "Moderate") risk += 8

  // Autoimmune Conditions
  if (autoimmuneConditions === "Yes") risk += 20

  // Inflammation Markers
  if (inflammationMarkers === "High") risk += 15
  else if (inflammationMarkers === "Moderate") risk += 8

  risk = Math.min(risk, 100)

  const factors = [
    {
      name: "Vaccination Status",
      impact:
        vaccinationStatus === "Not vaccinated"
          ? "High negative impact"
          : vaccinationStatus === "Partially vaccinated"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion:
        vaccinationStatus === "Not vaccinated"
          ? "Get vaccinated as soon as possible."
          : "Complete your vaccination schedule.",
    },
    {
      name: "Hygiene Practices",
      impact:
        hygienePractices === "Poor"
          ? "High negative impact"
          : hygienePractices === "Fair"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion: hygienePractices === "Poor" ? "Wash your hands frequently." : "Maintain good hygiene practices.",
    },
    {
      name: "Exposure to Infections",
      impact:
        exposureToInfections === "High"
          ? "High negative impact"
          : exposureToInfections === "Moderate"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion:
        exposureToInfections === "High"
          ? "Avoid crowded places."
          : "Take precautions to minimize exposure to infections.",
    },
    {
      name: "Autoimmune Conditions",
      impact: autoimmuneConditions === "Yes" ? "High negative impact" : "Positive impact",
      suggestion:
        autoimmuneConditions === "Yes"
          ? "Manage your autoimmune condition effectively."
          : "Monitor for symptoms of autoimmune conditions.",
    },
    {
      name: "Inflammation Markers",
      impact:
        inflammationMarkers === "High"
          ? "High negative impact"
          : inflammationMarkers === "Moderate"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion:
        inflammationMarkers === "High"
          ? "Reduce inflammation through diet and lifestyle changes."
          : "Monitor your inflammation levels regularly.",
    },
  ]

  return { risk: Math.round(risk), factors }
}

function calculateChronicRisk(userData: any, bmi: number) {
  const { familyHistory, smokingHistory, alcoholConsumption, physicalInactivity, unhealthyDiet } = userData
  let risk = 0

  // Family History
  if (familyHistory === "Yes") risk += 20

  // Smoking History
  if (smokingHistory === "Current" || smokingHistory === "Past") risk += 20

  // Alcohol Consumption
  if (alcoholConsumption === "High") risk += 15
  else if (alcoholConsumption === "Moderate") risk += 8

  // Physical Inactivity
  if (physicalInactivity === "Yes") risk += 15

  // Unhealthy Diet
  if (unhealthyDiet === "Yes") risk += 15

  // BMI
  if (bmi > 30) risk += 10

  risk = Math.min(risk, 100)

  const factors = [
    {
      name: "Family History",
      impact: familyHistory === "Yes" ? "High negative impact" : "Positive impact",
      suggestion:
        familyHistory === "Yes"
          ? "Undergo regular screenings for chronic diseases."
          : "Be aware of your family's health history.",
    },
    {
      name: "Smoking History",
      impact: smokingHistory === "Current" || smokingHistory === "Past" ? "High negative impact" : "Positive impact",
      suggestion:
        smokingHistory === "Current" || smokingHistory === "Past"
          ? "Quit smoking as soon as possible."
          : "Avoid smoking.",
    },
    {
      name: "Alcohol Consumption",
      impact:
        alcoholConsumption === "High"
          ? "High negative impact"
          : alcoholConsumption === "Moderate"
            ? "Medium negative impact"
            : "Positive impact",
      suggestion: alcoholConsumption === "High" ? "Reduce alcohol consumption." : "Consume alcohol in moderation.",
    },
    {
      name: "Physical Inactivity",
      impact: physicalInactivity === "Yes" ? "High negative impact" : "Positive impact",
      suggestion:
        physicalInactivity === "Yes" ? "Engage in regular physical activity." : "Maintain an active lifestyle.",
    },
    {
      name: "Unhealthy Diet",
      impact: unhealthyDiet === "Yes" ? "High negative impact" : "Positive impact",
      suggestion: unhealthyDiet === "Yes" ? "Adopt a healthy diet." : "Maintain a balanced diet.",
    },
    {
      name: "BMI",
      impact: bmi > 30 ? "Medium negative impact" : "Positive impact",
      suggestion: bmi > 30 ? "Consider a weight management program." : "Maintain a healthy weight.",
    },
  ]

  return { risk: Math.round(risk), factors }
}
