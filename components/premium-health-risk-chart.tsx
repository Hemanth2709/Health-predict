"use client"

import type React from "react"
import Link from "next/link"
import { m } from "framer-motion"
import { ChevronRight, Info } from "lucide-react"
import type { RiskCategoryResult } from "@/lib/risk/types"
import { LEVEL_STYLES, MethodBadge } from "@/components/results/meta"

type ChartRow = RiskCategoryResult & { color: string; icon: React.ReactNode }

interface PremiumHealthRiskChartProps {
  data: ChartRow[]
  title?: string
  subtitle?: string
  generatedAt?: string
}

/**
 * Risk scores are independent (not shares of a whole), so they are shown as
 * bars on a common 0-100 scale rather than as a pie.
 */
export default function PremiumHealthRiskChart({
  data,
  title = "Risk by Category",
  subtitle = "Scores from 0 (lowest risk) to 100 (highest risk)",
  generatedAt,
}: PremiumHealthRiskChartProps) {
  const highest = data.filter((d) => d.level !== "Diagnosed").sort((a, b) => b.risk - a.risk)[0]
  const date = new Date(generatedAt ?? Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <section
      className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-50 shadow-lg"
      aria-labelledby="risk-chart-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary-100 bg-primary-50 p-4">
        <div>
          <h2 id="risk-chart-title" className="text-lg font-bold text-gray-800">
            {title}
          </h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>

      <ul className="space-y-5 p-6">
        {data.map((row, index) => (
          <li key={row.id}>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full p-1.5 text-white" style={{ backgroundColor: row.color }}>
                  {row.icon}
                </span>
                <span className="font-medium text-gray-900">{row.category}</span>
                <MethodBadge method={row.method} />
                {highest?.id === row.id && (
                  <span className="text-xs font-medium text-gray-500">Highest score</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${LEVEL_STYLES[row.level]}`}>{row.level}</span>
                <span className="w-10 text-right text-sm font-semibold tabular-nums text-gray-900">
                  {row.level === "Diagnosed" ? "—" : row.risk}
                </span>
              </div>
            </div>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-gray-200"
              role="meter"
              aria-label={`${row.category} risk score`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={row.risk}
              aria-valuetext={row.level === "Diagnosed" ? "Existing diagnosis" : `${row.risk} out of 100, ${row.level}`}
            >
              <m.div
                className="h-full rounded-full"
                style={{ backgroundColor: row.color }}
                initial={{ width: 0 }}
                animate={{ width: `${row.risk}%` }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary-100 bg-primary-50 p-4">
        <div className="flex items-center text-xs text-gray-600">
          <Info size={12} className="mr-1" aria-hidden />
          ML scores are percentiles among 50,736 held-out CDC survey respondents
        </div>
        <Link
          href="/predict/results/detailed-analysis"
          className="flex items-center text-xs text-primary-700 transition-colors hover:text-primary-800"
        >
          View detailed analysis
          <ChevronRight size={12} className="ml-1" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
