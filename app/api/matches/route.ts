import { NextResponse } from "next/server"
import { fetchOpportunities, type Opportunity } from "@/lib/airtable"

interface UserPreferences {
  school: string
  grades: string[]
  timeAvailable: string
  availability: string[]
  interests: string[]
  contributionType: string
}

interface MatchedOpportunity extends Opportunity {
  matchScore: number
  matchReason: string
}

// ===================
// NORMALIZATION HELPERS
// ===================

// Normalize strings for comparison (case insensitive, trimmed)
function normalize(str: string): string {
  return (str || "").toLowerCase().trim()
}

// Normalize grade values for comparison
// Handles "4th" vs "4th Grade" vs "Grade 4" etc.
function normalizeGrade(grade: string): string {
  const g = normalize(grade)
  // Extract number or key word
  const match = g.match(/(\d+|k|kindergarten|pre-?k)/)
  if (match) {
    const val = match[1]
    if (val === "k" || val === "kindergarten") return "k"
    if (val.includes("pre")) return "prek"
    return val // just the number
  }
  return g
}

// Check if opportunity grades include "All" (meaning open to everyone)
function isOpenToAll(oppGrades: string[]): boolean {
  return oppGrades.some(g => normalize(g) === "all")
}

// Check if two grade arrays have any overlap
function hasGradeOverlap(oppGrades: string[], userGrades: string[]): boolean {
  // "All" means open to everyone
  if (isOpenToAll(oppGrades)) {
    return true
  }
  
  const normalizedOpp = oppGrades.map(normalizeGrade)
  const normalizedUser = userGrades.map(normalizeGrade)
  return normalizedOpp.some(g => normalizedUser.includes(g))
}

// Check if two arrays have any overlap (case insensitive)
function hasOverlap(arr1: string[], arr2: string[]): boolean {
  const normalized1 = arr1.map(normalize)
  const normalized2 = arr2.map(normalize)
  return normalized1.some(item => normalized2.includes(item))
}

// ===================
// SCORING (ALL SOFT - NO HARD FILTERS EXCEPT ACTIVE)
// ===================

// Map user interests to potential tag matches
const interestToTagKeywords: Record<string, string[]> = {
  "arts & crafts": ["art", "craft", "creative", "design", "visual"],
  "sports & fitness": ["sport", "fitness", "athletic", "physical", "pe", "recess"],
  "reading & literacy": ["reading", "literacy", "library", "book", "writing"],
  "stem & tech": ["stem", "tech", "science", "math", "computer", "coding"],
  "outdoor activities": ["outdoor", "garden", "nature", "field", "playground"],
  "event planning": ["event", "planning", "coordination", "organize", "party"],
  "food & hospitality": ["food", "hospitality", "snack", "kitchen", "cook", "lunch"],
  "photography": ["photo", "camera", "media", "video"],
  "music": ["music", "band", "choir", "instrument", "concert"],
  "fundraising": ["fundrais", "donation", "sponsor", "auction"],
  "administrative": ["admin", "office", "clerical", "data", "paperwork"],
  "mentoring": ["mentor", "tutor", "teach", "guide", "coach"],
}

// Map user timeAvailable to Airtable Time Commitment values
const timeCommitmentMatches: Record<string, string[]> = {
  minimal: ["one-time", "1 hour", "30 min", "quick", "single", "once"],
  moderate: ["2-4", "monthly", "occasional", "few hours"],
  regular: ["weekly", "ongoing", "regular", "5+", "committed"],
}

// Map user availability to Airtable Timing Window values
const availabilityMatches: Record<string, string[]> = {
  "weekday-morning": ["morning", "am", "before school", "drop-off"],
  "weekday-afternoon": ["afternoon", "pm", "after school", "pickup"],
  "weekday-evening": ["evening", "night"],
  "weekend": ["weekend", "saturday", "sunday"],
  "flexible": ["flexible", "varies", "any", "remote", "from home"],
}

interface ScoreBreakdown {
  gradeScore: number
  tagScore: number
  timeScore: number
  availScore: number
  contributionScore: number
  total: number
  reasons: string[]
}

// Normalize contribution type for comparison
function normalizeContributionType(type: string): string {
  const t = normalize(type)
  if (t.includes("donat")) return "donation"
  if (t.includes("volunt")) return "volunteer"
  if (t.includes("both")) return "both"
  return "volunteer" // Default
}

