import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Health risk questionnaire",
  description: "Answer a 3-minute questionnaire to get your cardiovascular, metabolic, sleep, mental, immune and chronic risk scores.",
}

export default function PredictLayout({ children }: { children: React.ReactNode }) {
  return children
}
