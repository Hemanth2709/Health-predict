"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Users } from "lucide-react"

interface FormPreviewProps {
  formData: any
  currentStep: number
}

export default function FormPreview({ formData, currentStep }: FormPreviewProps) {
  if (currentStep < 5) return null

  // Extract data for preview
  const familyHistory = formData.familyHistory || []
  const existingConditions = formData.existingConditions || []
  const hasNoFamilyHistory = familyHistory.includes("None") || familyHistory.length === 0
  const hasNoConditions = existingConditions.includes("None") || existingConditions.length === 0

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Data Summary</CardTitle>
        <CardDescription>Preview of your health information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Users className="h-4 w-4 mr-1 text-blue-500" />
              Family History
            </h4>
            {hasNoFamilyHistory ? (
              <p className="text-sm text-gray-600">No family history of major conditions reported</p>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {familyHistory.map((condition: string, index: number) => (
                  <div key={index} className="text-sm bg-gray-50 p-1 rounded">
                    {condition}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Activity className="h-4 w-4 mr-1 text-green-500" />
              Existing Conditions
            </h4>
            {hasNoConditions ? (
              <p className="text-sm text-gray-600">No existing health conditions reported</p>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {existingConditions.map((condition: string, index: number) => (
                  <div key={index} className="text-sm bg-gray-50 p-1 rounded">
                    {condition}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              Lifestyle Factors
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Exercise:</span>
                <span className="font-medium">{formData.exerciseFrequency || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sleep:</span>
                <span className="font-medium">{formData.sleepHours || "Not specified"} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diet:</span>
                <span className="font-medium">{formData.dietType || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fast Food:</span>
                <span className="font-medium">{formData.fastFoodFrequency || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Screen Time:</span>
                <span className="font-medium">{formData.screenTime || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outdoor Time:</span>
                <span className="font-medium">{formData.outdoorTime || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
