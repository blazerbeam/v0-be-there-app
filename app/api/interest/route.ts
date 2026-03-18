import { NextResponse } from "next/server"

interface InterestFormData {
  name?: string
  email: string
  school: string
  isPtoMember: boolean
}

export async function POST(request: Request) {
  try {
    const data: InterestFormData = await request.json()

    // Validate required fields
    if (!data.email || !data.school) {
      return NextResponse.json(
        { success: false, error: "Email and school are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "full",
      timeStyle: "short",
    })

    const emailBody = `
New BeThere Interest Submission

Name: ${data.name || "Not provided"}
Email: ${data.email}
School: ${data.school}
PTO Member: ${data.isPtoMember ? "Yes" : "No"}
Timestamp: ${timestamp}
    `.trim()

    // Check if Resend API key is available
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // Send email using Resend
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "BeThere <onboarding@resend.dev>",
          to: ["hello@bethere.community"],
          subject: "New BeThere Interest Submission",
          text: emailBody,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Resend API error:", errorData)
        throw new Error("Failed to send email")
      }
    } else {
      // Log submission when no email service is configured (development mode)
      console.log("=== Interest Form Submission ===")
      console.log(emailBody)
      console.log("================================")
      console.log("Note: RESEND_API_KEY not configured. Email not sent.")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Interest submission error:", error)
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
