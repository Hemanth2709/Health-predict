import Link from "next/link"
import { BarChart3, BrainCircuit, FileText, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MODEL_INFO } from "@/lib/ml/predict"

const FEATURES = [
  {
    icon: BrainCircuit,
    color: "text-primary-600",
    title: "Trained on real data",
    body: `Cardiovascular and metabolic risk models trained on ${MODEL_INFO.rows.toLocaleString("en-US")} CDC BRFSS survey responses.`,
  },
  {
    icon: BarChart3,
    color: "text-rose-600",
    title: "Explainable scores",
    body: "See exactly which factors raise or lower each score, and by how much compared with the average adult.",
  },
  {
    icon: ShieldCheck,
    color: "text-green-600",
    title: "Private by design",
    body: "Your answers are scored in memory and never stored. Results stay in your browser tab.",
  },
  {
    icon: FileText,
    color: "text-amber-600",
    title: "Actionable plan",
    body: "Get prioritised recommendations and download your report or 90-day plan as a PDF.",
  },
]

export default function LandingPage() {
  const { metabolic, cardiovascular } = MODEL_INFO.metrics
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 text-gray-900">
      <section className="py-20 text-center sm:py-24">
        <div className="container mx-auto px-4">
          <p className="mb-4 inline-block rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-primary-700 ring-1 ring-primary-200">
            ROC-AUC {cardiovascular.roc_auc.toFixed(2)} cardiovascular · {metabolic.roc_auc.toFixed(2)} metabolic
          </p>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Smarter Health, Backed by Data</h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            Answer a 3-minute questionnaire about your health and habits. VitalScope estimates your risk across six areas
            and shows which changes would help most.
          </p>
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/predict">Start your free assessment</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-14 text-center text-3xl font-bold">What VitalScope Offers</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, color, title, body }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className={`mb-2 h-10 w-10 ${color}`} aria-hidden />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="scroll-mt-20 py-20 text-center">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Prevention starts with awareness</CardTitle>
              <CardDescription className="mt-2 text-base">
                Most cardiovascular and metabolic risk comes from factors you can measure and change. VitalScope shows
                where you stand and where to start.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild size="lg" className="mt-4 w-full">
                <Link href="/predict">Start your assessment</Link>
              </Button>
              <Link href="/about" className="inline-block text-sm text-primary-700 underline-offset-4 hover:underline">
                How the models work →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
