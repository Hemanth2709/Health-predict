"use client"

import PremiumHealthRiskChart from "@/components/premium-health-risk-chart"

export default function HealthRiskPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Health Assessment</h1>
        <div className="grid gap-6">
          <PremiumHealthRiskChart />
        </div>
      </div>
    </div>
  )
}
