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
  isUniversalDonation?: boolean
}

// ===================
// NORMALIZATION HELPERS
// ===================

function normalize(str: string): string {
  return (str || "").toLowerCase().trim()
}

function normalizeGrade(grade: string): string {
  const g = normalize(grade)
  const match = g.match(/(\d+|k|kindergarten|pre-?k)/)
  if (match) {
    const val = match[1]
    if (val === "k" || val === "kindergarten") return "k"
    if (val.includes("pre")) return "prek"
    return val
  }
  return g
}

function isOpenToAll(oppGrades: string[]): boolean {
  return oppGrades.some(g => normalize(g) === "all")
}

function hasGradeOverlap(oppGrades: string[], userGrades: string[]): boolean {
  if (isOpenToAll(oppGrades)) return true
  const normalizedOpp = oppGrades.map(normalizeGrade)
  const normalizedUser = userGrades.map(normalizeGrade)
  return normalizedOpp.some(g => normalizedUser.includes(g))
}

// ===================
// INTEREST TAG MAPPING
// ===================

// Map UI interest labels (normalized to lowercase) to EXACT Airtable tag values
// Only exact matches count - no fuzzy/partial matching
const interestToTags: Record<string, string[]> = {
  "arts & crafts": ["arts & crafts", "arts", "crafts"],
  "sports & fitness": ["sports & fitness", "sports", "fitness"],
  "reading & literacy": ["reading & literacy", "reading", "literacy"],
  "stem & tech": ["stem & tech", "stem", "technology", "tech"],
  "outdoor activities": ["outdoor activities", "outdoors", "gardening"],
  "event planning": ["event planning", "events", "organizing"],
  "food & hospitality": ["food & hospitality", "food", "hospitality"],
  "photography": ["photography"],
  "music": ["music"],
  "fundraising": ["fundraising"],
  "administrative": ["administrative", "admin", "communications"],
  "mentoring": ["mentoring"],
}

// ===================
// CONTRIBUTION TYPE HELPERS
// ===================

function normalizeContributionType(type: string): "volunteer" | "donate" | "both" {
  const t = normalize(type)
  if (t.includes("donat") || t === "donate") return "donate"
  if (t.includes("volunt") || t === "volunteer") return "volunteer"
  if (t.includes("both")) return "both"
  return "volunteer"
}

function getUserContributionIntent(contributionType: string): "volunteer" | "donate" | "both" {
  const t = normalize(contributionType)
  if (t.includes("rather donate") || t === "donate") return "donate"
  if (t.includes("little of both") || t.includes("both")) return "both"
  // Default: any time-based selection means volunteering
  return "volunteer"
}

// ===================
// UNIVERSAL DONATION CARD
// ===================

function createUniversalDonationCard(): MatchedOpportunity {
  return {
    id: "universal-donation",
    title: "Support what matters most",
    description: "Donate to the PTO to help fund programs, events, and classroom support.",
    committee: "PTO",
    category: "Donation",
    timeCommitment: "One-time",
    timingWindow: "Any time",
    skillTags: [],
    availabilityTags: [],
    gradeRelevance: [],
    tags: ["donation"],
    active: true,
    type: "Donate",
    commitmentType: "One-time",
    timeEstimate: "5 min",
    highNeed: false,
    matchScore: 100,
    matchReason: "Donation opportunity",
    isUniversalDonation: true,
  }
}

// ===================
// FILTERING LOGIC
// ===================

// Check if opportunity matches at least one user interest via TAGS ONLY
// Uses STRICT matching - tag must exactly equal one of the mapped values
function matchesUserInterests(opp: Opportunity, userInterests: string[]): { matches: boolean; matchedInterest: string | null } {
  if (userInterests.length === 0) {
    // No interests selected = all opportunities are eligible
    return { matches: true, matchedInterest: null }
  }
  
  // Normalize opportunity tags for comparison
  const oppTags = opp.tags.map(normalize)
  
  for (const interest of userInterests) {
    const interestLower = normalize(interest)
    const allowedTags = interestToTags[interestLower] || []
    
    // Skip if we don't have a mapping for this interest
    if (allowedTags.length === 0) continue
    
    // Normalize allowed tags for comparison
    const normalizedAllowedTags = allowedTags.map(normalize)
    
    // STRICT MATCH: opportunity tag must exactly equal one of the allowed tags
    const hasExactTagMatch = oppTags.some(oppTag => 
      normalizedAllowedTags.includes(oppTag)
    )
    
    if (hasExactTagMatch) {
      return { matches: true, matchedInterest: interest }
    }
  }
  
  return { matches: false, matchedInterest: null }
}

