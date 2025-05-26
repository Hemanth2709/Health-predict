import { NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

// Define the path to store Excel files
const DATA_DIR = path.join(process.cwd(), "data")
const EXCEL_FILE = path.join(DATA_DIR, "health_data.xlsx")

export async function GET() {
  try {
    // Check if file exists
    if (!fs.existsSync(EXCEL_FILE)) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(EXCEL_FILE)

    // Return file as binary
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=health_data.xlsx",
      },
    })
  } catch (error) {
    console.error("Error reading Excel file:", error)
    return NextResponse.json(
      { success: false, message: "Failed to read data", error: (error as Error).message },
      { status: 500 },
    )
  }
}
