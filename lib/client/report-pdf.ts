import type { AssessmentResult } from "@/lib/risk/types"

/**
 * Builds a PDF report in the browser. jsPDF is loaded on demand so it doesn't
 * add to the initial bundle.
 */
export async function downloadReportPdf(result: AssessmentResult, kind: "report" | "plan" = "report") {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const margin = 48
  const width = doc.internal.pageSize.getWidth() - margin * 2
  const pageHeight = doc.internal.pageSize.getHeight()
  let y = margin

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
  }
  const text = (value: string, size = 10, style: "normal" | "bold" = "normal", color: [number, number, number] = [30, 41, 59]) => {
    doc.setFont("helvetica", style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(value, width) as string[]
    ensureSpace(lines.length * size * 1.35)
    doc.text(lines, margin, y)
    y += lines.length * size * 1.35
  }

  text(kind === "plan" ? "VitalScope: Personal Health Plan" : "VitalScope: Health Risk Report", 18, "bold")
  text(`Generated ${new Date(result.generatedAt).toLocaleString()}  ·  BMI ${result.bmi}`, 9, "normal", [100, 116, 139])
  y += 8
  text(`Overall score: ${result.overall.risk}/100 (${result.overall.level})`, 12, "bold")
  y += 6

  for (const c of result.categories) {
    ensureSpace(60)
    y += 6
    const method = c.method === "ml" ? "ML model trained on CDC BRFSS 2015" : "guideline-based score"
    text(`${c.category}: ${c.level === "Diagnosed" ? "existing diagnosis" : `${c.risk}/100 (${c.level})`}`, 12, "bold")
    text(method, 8, "normal", [100, 116, 139])
    if (c.model && c.level !== "Diagnosed") {
      text(
        `Estimated probability of ${c.model.target}: ${(c.model.probability * 100).toFixed(1)}% ` +
          `(survey average ${(c.model.prevalence * 100).toFixed(1)}%, ${c.model.relativeRisk.toFixed(1)}x the average). ` +
          `Score = percentile among 50,736 held-out survey respondents.`,
        9,
      )
    }
    for (const f of c.factors) {
      if (kind === "plan" && !f.impact.includes("negative")) continue
      text(`•  ${f.name} (${f.impact}): ${f.suggestion}`, 9)
    }
  }

  y += 12
  text(
    "Disclaimer: VitalScope is an educational project, not a medical device. Scores are estimated from self-reported " +
      "answers and population survey data. They are not a diagnosis. Talk to a qualified healthcare professional about any health concern.",
    8,
    "normal",
    [100, 116, 139],
  )

  doc.save(kind === "plan" ? "vitalscope-health-plan.pdf" : "vitalscope-health-report.pdf")
}
