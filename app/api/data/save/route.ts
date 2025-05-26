import { type NextRequest, NextResponse } from "next/server"
import { saveData } from "@/lib/data-utils"

export async function POST(request: NextRequest) {
  try {
    // Get data from request
    const data = await request.json()

    // Save data (wrap in try/catch to handle potential errors)
    try {
      await saveData(data)
      return NextResponse.json({ success: true, message: "Data saved successfully" })
    } catch (saveError) {
      console.error("Error in saveData function:", saveError)
      return NextResponse.json(
        { success: false, message: "Failed to save data", error: (saveError as Error).message },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error parsing request data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to parse request data", error: (error as Error).message },
      { status: 400 },
    )
  }
}
