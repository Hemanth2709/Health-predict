"use client"

import Link from "next/link"
import { Activity, ArrowRight, Heart, Brain, Moon, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              HealthPredict
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="font-medium text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-medium text-gray-600 hover:text-primary-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/predict" className="font-medium text-primary-600 hover:text-primary-800 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-r from-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-900">
                Personalized Health Predictions Powered by AI
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover your health risks and get personalized recommendations based on your lifestyle data. Our
                advanced AI analyzes your habits to provide accurate insights for a healthier future.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/predict">
                    <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6">
                      Get Your Prediction <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mr-4">
                      <Activity className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Health Risk Assessment</h3>
                      <p className="text-sm text-gray-500">Personalized analysis based on your lifestyle</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-rose-600 mr-2" />
                        <span className="text-gray-700">Cardiovascular Risk</span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Moderate
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 text-violet-600 mr-2" />
                        <span className="text-gray-700">Mental Health</span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Low Risk
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Moon className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="text-gray-700">Sleep Quality</span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Risk
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 italic">
                      "Based on your sleep patterns and stress levels, we recommend focusing on sleep hygiene and stress
                      management techniques."
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-blue-100 rounded-full opacity-70 blur-2xl"></div>
              <div className="absolute -top-6 -left-6 h-32 w-32 bg-primary-100 rounded-full opacity-70 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Health Analysis</h2>
            <p className="text-lg text-gray-600">
              Our AI-powered platform analyzes multiple aspects of your health to provide a holistic view of your
              wellbeing and personalized recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8 text-rose-600" />,
                title: "Cardiovascular Health",
                description:
                  "Assess your heart health based on lifestyle factors, family history, and medical metrics.",
              },
              {
                icon: <Zap className="h-8 w-8 text-cyan-600" />,
                title: "Metabolic Analysis",
                description: "Understand how your diet, exercise, and other habits affect your metabolic health.",
              },
              {
                icon: <Moon className="h-8 w-8 text-violet-600" />,
                title: "Sleep Quality",
                description: "Evaluate your sleep patterns and get recommendations for better rest and recovery.",
              },
              {
                icon: <Brain className="h-8 w-8 text-purple-600" />,
                title: "Mental Wellbeing",
                description:
                  "Gain insights into your mental health and discover strategies to improve your emotional balance.",
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600" />,
                title: "Immune System",
                description: "Learn how your lifestyle choices impact your immune function and disease resistance.",
              },
              {
                icon: <Activity className="h-8 w-8 text-orange-600" />,
                title: "Chronic Disease Risk",
                description: "Identify potential long-term health risks and take preventive measures early.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-lg text-gray-600">Get personalized health insights in just a few simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Share Your Lifestyle Data",
                description:
                  "Answer questions about your daily habits, including sleep, diet, exercise, and stress levels.",
              },
              {
                step: "02",
                title: "AI Analysis",
                description:
                  "Our advanced algorithms analyze your data to identify patterns and potential health risks.",
              },
              {
                step: "03",
                title: "Get Personalized Insights",
                description:
                  "Receive a detailed health risk assessment with actionable recommendations tailored to your lifestyle.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <div className="bg-white rounded-xl shadow-lg p-8 relative z-10 h-full border border-gray-100">
                  <div className="text-5xl font-bold text-gray-100 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                    <ArrowRight className="h-8 w-8 text-primary-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Health Journey Today</h2>
            <p className="text-xl mb-8 text-primary-100">
              Get personalized health insights and recommendations in minutes
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/predict">
                <Button className="bg-white text-primary-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6">
                  Get Your Health Prediction <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-primary-400 mr-2" />
                <span className="text-xl font-bold">HealthPredict</span>
              </div>
              <p className="text-gray-400 mt-2">Personalized health insights powered by AI</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Health Articles
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} HealthPredict. All rights reserved.</p>
            <p className="mt-2">
              Disclaimer: This tool provides general health information and is not a substitute for professional medical
              advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
