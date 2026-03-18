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