// Check if opportunity matches user's contribution type preference
function matchesContributionType(opp: Opportunity, userIntent: "volunteer" | "donate" | "both"): boolean {
  const oppType = normalizeContributionType(opp.type)
  
  switch (userIntent) {
    case "donate":
      // User wants to donate: only include donation opportunities
      return oppType === "donate" || oppType === "both"
    case "both":
      // User is open to both: include everything
      return true
    case "volunteer":
    default:
      // User wants to volunteer: only include volunteer opportunities
      return oppType === "volunteer" || oppType === "both"
  }
}

// Check if opportunity is grade-eligible
function isGradeEligible(opp: Opportunity, userGrades: string[]): boolean {
  if (opp.gradeRelevance.length === 0) return true
  if (isOpenToAll(opp.gradeRelevance)) return true
  if (userGrades.length === 0) return true
  return hasGradeOverlap(opp.gradeRelevance, userGrades)
}

// ===================
// SCORING (WITHIN FILTERED SET)
// ===================

const timeCommitmentMatches: Record<string, string[]> = {
  minimal: ["one-time", "1 hour", "30 min", "quick", "single", "once"],
  moderate: ["2-4", "monthly", "occasional", "few hours"],
  regular: ["weekly", "ongoing", "regular", "5+", "committed"],
}

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
  total: number
  matchedInterest: string | null
}

function scoreOpportunity(opp: Opportunity, preferences: UserPreferences, matchedInterest: string | null): ScoreBreakdown {
  const breakdown: ScoreBreakdown = {
    gradeScore: 0,
    tagScore: 0,
    timeScore: 0,
    availScore: 0,
    total: 0,
    matchedInterest,
  }

  // 1. Grade relevance score
  if (opp.gradeRelevance.length === 0 || isOpenToAll(opp.gradeRelevance)) {
    breakdown.gradeScore = 1
  } else {
    breakdown.gradeScore = 3
  }

  // 2. Tag/interest match score (we already know it matches, but give points for the match)
  if (matchedInterest) {
    breakdown.tagScore = 3
  }

  // 3. Time commitment match
  const oppTime = normalize(opp.timeCommitment)
  const timeKeywords = timeCommitmentMatches[preferences.timeAvailable] || []
  if (timeKeywords.some(kw => oppTime.includes(kw))) {
    breakdown.timeScore = 2
  }

  // 4. Availability/timing match
  const oppTiming = normalize(opp.timingWindow)
  if (oppTiming) {
    for (const avail of preferences.availability) {
      const availKeywords = availabilityMatches[avail] || []
      if (availKeywords.some(kw => oppTiming.includes(kw))) {
        breakdown.availScore = 2
        break
      }
    }
  }

  breakdown.total = breakdown.gradeScore + breakdown.tagScore + breakdown.timeScore + breakdown.availScore
  return breakdown
}

function generateMatchReason(breakdown: ScoreBreakdown, opp: Opportunity): string {
  // Priority 1: Interest match (only if we have a REAL tag-based match)
  if (breakdown.matchedInterest) {
    return `Matches your interest in ${breakdown.matchedInterest}`
  }
  
  // Priority 2: Schedule-based reasons
  if (breakdown.timeScore > 0) {
    return "Works with your schedule"
  }
  if (breakdown.availScore > 0) {
    return "Fits your availability"
  }
  
  // Priority 3: Grade-based reasons
  if (breakdown.gradeScore >= 3) {
    return "Great for your kids"
  }
  
  // Fallback
  const oppType = normalizeContributionType(opp.type)
  if (oppType === "donate") return "Donation opportunity"
  if (normalize(opp.timeCommitment).includes("one-time")) return "Quick commitment"
  
  return "Good fit for you"
}

