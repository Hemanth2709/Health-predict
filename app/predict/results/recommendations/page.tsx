"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo } from "react"

// Import the same icons as in premium-results.tsx
import {
  Activity,
  Dumbbell,
  Brain,
  Moon,
  Sun,
  Users,
  Thermometer,
  Droplets,
  Utensils,
  Clock,
  AlertCircle,
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

export default function RecommendationsPage() {
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

    return [
      {
        id: "cardiovascular",
        category: "Cardiovascular",
        risk: cardiovascularRisk.risk,
        previousRisk: cardiovascularRisk.risk + 4, // Mock previous risk for demonstration
        color: "#e11d48", // rose-600
        icon: <Activity className="h-4 w-4" />,
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
    ]
  }, [userData])

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

  // Group recommendations by priority
  const immediateActions = riskData
    .flatMap((category) =>
      category.factors
        .filter((f) => f.impact.includes("High negative"))
        .map((factor) => ({
          category: category.category,
          factor: factor,
        })),
    )
    .slice(0, 5)

  const shortTermActions = riskData
    .flatMap((category) =>
      category.factors
        .filter((f) => f.impact.includes("Medium negative"))
        .map((factor) => ({
          category: category.category,
          factor: factor,
        })),
    )
    .slice(0, 5)

  const maintenanceActions = riskData
    .flatMap((category) =>
      category.factors
        .filter((f) => f.impact.includes("positive"))
        .map((factor) => ({
          category: category.category,
          factor: factor,
        })),
    )
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Overview
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Your Personalized Health Plan</h1>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Based on your health assessment, we've created a personalized plan to help you improve your health outcomes.
            Follow these recommendations to reduce your health risks and enhance your overall wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="border border-gray-200 shadow-md h-full">
              <div className="h-1 bg-red-500"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-full bg-red-500 text-white">
                    <AlertCircle className="h-4 w-4" />
                  </span>
                  <CardTitle className="text-gray-900">Immediate Actions</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Address within 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {immediateActions.length > 0 ? (
                    immediateActions.map((item, index) => (
                      <motion.div
                        key={`immediate-${index}`}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start">
                          <div className="mt-0.5">{getIconForFactor(item.factor.name)}</div>
                          <div className="ml-2">
                            <p className="font-medium text-gray-900">
                              {item.factor.name}{" "}
                              <span className="text-sm font-normal text-gray-500">({item.category})</span>
                            </p>
                            <p className="text-sm text-gray-700">{item.factor.suggestion}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No immediate actions required</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border border-gray-200 shadow-md h-full">
              <div className="h-1 bg-amber-500"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-full bg-amber-500 text-white">
                    <Clock className="h-4 w-4" />
                  </span>
                  <CardTitle className="text-gray-900">Short-Term Goals</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Focus on these in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shortTermActions.map((item, index) => (
                    <motion.div
                      key={`shortterm-${index}`}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start">
                        <div className="mt-0.5">{getIconForFactor(item.factor.name)}</div>
                        <div className="ml-2">
                          <p className="font-medium text-gray-900">
                            {item.factor.name}{" "}
                            <span className="text-sm font-normal text-gray-500">({item.category})</span>
                          </p>
                          <p className="text-sm text-gray-700">{item.factor.suggestion}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="border border-gray-200 shadow-md h-full">
              <div className="h-1 bg-green-500"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-full bg-green-500 text-white">
                    <Activity className="h-4 w-4" />
                  </span>
                  <CardTitle className="text-gray-900">Maintenance</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Continue these positive habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceActions.map((item, index) => (
                    <motion.div
                      key={`maintenance-${index}`}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start">
                        <div className="mt-0.5">{getIconForFactor(item.factor.name)}</div>
                        <div className="ml-2">
                          <p className="font-medium text-gray-900">
                            {item.factor.name}{" "}
                            <span className="text-sm font-normal text-gray-500">({item.category})</span>
                          </p>
                          <p className="text-sm text-gray-700">{item.factor.suggestion}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="border border-gray-200 shadow-md mb-8">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-full bg-blue-500 text-white">
                  <Brain className="h-4 w-4" />
                </span>
                <CardTitle className="text-gray-900">Your 90-Day Health Plan</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                A structured approach to improving your health outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Weeks 1-4: Foundation</h3>
                  <p className="text-gray-700 mb-2">
                    Focus on establishing baseline healthy habits and addressing your highest risk factors.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Begin with small, sustainable changes to your daily routine</li>
                    <li>Track your sleep patterns and work on improving sleep hygiene</li>
                    <li>Gradually increase physical activity by 10% each week</li>
                    <li>Schedule any recommended medical check-ups</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Weeks 5-8: Building Momentum</h3>
                  <p className="text-gray-700 mb-2">
                    Now that you've established a foundation, focus on strengthening your healthy habits.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Increase intensity of exercise routine</li>
                    <li>Implement more advanced stress management techniques</li>
                    <li>Fine-tune your nutrition plan based on your body's response</li>
                    <li>Begin addressing medium-priority health concerns</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Weeks 9-12: Optimization</h3>
                  <p className="text-gray-700 mb-2">
                    In the final phase, focus on optimizing your routine and preparing for long-term maintenance.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Evaluate progress and adjust goals as needed</li>
                    <li>Develop strategies for maintaining habits during challenging periods</li>
                    <li>Create a sustainable long-term health plan</li>
                    <li>Schedule your next health assessment to track improvements</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
                  <Download size={16} />
                  Download Complete Health Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          className="text-center text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          This health plan is based on your assessment results and should be used as a guide.
          <br />
          Always consult with healthcare professionals before making significant changes to your health routine.
        </motion.p>
      </div>
    </div>
  )
}

// Risk calculation functions
function calculateCardiovascularRisk(userData: any, bmi: number) {
  // Copy the function from premium-results.tsx
  let risk = 0
  const factors: { name: string; impact: string; suggestion: string }[] = []

  // Age
  if (userData.age >= 45) {
    risk += 10
    factors.push({
      name: "Age",
      impact: "Medium negative impact",
      suggestion: "Regular cardiovascular checkups are recommended",
    })
  }

  // Smoking
  if (userData.smoking) {
    risk += 15
    factors.push({
      name: "Smoking",
      impact: "High negative impact",
      suggestion: "Quitting smoking is highly recommended",
    })
  }

  // Blood Pressure (Systolic)
  if (userData.systolicBloodPressure >= 140) {
    risk += 12
    factors.push({
      name: "Blood Pressure",
      impact: "Medium negative impact",
      suggestion: "Consult your doctor to manage your blood pressure",
    })
  }

  // Cholesterol
  if (userData.cholesterol >= 200) {
    risk += 8
    factors.push({
      name: "Cholesterol",
      impact: "Medium negative impact",
      suggestion: "Consider dietary changes to lower cholesterol",
    })
  }

  // Physical Activity
  if (!userData.exercise) {
    risk += 10
    factors.push({
      name: "Exercise",
      impact: "Medium negative impact",
      suggestion: "Incorporate regular physical activity into your routine",
    })
  } else {
    factors.push({
      name: "Exercise",
      impact: "Medium positive impact",
      suggestion: "Continue your regular exercise routine",
    })
  }

  // Family History
  if (userData.familyHistory) {
    risk += 7
    factors.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "Regular cardiovascular checkups are recommended",
    })
  }

  // Diet (Example: High sodium intake)
  if (userData.diet === "unhealthy") {
    risk += 8
    factors.push({
      name: "Diet",
      impact: "Medium negative impact",
      suggestion: "Consider reducing sodium intake",
    })
  } else {
    factors.push({
      name: "Diet",
      impact: "Medium positive impact",
      suggestion: "Continue with your healthy diet",
    })
  }

  // Obesity (BMI)
  if (bmi > 30) {
    risk += 10
    factors.push({
      name: "Weight",
      impact: "Medium negative impact",
      suggestion: "A 10% weight reduction would be beneficial",
    })
  }

  // Alcohol Consumption
  if (userData.alcohol === "high") {
    risk += 5
    factors.push({
      name: "Alcohol Consumption",
      impact: "Low negative impact",
      suggestion: "Limit alcohol consumption to moderate levels",
    })
  }

  return { risk, factors }
}

function calculateMetabolicRisk(userData: any, bmi: number) {
  let risk = 0
  const factors: { name: string; impact: string; suggestion: string }[] = []

  // BMI
  if (bmi > 25) {
    risk += 12
    factors.push({
      name: "Weight",
      impact: "Medium negative impact",
      suggestion: "A 5% weight reduction would be beneficial",
    })
  }

  // Waist Circumference (simplified)
  if (userData.waistCircumference > 40) {
    risk += 10
    factors.push({
      name: "Waist Circumference",
      impact: "Medium negative impact",
      suggestion: "Reducing waist circumference can improve metabolic health",
    })
  }

  // Physical Activity
  if (!userData.exercise) {
    risk += 10
    factors.push({
      name: "Exercise",
      impact: "Medium negative impact",
      suggestion: "Add 2 more days of strength training",
    })
  } else {
    factors.push({
      name: "Exercise",
      impact: "Medium positive impact",
      suggestion: "Continue your regular exercise routine",
    })
  }

  // Diet (High processed carbs)
  if (userData.diet === "unhealthy") {
    risk += 15
    factors.push({
      name: "Diet",
      impact: "Medium negative impact",
      suggestion: "Reduce processed carbohydrates",
    })
  } else {
    factors.push({
      name: "Diet",
      impact: "Medium positive impact",
      suggestion: "Continue with your healthy diet",
    })
  }

  // Fast Food Consumption
  if (userData.fastFood === "high") {
    risk += 8
    factors.push({
      name: "Fast Food",
      impact: "Medium negative impact",
      suggestion: "Try to limit fast food to once per week",
    })
  }

  // Water Intake
  if (userData.waterIntake < 6) {
    risk += 5
    factors.push({
      name: "Water Intake",
      impact: "Low negative impact",
      suggestion: "Increase daily water intake",
    })
  } else {
    factors.push({
      name: "Water Intake",
      impact: "Medium positive impact",
      suggestion: "Continue with good hydration habits",
    })
  }

  // Sleep Duration
  if (userData.sleep < 7) {
    risk += 7
    factors.push({
      name: "Sleep",
      impact: "Medium negative impact",
      suggestion: "Aim for 7-8 hours of sleep per night",
    })
  }

  return { risk, factors }
}

function calculateSleepRisk(userData: any) {
  let risk = 0
  const factors: { name: string; impact: string; suggestion: string }[] = []

  // Screen Time Before Bed
  if (userData.screenTimeBeforeBed > 2) {
    risk += 15
    factors.push({
      name: "Screen Time",
      impact: "High negative impact",
      suggestion: "Avoid screens 1 hour before bedtime",
    })
  }

  // Stress Levels
  if (userData.stressLevel > 7) {
    risk += 12
    factors.push({
      name: "Stress",
      impact: "Medium negative impact",
      suggestion: "Try meditation before sleep",
    })
  }

  // Exercise Timing
  if (userData.exerciseTiming === "late") {
    risk += 8
    factors.push({
      name: "Exercise Timing",
      impact: "Low negative impact",
      suggestion: "Avoid intense exercise 3 hours before bed",
    })
  }

  // Sleep Environment
  if (userData.sleepEnvironment === "uncomfortable") {
    risk += 7
    factors.push({
      name: "Sleep Environment",
      impact: "Medium negative impact",
      suggestion: "Create a comfortable sleep environment",
    })
  } else {
    factors.push({
      name: "Sleep Environment",
      impact: "Medium positive impact",
      suggestion: "Maintain your comfortable sleep environment",
    })
  }

  // Sleep Consistency
  if (!userData.consistentSleep) {
    risk += 10
    factors.push({
      name: "Sleep Consistency",
      impact: "Medium negative impact",
      suggestion: "Try to go to bed at the same time each night",
    })
  }

  return { risk, factors }
}

function calculateMentalRisk(userData: any) {
  let risk = 0
  const factors: { name: string; impact: string; suggestion: string }[] = []

  // Social Connection
  if (userData.socialConnection === "low") {
    risk += 15
    factors.push({
      name: "Social Connection",
      impact: "High negative impact",
      suggestion: "Increase social interaction and connection",
    })
  } else {
    factors.push({
      name: "Social Connection",
      impact: "High positive impact",
      suggestion: "Continue maintaining social connections",
    })
  }

  // Stress Management
  if (!userData.mindfulness) {
    risk += 12
    factors.push({
      name: "Stress Management",
      impact: "Medium negative impact",
      suggestion: "Consider adding mindfulness practice",
    })
  }

  // Sleep Quality
  if (userData.sleep < 7) {
    risk += 10
    factors.push({
      name: "Sleep",
      impact: "Medium negative impact",
      suggestion: "Improve sleep quality with a consistent schedule",
    })
  }

  // Outdoor Time
  if (userData.outdoorTime < 1) {
    risk += 8
    factors.push({
      name: "Outdoor Time",
      impact: "Medium negative impact",
      suggestion: "Spend more time outdoors",
    })
  } else {
    factors.push({
      name: "Outdoor Time",
      impact: "Medium positive impact",
      suggestion: "Your time outdoors benefits your mental health",
    })
  }

  // Physical Activity
  if (!userData.exercise) {
    risk += 7
    factors.push({
      name: "Physical Activity",
      impact: "Medium negative impact",
      suggestion: "Incorporate regular physical activity",
    })
  } else {
    factors.push({
      name: "Physical Activity",
      impact: "High positive impact",
      suggestion: "Exercise is benefiting your mental health",
    })
  }

  return { risk, factors }
}
