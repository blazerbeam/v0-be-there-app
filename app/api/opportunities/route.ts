import { NextResponse } from "next/server"
import { fetchOpportunities } from "@/lib/airtable"

export async function GET() {
  try {
    const opportunities = await fetchOpportunities()
    return NextResponse.json({ opportunities })
  } catch (error) {
    console.error("[API] Failed to fetch opportunities:", error)
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    )
  }
}
