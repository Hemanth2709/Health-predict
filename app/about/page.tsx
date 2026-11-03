import type { Metadata } from "next"
import Link from "next/link"
import { Activity, Brain, Database, Heart, Moon, Pill, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MODEL_INFO } from "@/lib/ml/predict"

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How VitalScope estimates cardiovascular and metabolic risk with logistic-regression models trained on the CDC BRFSS 2015 survey, and how the guideline-based scores work.",
}

const pct = (n: number) => n.toFixed(3)

export default function AboutPage() {
  const { metabolic, cardiovascular } = MODEL_INFO.metrics
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">How VitalScope works</h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl">
            VitalScope combines two machine-learning models trained on a large public health survey with four
            guideline-based scores. Every score shows the factors behind it.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold">
            <Database className="h-6 w-6 text-primary-600" aria-hidden />
            The data and the models
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dataset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700">
                <p>
                  <strong>CDC Diabetes Health Indicators</strong> (Behavioral Risk Factor Surveillance System 2015), from
                  the UCI Machine Learning Repository: {MODEL_INFO.rows.toLocaleString("en-US")} anonymised US adult survey
                  responses.
                </p>
                <p>
                  The models use the inputs this questionnaire can collect: age group, sex, BMI, high blood pressure, high
                  cholesterol, smoking history, stroke, physical activity, fruit and vegetable intake, and existing heart
                  disease or diabetes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700">
                <p>
                  One logistic-regression model per condition, trained in Python with scikit-learn and compared with
                  gradient boosting. Logistic regression is served because it scores within 0.004 AUC of boosting, is well
                  calibrated, and lets us show each factor&apos;s exact contribution.
                </p>
                <p>
                  The coefficients are exported to JSON and run inside the Next.js API route. A test checks that the
                  TypeScript output matches scikit-learn on held-out rows.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <caption className="mb-2 text-left text-gray-600">
                Held-out test-set performance (20% stratified split)
              </caption>
              <thead className="border-b bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3">Model</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">ROC-AUC</th>
                  <th className="p-3">5-fold CV AUC</th>
                  <th className="p-3">Brier score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cardiovascular</td>
                  <td className="p-3">Coronary heart disease or heart attack</td>
                  <td className="p-3">{pct(cardiovascular.roc_auc)}</td>
                  <td className="p-3">{pct(cardiovascular.cv5_roc_auc_mean)}</td>
                  <td className="p-3">{pct(cardiovascular.brier)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Metabolic</td>
                  <td className="p-3">Diabetes or prediabetes</td>
                  <td className="p-3">{pct(metabolic.roc_auc)}</td>
                  <td className="p-3">{pct(metabolic.cv5_roc_auc_mean)}</td>
                  <td className="p-3">{pct(metabolic.brier)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-2xl font-bold">What each score means</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-600" aria-hidden />
                  <Activity className="h-5 w-5 text-cyan-600" aria-hidden />
                  ML scores
                </CardTitle>
                <CardDescription>Cardiovascular · Metabolic</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-700">
                The score is your <strong>percentile</strong>: a score of 70 means your predicted probability is higher
                than that of 70% of surveyed adults. The detailed view also shows the estimated probability and how it
                compares with the survey average.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-violet-600" aria-hidden />
                  <Brain className="h-5 w-5 text-fuchsia-600" aria-hidden />
                  <Shield className="h-5 w-5 text-green-600" aria-hidden />
                  <Pill className="h-5 w-5 text-orange-600" aria-hidden />
                  Guideline scores
                </CardTitle>
                <CardDescription>Sleep · Mental · Immune · Chronic</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-700">
                The survey doesn&apos;t measure these outcomes, so they use transparent point-based rules from
                public-health guidance, such as 7–9 hours of sleep, 150 minutes of activity a week, alcohol limits and
                screening intervals. They are heuristics and are labelled that way.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-2xl font-bold">Limitations</h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>
              The survey is cross-sectional: the models estimate how likely someone with your profile is to{" "}
              <em>currently</em> report the condition, not a 10-year forecast.
            </li>
            <li>All inputs are self-reported, and the survey covers US adults in 2015.</li>
            <li>
              Two survey variables were excluded on purpose because they show reverse causation: cholesterol screening,
              and heavy drinking, which looks protective because people tend to stop drinking after a diagnosis.
            </li>
            <li>VitalScope is an educational project. It is not a medical device and does not give a diagnosis.</li>
          </ul>
          <div className="mt-10 text-center">
            <Button size="lg" asChild>
              <Link href="/predict">Start your assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
