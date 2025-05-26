"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Activity, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import type { ValidationErrors } from "@/lib/validation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"

export default function PredictPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    heightFeet: "",
    heightInches: "",
    exerciseFrequency: "",
    exerciseTypes: [],
    sleepHours: "",
    sleepQuality: "",
    dietType: "",
    waterIntake: "",
    stressLevel: "5",
    smokingStatus: "",
    alcoholConsumption: "",
    fastFoodFrequency: "",
    screenTime: "",
    outdoorTime: "",
    familyHistory: [],
    existingConditions: [],
    chronicPain: "",
    painLevel: "",
    allergies: [],
    medications: [],
    bloodPressure: "",
    cholesterolLevels: "",
    lastCheckup: "",
    vaccinationStatus: "",
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [validationAttempted, setValidationAttempted] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Update the handleChange function for age validation
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user makes a change
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateCurrentStep = (): boolean => {
    let fieldsToValidate: Record<string, any> = {}
    let hasErrors = false
    const newErrors: ValidationErrors = {}

    // Determine which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = {
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight,
        heightFeet: formData.heightFeet,
        heightInches: formData.heightInches,
        bloodPressure: formData.bloodPressure,
        cholesterolLevels: formData.cholesterolLevels,
        lastCheckup: formData.lastCheckup,
      }

      // Validate age specifically
      if (formData.age) {
        const ageValue = Number.parseInt(formData.age as string)
        if (ageValue < 0 || ageValue > 114) {
          hasErrors = true
          newErrors["age"] = ["Please enter an age between 0 and 114."]
        }
      }
    } else if (currentStep === 2) {
      fieldsToValidate = {
        exerciseFrequency: formData.exerciseFrequency,
        sleepHours: formData.sleepHours,
        sleepQuality: formData.sleepQuality,
        dietType: formData.dietType,
        waterIntake: formData.waterIntake,
        fastFoodFrequency: formData.fastFoodFrequency,
        screenTime: formData.screenTime,
        outdoorTime: formData.outdoorTime,
      }
      // exerciseTypes is optional, so we don't need to validate it
    } else if (currentStep === 3) {
      fieldsToValidate = {
        stressLevel: formData.stressLevel,
        smokingStatus: formData.smokingStatus,
        alcoholConsumption: formData.alcoholConsumption,
        chronicPain: formData.chronicPain,
        vaccinationStatus: formData.vaccinationStatus,
      }

      // Only validate pain level if chronic pain is "yes"
      if (formData.chronicPain === "yes" && !formData.painLevel) {
        hasErrors = true
        newErrors["painLevel"] = ["Please rate your pain level"]
      }

      // For family history and existing conditions, they're valid if they have any selection
      // This includes the "None" option
      if (!formData.familyHistory || formData.familyHistory.length === 0) {
        hasErrors = true
        newErrors["familyHistory"] = ["Please select at least one option or 'None of the above'"]
      }

      if (!formData.existingConditions || formData.existingConditions.length === 0) {
        hasErrors = true
        newErrors["existingConditions"] = ["Please select at least one option or 'None of the above'"]
      }
    }

    // Check if any required fields are empty
    Object.entries(fieldsToValidate).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        hasErrors = true
        newErrors[key] = [`${key.replace(/([A-Z])/g, " $1").toLowerCase()} is required`]
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
      return false
    }

    return true
  }

  const nextStep = () => {
    setValidationAttempted(true)
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
      setValidationAttempted(false) // Reset for the next step
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Update the handleSubmit function to improve error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    setValidationAttempted(true)

    // Validate current step first
    if (!validateCurrentStep()) {
      return
    }

    setIsSubmitting(true)
    setGeneralError(null)

    try {
      // Convert height from feet/inches to cm for backend processing
      const heightInCm = calculateHeightInCm()

      // Create a copy of the form data with the calculated height in cm
      const processedData = {
        ...formData,
        height: heightInCm.toString(),
      }

      // Add ID and timestamp for storage
      const dataToSave = {
        ...processedData,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      }

      // Save to backend with improved error handling
      try {
        const response = await fetch("/api/data/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
          cache: "no-store",
        })

        const responseData = await response.json()

        if (!response.ok) {
          console.error("Server error:", responseData)
          throw new Error(responseData.message || "Failed to save data")
        }

        // Navigate to results page
        router.push(`/predict/results?data=${encodeURIComponent(JSON.stringify(processedData))}`)
      } catch (fetchError) {
        console.error("Fetch error:", fetchError)
        setGeneralError("There was an error submitting your data. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error processing form data:", error)
      setGeneralError("There was an error submitting your data. Please try again.")
      setIsSubmitting(false)
    }
  }

  const calculateHeightInCm = () => {
    const feet = Number.parseInt(formData.heightFeet as string) || 0
    const inches = Number.parseInt(formData.heightInches as string) || 0
    return Math.round(feet * 30.48 + inches * 2.54)
  }

  // Only show validation errors if the user has attempted to submit the form or move to the next step
  const shouldShowError = (field: string) => {
    return (validationAttempted || submitAttempted) && errors[field]
  }

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
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
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div className="max-w-3xl mx-auto" initial="hidden" animate="visible" variants={fadeInVariants}>
          <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-900">
            Health Prediction Questionnaire
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Complete this questionnaire to receive your personalized health insights
          </p>

          {generalError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <motion.button
                  key={step}
                  onClick={() => {
                    // Only allow going back to previous steps or current step
                    if (step <= currentStep) {
                      setCurrentStep(step)
                    }
                  }}
                  className={`flex-1 text-center py-2 rounded hover:bg-gray-100 transition-colors ${
                    currentStep === step
                      ? "text-primary-600 font-medium border-b-2 border-primary-600"
                      : step < currentStep
                        ? "text-gray-700 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                  }`}
                  whileHover={{ scale: step <= currentStep ? 1.05 : 1 }}
                  whileTap={{ scale: step <= currentStep ? 0.95 : 1 }}
                >
                  {step === 1 && "Personal"}
                  {step === 2 && "Lifestyle"}
                  {step === 3 && "Medical"}
                </motion.button>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="premium-card border-0 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <CardHeader className="bg-white border-b border-gray-100">
                  <CardTitle className="flex items-center">
                    {currentStep === 1 && (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-2">
                          <span className="text-primary-600 font-bold">1</span>
                        </div>
                        Personal & Physical Health
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-2">
                          <span className="text-primary-600 font-bold">2</span>
                        </div>
                        Lifestyle Habits
                      </>
                    )}
                    {currentStep === 3 && (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-2">
                          <span className="text-primary-600 font-bold">3</span>
                        </div>
                        Medical History & Health Behaviors
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 && "Please provide your basic information and physical health metrics"}
                    {currentStep === 2 && "Tell us about your daily activities and lifestyle habits"}
                    {currentStep === 3 && "Share your medical history and health-related behaviors"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Label htmlFor="age" className={shouldShowError("age") ? "text-destructive" : ""}>
                            Age
                          </Label>
                          {/* Update the age input validation */}
                          <Input
                            id="age"
                            type="number"
                            min="0"
                            max="114"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value)
                              if (value < 0 || value > 114) {
                                handleChange("age", e.target.value)
                                setErrors((prev) => ({ ...prev, age: ["Please enter an age between 0 and 114."] }))
                              } else {
                                handleChange("age", e.target.value)
                              }
                            }}
                            className={`premium-input ${shouldShowError("age") ? "border-destructive" : ""}`}
                            required
                          />
                          {shouldShowError("age") && <p className="text-sm text-destructive">{errors.age[0]}</p>}
                        </motion.div>
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Label htmlFor="gender" className={shouldShowError("gender") ? "text-destructive" : ""}>
                            Gender
                          </Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) => handleChange("gender", value)}
                            required
                          >
                            <SelectTrigger
                              id="gender"
                              className={`premium-input ${shouldShowError("gender") ? "border-destructive" : ""}`}
                            >
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {shouldShowError("gender") && <p className="text-sm text-destructive">{errors.gender[0]}</p>}
                        </motion.div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label htmlFor="weight" className={shouldShowError("weight") ? "text-destructive" : ""}>
                            Weight (kg)
                          </Label>
                          {/* Update the weight input validation */}
                          <Input
                            id="weight"
                            type="number"
                            min="2"
                            max="250"
                            step="0.1"
                            placeholder="Enter your weight"
                            value={formData.weight}
                            onChange={(e) => {
                              const value = Number.parseFloat(e.target.value)
                              if (value < 2 || value > 250) {
                                handleChange("weight", e.target.value)
                                setErrors((prev) => ({
                                  ...prev,
                                  weight: ["Please enter a weight between 2 kg and 250 kg."],
                                }))
                              } else {
                                handleChange("weight", e.target.value)
                              }
                            }}
                            className={`premium-input ${shouldShowError("weight") ? "border-destructive" : ""}`}
                            required
                          />
                          {shouldShowError("weight") && <p className="text-sm text-destructive">{errors.weight[0]}</p>}
                        </motion.div>
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label
                            className={
                              shouldShowError("heightFeet") || shouldShowError("heightInches") ? "text-destructive" : ""
                            }
                          >
                            Height
                          </Label>
                          {/* Update the height validation */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Input
                                id="heightFeet"
                                type="number"
                                min="1"
                                max="8"
                                placeholder="Feet"
                                value={formData.heightFeet}
                                onChange={(e) => {
                                  const feet = Number.parseInt(e.target.value)
                                  if (feet < 1 || feet > 8) {
                                    handleChange("heightFeet", e.target.value)
                                    setErrors((prev) => ({
                                      ...prev,
                                      heightFeet: ["Feet must be between 1 and 8."],
                                    }))
                                  } else {
                                    handleChange("heightFeet", e.target.value)
                                    // Check combined height
                                    const inches = Number.parseInt(formData.heightInches || "0")
                                    const totalInches = feet * 12 + inches
                                    if (totalInches < 18 || totalInches > 102) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        heightFeet: ["Total height must be between 1′ 6″ and 8′ 6″."],
                                      }))
                                    }
                                  }
                                }}
                                className={`premium-input ${shouldShowError("heightFeet") ? "border-destructive" : ""}`}
                                required
                              />
                              {shouldShowError("heightFeet") && (
                                <p className="text-sm text-destructive">{errors.heightFeet[0]}</p>
                              )}
                            </div>
                            <div>
                              <Input
                                id="heightInches"
                                type="number"
                                min="0"
                                max="11"
                                placeholder="Inches"
                                value={formData.heightInches}
                                onChange={(e) => {
                                  const inches = Number.parseInt(e.target.value)
                                  if (inches < 0 || inches > 11) {
                                    handleChange("heightInches", e.target.value)
                                    setErrors((prev) => ({
                                      ...prev,
                                      heightInches: ["Inches must be between 0 and 11."],
                                    }))
                                  } else {
                                    handleChange("heightInches", e.target.value)
                                    // Check combined height
                                    const feet = Number.parseInt(formData.heightFeet || "0")
                                    const totalInches = feet * 12 + inches
                                    if (totalInches < 18 || totalInches > 102) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        heightInches: ["Total height must be between 1′ 6″ and 8′ 6″."],
                                      }))
                                    }
                                  }
                                }}
                                className={`premium-input ${shouldShowError("heightInches") ? "border-destructive" : ""}`}
                                required
                              />
                              {shouldShowError("heightInches") && (
                                <p className="text-sm text-destructive">{errors.heightInches[0]}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label
                          htmlFor="bloodPressure"
                          className={shouldShowError("bloodPressure") ? "text-destructive" : ""}
                        >
                          Blood Pressure
                        </Label>
                        <Select
                          value={formData.bloodPressure}
                          onValueChange={(value) => handleChange("bloodPressure", value)}
                          required
                        >
                          <SelectTrigger
                            id="bloodPressure"
                            className={`premium-input ${shouldShowError("bloodPressure") ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Select your blood pressure status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (Below 90/60)</SelectItem>
                            <SelectItem value="normal">Normal (90/60 - 120/80)</SelectItem>
                            <SelectItem value="elevated">Elevated (120/80 - 129/80)</SelectItem>
                            <SelectItem value="high-stage1">High Stage 1 (130/80 - 139/89)</SelectItem>
                            <SelectItem value="high-stage2">High Stage 2 (140/90 or higher)</SelectItem>
                            <SelectItem value="unknown">I don't know</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("bloodPressure") && (
                          <p className="text-sm text-destructive">{errors.bloodPressure[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label
                          htmlFor="cholesterolLevels"
                          className={shouldShowError("cholesterolLevels") ? "text-destructive" : ""}
                        >
                          Cholesterol Levels
                        </Label>
                        <Select
                          value={formData.cholesterolLevels}
                          onValueChange={(value) => handleChange("cholesterolLevels", value)}
                          required
                        >
                          <SelectTrigger
                            id="cholesterolLevels"
                            className={`premium-input ${shouldShowError("cholesterolLevels") ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Select your cholesterol status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="borderline">Borderline High</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="unknown">I don't know</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("cholesterolLevels") && (
                          <p className="text-sm text-destructive">{errors.cholesterolLevels[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label
                          htmlFor="lastCheckup"
                          className={shouldShowError("lastCheckup") ? "text-destructive" : ""}
                        >
                          Last Medical Checkup
                        </Label>
                        <Select
                          value={formData.lastCheckup}
                          onValueChange={(value) => handleChange("lastCheckup", value)}
                          required
                        >
                          <SelectTrigger
                            id="lastCheckup"
                            className={`premium-input ${shouldShowError("lastCheckup") ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="When was your last checkup?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less-than-6-months">Less than 6 months ago</SelectItem>
                            <SelectItem value="6-12-months">6-12 months ago</SelectItem>
                            <SelectItem value="1-2-years">1-2 years ago</SelectItem>
                            <SelectItem value="2-5-years">2-5 years ago</SelectItem>
                            <SelectItem value="more-than-5-years">More than 5 years ago</SelectItem>
                            <SelectItem value="never">Never had a checkup</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("lastCheckup") && (
                          <p className="text-sm text-destructive">{errors.lastCheckup[0]}</p>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label
                          htmlFor="exercise"
                          className={shouldShowError("exerciseFrequency") ? "text-destructive" : ""}
                        >
                          Exercise Frequency
                        </Label>
                        <Select
                          value={formData.exerciseFrequency}
                          onValueChange={(value) => handleChange("exerciseFrequency", value)}
                          required
                        >
                          <SelectTrigger
                            id="exercise"
                            className={`premium-input ${shouldShowError("exerciseFrequency") ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                            <SelectItem value="light">Light (1-3 days per week)</SelectItem>
                            <SelectItem value="moderate">Moderate (3-5 days per week)</SelectItem>
                            <SelectItem value="active">Active (6-7 days per week)</SelectItem>
                            <SelectItem value="very-active">Very Active (Twice daily)</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("exerciseFrequency") && (
                          <p className="text-sm text-destructive">{errors.exerciseFrequency[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="exerciseType"
                          className={shouldShowError("exerciseTypes") ? "text-destructive" : ""}
                        >
                          Exercise Types
                        </Label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
                          {["Cardio", "Strength Training", "Flexibility/Yoga", "Sports", "Walking"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`exercise-${type.toLowerCase().replace("/", "-")}`}
                                checked={formData.exerciseTypes?.includes(type) || false}
                                onCheckedChange={(checked) => {
                                  const currentTypes = formData.exerciseTypes || []
                                  if (checked) {
                                    handleChange("exerciseTypes", [...currentTypes, type])
                                  } else {
                                    handleChange(
                                      "exerciseTypes",
                                      currentTypes.filter((t) => t !== type),
                                    )
                                  }
                                }}
                                className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                              />
                              <Label htmlFor={`exercise-${type.toLowerCase().replace("/", "-")}`} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {shouldShowError("exerciseTypes") && (
                          <p className="text-sm text-destructive">{errors.exerciseTypes[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="sleepHours" className={shouldShowError("sleepHours") ? "text-destructive" : ""}>
                          Sleep Hours (per night)
                        </Label>
                        {/* Changed from input to select dropdown with options from 4 to 15 */}
                        <Select
                          value={formData.sleepHours}
                          onValueChange={(value) => handleChange("sleepHours", value)}
                          required
                        >
                          <SelectTrigger
                            id="sleepHours"
                            className={`premium-input ${shouldShowError("sleepHours") ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Select sleep hours" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 4).map((hours) => (
                              <SelectItem key={hours} value={hours.toString()}>
                                {hours} hours
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {shouldShowError("sleepHours") && (
                          <p className="text-sm text-destructive">{errors.sleepHours[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label
                          htmlFor="sleepQuality"
                          className={shouldShowError("sleepQuality") ? "text-destructive" : ""}
                        >
                          Sleep Quality
                        </Label>
                        <Select
                          value={formData.sleepQuality || ""}
                          onValueChange={(value) => handleChange("sleepQuality", value)}
                          required
                        >
                          <SelectTrigger
                            id="sleepQuality"
                            className={`premium-input ${shouldShowError("sleepQuality") ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Select sleep quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="poor">Poor - Frequent disruptions</SelectItem>
                            <SelectItem value="fair">Fair - Some disruptions</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="good">Good - Rarely disrupted</SelectItem>
                            <SelectItem value="excellent">Excellent - Consistent quality</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("sleepQuality") && (
                          <p className="text-sm text-destructive">{errors.sleepQuality[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="diet" className={shouldShowError("dietType") ? "text-destructive" : ""}>
                          Your Eating Habits
                        </Label>
                        <Select
                          value={formData.dietType}
                          onValueChange={(value) => handleChange("dietType", value)}
                          required
                        >
                          <SelectTrigger
                            id="diet"
                            className={`premium-input ${shouldShowError("dietType") ? "border-destructive" : ""}`}
                          >
                            <SelectValue placeholder="Select your eating habits" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="mediterranean">Mediterranean</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        {shouldShowError("dietType") && (
                          <p className="text-sm text-destructive">{errors.dietType[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label className={shouldShowError("waterIntake") ? "text-destructive" : ""}>
                          Daily Water Intake
                        </Label>
                        <RadioGroup
                          value={formData.waterIntake || ""}
                          onValueChange={(value) => handleChange("waterIntake", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="low"
                              id="water-low"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="water-low">Less than 4 glasses</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="moderate"
                              id="water-moderate"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="water-moderate">4-6 glasses</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="high"
                              id="water-high"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="water-high">7+ glasses</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("waterIntake") && (
                          <p className="text-sm text-destructive">{errors.waterIntake[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label className={shouldShowError("fastFoodFrequency") ? "text-destructive" : ""}>
                          How often do you eat fast food?
                        </Label>
                        <RadioGroup
                          value={formData.fastFoodFrequency || ""}
                          onValueChange={(value) => handleChange("fastFoodFrequency", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="never"
                              id="fastfood-never"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="fastfood-never">Rarely or never</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="sometimes"
                              id="fastfood-sometimes"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="fastfood-sometimes">1-2 times per month</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="often"
                              id="fastfood-often"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="fastfood-often">1-2 times per week</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="frequently"
                              id="fastfood-frequently"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="fastfood-frequently">3+ times per week</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("fastFoodFrequency") && (
                          <p className="text-sm text-destructive">{errors.fastFoodFrequency[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Label className={shouldShowError("screenTime") ? "text-destructive" : ""}>
                          How many hours do you spend on screens daily (outside of work)?
                        </Label>
                        <RadioGroup
                          value={formData.screenTime || ""}
                          onValueChange={(value) => handleChange("screenTime", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="minimal"
                              id="screen-minimal"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="screen-minimal">Less than 1 hour</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="moderate"
                              id="screen-moderate"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="screen-moderate">1-3 hours</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="high"
                              id="screen-high"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="screen-high">4-6 hours</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="very-high"
                              id="screen-very-high"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="screen-very-high">More than 6 hours</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("screenTime") && (
                          <p className="text-sm text-destructive">{errors.screenTime[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <Label className={shouldShowError("outdoorTime") ? "text-destructive" : ""}>
                          How much time do you spend outdoors each day?
                        </Label>
                        <RadioGroup
                          value={formData.outdoorTime || ""}
                          onValueChange={(value) => handleChange("outdoorTime", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="minimal"
                              id="outdoor-minimal"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="outdoor-minimal">Less than 30 minutes</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="moderate"
                              id="outdoor-moderate"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="outdoor-moderate">30-60 minutes</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="high"
                              id="outdoor-high"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="outdoor-high">1-2 hours</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="very-high"
                              id="outdoor-very-high"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="outdoor-very-high">More than 2 hours</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("outdoorTime") && (
                          <p className="text-sm text-destructive">{errors.outdoorTime[0]}</p>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label
                          htmlFor="stressLevel"
                          className={shouldShowError("stressLevel") ? "text-destructive" : ""}
                        >
                          Stress Level (1-10)
                        </Label>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Low</span>
                          <Input
                            id="stressLevel"
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={formData.stressLevel === "" ? "5" : String(formData.stressLevel)}
                            onChange={(e) => {
                              handleChange("stressLevel", e.target.value === "" ? "" : Number.parseInt(e.target.value))
                            }}
                            className="flex-1 h-2 accent-primary-600"
                            required
                          />
                          <span className="text-sm text-gray-500">High</span>
                          <span className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-medium">
                            {formData.stressLevel}
                          </span>
                        </div>
                        {shouldShowError("stressLevel") && (
                          <p className="text-sm text-destructive">{errors.stressLevel[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label className={shouldShowError("smokingStatus") ? "text-destructive" : ""}>
                          Smoking Status
                        </Label>
                        <RadioGroup
                          value={formData.smokingStatus}
                          onValueChange={(value) => handleChange("smokingStatus", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="non-smoker"
                              id="non-smoker"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="non-smoker">Non-smoker</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="former-smoker"
                              id="former-smoker"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="former-smoker">Former smoker</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="occasional"
                              id="occasional-smoker"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="occasional-smoker">Occasional smoker</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="regular"
                              id="regular-smoker"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="regular-smoker">Regular smoker</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("smokingStatus") && (
                          <p className="text-sm text-destructive">{errors.smokingStatus[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label className={shouldShowError("alcoholConsumption") ? "text-destructive" : ""}>
                          Alcohol Consumption
                        </Label>
                        <RadioGroup
                          value={formData.alcoholConsumption}
                          onValueChange={(value) => handleChange("alcoholConsumption", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="none"
                              id="no-alcohol"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="no-alcohol">None</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="occasional"
                              id="occasional-alcohol"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="occasional-alcohol">Occasional (1-2 drinks/week)</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="moderate"
                              id="moderate-alcohol"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="moderate-alcohol">Moderate (3-7 drinks/week)</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="heavy"
                              id="heavy-alcohol"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="heavy-alcohol">Heavy (8+ drinks/week)</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("alcoholConsumption") && (
                          <p className="text-sm text-destructive">{errors.alcoholConsumption[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label className={shouldShowError("chronicPain") ? "text-destructive" : ""}>
                          Do you experience chronic pain?
                        </Label>
                        <RadioGroup
                          value={formData.chronicPain}
                          onValueChange={(value) => handleChange("chronicPain", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="yes"
                              id="pain-yes"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="pain-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="no"
                              id="pain-no"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="pain-no">No</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("chronicPain") && (
                          <p className="text-sm text-destructive">{errors.chronicPain[0]}</p>
                        )}
                      </motion.div>

                      {formData.chronicPain === "yes" && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label className={shouldShowError("painLevel") ? "text-destructive" : ""}>
                            Pain Level (1-10)
                          </Label>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Mild</span>
                            <Input
                              id="painLevel"
                              type="range"
                              min="1"
                              max="10"
                              step="1"
                              value={formData.painLevel === "" ? "5" : String(formData.painLevel)}
                              onChange={(e) => {
                                handleChange("painLevel", e.target.value === "" ? "" : Number.parseInt(e.target.value))
                              }}
                              className="flex-1 h-2 accent-primary-600"
                              required
                            />
                            <span className="text-sm text-gray-500">Severe</span>
                            <span className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-medium">
                              {formData.painLevel || "5"}
                            </span>
                          </div>
                          {shouldShowError("painLevel") && (
                            <p className="text-sm text-destructive">{errors.painLevel[0]}</p>
                          )}
                        </motion.div>
                      )}

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label className={shouldShowError("vaccinationStatus") ? "text-destructive" : ""}>
                          Are your vaccinations up to date?
                        </Label>
                        <RadioGroup
                          value={formData.vaccinationStatus}
                          onValueChange={(value) => handleChange("vaccinationStatus", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="yes"
                              id="vaccination-yes"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="vaccination-yes">Yes, all up to date</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="partial"
                              id="vaccination-partial"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="vaccination-partial">Partially up to date</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="no"
                              id="vaccination-no"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="vaccination-no">No, not up to date</Label>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <RadioGroupItem
                              value="unknown"
                              id="vaccination-unknown"
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="vaccination-unknown">I don't know</Label>
                          </div>
                        </RadioGroup>
                        {shouldShowError("vaccinationStatus") && (
                          <p className="text-sm text-destructive">{errors.vaccinationStatus[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label className={shouldShowError("familyHistory") ? "text-destructive" : ""}>
                          Family History
                        </Label>
                        <div className="text-sm text-gray-500 mb-2">Select all that apply in your immediate family</div>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
                          {[
                            "Heart Disease",
                            "Diabetes",
                            "Cancer",
                            "High Blood Pressure",
                            "Stroke",
                            "Mental Health Conditions",
                            "Alzheimer's/Dementia",
                            "Autoimmune Disorders",
                          ].map((condition) => (
                            <div
                              key={condition}
                              className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded transition-colors"
                            >
                              <Checkbox
                                id={`family-${condition.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                                checked={formData.familyHistory?.includes(condition) || false}
                                disabled={formData.familyHistory?.includes("None of the above")}
                                onCheckedChange={(checked) => {
                                  const currentHistory = formData.familyHistory || []
                                  if (checked) {
                                    handleChange("familyHistory", [
                                      ...currentHistory.filter((item) => item !== "None of the above"),
                                      condition,
                                    ])
                                  } else {
                                    handleChange(
                                      "familyHistory",
                                      currentHistory.filter((c) => c !== condition),
                                    )
                                  }
                                }}
                                className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                              />
                              <Label
                                htmlFor={`family-${condition.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                                className="text-sm"
                              >
                                {condition}
                              </Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded transition-colors">
                            <Checkbox
                              id="family-none"
                              checked={formData.familyHistory?.includes("None of the above") || false}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleChange("familyHistory", ["None of the above"])
                                } else {
                                  handleChange("familyHistory", [])
                                }
                              }}
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="family-none" className="text-sm">
                              None of the above
                            </Label>
                          </div>
                        </div>
                        {shouldShowError("familyHistory") && (
                          <p className="text-sm text-destructive">{errors.familyHistory[0]}</p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Label className={shouldShowError("existingConditions") ? "text-destructive" : ""}>
                          Existing Conditions
                        </Label>
                        <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
                          {[
                            "Heart Disease",
                            "Diabetes",
                            "Cancer",
                            "High Blood Pressure",
                            "Stroke",
                            "Mental Health Conditions",
                            "Asthma/COPD",
                            "Thyroid Disorder",
                            "Arthritis",
                            "Digestive Disorders",
                            "Kidney Disease",
                            "Liver Disease",
                          ].map((condition) => (
                            <div
                              key={condition}
                              className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded transition-colors"
                            >
                              <Checkbox
                                id={`existing-${condition.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                                checked={formData.existingConditions?.includes(condition) || false}
                                disabled={formData.existingConditions?.includes("None of the above")}
                                onCheckedChange={(checked) => {
                                  const currentConditions = formData.existingConditions || []
                                  if (checked) {
                                    handleChange("existingConditions", [
                                      ...currentConditions.filter((item) => item !== "None of the above"),
                                      condition,
                                    ])
                                  } else {
                                    handleChange(
                                      "existingConditions",
                                      currentConditions.filter((c) => c !== condition),
                                    )
                                  }
                                }}
                                className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                              />
                              <Label
                                htmlFor={`existing-${condition.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                                className="text-sm"
                              >
                                {condition}
                              </Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded transition-colors">
                            <Checkbox
                              id="existing-none"
                              checked={formData.existingConditions?.includes("None of the above") || false}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleChange("existingConditions", ["None of the above"])
                                } else {
                                  handleChange("existingConditions", [])
                                }
                              }}
                              className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label htmlFor="existing-none" className="text-sm">
                              None of the above
                            </Label>
                          </div>
                        </div>
                        {shouldShowError("existingConditions") && (
                          <p className="text-sm text-destructive">{errors.existingConditions[0]}</p>
                        )}
                      </motion.div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="border-gray-300 hover:bg-gray-100 transition-all duration-300"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                  </motion.div>
                  {currentStep < 3 ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            Get Prediction <CheckCircle className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
