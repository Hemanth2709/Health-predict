"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
  Download,
  Share2,
} from "lucide-react"
import { motion } from "framer-motion"
import PremiumHealthRiskChart from "@/components/premium-health-risk-chart"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define risk category type
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

export default function PremiumResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [savingReport, setSavingReport] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

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

  // Generate risk data based on user input
  const riskData: RiskCategory[] = useMemo(() => {
    if (!userData) {
      return [] // Return empty array if no user data
    }

    // Calculate BMI
    const bmi = userData.weight / (userData.height / 100) ** 2

    // Calculate cardiovascular risk based on user inputs
    const cardiovascularRisk = calculateCardiovascularRisk(userData, bmi)

    // Calculate metabolic risk based on user inputs
    const metabolicRisk = calculateMetabolicRisk(userData, bmi)

    // Calculate sleep risk based on user inputs
    const sleepRisk = calculateSleepRisk(userData)

    // Calculate mental risk based on user inputs
    const mentalRisk = calculateMentalRisk(userData)

    // Calculate immune risk based on user inputs
    const immuneRisk = calculateImmuneRisk(userData)

    // Calculate chronic disease risk based on user inputs
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

  // Calculate overall risk
  const overallRisk = Math.round(riskData.reduce((sum, item) => sum + item.risk, 0) / riskData.length)
  const overallRiskLevel = getRiskLevel(overallRisk)

  // Mock function for downloading report
  const downloadReport = async () => {
    setSavingReport(true)
    setDownloadError(null)

    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a simple text report
      const reportContent =
        `Health Prediction Report\n\nOverall Risk: ${overallRisk}%\n\n` +
        riskData
          .map(
            (category) =>
              `${category.category} Risk: ${category.risk}%\n` +
              category.factors.map((factor) => `- ${factor.name}: ${factor.suggestion}`).join("\n"),
          )
          .join("\n\n")

      // Create a blob and download it
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "health-prediction-report.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      setDownloadError("Download failed. Please try again.")
    } finally {
      setSavingReport(false)
    }
  }

  // Mock function for sharing results
  const shareResults = async () => {
    setShareError(null)

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Health Prediction Results",
          text: `My overall health risk is ${overallRisk}%. Check out my detailed health prediction results.`,
          url: window.location.href,
        })
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href)
        alert("Share link copied to clipboard!")
      }
    } catch (error) {
      console.error("Share error:", error)
      setShareError("Unable to share results. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Health Prediction Results</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your information, we've analyzed your health risks and identified key factors affecting your
            wellbeing.
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
              Detailed Analysis
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 gap-8">
              {/* Overall Risk Summary Card */}
              <Card className="border border-gray-200 shadow-md overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <CardHeader>
                  <CardTitle className="text-gray-900">Overall Health Risk</CardTitle>
                  <CardDescription className="text-gray-600">Your comprehensive health assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                        <path
                          d={`M 50 50 L 50 5 A 45 45 0 ${overallRisk > 50 ? 1 : 0} 1 ${
                            50 + 45 * Math.sin((overallRisk / 100) * Math.PI * 2)
                          } ${50 - 45 * Math.cos((overallRisk / 100) * Math.PI * 2)} Z`}
                          fill={overallRisk < 25 ? "#22c55e" : overallRisk < 50 ? "#eab308" : "#ef4444"}
                          opacity="0.8"
                        />
                        <circle cx="50" cy="50" r="35" fill="#F8FAFC" />
                        <text
                          x="50"
                          y="45"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#1E293B"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {overallRisk}%
                        </text>
                        <text x="50" y="60" textAnchor="middle" dominantBaseline="middle" fill="#64748B" fontSize="6">
                          {overallRiskLevel.label}
                        </text>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 mb-4">
                        Your overall health risk is{" "}
                        <span className={overallRiskLevel.color.split(" ")[0]}>
                          {overallRiskLevel.label.toLowerCase()}
                        </span>
                        , based on the analysis of your lifestyle data, medical history, and family background.
                      </p>
                      <p className="text-gray-700 mb-4">
                        This assessment provides a comprehensive view of your current health status and potential future
                        risks. The detailed breakdown shows your risk levels across different health categories.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/predict/results/detailed-analysis?data=${encodeURIComponent(JSON.stringify(userData))}`,
                            )
                          }
                          className="border-primary-200 text-primary-700 hover:bg-primary-50"
                        >
                          View Detailed Analysis
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/predict/results/recommendations?data=${encodeURIComponent(JSON.stringify(userData))}`,
                            )
                          }
                          className="border-primary-200 text-primary-700 hover:bg-primary-50"
                        >
                          See Recommendations
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Health Risk Chart */}
              <PremiumHealthRiskChart data={riskData} />
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="mt-0">
            <div className="grid grid-cols-1 gap-8">
              {riskData.map((category) => (
                <Card key={category.id} className="border border-gray-200 shadow-md overflow-hidden">
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-0">
            <Card className="border border-gray-200 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
              <CardHeader>
                <CardTitle className="text-gray-900">Personalized Recommendations</CardTitle>
                <CardDescription className="text-gray-600">
                  Actionable steps to improve your health based on your assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <Dumbbell className="h-5 w-5 text-green-600" />
                      </div>
                      Immediate Actions (Next 7 days)
                    </h3>
                    <div className="space-y-3">
                      {riskData
                        .flatMap((category) =>
                          category.factors
                            .filter((f) => f.impact.includes("High negative"))
                            .map((factor) => ({
                              category: category.category,
                              factor: factor,
                            })),
                        )
                        .slice(0, 3)
                        .map((item, index) => (
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
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      Long-Term Improvements
                    </h3>
                    <div className="space-y-3">
                      {riskData
                        .flatMap((category) =>
                          category.factors
                            .filter((f) => f.impact.includes("Medium negative"))
                            .map((factor) => ({
                              category: category.category,
                              factor: factor,
                            })),
                        )
                        .slice(0, 3)
                        .map((item, index) => (
                          <motion.div
                            key={`longterm-${index}`}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={downloadReport}
              disabled={savingReport}
              className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
            >
              <Download size={16} />
              {savingReport ? "Generating PDF..." : "Download Report"}
            </Button>
            <Button
              onClick={shareResults}
              variant="outline"
              className="border-primary-200 text-primary-700 hover:bg-primary-50 flex items-center gap-2"
            >
              <Share2 size={16} />
              Share Results
            </Button>
          </div>

          {downloadError && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{downloadError}</AlertDescription>
            </Alert>
          )}

          {shareError && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{shareError}</AlertDescription>
            </Alert>
          )}
        </motion.div>

        <motion.p
          className="text-center text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          This health prediction is based on self-reported data and should not replace professional medical advice.
          <br />
          Please consult with a healthcare provider for any health concerns.
        </motion.p>
      </div>
    </div>
  )
}

// Risk calculation functions
function calculateCardiovascularRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // Age factor
  if (userData.age) {
    const ageRisk = Math.min(Math.max(Number.parseInt(userData.age) - 30, 0) * 0.5, 30)
    risk += ageRisk
    if (Number.parseInt(userData.age) > 50) {
      factors.push({
        name: "Age",
        impact: "Medium negative impact",
        suggestion: "Regular cardiovascular checkups are recommended for your age group",
      })
    }
  }

  // BMI factor
  if (bmi) {
    if (bmi < 18.5) {
      risk += 10
      factors.push({
        name: "Weight",
        impact: "Medium negative impact",
        suggestion: "Being underweight may affect heart health. Consider a nutrition plan to reach a healthy weight.",
      })
    } else if (bmi >= 25 && bmi < 30) {
      risk += 15
      factors.push({
        name: "Weight",
        impact: "Medium negative impact",
        suggestion: "Being overweight increases cardiovascular risk. Aim for a 5-10% weight reduction.",
      })
    } else if (bmi >= 30) {
      risk += 25
      factors.push({
        name: "Weight",
        impact: "High negative impact",
        suggestion:
          "Obesity significantly increases cardiovascular risk. Consult a healthcare provider about weight management.",
      })
    }
  }

  // Exercise factor
  if (userData.exerciseFrequency) {
    if (userData.exerciseFrequency === "sedentary" || userData.exerciseFrequency === "light") {
      risk += 20
      factors.push({
        name: "Exercise",
        impact: "High negative impact",
        suggestion: "Aim for at least 150 minutes of moderate aerobic activity weekly",
      })
    } else if (userData.exerciseFrequency === "moderate") {
      risk += 5
      factors.push({
        name: "Exercise",
        impact: "Low negative impact",
        suggestion: "Consider adding more variety to your exercise routine",
      })
    } else {
      factors.push({
        name: "Exercise",
        impact: "High positive impact",
        suggestion: "Continue your regular exercise routine",
      })
    }
  }

  // Blood pressure factor
  if (userData.bloodPressure) {
    if (userData.bloodPressure === "high-stage1" || userData.bloodPressure === "high-stage2") {
      risk += 25
      factors.push({
        name: "Blood Pressure",
        impact: "High negative impact",
        suggestion: "Consult with a healthcare provider about managing your blood pressure",
      })
    } else if (userData.bloodPressure === "elevated") {
      risk += 15
      factors.push({
        name: "Blood Pressure",
        impact: "Medium negative impact",
        suggestion: "Monitor your blood pressure regularly and consider dietary changes",
      })
    } else if (userData.bloodPressure === "normal") {
      factors.push({
        name: "Blood Pressure",
        impact: "High positive impact",
        suggestion: "Continue maintaining healthy blood pressure levels",
      })
    }
  }

  // Smoking factor
  if (userData.smokingStatus) {
    if (userData.smokingStatus === "regular") {
      risk += 30
      factors.push({
        name: "Smoking",
        impact: "High negative impact",
        suggestion: "Quitting smoking is the single most important step for heart health",
      })
    } else if (userData.smokingStatus === "occasional") {
      risk += 15
      factors.push({
        name: "Smoking",
        impact: "Medium negative impact",
        suggestion: "Even occasional smoking increases cardiovascular risk. Consider quitting completely.",
      })
    } else if (userData.smokingStatus === "former-smoker") {
      risk += 5
      factors.push({
        name: "Smoking History",
        impact: "Low negative impact",
        suggestion: "Your risk decreases the longer you stay smoke-free",
      })
    }
  }

  // Family history factor
  if (
    userData.familyHistory &&
    (userData.familyHistory.includes("Heart Disease") ||
      userData.familyHistory.includes("High Blood Pressure") ||
      userData.familyHistory.includes("Stroke"))
  ) {
    risk += 15
    factors.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "Given your family history, regular cardiovascular checkups are recommended",
    })
  }

  // Diet factor
  if (userData.dietType) {
    if (userData.dietType === "mediterranean") {
      risk -= 10
      factors.push({
        name: "Diet",
        impact: "High positive impact",
        suggestion: "The Mediterranean diet is excellent for heart health",
      })
    } else if (userData.fastFoodFrequency === "frequently") {
      risk += 15
      factors.push({
        name: "Diet",
        impact: "Medium negative impact",
        suggestion: "Reducing fast food consumption can improve heart health",
      })
    }
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Sleep",
      impact: "Medium negative impact",
      suggestion: "Poor sleep quality can affect heart health. Aim for 7-8 hours of quality sleep.",
    })
  }

  // Cap risk between 10 and 85
  risk = Math.max(10, Math.min(85, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateMetabolicRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // BMI factor
  if (bmi) {
    if (bmi >= 30) {
      risk += 30
      factors.push({
        name: "Weight",
        impact: "High negative impact",
        suggestion: "Obesity significantly increases metabolic risk. A 5-10% weight reduction would be beneficial.",
      })
    } else if (bmi >= 25) {
      risk += 20
      factors.push({
        name: "Weight",
        impact: "Medium negative impact",
        suggestion: "Being overweight increases metabolic risk. Consider a balanced diet and regular exercise.",
      })
    } else if (bmi < 18.5) {
      risk += 10
      factors.push({
        name: "Weight",
        impact: "Low negative impact",
        suggestion:
          "Being underweight may affect metabolic health. Consider a nutrition plan to reach a healthy weight.",
      })
    }
  }

  // Diet factor
  if (userData.dietType) {
    if (userData.dietType === "mediterranean" || userData.dietType === "vegetarian") {
      risk -= 10
      factors.push({
        name: "Diet",
        impact: "High positive impact",
        suggestion: "Your diet choice is beneficial for metabolic health",
      })
    } else if (userData.fastFoodFrequency === "frequently" || userData.fastFoodFrequency === "often") {
      risk += 20
      factors.push({
        name: "Diet",
        impact: "Medium negative impact",
        suggestion: "Reduce processed carbohydrates and fast food consumption",
      })
    }
  }

  // Exercise factor
  if (userData.exerciseFrequency) {
    if (userData.exerciseFrequency === "sedentary") {
      risk += 25
      factors.push({
        name: "Exercise",
        impact: "High negative impact",
        suggestion: "Regular physical activity is essential for metabolic health. Start with short daily walks.",
      })
    } else if (userData.exerciseFrequency === "light") {
      risk += 15
      factors.push({
        name: "Exercise",
        impact: "Medium negative impact",
        suggestion: "Increase your physical activity to at least 150 minutes per week",
      })
    } else if (userData.exerciseFrequency === "moderate") {
      risk += 5
      factors.push({
        name: "Exercise",
        impact: "Low negative impact",
        suggestion: "Add 2 more days of strength training to your routine",
      })
    } else {
      factors.push({
        name: "Exercise",
        impact: "Medium positive impact",
        suggestion: "Your activity level benefits your metabolic health",
      })
    }
  }

  // Water intake
  if (userData.waterIntake) {
    if (userData.waterIntake === "low") {
      risk += 10
      factors.push({
        name: "Hydration",
        impact: "Medium negative impact",
        suggestion: "Increase water intake to at least 8 glasses daily",
      })
    } else {
      factors.push({
        name: "Hydration",
        impact: "Medium positive impact",
        suggestion: "Continue with good hydration habits",
      })
    }
  }

  // Family history
  if (userData.familyHistory && userData.familyHistory.includes("Diabetes")) {
    risk += 15
    factors.push({
      name: "Family History",
      impact: "Medium negative impact",
      suggestion: "With your family history of diabetes, regular metabolic screenings are important",
    })
  }

  // Existing conditions
  if (userData.existingConditions && userData.existingConditions.includes("Diabetes")) {
    risk += 30
    factors.push({
      name: "Diabetes",
      impact: "High negative impact",
      suggestion: "Continue following your diabetes management plan and regular check-ups",
    })
  }

  // Ensure we have at least 3 factors
  if (factors.length < 3) {
    factors.push({
      name: "Fast Food",
      impact: "Medium negative impact",
      suggestion: "Try to limit fast food to once per week",
    })
  }

  // Cap risk between 15 and 85
  risk = Math.max(15, Math.min(85, risk))

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateSleepRisk(userData: any) {
  let risk = 0
  const factors = []

  // Sleep hours
  if (userData.sleepHours) {
    const sleepHours = Number.parseFloat(userData.sleepHours)
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
    const stressLevel = Number.parseInt(userData.stressLevel)
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

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateMentalRisk(userData: any) {
  let risk = 0
  const factors = []

  // Stress level
  if (userData.stressLevel) {
    const stressLevel = Number.parseInt(userData.stressLevel)
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

  // Social connections
  if (userData.socialConnections) {
    if (userData.socialConnections === "limited") {
      risk += 25
      factors.push({
        name: "Social Connection",
        impact: "High negative impact",
        suggestion: "Try to increase meaningful social interactions weekly",
      })
    } else if (userData.socialConnections === "very-strong" || userData.socialConnections === "strong") {
      risk -= 10
      factors.push({
        name: "Social Connection",
        impact: "High positive impact",
        suggestion: "Continue maintaining your strong social connections",
      })
    }
  } else {
    // If no direct social connections data, infer from other factors
    if (userData.outdoorTime === "minimal") {
      risk += 15
      factors.push({
        name: "Social Connection",
        impact: "Medium negative impact",
        suggestion: "Spending more time outdoors can increase social interactions",
      })
    }
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
    const sleepHours = Number.parseFloat(userData.sleepHours)
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

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateImmuneRisk(userData: any) {
  let risk = 0
  const factors = []

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
    const sleepHours = Number.parseFloat(userData.sleepHours)
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
    const stressLevel = Number.parseInt(userData.stressLevel)
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

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}

function calculateChronicRisk(userData: any, bmi: number) {
  let risk = 0
  const factors = []

  // Age factor
  if (userData.age) {
    const age = Number.parseInt(userData.age)
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

  return { risk: Math.round(risk), factors: factors.slice(0, 5) }
}
