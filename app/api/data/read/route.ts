import { NextResponse } from "next/server"
import { readData } from "@/lib/data-utils"

export async function GET() {
  try {
    // Read data
    const data = await readData()

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to read data", error: (error as Error).message },
      { status: 500 },
    )
  }
}
