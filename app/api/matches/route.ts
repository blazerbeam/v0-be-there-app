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

// Normalize strings for comparison (case insensitive, trimmed)
function normalize(str: string): string {
  return (str || "").toLowerCase().trim()
}

// Check if two arrays have any overlap (case insensitive)
function hasOverlap(arr1: string[], arr2: string[]): boolean {
  const normalized1 = arr1.map(normalize)
  const normalized2 = arr2.map(normalize)
  return normalized1.some(item => normalized2.includes(item))
}

// Get overlapping items between two arrays
function getOverlap(arr1: string[], arr2: string[]): string[] {
  const normalized2 = arr2.map(normalize)
  return arr1.filter(item => normalized2.includes(normalize(item)))
}

// ===================
// HARD FILTERS
// ===================

function passesHardFilters(opp: Opportunity, preferences: UserPreferences): boolean {
  // 1. Must be active
  if (!opp.active) {
    return false
  }

  // 2. Grade relevance check
  // If Grade Relevance is empty, treat as general opportunity (allow it)
  // If Grade Relevance has values, must overlap with user's grades
  if (opp.gradeRelevance.length > 0 && preferences.grades.length > 0) {
    if (!hasOverlap(opp.gradeRelevance, preferences.grades)) {
      return false
    }
  }

  return true
}

// ===================
// SOFT SCORING
// ===================

interface ScoreResult {
  score: number
  reason?: string
}

// Map user interests to potential tag matches
const interestToTagKeywords: Record<string, string[]> = {
  "Arts & Crafts": ["art", "craft", "creative", "design", "visual"],
  "Sports & Fitness": ["sport", "fitness", "athletic", "physical", "pe", "recess"],
  "Reading & Literacy": ["reading", "literacy", "library", "book", "writing"],
  "STEM & Tech": ["stem", "tech", "science", "math", "computer", "coding"],
  "Outdoor Activities": ["outdoor", "garden", "nature", "field", "playground"],
  "Event Planning": ["event", "planning", "coordination", "organize", "party"],
  "Food & Hospitality": ["food", "hospitality", "snack", "kitchen", "cook", "lunch"],
  "Photography": ["photo", "camera", "media", "video"],
  "Music": ["music", "band", "choir", "instrument", "concert"],
  "Fundraising": ["fundrais", "donation", "sponsor", "auction"],
  "Administrative": ["admin", "office", "clerical", "data", "paperwork"],
  "Mentoring": ["mentor", "tutor", "teach", "guide", "coach"],
}

// Score tag match
function scoreTagMatch(opp: Opportunity, userInterests: string[]): ScoreResult {
  const oppTags = opp.tags.map(normalize)
  let score = 0
  let matchedInterest = ""

  for (const interest of userInterests) {
    const interestLower = normalize(interest)
    const keywords = interestToTagKeywords[interest] || [interestLower]
    
    // Check if any opportunity tag matches any keyword
    const tagMatch = oppTags.some(tag => 
      keywords.some(kw => tag.includes(kw) || kw.includes(tag))
    )
    
    if (tagMatch) {
      score += 3
      if (!matchedInterest) matchedInterest = interest
    }
  }

  return {
    score,
    reason: matchedInterest ? `Matches your interest in ${matchedInterest}` : undefined,
  }
}

// Map user timeAvailable to Airtable Time Commitment values
const timeCommitmentMatches: Record<string, string[]> = {
  minimal: ["one-time", "1 hour", "30 min", "quick", "single"],
  moderate: ["2-4", "monthly", "occasional", "few hours"],
  regular: ["weekly", "ongoing", "regular", "5+", "committed"],
}

// Score time commitment match
function scoreTimeMatch(opp: Opportunity, userTimeAvailable: string): ScoreResult {
  const oppTime = normalize(opp.timeCommitment)
  const matchKeywords = timeCommitmentMatches[userTimeAvailable] || []
  
  const matches = matchKeywords.some(kw => oppTime.includes(kw))
  
  if (matches) {
    return {
      score: 2,
      reason: userTimeAvailable === "minimal" ? "Quick commitment" : "Works with your schedule",
    }
  }

  return { score: 0 }
}

