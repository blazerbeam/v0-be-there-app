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
  timingWindow: string
  skillTags: string[]
  availabilityTags: string[]
  gradeRelevance: string[]
  tags: string[]
  active: boolean
  type: string // "Volunteer", "Donation", or "Both"
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

  const title = getField(fields, "title", "Title", "name", "Name")
  const description = getField(fields, "description", "Description", "details", "Details")
  const committee = getField(fields, "committee", "Committee", "category", "Category")
  const timeCommitment = getField(fields, "time_commitment", "Time Commitment", "timeCommitment")
  const timingWindow = getField(fields, "timing_window", "Timing Window", "timingWindow")
  const skillTags = getField(fields, "skill_tags", "Skill Tags", "skills", "Skills")
  const availabilityTags = getField(fields, "availability_tags", "Availability Tags", "availability", "Availability")
  const gradeRelevance = getField(fields, "grade_relevance", "Grade Relevance", "gradeRelevance", "Grades")
  const tags = getField(fields, "tags", "Tags")
  const active = getField(fields, "active", "Active")
  const type = getField(fields, "type", "Type")

  return {
    id: record.id,
    title: toStringValue(title, "Untitled Opportunity"),
    description: toStringValue(description, ""),
    committee: toStringValue(committee, "General"),
    category: toStringValue(committee, "General"),
    timeCommitment: toStringValue(timeCommitment, "Varies"),
    timingWindow: toStringValue(timingWindow, ""),
    skillTags: toArray(skillTags),
    availabilityTags: toArray(availabilityTags),
    gradeRelevance: toArray(gradeRelevance),
    tags: toArray(tags),
    active: active === true || active === "true" || active === 1,
    type: toStringValue(type, "Volunteer"), // Default to Volunteer if not specified
  }
}

// ===================
// Survey Submission Types and Helpers
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

// Contact method mapping (lowercase UI values to Airtable select options)
const contactMethodMap: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  text: "Text",
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

// ===================
// Parents Table Helpers
// ===================

interface ParentRecord {
  id: string
  email: string
  name: string
}

async function findParentByEmail(email: string): Promise<ParentRecord | null> {
  try {
    const url = new URL(`${AIRTABLE_API_URL}/${encodeURIComponent("Parents")}`)
    url.searchParams.set("filterByFormula", `{Email} = "${email}"`)
    url.searchParams.set("maxRecords", "1")

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[Airtable] Find parent error:", await response.text())
      return null
    }

    const data = await response.json()
    const record = data.records?.[0]
    
    if (!record) return null
    
    return {
      id: record.id,
      email: record.fields.Email || email,
      name: record.fields.Name || "",
    }
  } catch (err) {
    console.error("[Airtable] Find parent exception:", err)
    return null
  }
}

async function createParent(submission: SurveySubmission): Promise<ParentRecord | null> {
  try {
    // Only send the minimum required fields
    const fields: Record<string, unknown> = {
      Name: submission.name,
      Email: submission.email,
    }

    const payload = { records: [{ fields }] }

    const response = await fetch(`${AIRTABLE_API_URL}/${encodeURIComponent("Parents")}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Airtable] Create parent error:", errorText)
      return null
    }

    const data = await response.json()
    const record = data.records?.[0]
    
    if (!record) return null
    
    return {
      id: record.id,
      email: submission.email,
      name: submission.name,
    }
  } catch (err) {
    console.error("[Airtable] Create parent exception:", err)
    return null
  }
}

// ===================
// Interaction Events Table Helpers
// ===================

async function createInteractionEvent(
  submission: SurveySubmission,
  parentId: string | null
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Only use known existing fields: Parent, Opportunity, Metadata
    const fields: Record<string, unknown> = {}

    // Parent - linked record (array of IDs)
    if (parentId) {
      fields.Parent = [parentId]
    }

    // Opportunity - linked record (array of IDs)
    if (submission.selectedOpportunityIds?.length) {
      fields.Opportunity = submission.selectedOpportunityIds
    }

    // Metadata - store full submission as JSON string
    fields.Metadata = JSON.stringify({
      name: submission.name,
      email: submission.email,
      phone: submission.phone || null,
      preferredContact: submission.preferredContact,
      school: submission.school,
      grades: submission.grades,
      timeAvailable: submission.timeAvailable,
      availability: submission.availability,
      interests: submission.interests,
      contributionType: submission.contributionType,
      selectedOpportunityIds: submission.selectedOpportunityIds,
      submittedAt: new Date().toISOString(),
    })

    const payload = { records: [{ fields }] }

    const response = await fetch(`${AIRTABLE_API_URL}/${encodeURIComponent("Interaction Events")}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Airtable] Create interaction event error:", errorText)
      return { success: false, error: `Airtable API error: ${response.status}` }
    }

    const data = await response.json()
    const createdId = data.records?.[0]?.id

    return { success: true, id: createdId }
  } catch (err) {
    console.error("[Airtable] Create interaction event exception:", err)
    return { success: false, error: "Failed to create interaction event" }
  }
}

// ===================
// Main Submission Function
// ===================

export async function createSurveyResponse(
  submission: SurveySubmission
): Promise<{ success: boolean; id?: string; parentId?: string; error?: string }> {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    return { success: false, error: "Airtable credentials not configured" }
  }

  if (!submission.email) {
    return { success: false, error: "Email is required" }
  }

  // Step 1: Find or create parent
  let parent = await findParentByEmail(submission.email)
  
  if (!parent) {
    parent = await createParent(submission)
  }

  // Step 2: Create interaction event (even if parent creation failed)
  const result = await createInteractionEvent(submission, parent?.id || null)

  return {
    ...result,
    parentId: parent?.id,
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
