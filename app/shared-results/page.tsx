"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Activity, Heart, Brain, Moon, AlertCircle } from "lucide-react"

export default function SharedResultsPage() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get shared results data from URL parameter
    const idParam = searchParams.get("id")

    if (idParam) {
      try {
        const decodedData = JSON.parse(atob(idParam))
        setResults(decodedData.results)
        setLoading(false)
      } catch (error) {
        console.error("Error parsing shared results:", error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const getRiskLevel = (score: number) => {
    if (score < 25) return { label: "Low Risk", color: "bg-green-500" }
    if (score < 50) return { label: "Moderate Risk", color: "bg-yellow-500" }
    if (score < 75) return { label: "High Risk", color: "bg-orange-500" }
    return { label: "Very High Risk", color: "bg-red-500" }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Activity className="h-12 w-12 text-primary animate-pulse mb-4" />
        <h2 className="text-2xl font-bold mb-2">Loading Shared Results</h2>
        <p className="text-gray-600">Please wait while we load the shared health prediction results...</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Results Not Found</h2>
        <p className="text-gray-600 mb-6">The shared health prediction results could not be found or have expired.</p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">HealthPredict</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/predict" className="font-medium">
                  Get Your Prediction
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Shared Health Prediction Results</h1>
            <p className="text-gray-600 mt-2">
              These results have been shared with you. Create your own health prediction by completing our
              questionnaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Cardiovascular Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span className="font-medium">{results.cardiovascular.risk}%</span>
                  </div>
                  <Progress
                    value={results.cardiovascular.risk}
                    className={`h-2 ${getRiskLevel(results.cardiovascular.risk).color}`}
                  />
                  <div className="text-sm text-right">{getRiskLevel(results.cardiovascular.risk).label}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  Metabolic Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span className="font-medium">{results.metabolic.risk}%</span>
                  </div>
                  <Progress
                    value={results.metabolic.risk}
                    className={`h-2 ${getRiskLevel(results.metabolic.risk).color}`}
                  />
                  <div className="text-sm text-right">{getRiskLevel(results.metabolic.risk).label}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                  Sleep Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span className="font-medium">{results.sleep.risk}%</span>
                  </div>
                  <Progress value={results.sleep.risk} className={`h-2 ${getRiskLevel(results.sleep.risk).color}`} />
                  <div className="text-sm text-right">{getRiskLevel(results.sleep.risk).label}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  Mental Wellbeing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span className="font-medium">{results.mental.risk}%</span>
                  </div>
                  <Progress value={results.mental.risk} className={`h-2 ${getRiskLevel(results.mental.risk).color}`} />
                  <div className="text-sm text-right">{getRiskLevel(results.mental.risk).label}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="cardiovascular" className="mb-8">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="cardiovascular">Cardiovascular</TabsTrigger>
              <TabsTrigger value="metabolic">Metabolic</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="mental">Mental</TabsTrigger>
            </TabsList>
            {Object.keys(results).map((key) => (
              <TabsContent key={key} value={key} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Factors & Recommendations</CardTitle>
                    <CardDescription>
                      Based on lifestyle data, here are the factors affecting {key} health
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {results[key].factors.map((factor: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                          <h4 className="font-medium mb-2">{factor.name}</h4>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Impact:</span>
                            <span>{factor.impact}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Suggestion:</span>
                            <span className="text-right">{factor.suggestion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-center">
            <Button asChild>
              <Link href="/predict">Get Your Own Health Prediction</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
