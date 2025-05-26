// Check if this file exists and update it if needed
// If it doesn't exist, create it with the following content

import fs from "fs"
import path from "path"

// Define the data directory
const DATA_DIR = path.join(process.cwd(), "data")

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Failed to create data directory:", error)
  }
}

export async function saveData(data: any): Promise<void> {
  try {
    // Create a unique filename based on the ID and timestamp
    const filename = `${data.id}.json`
    const filePath = path.join(DATA_DIR, filename)

    // Write the data to a file
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2))

    return
  } catch (error) {
    console.error("Error saving data:", error)
    throw new Error("Failed to save data")
  }
}

export async function readData(id: string): Promise<any> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`)

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("Data not found")
    }

    // Read the data from the file
    const data = await fs.promises.readFile(filePath, "utf8")

    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading data:", error)
    throw new Error("Failed to read data")
  }
}

export async function getAllData(): Promise<any[]> {
  try {
    // Check if the directory exists
    if (!fs.existsSync(DATA_DIR)) {
      return []
    }

    // Get all files in the directory
    const files = await fs.promises.readdir(DATA_DIR)

    // Read each file and parse the data
    const dataPromises = files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const filePath = path.join(DATA_DIR, file)
        const data = await fs.promises.readFile(filePath, "utf8")
        return JSON.parse(data)
      })

    return Promise.all(dataPromises)
  } catch (error) {
    console.error("Error getting all data:", error)
    throw new Error("Failed to get all data")
  }
}
