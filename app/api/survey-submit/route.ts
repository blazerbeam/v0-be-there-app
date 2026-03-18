import { createSurveyResponse, type SurveySubmission } from "@/lib/airtable"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      )
    }

    // Build submission object with defensive defaults
    const submission: SurveySubmission = {
      name: body.name,
      email: body.email,
      phone: body.phone || undefined,
      preferredContact: body.preferredContact || "email",
      school: body.school || "",
      grades: Array.isArray(body.grades) ? body.grades : [],
      timeAvailable: body.timeAvailable || "",
      availability: Array.isArray(body.availability) ? body.availability : [],
      interests: Array.isArray(body.interests) ? body.interests : [],
      contributionType: body.contributionType || "",
      selectedOpportunityIds: Array.isArray(body.selectedOpportunityIds)
        ? body.selectedOpportunityIds
        : [],
    }

    const result = await createSurveyResponse(submission)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      id: result.id,
    })
  } catch (err) {
    console.error("[API] Survey submit error:", err)
    return NextResponse.json(
      { success: false, error: "Failed to process submission" },
      { status: 500 }
    )
  }
}
