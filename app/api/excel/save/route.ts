import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

// Define the path to store Excel files
const DATA_DIR = path.join(process.cwd(), "data")
const EXCEL_FILE = path.join(DATA_DIR, "health_data.xlsx")

export async function POST(request: NextRequest) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Get binary data from request
    const { data } = await request.json()

    // Convert array back to Uint8Array
    const buffer = new Uint8Array(data)

    // Write to file
    fs.writeFileSync(EXCEL_FILE, buffer)

    return NextResponse.json({ success: true, message: "Data saved successfully" })
  } catch (error) {
    console.error("Error saving Excel file:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save data", error: (error as Error).message },
      { status: 500 },
    )
  }
}
