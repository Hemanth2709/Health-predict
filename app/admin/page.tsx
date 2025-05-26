import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, BarChart, Database, Settings } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Manage health prediction data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              View, export, and manage all collected health prediction data. Ensure data integrity and proper
              formatting.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/data">Manage Data</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              ML Analysis
            </CardTitle>
            <CardDescription>Machine learning data analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Analyze health data using machine learning algorithms. View insights, trends, and predictions.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/ml-analysis">View Analysis</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Data Validation
            </CardTitle>
            <CardDescription>Validation rules and error logs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Configure data validation rules and view error logs to improve data quality and user experience.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/validation">Validation Settings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system-wide settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Data Storage</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Configure how health prediction data is stored and managed. Set up backup schedules and data retention
                  policies.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/admin/settings/storage">Storage Settings</Link>
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">ML Configuration</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Configure machine learning models, parameters, and training schedules for health predictions.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/admin/settings/ml">ML Settings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
