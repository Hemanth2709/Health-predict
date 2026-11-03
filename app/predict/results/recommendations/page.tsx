"use client"

import { useState } from "react"
import Link from "next/link"
import { m } from "framer-motion"
import { Activity, AlertCircle, ArrowLeft, Brain, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FactorIcon } from "@/components/results/meta"
import { NoResults, ResultsLoading } from "@/components/results/no-results"
import { useAssessment } from "@/lib/client/use-assessment"
import { downloadReportPdf } from "@/lib/client/report-pdf"
import type { AssessmentResult } from "@/lib/risk/types"

export default function RecommendationsPage() {
  const { result, ready } = useAssessment()
  if (!ready) return <ResultsLoading />
  if (!result) return <NoResults />
  return <HealthPlan result={result} />
}

function HealthPlan({ result }: { result: AssessmentResult }) {
  const [downloading, setDownloading] = useState(false)
  const riskData = result.categories
  const getIconForFactor = (name: string) => <FactorIcon name={name} />

  const downloadPlan = async () => {
    setDownloading(true)
    try {
      await downloadReportPdf(result, "plan")
    } finally {
      setDownloading(false)
    }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Button asChild variant="ghost" className="mr-4 text-gray-600 hover:text-gray-900">
            <Link href="/predict/results">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Back to overview
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Your Personalized Health Plan</h1>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Based on your health assessment, we&apos;ve created a personalized plan to help you improve your health outcomes.
            Follow these recommendations to reduce your health risks and enhance your overall wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
                      <m.div
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
                      </m.div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No immediate actions required</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </m.div>

          <m.div
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
                    <m.div
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
                    </m.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </m.div>

          <m.div
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
                    <m.div
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
                    </m.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </m.div>
        </div>

        <m.div
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
                    Now that you&apos;ve established a foundation, focus on strengthening your healthy habits.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Increase intensity of exercise routine</li>
                    <li>Implement more advanced stress management techniques</li>
                    <li>Fine-tune your nutrition plan based on your body&apos;s response</li>
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
                <Button
                  onClick={downloadPlan}
                  disabled={downloading}
                  className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
                >
                  <Download size={16} aria-hidden />
                  {downloading ? "Generating PDF…" : "Download health plan (PDF)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </m.div>

        <m.p
          className="text-center text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          This health plan is based on your assessment results and should be used as a guide.
          <br />
          Always consult with healthcare professionals before making significant changes to your health routine.
        </m.p>
      </div>
    </div>
  )
}