// ===================
// FILTERING LOGIC
// ===================
// 
// PRIMARY: Interest + Grade + Type (strict match)
// SECONDARY: Grade + Type only (no interest match) - shown separately
//
// Grade eligibility means:
// - Opportunity is tagged for user's selected grade(s), OR
// - Opportunity is tagged "All" / open to all grades, OR
// - Opportunity has no grade restriction (empty gradeRelevance)

interface FilterResult {
  opp: Opportunity
  matchedInterest: string | null
}

interface SplitFilterResults {
  primary: FilterResult[]   // Interest-matched opportunities
  secondary: FilterResult[] // Grade-matched but no interest match
}

function splitFilterOpportunities(
  activeOpportunities: Opportunity[],
  userIntent: "volunteer" | "donate" | "both",
  userGrades: string[],
  userInterests: string[]
): SplitFilterResults {
  // HARD FILTER 1: Contribution type (never relaxed)
  const typeFiltered = activeOpportunities.filter(opp => 
    matchesContributionType(opp, userIntent)
  )
  
  // HARD FILTER 2: Grade eligibility (never relaxed)
  const gradeFiltered = typeFiltered.filter(opp => 
    isGradeEligible(opp, userGrades)
  )
  
  const primary: FilterResult[] = []
  const secondary: FilterResult[] = []
  
  for (const opp of gradeFiltered) {
    const { matches, matchedInterest } = matchesUserInterests(opp, userInterests)
    
    if (matches && matchedInterest) {
      primary.push({ opp, matchedInterest })
    } else {
      secondary.push({ opp, matchedInterest: null })
    }
  }
  
  return { primary, secondary }
}

// ===================
// MAIN MATCHING LOGIC
// ===================

