import * as XLSX from "xlsx"

// Define the structure of our health data
export interface HealthData {
  id: string
  timestamp: string
  age: string
  gender: string
  weight: string
  height: string
  exerciseFrequency: string
  exerciseTypes: string
  sleepHours: string
  sleepQuality: string
  dietType: string
  waterIntake: string
  stressLevel: string
  smokingStatus: string
  alcoholConsumption: string
  anxietyFrequency: string
  depressionFrequency: string
  socialConnections: string
  workLifeBalance: string
  mindfulnessPractice: string
  bloodPressure: string
  cholesterolLevels: string
  familyHistory: string
  existingConditions: string
  [key: string]: any // Allow additional properties
}

// Function to save data to Excel file
export async function saveToExcel(data: HealthData): Promise<string> {
  try {
    // Check if file exists, if not create a new one with headers
    let workbook: XLSX.WorkBook
    let worksheet: XLSX.WorkSheet

    try {
      // Try to read existing file
      const fileData = await fetch("/api/excel/read").then((res) => {
        if (!res.ok) throw new Error("File not found")
        return res.arrayBuffer()
      })

      workbook = XLSX.read(new Uint8Array(fileData), { type: "array" })
      worksheet = workbook.Sheets[workbook.SheetNames[0]]
    } catch (error) {
      // Create new workbook if file doesn't exist
      workbook = XLSX.utils.book_new()
      worksheet = XLSX.utils.aoa_to_sheet([Object.keys(data)])
      XLSX.utils.book_append_sheet(workbook, worksheet, "HealthData")
    }

    // Add new row
    const newRow = Object.values(data)
    XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 })

    // Convert to binary and save
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

    // Send to API to save
    const response = await fetch("/api/excel/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: Array.from(new Uint8Array(excelBuffer)) }),
    })

    if (!response.ok) {
      throw new Error("Failed to save data")
    }

    return "Data saved successfully"
  } catch (error) {
    console.error("Error saving to Excel:", error)
    throw error
  }
}

// Function to read data from Excel file
export async function readFromExcel(): Promise<HealthData[]> {
  try {
    const response = await fetch("/api/excel/read")

    if (!response.ok) {
      throw new Error("Failed to read data")
    }

    const fileData = await response.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(fileData), { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json<HealthData>(worksheet)

    return jsonData
  } catch (error) {
    console.error("Error reading from Excel:", error)
    return []
  }
}

// Function to preprocess data for ML
export function preprocessData(data: HealthData[]): any[] {
  // Implement data preprocessing for ML
  // This would include handling missing values, encoding categorical variables, etc.
  return data.map((record) => {
    // Create a copy to avoid modifying the original
    const processed = { ...record }

    // Convert string numbers to actual numbers
    processed.age = Number(record.age) || 0
    processed.weight = Number(record.weight) || 0
    processed.height = Number(record.height) || 0
    processed.sleepHours = Number(record.sleepHours) || 0
    processed.stressLevel = Number(record.stressLevel) || 0

    // Convert arrays stored as strings back to arrays
    if (typeof record.exerciseTypes === "string") {
      processed.exerciseTypes = record.exerciseTypes.split(",")
    }
    if (typeof record.familyHistory === "string") {
      processed.familyHistory = record.familyHistory.split(",")
    }
    if (typeof record.existingConditions === "string") {
      processed.existingConditions = record.existingConditions.split(",")
    }

    return processed
  })
}
