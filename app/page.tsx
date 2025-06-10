"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  HeartPulse,
  Stethoscope,
  Apple,
  BarChart3,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">

     

      {/* Hero */}
      <section className="py-24 text-center">
        <div className="container px-4 mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Smarter Health, Backed by Data</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-10">
            VitalScope analyzes your health metrics, lifestyle, and history to deliver tailored guidance for a better tomorrow.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => router.push("/predict")}
          >
            Begin Your Health Scan
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">What VitalScope Offers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Stethoscope className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Vital Tracking</CardTitle>
                <CardDescription>Stay updated with real-time indicators like BMI, blood pressure, and pulse rates.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <HeartPulse className="h-10 w-10 text-pink-500 mb-2" />
                <CardTitle>Genetic Insights</CardTitle>
                <CardDescription>Incorporate hereditary risk factors and family history into health analysis.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Apple className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Smart Nutrition</CardTitle>
                <CardDescription>Generate meal plans tuned to your goals and dietary restrictions.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-indigo-500 mb-2" />
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>Track your transformation with intelligent visual feedback and goal-setting.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-20 text-center">
        <div className="container px-4 mx-auto">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Redefining Preventive Healthcare</CardTitle>
              <CardDescription className="text-base mt-2">
                With data-driven insight and personalized recommendations, VitalScope empowers individuals to take charge of their well-being proactively.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full mt-4"
                onClick={() => router.push("/predict")}
              >
                Start Your Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
     
    </main>
  )
}
