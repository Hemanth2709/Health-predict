"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_META, LEVEL_STYLES, MethodBadge } from "@/components/results/meta"
import { ResultsLoading } from "@/components/results/no-results"
import { decodeShare } from "@/lib/share"

function SharedResults() {
  const searchParams = useSearchParams()
  const summary = decodeShare(searchParams.get("r"))

  if (!summary) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" aria-hidden />
        <h1 className="mb-2 text-2xl font-bold">Link not valid</h1>
        <p className="mb-6 text-gray-600">This shared results link is incomplete or has been altered.</p>
        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Shared Health Risk Profile</h1>
        <p className="mb-8 text-gray-600">
          {summary.generatedAt && <>Assessed on {summary.generatedAt}. </>}
          Only the scores are shared. The answers behind them never leave the original browser.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall score: {summary.overall.risk}/100</CardTitle>
            <CardDescription>
              <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${LEVEL_STYLES[summary.overall.level]}`}>
                {summary.overall.level}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-5">
              {summary.categories.map((c) => {
                const meta = CATEGORY_META[c.id]
                return (
                  <li key={c.id}>
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full p-1.5 text-white" style={{ backgroundColor: meta.color }}>
                          {meta.icon}
                        </span>
                        <span className="font-medium">{c.category}</span>
                        <MethodBadge method={c.method} />
                      </div>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${LEVEL_STYLES[c.level]}`}>
                        {c.level === "Diagnosed" ? "Existing diagnosis" : `${c.risk}/100 · ${c.level}`}
                      </span>
                    </div>
                    <div
                      className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
                      role="meter"
                      aria-label={`${c.category} risk score`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={c.risk}
                    >
                      <div className="h-full rounded-full" style={{ width: `${c.risk}%`, backgroundColor: meta.color }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild className="bg-primary-600 text-white hover:bg-primary-700">
            <Link href="/predict">Get your own assessment</Link>
          </Button>
          <p className="mt-6 text-xs text-gray-500">
            VitalScope is an educational tool, not a medical diagnosis.
          </p>
        </div>
      </div>
    </main>
  )
}

export default function SharedResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <SharedResults />
    </Suspense>
  )
}