function scoreOpportunity(opp: Opportunity, preferences: UserPreferences): ScoreBreakdown {
  const breakdown: ScoreBreakdown = {
    gradeScore: 0,
    tagScore: 0,
    timeScore: 0,
    availScore: 0,
    contributionScore: 0,
    total: 0,
    reasons: [],
  }

  // 1. Grade relevance score (bonus for matches - grade filtering already applied)
  // Note: By the time we score, opportunities are already grade-eligible
  if (opp.gradeRelevance.length === 0 || isOpenToAll(opp.gradeRelevance)) {
    // General opportunity (empty or "All") - small bonus
    breakdown.gradeScore = 1
    breakdown.reasons.push("Open to all families")
  } else {
    // Grade-specific opportunity that matches user grades - bigger bonus
    breakdown.gradeScore = 3
    breakdown.reasons.push("Great for your kids")
  }

  // 2. Tag/interest match
  const oppTags = opp.tags.map(normalize)
  for (const interest of preferences.interests) {
    const interestLower = normalize(interest)
    const keywords = interestToTagKeywords[interestLower] || [interestLower]
    
    // Check if any opportunity tag matches any keyword
    const tagMatch = oppTags.some(tag => 
      keywords.some(kw => tag.includes(kw) || kw.includes(tag))
    )
    
    // Also check title/description for keyword matches
    const titleMatch = keywords.some(kw => normalize(opp.title).includes(kw))
    const descMatch = keywords.some(kw => normalize(opp.description).includes(kw))
    
    if (tagMatch || titleMatch || descMatch) {
      breakdown.tagScore += 3
      if (!breakdown.reasons.includes(`Matches your interest in ${interest}`)) {
        breakdown.reasons.push(`Matches your interest in ${interest}`)
      }
    }
  }

  // 3. Time commitment match
  const oppTime = normalize(opp.timeCommitment)
  const timeKeywords = timeCommitmentMatches[preferences.timeAvailable] || []
  if (timeKeywords.some(kw => oppTime.includes(kw))) {
    breakdown.timeScore = 2
    if (preferences.timeAvailable === "minimal") {
      breakdown.reasons.push("Quick commitment")
    } else {
      breakdown.reasons.push("Works with your schedule")
    }
  }

  // 4. Availability/timing match
  const oppTiming = normalize(opp.timingWindow)
  if (oppTiming) {
    for (const avail of preferences.availability) {
      const availKeywords = availabilityMatches[avail] || []
      if (availKeywords.some(kw => oppTiming.includes(kw))) {
        breakdown.availScore = 2
        breakdown.reasons.push("Fits your schedule")
        break
      }
    }
  }

  // 5. Contribution type match
  const userContrib = normalizeContributionType(preferences.contributionType)
  const oppContrib = normalizeContributionType(opp.type)
  
  // Score based on contribution type alignment
  if (userContrib === "both") {
    // User is open to both - give bonus to all opportunities
    breakdown.contributionScore = 2
    if (oppContrib === "donation") {
      breakdown.reasons.push("Donation opportunity")
    }
  } else if (userContrib === "donate") {
    // User prefers donating
    if (oppContrib === "donation" || oppContrib === "both") {
      breakdown.contributionScore = 3
      breakdown.reasons.push("Donation opportunity")
    }
    // Volunteer opportunities still eligible but no bonus
  } else if (userContrib === "volunteer") {
    // User prefers volunteering
    if (oppContrib === "volunteer" || oppContrib === "both") {
      breakdown.contributionScore = 3
      breakdown.reasons.push("Volunteer opportunity")
    }
    // Donation opportunities still eligible but no bonus
  }

  // Calculate total
  breakdown.total = breakdown.gradeScore + breakdown.tagScore + breakdown.timeScore + breakdown.availScore + breakdown.contributionScore

  return breakdown
}

function generateMatchReason(breakdown: ScoreBreakdown, opp: Opportunity): string {
  // Return best reason
  if (breakdown.reasons.length > 0) {
    // Prioritize specific reasons
    const priorityOrder = [
      "Matches your interest",
      "Donation opportunity",
      "Volunteer opportunity",
      "Works with your schedule",
      "Fits your schedule",
      "Quick commitment",
      "Great for your kids",
      "Open to all families",
    ]
    
    for (const priority of priorityOrder) {
      const match = breakdown.reasons.find(r => r.includes(priority.split(" ")[0]))
      if (match) return match
    }
    
    return breakdown.reasons[0]
  }
  
  // Fallback reasons based on opportunity characteristics
  const oppType = normalizeContributionType(opp.type)
  if (oppType === "donation") return "Donation opportunity"
  if (normalize(opp.timeCommitment).includes("one-time")) return "Quick win"
  if (opp.gradeRelevance.length > 0) return "Grade-specific opportunity"
  
  return "Good fit for you"
}

// ===================
// GRADE ELIGIBILITY CHECK (HARD FILTER)
// ===================

// Check if opportunity is eligible for user based on grade relevance
// Rule: If opportunity has Grade Relevance set, user grades MUST overlap. Otherwise excluded.
// If Grade Relevance is empty OR contains "All", opportunity is general/open to all.
function isGradeEligible(opp: Opportunity, userGrades: string[]): boolean {
  // Empty Grade Relevance = open to all
  if (opp.gradeRelevance.length === 0) {
    return true
  }
  
  // "All" in Grade Relevance = open to all
  if (isOpenToAll(opp.gradeRelevance)) {
    return true
  }
  
  // If user has no grades selected, they can still see general opportunities
  if (userGrades.length === 0) {
    return true
  }
  
  // Grade-specific opportunity: MUST have overlap with user grades
  return hasGradeOverlap(opp.gradeRelevance, userGrades)
}

