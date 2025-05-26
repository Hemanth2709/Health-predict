"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import PremiumResultsPage from "./premium-results"

// Default results for when user data is not available
const defaultResults = {
  cardiovascular: {
    risk: 28,
    factors: [
      { name: "Exercise", impact: "High positive impact", suggestion: "Continue your regular exercise routine" },
      { name: "Diet", impact: "Medium positive impact", suggestion: "Consider reducing sodium intake" },
      { name: "Sleep", impact: "Medium negative impact", suggestion: "Try to increase sleep duration by 1 hour" },
      { name: "Screen Time", impact: "Low negative impact", suggestion: "Reduce screen time before bed" },
      {
        name: "Family History",
        impact: "Medium negative impact",
        suggestion: "Regular cardiovascular checkups are recommended",
      },
    ],
  },
  metabolic: {
    risk: 42,
    factors: [
      { name: "Diet", impact: "Medium negative impact", suggestion: "Reduce processed carbohydrates" },
      { name: "Exercise", impact: "Medium positive impact", suggestion: "Add 2 more days of strength training" },
      { name: "Weight", impact: "Low negative impact", suggestion: "A 5% weight reduction would be beneficial" },
      { name: "Water Intake", impact: "Medium positive impact", suggestion: "Continue with good hydration habits" },
      {
        name: "Fast Food",
        impact: "Medium negative impact",
        suggestion: "Try to limit fast food to once per week",
      },
    ],
  },
  sleep: {
    risk: 35,
    factors: [
      { name: "Screen Time", impact: "High negative impact", suggestion: "Avoid screens 1 hour before bedtime" },
      { name: "Stress", impact: "Medium negative impact", suggestion: "Try meditation before sleep" },
      {
        name: "Exercise Timing",
        impact: "Low negative impact",
        suggestion: "Avoid intense exercise 3 hours before bed",
      },
      {
        name: "Sleep Environment",
        impact: "Medium positive impact",
        suggestion: "Maintain your comfortable sleep environment",
      },
      {
        name: "Sleep Consistency",
        impact: "Medium negative impact",
        suggestion: "Try to go to bed at the same time each night",
      },
    ],
  },
  mental: {
    risk: 22,
    factors: [
      {
        name: "Social Connection",
        impact: "High positive impact",
        suggestion: "Continue maintaining social connections",
      },
      {
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Consider adding mindfulness practice",
      },
      {
        name: "Sleep",
        impact: "Medium negative impact",
        suggestion: "Improve sleep quality with a consistent schedule",
      },
      {
        name: "Outdoor Time",
        impact: "Medium positive impact",
        suggestion: "Your time outdoors benefits your mental health",
      },
      {
        name: "Physical Activity",
        impact: "High positive impact",
        suggestion: "Exercise is benefiting your mental health",
      },
    ],
  },
  immune: {
    risk: 30,
    factors: [
      {
        name: "Vaccination",
        impact: "High positive impact",
        suggestion: "Staying up-to-date with vaccinations strengthens your immune protection",
      },
      {
        name: "Sleep Quality",
        impact: "Medium negative impact",
        suggestion: "Poor sleep can weaken immune function; aim for 7-8 hours of quality sleep",
      },
      {
        name: "Stress Management",
        impact: "Medium negative impact",
        suggestion: "Chronic stress suppresses immune function; consider stress reduction techniques",
      },
      {
        name: "Nutrition",
        impact: "Medium positive impact",
        suggestion: "Continue consuming a variety of fruits and vegetables rich in antioxidants",
      },
      {
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Regular moderate exercise supports immune health",
      },
    ],
  },
  chronic: {
    risk: 38,
    factors: [
      {
        name: "Family History",
        impact: "High negative impact",
        suggestion: "With your family history, regular preventive screenings are essential",
      },
      {
        name: "Diet Quality",
        impact: "Medium negative impact",
        suggestion: "Reducing processed foods can lower chronic disease risk",
      },
      {
        name: "Physical Activity",
        impact: "Medium positive impact",
        suggestion: "Your activity level helps prevent chronic conditions",
      },
      {
        name: "Weight Management",
        impact: "Medium negative impact",
        suggestion: "Maintaining a healthy weight reduces risk of multiple chronic conditions",
      },
      {
        name: "Regular Checkups",
        impact: "High positive impact",
        suggestion: "Continue with regular health screenings for early detection",
      },
    ],
  },
}

export default function ResultsPage() {
  // Use refs to prevent re-renders
  const initialized = useRef(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [userData, setUserData] = useState<any>(null)

  // Initialize data only once
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Get user data from URL parameters
    const dataParam = searchParams.get("data")
    let parsedData = null

    if (dataParam) {
      try {
        parsedData = JSON.parse(decodeURIComponent(dataParam))
        setUserData(parsedData)

        // Simulate loading progress
        const interval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              return 100
            }
            return prev + 5
          })
        }, 100)

        // Simulate API call to Python backend with the user data
        setTimeout(() => {
          setLoading(false)
          clearInterval(interval)
        }, 2000)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [searchParams])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Health Data</h1>
          <p className="text-gray-600 mb-8">
            Please wait while we process your information and generate personalized insights...
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          <div className="flex flex-col items-center space-y-8 mt-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 italic">
              Our AI is analyzing your data to provide personalized health insights...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Render the premium results page
  return <PremiumResultsPage />
}
