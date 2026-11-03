"use client"

import Link from "next/link"
import { m } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_META, FactorIcon, LEVEL_STYLES, MethodBadge, impactClass } from "@/components/results/meta"
import { NoResults, ResultsLoading } from "@/components/results/no-results"
import { useAssessment } from "@/lib/client/use-assessment"

export default function DetailedAnalysisPage() {
  const { result, ready } = useAssessment()
  if (!ready) return <ResultsLoading />
  if (!result) return <NoResults />

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
            <Link href="/predict/results">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Back to overview
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Detailed Health Analysis</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {result.categories.map((category) => {
            const meta = CATEGORY_META[category.id]
            return (
              <m.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="overflow-hidden border border-gray-200 shadow-md">
                  <div className="h-1" style={{ backgroundColor: meta.color }}></div>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full p-2 text-white" style={{ backgroundColor: meta.color }}>
                        {meta.icon}
                      </span>
                      <CardTitle className="text-gray-900">{category.category} Health</CardTitle>
                      <MethodBadge method={category.method} />
                    </div>
                    <CardDescription>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${LEVEL_STYLES[category.level]}`}>
                        {category.level}
                      </span>
                      {category.level !== "Diagnosed" && <span className="ml-2 text-gray-600">Score {category.risk}/100</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-gray-700">
                      {category.model && category.level !== "Diagnosed" ? (
                        <p>
                          The model estimates a <strong>{(category.model.probability * 100).toFixed(1)}%</strong>{" "}
                          probability of {category.model.target} for someone with your profile. The survey average is{" "}
                          {(category.model.prevalence * 100).toFixed(1)}%, so that&apos;s {category.model.relativeRisk.toFixed(1)}× the
                          average. Factors are ranked by how much each one moves your estimate compared with an average adult.
                        </p>
                      ) : category.method === "guideline" ? (
                        <p>
                          This score adds up points for risk factors from public-health guidelines (for example, 7–9 hours
                          of sleep and 150 minutes of activity a week). It&apos;s a heuristic, not a trained model.
                        </p>
                      ) : null}
                    </div>

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
                                  {factor.source === "model" && factor.weight !== undefined && (
                                    <span className="ml-1 opacity-70">
                                      ({factor.weight > 0 ? "+" : ""}
                                      {factor.weight.toFixed(2)} log-odds)
                                    </span>
                                  )}
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
              </m.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
