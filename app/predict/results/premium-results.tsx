"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Activity, AlertCircle, Check, Download, Dumbbell, Info, Share2 } from "lucide-react"
import { m } from "framer-motion"
import PremiumHealthRiskChart from "@/components/premium-health-risk-chart"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CATEGORY_META, FactorIcon, LEVEL_FILL, LEVEL_STYLES, MethodBadge, impactClass } from "@/components/results/meta"
import { downloadReportPdf } from "@/lib/client/report-pdf"
import { encodeShare } from "@/lib/share"
import type { AssessmentResult, RiskCategoryResult } from "@/lib/risk/types"

function ModelSummary({ category }: { category: RiskCategoryResult }) {
  if (!category.model || category.level === "Diagnosed") return null
  const { probability, prevalence, relativeRisk, target } = category.model
  return (
    <p className="mb-4 rounded-md bg-primary-50/60 p-3 text-sm text-gray-700">
      Estimated probability of {target}: <strong>{(probability * 100).toFixed(1)}%</strong>, compared with a survey
      average of {(prevalence * 100).toFixed(1)}% ({relativeRisk.toFixed(1)}× average). Your score of {category.risk}{" "}
      means your predicted risk is higher than about {category.risk}% of adults in the CDC survey.
    </p>
  )
}

export default function PremiumResultsPage({ result }: { result: AssessmentResult }) {
  const [savingReport, setSavingReport] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle")

  const riskData = result.categories.map((c) => ({ ...c, ...CATEGORY_META[c.id] }))
  const overall = result.overall

  const downloadReport = async () => {
    setSavingReport(true)
    setDownloadError(null)
    try {
      await downloadReportPdf(result, "report")
    } catch {
      setDownloadError("Download failed. Please try again.")
    } finally {
      setSavingReport(false)
    }
  }

  const shareResults = async () => {
    // Only the six scores go into the link, never the answers behind them.
    const url = `${window.location.origin}/shared-results?r=${encodeShare(result)}`
    try {
      if (navigator.share) {
        await navigator.share({ title: "My VitalScope health risk profile", url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareState("copied")
      setTimeout(() => setShareState("idle"), 2500)
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return
      setShareState("error")
    }
  }

  const actions = (filter: string) =>
    riskData
      .flatMap((c) => c.factors.filter((f) => f.impact.includes(filter)).map((factor) => ({ category: c.category, factor })))
      .slice(0, 3)

  const angle = (overall.risk / 100) * Math.PI * 2

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <m.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Your Health Risk Profile</h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl">
            Cardiovascular and metabolic risk come from machine-learning models trained on 253,680 CDC survey responses.
            The other four categories use public-health guidelines.
          </p>
        </m.div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-8 grid h-auto grid-cols-3 bg-gray-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
              Detailed
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 gap-8">
              <Card className="overflow-hidden border border-gray-200 shadow-md">
                <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <CardHeader>
                  <CardTitle className="text-gray-900">Overall Health Risk</CardTitle>
                  <CardDescription className="text-gray-600">
                    Average of the six category scores ({result.bmi} BMI)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="relative h-48 w-48 shrink-0">
                      <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full"
                        role="img"
                        aria-label={`Overall score ${overall.risk} out of 100, ${overall.level}`}
                      >
                        <circle cx="50" cy="50" r="45" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                        {overall.risk >= 100 ? (
                          <circle cx="50" cy="50" r="45" fill={LEVEL_FILL[overall.level]} opacity="0.8" />
                        ) : (
                          <path
                            d={`M 50 50 L 50 5 A 45 45 0 ${overall.risk > 50 ? 1 : 0} 1 ${50 + 45 * Math.sin(angle)} ${
                              50 - 45 * Math.cos(angle)
                            } Z`}
                            fill={LEVEL_FILL[overall.level]}
                            opacity="0.8"
                          />
                        )}
                        <circle cx="50" cy="50" r="35" fill="#F8FAFC" />
                        <text x="50" y="47" textAnchor="middle" dominantBaseline="middle" fill="#1E293B" fontSize="14" fontWeight="bold">
                          {overall.risk}
                        </text>
                        <text x="50" y="61" textAnchor="middle" dominantBaseline="middle" fill="#64748B" fontSize="6">
                          {overall.level}
                        </text>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="mb-4 text-gray-700">
                        Your overall score is{" "}
                        <span className={`rounded px-1.5 py-0.5 font-medium ${LEVEL_STYLES[overall.level]}`}>
                          {overall.risk}/100 · {overall.level.toLowerCase()}
                        </span>
                        . Higher scores mean higher risk.
                      </p>
                      <p className="mb-4 flex items-start gap-2 text-sm text-gray-600">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                        ML scores are population percentiles: 70 means a higher predicted risk than 70% of surveyed
                        adults. Guideline scores add up points for known risk factors.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50">
                          <Link href="/predict/results/detailed-analysis">View detailed analysis</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50">
                          <Link href="/predict/results/recommendations">See your health plan</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PremiumHealthRiskChart data={riskData} generatedAt={result.generatedAt} />
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="mt-0">
            <div className="grid grid-cols-1 gap-8">
              {riskData.map((category) => (
                <Card key={category.id} className="overflow-hidden border border-gray-200 shadow-md">
                  <div className="h-1" style={{ backgroundColor: category.color }}></div>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full p-2 text-white" style={{ backgroundColor: category.color }}>
                        {category.icon}
                      </span>
                      <CardTitle className="text-gray-900">{category.category} Health</CardTitle>
                      <MethodBadge method={category.method} />
                    </div>
                    <CardDescription className="text-gray-600">
                      {category.level === "Diagnosed" ? "Existing diagnosis reported" : `${category.level} · score ${category.risk}/100`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ModelSummary category={category} />
                    <h2 className="mb-4 text-lg font-medium text-gray-900">Key Factors</h2>
                    <ul className="space-y-4">
                      {category.factors.map((factor, index) => (
                        <m.li
                          key={factor.name}
                          className="rounded-lg bg-gray-50 p-4 shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                        >
                          <div className="flex items-start">
                            <div className="mt-0.5">
                              <FactorIcon name={factor.name} />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-medium text-gray-900">{factor.name}</h3>
                                <span className={`rounded-full px-2 py-1 text-xs ${impactClass(factor.impact)}`}>
                                  {factor.impact}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{factor.suggestion}</p>
                            </div>
                          </div>
                        </m.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-0">
            <Card className="overflow-hidden border border-gray-200 shadow-md">
              <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
              <CardHeader>
                <CardTitle className="text-gray-900">Personalized Recommendations</CardTitle>
                <CardDescription className="text-gray-600">
                  The factors that are raising your risk the most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    { title: "Immediate actions (next 7 days)", filter: "High negative", icon: Dumbbell, tint: "green" },
                    { title: "Longer-term improvements", filter: "Medium negative", icon: Activity, tint: "blue" },
                  ].map(({ title, filter, icon: Icon, tint }) => {
                    const items = actions(filter)
                    return (
                      <div key={title}>
                        <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
                          <span className={`mr-2 rounded-full p-1 ${tint === "green" ? "bg-green-100" : "bg-blue-100"}`}>
                            <Icon className={`h-5 w-5 ${tint === "green" ? "text-green-600" : "text-blue-600"}`} aria-hidden />
                          </span>
                          {title}
                        </h2>
                        {items.length === 0 ? (
                          <p className="text-sm italic text-gray-500">Nothing in this group. Nice work.</p>
                        ) : (
                          <ul className="space-y-3">
                            {items.map((item) => (
                              <li key={`${item.category}-${item.factor.name}`} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <div className="flex items-start">
                                  <div className="mt-0.5">
                                    <FactorIcon name={item.factor.name} />
                                  </div>
                                  <div className="ml-2">
                                    <p className="font-medium text-gray-900">
                                      {item.factor.name}{" "}
                                      <span className="text-sm font-normal text-gray-500">({item.category})</span>
                                    </p>
                                    <p className="text-sm text-gray-700">{item.factor.suggestion}</p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={downloadReport}
              disabled={savingReport}
              className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700"
            >
              <Download size={16} aria-hidden />
              {savingReport ? "Generating PDF…" : "Download PDF report"}
            </Button>
            <Button
              onClick={shareResults}
              variant="outline"
              className="flex items-center gap-2 border-primary-200 text-primary-700 hover:bg-primary-50"
            >
              {shareState === "copied" ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
              {shareState === "copied" ? "Link copied" : "Share scores"}
            </Button>
          </div>
          <p className="text-xs text-gray-500" aria-live="polite">
            Shared links contain only your six scores, not your answers.
          </p>

          {downloadError && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{downloadError}</AlertDescription>
            </Alert>
          )}
          {shareState === "error" && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Unable to share results. Please try again.</AlertDescription>
            </Alert>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          VitalScope is an educational tool based on self-reported answers and population survey data. It is not a
          diagnosis. Talk to a healthcare professional about any health concern.
        </p>
      </div>
    </div>
  )
}
