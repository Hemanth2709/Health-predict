"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { readFromExcel, preprocessData, type HealthData } from "@/lib/excel-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import * as XLSX from "xlsx"

export default function MLAnalysisPage() {
  const [data, setData] = useState<HealthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const excelData = await readFromExcel()
        setData(excelData)

        if (excelData.length > 0) {
          // Process data for ML analysis
          const processedData = preprocessData(excelData)

          // Calculate basic statistics
          calculateStatistics(processedData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateStatistics = (processedData: any[]) => {
    // Basic statistics calculation
    const stats: any = {
      totalRecords: processedData.length,
      averageAge: 0,
      averageWeight: 0,
      averageHeight: 0,
      genderDistribution: {},
      exerciseFrequencyDistribution: {},
      dietTypeDistribution: {},
      riskFactors: {
        smoking: 0,
        alcohol: 0,
        highBloodPressure: 0,
        highCholesterol: 0,
      },
    }

    // Calculate averages and distributions
    let totalAge = 0
    let totalWeight = 0
    let totalHeight = 0

    processedData.forEach((record) => {
      // Averages
      totalAge += record.age
      totalWeight += record.weight
      totalHeight += record.height

      // Distributions
      if (!stats.genderDistribution[record.gender]) {
        stats.genderDistribution[record.gender] = 0
      }
      stats.genderDistribution[record.gender]++

      if (!stats.exerciseFrequencyDistribution[record.exerciseFrequency]) {
        stats.exerciseFrequencyDistribution[record.exerciseFrequency] = 0
      }
      stats.exerciseFrequencyDistribution[record.exerciseFrequency]++

      if (!stats.dietTypeDistribution[record.dietType]) {
        stats.dietTypeDistribution[record.dietType] = 0
      }
      stats.dietTypeDistribution[record.dietType]++

      // Risk factors
      if (record.smokingStatus === "regular" || record.smokingStatus === "occasional") {
        stats.riskFactors.smoking++
      }

      if (record.alcoholConsumption === "heavy" || record.alcoholConsumption === "moderate") {
        stats.riskFactors.alcohol++
      }

      if (record.bloodPressure === "high-stage1" || record.bloodPressure === "high-stage2") {
        stats.riskFactors.highBloodPressure++
      }

      if (record.cholesterolLevels === "high") {
        stats.riskFactors.highCholesterol++
      }
    })

    if (processedData.length > 0) {
      stats.averageAge = Math.round(totalAge / processedData.length)
      stats.averageWeight = Math.round(totalWeight / processedData.length)
      stats.averageHeight = Math.round(totalHeight / processedData.length)
    }

    setStats(stats)
  }

  const downloadProcessedData = () => {
    if (data.length === 0) return

    // Process data for ML
    const processedData = preprocessData(data)

    // Convert to Excel
    const worksheet = XLSX.utils.json_to_sheet(processedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "ProcessedData")

    // Generate Excel file
    XLSX.writeFile(workbook, "processed_health_data.xlsx")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Machine Learning Data Analysis</h1>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Admin</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Overview</CardTitle>
                <CardDescription>Summary of the health prediction dataset</CardDescription>
              </CardHeader>
              <CardContent>
                {data.length === 0 ? (
                  <p>No data available. Please collect some health prediction data first.</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Records</p>
                      <p className="text-2xl font-bold">{stats?.totalRecords || 0}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Avg. Age</p>
                        <p className="text-xl font-bold">{stats?.averageAge || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg. Weight (kg)</p>
                        <p className="text-xl font-bold">{stats?.averageWeight || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg. Height (cm)</p>
                        <p className="text-xl font-bold">{stats?.averageHeight || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={downloadProcessedData}
                  disabled={data.length === 0}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Download Processed Data
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Distribution of key health risk factors</CardDescription>
              </CardHeader>
              <CardContent>
                {data.length === 0 ? (
                  <p>No data available. Please collect some health prediction data first.</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Smoking (Regular/Occasional)</p>
                      <div className="flex items-center">
                        <div
                          className="bg-red-500 h-4 rounded-l"
                          style={{ width: `${(stats?.riskFactors.smoking / stats?.totalRecords) * 100}%` }}
                        ></div>
                        <div className="bg-gray-200 h-4 rounded-r flex-grow"></div>
                        <span className="ml-2 text-sm font-medium">
                          {stats?.riskFactors.smoking} (
                          {Math.round((stats?.riskFactors.smoking / stats?.totalRecords) * 100)}%)
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Alcohol (Heavy/Moderate)</p>
                      <div className="flex items-center">
                        <div
                          className="bg-orange-500 h-4 rounded-l"
                          style={{ width: `${(stats?.riskFactors.alcohol / stats?.totalRecords) * 100}%` }}
                        ></div>
                        <div className="bg-gray-200 h-4 rounded-r flex-grow"></div>
                        <span className="ml-2 text-sm font-medium">
                          {stats?.riskFactors.alcohol} (
                          {Math.round((stats?.riskFactors.alcohol / stats?.totalRecords) * 100)}%)
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">High Blood Pressure</p>
                      <div className="flex items-center">
                        <div
                          className="bg-purple-500 h-4 rounded-l"
                          style={{ width: `${(stats?.riskFactors.highBloodPressure / stats?.totalRecords) * 100}%` }}
                        ></div>
                        <div className="bg-gray-200 h-4 rounded-r flex-grow"></div>
                        <span className="ml-2 text-sm font-medium">
                          {stats?.riskFactors.highBloodPressure} (
                          {Math.round((stats?.riskFactors.highBloodPressure / stats?.totalRecords) * 100)}%)
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">High Cholesterol</p>
                      <div className="flex items-center">
                        <div
                          className="bg-blue-500 h-4 rounded-l"
                          style={{ width: `${(stats?.riskFactors.highCholesterol / stats?.totalRecords) * 100}%` }}
                        ></div>
                        <div className="bg-gray-200 h-4 rounded-r flex-grow"></div>
                        <span className="ml-2 text-sm font-medium">
                          {stats?.riskFactors.highCholesterol} (
                          {Math.round((stats?.riskFactors.highCholesterol / stats?.totalRecords) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Tools for managing the health prediction dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={downloadProcessedData} disabled={data.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Raw Data
                </Button>
                <Button variant="outline" onClick={downloadProcessedData} disabled={data.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Processed Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