// Map user availability to Airtable Timing Window values
const availabilityMatches: Record<string, string[]> = {
  "weekday-morning": ["morning", "am", "before school", "drop-off"],
  "weekday-afternoon": ["afternoon", "pm", "after school", "pickup"],
  "weekday-evening": ["evening", "night"],
  "weekend": ["weekend", "saturday", "sunday"],
  "flexible": ["flexible", "varies", "any", "remote", "from home"],
}

// Score availability/timing match
function scoreAvailabilityMatch(opp: Opportunity, userAvailability: string[]): ScoreResult {
  const oppTiming = normalize(opp.timingWindow)
  
  // If opportunity has no timing window, neutral
  if (!oppTiming) {
    return { score: 0 }
  }

  for (const avail of userAvailability) {
    const matchKeywords = availabilityMatches[avail] || []
    const matches = matchKeywords.some(kw => oppTiming.includes(kw))
    
    if (matches) {
      return {
        score: 2,
        reason: "Fits your schedule",
      }
    }
  }

  return { score: 0 }
}

// ===================
// MATCH REASON GENERATION
// ===================

function generateMatchReason(
  tagResult: ScoreResult,
  timeResult: ScoreResult,
  availResult: ScoreResult,
  opp: Opportunity
): string {
  // Priority: specific reasons first
  if (tagResult.reason && tagResult.score >= 3) return tagResult.reason
  if (availResult.reason && availResult.score >= 2) return availResult.reason
  if (timeResult.reason && timeResult.score >= 2) return timeResult.reason
  
  // Fallback reasons based on opportunity characteristics
  if (normalize(opp.timeCommitment).includes("one-time")) return "Quick win"
  if (opp.gradeRelevance.length > 0) return "Great for your kids"
  
  return "Good fit for you"
}

// ===================
// MAIN MATCHING LOGIC
// ===================

export async function POST(request: Request) {
  try {
    const preferences: UserPreferences = await request.json()
    
    // Fetch all opportunities from Airtable
    const allOpportunities = await fetchOpportunities()
    
    // Apply hard filters and score remaining
    const matchedOpportunities: MatchedOpportunity[] = []
    
    for (const opp of allOpportunities) {
      // Hard filters - skip if doesn't pass
      if (!passesHardFilters(opp, preferences)) {
        continue
      }
      
      // Soft scoring
      const tagResult = scoreTagMatch(opp, preferences.interests)
      const timeResult = scoreTimeMatch(opp, preferences.timeAvailable)
      const availResult = scoreAvailabilityMatch(opp, preferences.availability)
      
      // Calculate total score
      const totalScore = tagResult.score + timeResult.score + availResult.score
      
      // Generate match reason
      const matchReason = generateMatchReason(tagResult, timeResult, availResult, opp)
      
      matchedOpportunities.push({
        ...opp,
        matchScore: totalScore,
        matchReason,
      })
    }
    
    // Sort by score (highest first)
    matchedOpportunities.sort((a, b) => b.matchScore - a.matchScore)
    
    // Determine if we have strong matches (score >= 3)
    const hasStrongMatches = matchedOpportunities.some(m => m.matchScore >= 3)
    
    // Return top 3-5 matches
    const maxResults = hasStrongMatches ? 5 : 4
    const topMatches = matchedOpportunities.slice(0, maxResults)
    
    // If no matches at all, return fallback with soft message
    if (topMatches.length === 0) {
      // Get general opportunities (no grade restrictions, active)
      const generalOpps = allOpportunities
        .filter(opp => opp.active && opp.gradeRelevance.length === 0)
        .slice(0, 3)
        .map(opp => ({
          ...opp,
          matchScore: 0,
          matchReason: "Open to all families",
        }))
      
      return NextResponse.json({
        opportunities: generalOpps,
        hasStrongMatches: false,
        totalAvailable: allOpportunities.length,
        matchedCount: 0,
        message: "We're still finding the best fits for you, but here are a few ways you could help.",
      })
    }
    
    return NextResponse.json({
      opportunities: topMatches,
      hasStrongMatches,
      totalAvailable: allOpportunities.length,
      matchedCount: matchedOpportunities.length,
    })
  } catch (error) {
    console.error("[Matching] Error:", error)
    return NextResponse.json(
      { error: "Failed to find matches" },
      { status: 500 }
    )
  }
}
