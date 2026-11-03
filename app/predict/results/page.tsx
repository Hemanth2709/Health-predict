"use client"

import { useAssessment } from "@/lib/client/use-assessment"
import { NoResults, ResultsLoading } from "@/components/results/no-results"
import PremiumResultsPage from "./premium-results"

export default function ResultsPage() {
  const { result, ready } = useAssessment()
  if (!ready) return <ResultsLoading />
  if (!result) return <NoResults />
  return <PremiumResultsPage result={result} />
}
