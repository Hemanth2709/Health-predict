import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Brain, Moon, Users, BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
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
                <Link href="/dashboard" className="font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-medium text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/login" className="font-medium">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About HealthPredict</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Our mission is to empower individuals with personalized health insights through advanced data analysis and
              machine learning.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Approach</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    Data-Driven Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We use advanced machine learning algorithms to analyze your lifestyle data and provide personalized
                    health predictions based on scientific research.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Evidence-Based Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    All our health recommendations are based on peer-reviewed scientific literature and established
                    medical guidelines.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Personalized Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We recognize that everyone is unique. Our system provides tailored recommendations based on your
                    specific health profile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Health Areas We Focus On</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Heart className="h-10 w-10 text-red-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">Cardiovascular Health</CardTitle>
                  <CardDescription>
                    Assessing heart health risks and providing strategies to improve cardiovascular wellness
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Activity className="h-10 w-10 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">Metabolic Health</CardTitle>
                  <CardDescription>
                    Evaluating metabolic efficiency and offering guidance for optimal energy management
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Moon className="h-10 w-10 text-indigo-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">Sleep Quality</CardTitle>
                  <CardDescription>
                    Analyzing sleep patterns and recommending improvements for restorative rest
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Brain className="h-10 w-10 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg mb-2">Mental Wellbeing</CardTitle>
                  <CardDescription>
                    Identifying mental health risk factors and suggesting strategies for emotional balance
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Experts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our team includes physicians, nutritionists, and health researchers who ensure all recommendations
                    are medically sound and up-to-date with the latest research.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Scientists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our data science team develops and refines the machine learning models that power our health
                    prediction algorithms.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Health Coaches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our certified health coaches help translate predictions into actionable lifestyle changes that are
                    sustainable and effective.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Start your personalized health journey today with our comprehensive health prediction tool.
            </p>
            <Button size="lg" asChild>
              <Link href="/predict">Get Your Health Prediction</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">HealthPredict</h2>
              </div>
              <p className="text-gray-400">
                Using advanced machine learning to predict health outcomes based on lifestyle data.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-gray-400 hover:text-white">
                    Health Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} HealthPredict. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
