"use client"

import { useEffect, useState } from "react"
import type { AssessmentResult } from "@/lib/risk/types"
import { loadAssessment } from "./results-store"

/** Reads the stored assessment after mount (sessionStorage is not available during SSR). */
export function useAssessment(): { result: AssessmentResult | null; ready: boolean } {
  const [state, setState] = useState<{ result: AssessmentResult | null; ready: boolean }>({
    result: null,
    ready: false,
  })
  useEffect(() => {
    setState({ result: loadAssessment(), ready: true })
  }, [])
  return state
}