export async function POST(request: Request) {
  try {
    const preferences: UserPreferences = await request.json()
    
    // Fetch all opportunities from Airtable
    const allOpportunities = await fetchOpportunities()
    
    // Determine user's contribution intent
    const userIntent = getUserContributionIntent(preferences.contributionType)
    
    // HARD FILTER: Active = true
    const activeOpportunities = allOpportunities.filter(opp => opp.active)
    
    // Split into primary (interest-matched) and secondary (grade-only)
    const { primary, secondary } = splitFilterOpportunities(
      activeOpportunities,
      userIntent,
      preferences.grades,
      preferences.interests
    )
    
    // Score PRIMARY opportunities (interest-matched)
    const scoredPrimary: MatchedOpportunity[] = primary.map(({ opp, matchedInterest }) => {
      const breakdown = scoreOpportunity(opp, preferences, matchedInterest)
      return {
        ...opp,
        matchScore: breakdown.total,
        matchReason: generateMatchReason(breakdown, opp),
      }
    })
    
    // CURATED SORTING: Prioritize by High Need > Interest Match > Time Alignment > Score
    scoredPrimary.sort((a, b) => {
      // 1. High Need opportunities first
      if (a.highNeed && !b.highNeed) return -1
      if (!a.highNeed && b.highNeed) return 1
      
      // 2. Strong interest matches (those with "Matches your interest" reason)
      const aHasInterestMatch = a.matchReason.includes("Matches your interest")
      const bHasInterestMatch = b.matchReason.includes("Matches your interest")
      if (aHasInterestMatch && !bHasInterestMatch) return -1
      if (!aHasInterestMatch && bHasInterestMatch) return 1
      
      // 3. Time alignment (check if time-related reason)
      const aHasTimeMatch = a.matchReason.includes("schedule") || a.matchReason.includes("availability")
      const bHasTimeMatch = b.matchReason.includes("schedule") || b.matchReason.includes("availability")
      if (aHasTimeMatch && !bHasTimeMatch) return -1
      if (!aHasTimeMatch && bHasTimeMatch) return 1
      
      // 4. Fall back to overall score
      return b.matchScore - a.matchScore
    })
    
    // Score and sort SECONDARY opportunities (grade-only, no interest match)
    // These get a different match reason - never "Matches your interest"
    const scoredSecondary: MatchedOpportunity[] = secondary.map(({ opp }) => {
      const breakdown = scoreOpportunity(opp, preferences, null) // No matched interest
      return {
        ...opp,
        matchScore: breakdown.total,
        matchReason: generateSecondaryMatchReason(breakdown, opp),
      }
    })
    
    // Sort secondary by High Need first, then by score
    scoredSecondary.sort((a, b) => {
      if (a.highNeed && !b.highNeed) return -1
      if (!a.highNeed && b.highNeed) return 1
      return b.matchScore - a.matchScore
    })
    
    // CURATED DISPLAY: Limit secondary opportunities
    // Only show 3 secondary to avoid overwhelming the user
    const MAX_SECONDARY = 3
    const displayedSecondary = scoredSecondary.slice(0, MAX_SECONDARY)
    const hasMoreOpportunities = scoredSecondary.length > MAX_SECONDARY || overflowPrimary.length > 0
    
    // Determine if we should show universal donation card
    const showUniversalDonation = userIntent === "donate" || userIntent === "both"
    
    // CURATED DISPLAY: Limit to max 5 primary opportunities
    const MAX_PRIMARY = 5
    
    // Build final PRIMARY results (curated top results)
    let finalPrimary: MatchedOpportunity[] = []
    let overflowPrimary: MatchedOpportunity[] = [] // Opportunities beyond the top 5
    
    if (showUniversalDonation) {
      const universalDonation = createUniversalDonationCard()
      
      if (userIntent === "donate") {
        // Donation-only: universal card first, then any matching donation opportunities
        const allResults = [universalDonation, ...scoredPrimary]
        finalPrimary = allResults.slice(0, MAX_PRIMARY)
        overflowPrimary = allResults.slice(MAX_PRIMARY)
      } else {
        // Both: universal donation near top, but after highest-scoring volunteer opportunity
        const topVolunteer = scoredPrimary.filter(o => normalizeContributionType(o.type) === "volunteer").slice(0, 1)
        const rest = scoredPrimary.filter(o => !topVolunteer.includes(o))
        const allResults = [...topVolunteer, universalDonation, ...rest]
        finalPrimary = allResults.slice(0, MAX_PRIMARY)
        overflowPrimary = allResults.slice(MAX_PRIMARY)
      }
    } else {
      finalPrimary = scoredPrimary.slice(0, MAX_PRIMARY)
      overflowPrimary = scoredPrimary.slice(MAX_PRIMARY)
    }
    
    // Determine if we have strong matches
    const hasStrongMatches = finalPrimary.length > 0 && finalPrimary.some(m => !m.isUniversalDonation)
    
    // Build appropriate message
    let message: string | undefined
    if (finalPrimary.length === 0 && scoredSecondary.length === 0) {
      message = "No opportunities match your selections right now. Check back soon!"
    } else if (finalPrimary.length === 0 && scoredSecondary.length > 0) {
      message = "We didn't find exact matches for your interests, but here are other ways to help."
    } else if (finalPrimary.length <= 2 && !showUniversalDonation) {
      message = "We found a few strong matches based on your interests."
    }
    
    return NextResponse.json({
      // Primary: curated top interest-matched opportunities (max 5)
      opportunities: finalPrimary,
      // Secondary: curated grade-matched opportunities (max 3)
      secondaryOpportunities: displayedSecondary,
      hasStrongMatches,
      totalAvailable: allOpportunities.length,
      matchedCount: finalPrimary.length,
      message,
      limitedResults: finalPrimary.length <= 2 && !showUniversalDonation,
      // Flag for "See more" link
      hasMoreOpportunities,
    })
  } catch (error) {
    console.error("[Matching] Error:", error)
    return NextResponse.json(
      { error: "Failed to find matches" },
      { status: 500 }
    )
  }
}

// Generate match reason for secondary (non-interest-matched) opportunities
function generateSecondaryMatchReason(breakdown: ScoreBreakdown, opp: Opportunity): string {
  // Priority 1: Schedule-based reasons
  if (breakdown.timeScore > 0) {
    return "Works with your schedule"
  }
  if (breakdown.availScore > 0) {
    return "Fits your availability"
  }
  
  // Priority 2: Grade-based
  if (breakdown.gradeScore >= 3) {
    return "Great for your kids"
  }
  
  // Fallback
  const oppType = normalizeContributionType(opp.type)
  if (oppType === "donate") return "Donation opportunity"
  if (normalize(opp.timeCommitment).includes("one-time")) return "Quick commitment"
  
  return "Available for your grade"
}
