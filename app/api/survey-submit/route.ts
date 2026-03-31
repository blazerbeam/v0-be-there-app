import { createSurveyResponse, type SurveySubmission } from "@/lib/airtable"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send notification email
    try {
      await resend.emails.send({
        from: "BeThere <hello@bethere.community>",
        to: "hello@bethere.community",
        subject: `New Interest: ${submission.name} — ${submission.school}`,
        html: `
          <h2>New BeThere Submission</h2>
          <p><strong>Name:</strong> ${submission.name}</p>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Phone:</strong> ${submission.phone || "Not provided"}</p>
          <p><strong>Preferred Contact:</strong> ${submission.preferredContact}</p>
          <hr/>
          <p><strong>School:</strong> ${submission.school}</p>
          <p><strong>Grades:</strong> ${submission.grades.join(", ")}</p>
          <p><strong>Time Available:</strong> ${submission.timeAvailable}</p>
          <p><strong>Availability:</strong> ${submission.availability.join(", ")}</p>
          <p><strong>Interests:</strong> ${submission.interests.join(", ")}</p>
          <p><strong>Contribution Type:</strong> ${submission.contributionType}</p>
          <hr/>
          <p><strong>Selected Opportunities:</strong></p>
          <ul>${submission.selectedOpportunityIds.map(id => `<li>${id}</li>`).join("")}</ul>
          <p><em>Submitted at ${new Date().toISOString()}</em></p>
        `,
      })
    } catch (emailErr) {
      console.error("[Email] Failed to send notification:", emailErr)
      // Don't fail the submission if email fails
    }

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
