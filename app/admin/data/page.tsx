"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { readFromExcel, type HealthData } from "@/lib/excel-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import * as XLSX from "xlsx"

export default function DataManagementPage() {
  const [data, setData] = useState<HealthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const excelData = await readFromExcel()
        setData(excelData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const downloadExcel = () => {
    if (data.length === 0) return

    // Convert to Excel
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "HealthData")

    // Generate Excel file
    XLSX.writeFile(workbook, "health_data.xlsx")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Management</h1>
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Health Prediction Data</CardTitle>
          <CardDescription>View and manage all collected health data</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p className="text-sm text-gray-500 mb-4">
                There is no health prediction data available yet. Start collecting data by having users complete the
                health prediction form.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Height (cm)</TableHead>
                    <TableHead>Exercise Frequency</TableHead>
                    <TableHead>Sleep Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.id.substring(0, 8)}...</TableCell>
                      <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>{row.gender}</TableCell>
                      <TableCell>{row.weight}</TableCell>
                      <TableCell>{row.height}</TableCell>
                      <TableCell>{row.exerciseFrequency}</TableCell>
                      <TableCell>{row.sleepHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={downloadExcel} disabled={data.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
            <Button asChild>
              <Link href="/predict">Collect New Data</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Validation Logs</CardTitle>
          <CardDescription>View logs of validation errors and data issues</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">No validation errors have been logged yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
