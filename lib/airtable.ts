// Server-side Airtable helper - never import this on the client

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.warn("[Airtable] Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID environment variables")
}

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`

interface AirtableRecord<T = Record<string, unknown>> {
  id: string
  createdTime: string
  fields: T
}

interface AirtableResponse<T = Record<string, unknown>> {
  records: AirtableRecord<T>[]
  offset?: string
}

export interface Opportunity {
  id: string
  title: string
  description: string
  committee: string
  category: string
  timeCommitment: string
  skillTags: string[]
  availabilityTags: string[]
}

function getField(fields: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = fields[key]
    if (value !== undefined && value !== null && value !== "") {
      return value
    }
  }
  return undefined
}

function toArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }
  return [String(value)]
}

function toStringValue(value: unknown, fallback = ""): string {
  if (value === undefined || value === null || value === "") return fallback
  if (Array.isArray(value)) return value.length ? String(value[0]) : fallback
  return String(value)
}

function normalizeOpportunity(record: AirtableRecord<Record<string, unknown>>): Opportunity {
  const fields = record.fields || {}

  console.log("[Airtable] Raw fields:", JSON.stringify(fields, null, 2))

  const title = getField(fields, "title", "Title", "name", "Name")
  const description = getField(fields, "description", "Description", "details", "Details")
  const committee = getField(fields, "committee", "Committee", "category", "Category")
  const timeCommitment = getField(fields, "time_commitment", "Time Commitment", "timeCommitment")
  const skillTags = getField(fields, "skill_tags", "Skill Tags", "skills", "Skills")
  const availabilityTags = getField(fields, "availability_tags", "Availability Tags", "availability", "Availability")

  return {
    id: record.id,
    title: toStringValue(title, "Untitled Opportunity"),
    description: toStringValue(description, ""),
    committee: toStringValue(committee, "General"),
    category: toStringValue(committee, "General"),
    timeCommitment: toStringValue(timeCommitment, "Varies"),
    skillTags: toArray(skillTags),
    availabilityTags: toArray(availabilityTags),
  }
}

// ===================
// Survey Response Types and Helpers
// ===================

// Mapping from UI values to Airtable values
const timeCommitmentMap: Record<string, string> = {
  minimal: "30 min - 1 hour/month",
  moderate: "2-4 hours/month",
  regular: "5+ hours/month",
}

const availabilityMap: Record<string, string> = {
  "weekday-morning": "Weekday Mornings",
  "weekday-afternoon": "Weekday Afternoons",
  "weekday-evening": "Weekday Evenings",
  weekend: "Weekends",
  flexible: "Flexible",
}

const interestsMap: Record<string, string> = {
  "Arts & Crafts": "Arts & Crafts",
  "Sports & Fitness": "Sports & Fitness",
  "Reading & Literacy": "Reading & Literacy",
  "STEM & Tech": "STEM & Tech",
  "Outdoor Activities": "Outdoor Activities",
  "Event Planning": "Event Planning",
  "Food & Hospitality": "Food & Hospitality",
  Photography: "Photography",
  Music: "Music",
  Fundraising: "Fundraising",
  Administrative: "Administrative",
  Mentoring: "Mentoring",
}

const contributionTypeMap: Record<string, string> = {
  volunteer: "Volunteer",
  donate: "Donate",
  both: "Both",
}

export interface SurveySubmission {
  // Contact info
  name: string
  email: string
  phone?: string
  preferredContact: string
  // Survey preferences
  school: string
  grades: string[]
  timeAvailable: string
  availability: string[]
  interests: string[]
  contributionType: string
  // Selected opportunities
  selectedOpportunityIds: string[]
}

interface AirtableSurveyFields {
  Name: string
  Email: string
  Phone?: string
  "Preferred Contact": string
  School: string
  Grades: string[]
  "Time Commitment": string
  Availability: string[]
  Interests: string[]
  "Contribution Type": string
  Opportunities: string[]
}

function mapSurveyToAirtable(submission: SurveySubmission): AirtableSurveyFields {
  return {
    Name: submission.name,
    Email: submission.email,
    Phone: submission.phone || undefined,
    "Preferred Contact": submission.preferredContact,
    School: submission.school,
    Grades: submission.grades,
    "Time Commitment": timeCommitmentMap[submission.timeAvailable] || submission.timeAvailable,
    Availability: submission.availability.map((a) => availabilityMap[a] || a),
    Interests: submission.interests.map((i) => interestsMap[i] || i),
    "Contribution Type": contributionTypeMap[submission.contributionType] || submission.contributionType,
    Opportunities: submission.selectedOpportunityIds,
  }
}

export async function createSurveyResponse(
  submission: SurveySubmission
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    return { success: false, error: "Airtable credentials not configured" }
  }

  if (!submission.email) {
    return { success: false, error: "Email is required" }
  }

  try {
    const fields = mapSurveyToAirtable(submission)
    
    // Remove undefined fields
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    )

    const response = await fetch(`${AIRTABLE_API_URL}/Survey Responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields: cleanFields }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Airtable] Create survey response error:", error)
      return { success: false, error: `Airtable API error: ${response.status}` }
    }

    const data = await response.json()
    const createdId = data.records?.[0]?.id

    return { success: true, id: createdId }
  } catch (err) {
    console.error("[Airtable] Create survey response exception:", err)
    return { success: false, error: "Failed to create survey response" }
  }
}

// ===================
// Opportunities
// ===================

export async function fetchOpportunities(): Promise<Opportunity[]> {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    throw new Error("Airtable credentials not configured")
  }

  const allRecords: AirtableRecord<Record<string, unknown>>[] = []
  let offset: string | undefined

  do {
    const url = new URL(`${AIRTABLE_API_URL}/Opportunities`)
    if (offset) {
      url.searchParams.set("offset", offset)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Airtable API error: ${response.status} - ${error}`)
    }

    const data: AirtableResponse<Record<string, unknown>> = await response.json()
    allRecords.push(...data.records)
    offset = data.offset
  } while (offset)

  return allRecords.map(normalizeOpportunity)
}