// ===================
// MAIN MATCHING LOGIC
// ===================

const MIN_RESULTS = 3
const MAX_RESULTS = 5

export async function POST(request: Request) {
  try {
    const preferences: UserPreferences = await request.json()
    
    // Fetch all opportunities from Airtable
    const allOpportunities = await fetchOpportunities()
    
    console.log("[v0] === MATCHING DEBUG ===")
    console.log("[v0] Total opportunities:", allOpportunities.length)
    console.log("[v0] User selected grades:", preferences.grades)
    
    // HARD FILTER 1: Active = true
    const activeOpportunities = allOpportunities.filter(opp => opp.active)
    console.log("[v0] Active opportunities:", activeOpportunities.length)
    
    // Separate into grade-specific and general opportunities
    // General = empty Grade Relevance OR contains "All"
    const generalOpportunities = activeOpportunities.filter(opp => 
      opp.gradeRelevance.length === 0 || isOpenToAll(opp.gradeRelevance)
    )
    const gradeSpecificOpportunities = activeOpportunities.filter(opp => 
      opp.gradeRelevance.length > 0 && !isOpenToAll(opp.gradeRelevance)
    )
    
    console.log("[v0] General opportunities (empty Grade Relevance):", generalOpportunities.length)
    console.log("[v0] Grade-specific opportunities:", gradeSpecificOpportunities.length)
    
    // HARD FILTER 2: Grade eligibility for grade-specific opportunities only
    const gradeMatchedOpportunities = gradeSpecificOpportunities.filter(opp => {
      const matches = hasGradeOverlap(opp.gradeRelevance, preferences.grades)
      if (!matches) {
        console.log("[v0] GRADE EXCLUDED:", opp.title)
        console.log("[v0]   Grade Relevance:", opp.gradeRelevance)
        console.log("[v0]   User grades:", preferences.grades)
        console.log("[v0]   Empty Grade Relevance:", false)
        console.log("[v0]   Excluded: true")
      }
      return matches
    })
    
    console.log("[v0] Grade-matched opportunities:", gradeMatchedOpportunities.length)
    
    // Combine: general opportunities + grade-matched opportunities
    // This ensures we always have general opportunities available
    const eligibleOpportunities = [...generalOpportunities, ...gradeMatchedOpportunities]
    console.log("[v0] Total eligible opportunities:", eligibleOpportunities.length)
    
    // Score eligible opportunities
    const scoredOpportunities: MatchedOpportunity[] = eligibleOpportunities.map(opp => {
      const breakdown = scoreOpportunity(opp, preferences)
      return {
        ...opp,
        matchScore: breakdown.total,
        matchReason: generateMatchReason(breakdown, opp),
      }
    })
    
    // Sort by score (highest first)
    scoredOpportunities.sort((a, b) => b.matchScore - a.matchScore)
    
    // Log sample opportunities for debugging
    console.log("[v0] Sample scored opportunities:")
    const samples = scoredOpportunities.slice(0, 5)
    for (const opp of samples) {
      console.log("[v0]  - Title:", opp.title)
      console.log("[v0]    Grade Relevance:", opp.gradeRelevance)
      console.log("[v0]    Empty Grade Relevance:", opp.gradeRelevance.length === 0)
      console.log("[v0]    Retained: true")
      console.log("[v0]    Score:", opp.matchScore)
    }
    
    // Determine if we have strong matches (score >= 3)
    const hasStrongMatches = scoredOpportunities.some(m => m.matchScore >= 3)
    
    // Calculate number of results to return
    const numResults = Math.min(
      Math.max(MIN_RESULTS, hasStrongMatches ? MAX_RESULTS : MIN_RESULTS),
      scoredOpportunities.length
    )
    
    const topMatches = scoredOpportunities.slice(0, numResults)
    
    console.log("[v0] Final returned opportunities:", topMatches.length)
    console.log("[v0] Has strong matches:", hasStrongMatches)
    console.log("[v0] === END MATCHING DEBUG ===")
    
    // Generate appropriate message
    let message: string | undefined
    if (!hasStrongMatches && topMatches.length > 0) {
      message = "We're still finding the best fits for you, but here are a few ways you could help."
    } else if (topMatches.length === 0) {
      message = "No opportunities are currently available. Please check back soon!"
    }
    
    return NextResponse.json({
      opportunities: topMatches,
      hasStrongMatches,
      totalAvailable: allOpportunities.length,
      matchedCount: scoredOpportunities.length,
      message,
    })
  } catch (error) {
    console.error("[Matching] Error:", error)
    return NextResponse.json(
      { error: "Failed to find matches" },
      { status: 500 }
    )
  }
}
