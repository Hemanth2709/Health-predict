"use client"

import PremiumPieChart from "@/premium-pie-chart"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Executive Dashboard</h1>
        <div className="grid gap-6">
          <PremiumPieChart />
        </div>
      </div>
    </div>
  )
}
