import { NextResponse } from "next/server"
import { fetchOpportunities, type Opportunity } from "@/lib/airtable"

// JSON API endpoint for automated testing of recommendation matching
// Returns the EXACT same output as the UI displays
// Usage: GET /api/test-match?grades=4th,5th&interests=Arts%20%26%20Crafts&time=flexible&type=volunteer

// ===================
// SHARED HELPERS (must match /api/matches exactly)
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
  return "volunteer"
}

function matchesUserInterests(opp: Opportunity, userInterests: string[]): { matches: boolean; matchedInterest: string | null } {
  if (userInterests.length === 0) {
    return { matches: true, matchedInterest: null }
  }
  
  const oppTags = opp.tags.map(normalize)
  
  for (const interest of userInterests) {
    const interestLower = normalize(interest)
    const allowedTags = interestToTags[interestLower] || []
    if (allowedTags.length === 0) continue
    
    const normalizedAllowedTags = allowedTags.map(normalize)
    const hasExactTagMatch = oppTags.some(oppTag => normalizedAllowedTags.includes(oppTag))
    
    if (hasExactTagMatch) {
      return { matches: true, matchedInterest: interest }
    }
  }
  
  return { matches: false, matchedInterest: null }
}

function matchesContributionType(opp: Opportunity, userIntent: "volunteer" | "donate" | "both"): boolean {
  const oppType = normalizeContributionType(opp.type)
  
  switch (userIntent) {
    case "donate":
      return oppType === "donate" || oppType === "both"
    case "both":
      return true
    case "volunteer":
    default:
      return oppType === "volunteer" || oppType === "both"
  }
}

function isGradeEligible(opp: Opportunity, userGrades: string[]): boolean {
  if (opp.gradeRelevance.length === 0) return true
  if (isOpenToAll(opp.gradeRelevance)) return true
  if (userGrades.length === 0) return true
  return hasGradeOverlap(opp.gradeRelevance, userGrades)
}

function isBroadSelection(userInterests: string[]): boolean {
  const ALL_INTERESTS_COUNT = 12
  return userInterests.length >= 5 || userInterests.length === ALL_INTERESTS_COUNT
}

// ===================
// SCORING (matches /api/matches)
// ===================

interface ScoredOpportunity extends Opportunity {
  matchScore: number
  matchReason: string
  matchedInterest: string | null
  isUniversalDonation?: boolean
}

const timeCommitmentMatches: Record<string, string[]> = {
  minimal: ["one-time", "1 hour", "30 min", "quick", "single", "once"],
  moderate: ["2-4", "monthly", "occasional", "few hours"],
  regular: ["weekly", "ongoing", "regular", "5+", "committed"],
}

function scoreOpportunity(
  opp: Opportunity, 
  timeAvailable: string,
  matchedInterest: string | null,
  broadSelection: boolean
): { total: number; matchedInterest: string | null; highNeedScore: number; timeScore: number; quickTaskScore: number } {
  let interestScore = 0
  let highNeedScore = 0
  let timeScore = 0
  let quickTaskScore = 0

  if (matchedInterest) {
    interestScore = broadSelection ? 2 : 5
  }

  if (opp.highNeed) {
    highNeedScore = 3
  }

  const oppTime = normalize(opp.timeCommitment)
  const timeKeywords = timeCommitmentMatches[timeAvailable] || []
  if (timeKeywords.some(kw => oppTime.includes(kw))) {
    timeScore = 2
  }

  const isQuickTask = oppTime.includes("one-time") || 
                      oppTime.includes("30 min") || 
                      oppTime.includes("1 hour") ||
                      normalize(opp.commitmentType || "").includes("one-time")
  if (isQuickTask) {
    quickTaskScore = 1
  }

  return {
    total: interestScore + highNeedScore + timeScore + quickTaskScore,
    matchedInterest,
    highNeedScore,
    timeScore,
    quickTaskScore
  }
}

function generateMatchReason(matchedInterest: string | null, highNeedScore: number, timeScore: number, quickTaskScore: number, opp: Opportunity): string {
  if (matchedInterest) {
    return `Matches your interest in ${matchedInterest}`
  }
  if (highNeedScore > 0) {
    return "High priority need"
  }
  if (timeScore > 0) {
    return "Works with your schedule"
  }
  if (quickTaskScore > 0) {
    return "Quick commitment"
  }
  const oppType = normalizeContributionType(opp.type)
  if (oppType === "donate") return "Donation opportunity"
  return "Good fit for you"
}

function generateSecondaryMatchReason(highNeedScore: number, timeScore: number, quickTaskScore: number, opp: Opportunity): string {
  if (highNeedScore > 0) {
    return "High priority need"
  }
  if (timeScore > 0) {
    return "Works with your schedule"
  }
  if (quickTaskScore > 0) {
    return "Quick commitment"
  }
  const oppType = normalizeContributionType(opp.type)
  if (oppType === "donate") return "Donation opportunity"
  return "Available for your grade"
}

// Category diversity selection (matches /api/matches)
function selectWithDiversity(sorted: ScoredOpportunity[], limit: number): ScoredOpportunity[] {
  const selected: ScoredOpportunity[] = []
  const categoryCounts: Record<string, number> = {}
  const MAX_PER_CATEGORY = 2
  
  for (const opp of sorted) {
    if (selected.length >= limit) break
    const categoryKey = normalize(opp.category || opp.committee || "general")
    const currentCount = categoryCounts[categoryKey] || 0
    
    if (currentCount < MAX_PER_CATEGORY) {
      selected.push(opp)
      categoryCounts[categoryKey] = currentCount + 1
    }
  }
  
  if (selected.length < limit) {
    for (const opp of sorted) {
      if (selected.length >= limit) break
      if (!selected.includes(opp)) {
        selected.push(opp)
      }
    }
  }
  
  return selected
}

// Universal donation card (matches /api/matches)
function createUniversalDonationCard(): ScoredOpportunity {
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
    matchedInterest: null,
    isUniversalDonation: true,
  }
}

// ===================
// TEST ENDPOINT
// ===================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Parse query parameters
  const gradesParam = searchParams.get("grades") || ""
  const interestsParam = searchParams.get("interests") || ""
  const timeParam = searchParams.get("time") || "flexible"
  const typeParam = searchParams.get("type") || "volunteer"
  
  const grades = gradesParam ? gradesParam.split(",").map(g => g.trim()) : []
  const interests = interestsParam ? interestsParam.split(",").map(i => i.trim()) : []
  
  // Map time param to time availability
  const timeMapping: Record<string, string> = {
    "quick": "minimal",
    "flexible": "moderate", 
    "more": "regular"
  }
  const timeAvailable = timeMapping[timeParam] || "moderate"
  
  // Map type param to contribution type
  const contributionType = typeParam === "donate" ? "I'd rather donate" : 
                           typeParam === "both" ? "A little of both" :
                           "Depends on the week"
  
  try {
    // Fetch opportunities from Airtable
    const allOpportunities = await fetchOpportunities()
    
    // Determine user intent
    const userIntent = getUserContributionIntent(contributionType)
    
    // Filter active
    const activeOpportunities = allOpportunities.filter(opp => opp.active)
    
    // Filter by type
    const typeFiltered = activeOpportunities.filter(opp => matchesContributionType(opp, userIntent))
    
    // Filter by grade
    const gradeFiltered = typeFiltered.filter(opp => isGradeEligible(opp, grades))
    
    // Split by interest match
    const primary: Array<{ opp: Opportunity; matchedInterest: string | null }> = []
    const secondary: Array<{ opp: Opportunity }> = []
    
    for (const opp of gradeFiltered) {
      const { matches, matchedInterest } = matchesUserInterests(opp, interests)
      if (matches && matchedInterest) {
        primary.push({ opp, matchedInterest })
      } else {
        secondary.push({ opp })
      }
    }
    
    // Detect broad selection
    const broadSelection = isBroadSelection(interests)
    
    // Track full counts
    const fullPrimaryCount = primary.length
    const fullSecondaryCount = secondary.length
    
    // Score PRIMARY opportunities
    const scoredPrimary: ScoredOpportunity[] = primary.map(({ opp, matchedInterest }) => {
      const score = scoreOpportunity(opp, timeAvailable, matchedInterest, broadSelection)
      return {
        ...opp,
        matchScore: score.total,
        matchReason: generateMatchReason(score.matchedInterest, score.highNeedScore, score.timeScore, score.quickTaskScore, opp),
        matchedInterest: score.matchedInterest
      }
    })
    
    // Apply broad selection ranking
    if (broadSelection) {
      scoredPrimary.sort((a, b) => {
        // 1. High Need first
        if (a.highNeed && !b.highNeed) return -1
        if (!a.highNeed && b.highNeed) return 1
        
        // 2. Quick tasks first
        const aTime = normalize(a.timeCommitment || "")
        const bTime = normalize(b.timeCommitment || "")
        const aIsQuick = aTime.includes("one-time") || aTime.includes("30 min") || aTime.includes("1 hour") || aTime.includes("5 min")
        const bIsQuick = bTime.includes("one-time") || bTime.includes("30 min") || bTime.includes("1 hour") || bTime.includes("5 min")
        if (aIsQuick && !bIsQuick) return -1
        if (!aIsQuick && bIsQuick) return 1
        
        // 3. One-time before ongoing
        const aCommit = normalize(a.commitmentType || "")
        const bCommit = normalize(b.commitmentType || "")
        const aIsOneTime = aCommit.includes("one-time") || aTime.includes("one-time")
        const bIsOneTime = bCommit.includes("one-time") || bTime.includes("one-time")
        if (aIsOneTime && !bIsOneTime) return -1
        if (!aIsOneTime && bIsOneTime) return 1
        
        // 4. All-grade before narrow-grade
        const aIsAllGrade = a.gradeRelevance.length === 0 || isOpenToAll(a.gradeRelevance)
        const bIsAllGrade = b.gradeRelevance.length === 0 || isOpenToAll(b.gradeRelevance)
        if (aIsAllGrade && !bIsAllGrade) return -1
        if (!aIsAllGrade && bIsAllGrade) return 1
        
        // 5. Fall back to score
        return b.matchScore - a.matchScore
      })
    } else {
      scoredPrimary.sort((a, b) => b.matchScore - a.matchScore)
    }
    
    // Score SECONDARY opportunities
    const scoredSecondary: ScoredOpportunity[] = secondary.map(({ opp }) => {
      const score = scoreOpportunity(opp, timeAvailable, null, broadSelection)
      return {
        ...opp,
        matchScore: score.total,
        matchReason: generateSecondaryMatchReason(score.highNeedScore, score.timeScore, score.quickTaskScore, opp),
        matchedInterest: null
      }
    })
    
    // Sort secondary by high need, then score
    scoredSecondary.sort((a, b) => {
      if (a.highNeed && !b.highNeed) return -1
      if (!a.highNeed && b.highNeed) return 1
      return b.matchScore - a.matchScore
    })
    
    // ========================================
    // CURATION LOGIC (mirrors /api/matches exactly)
    // ========================================
    
    const MAX_PRIMARY = 5
    const MAX_SECONDARY = 3
    const showUniversalDonation = userIntent === "donate" || userIntent === "both"
    
    // Apply category diversity for broad selections
    let curatedPrimary = scoredPrimary
    if (broadSelection && scoredPrimary.length > MAX_PRIMARY) {
      curatedPrimary = selectWithDiversity(scoredPrimary, MAX_PRIMARY)
    }
    
    // Build final displayed primary
    let displayedPrimary: ScoredOpportunity[] = []
    
    if (showUniversalDonation) {
      const universalDonation = createUniversalDonationCard()
      
      if (userIntent === "donate") {
        const allResults = [universalDonation, ...curatedPrimary]
        displayedPrimary = allResults.slice(0, MAX_PRIMARY)
      } else {
        const topVolunteer = curatedPrimary.filter(o => normalizeContributionType(o.type) === "volunteer").slice(0, 1)
        const rest = curatedPrimary.filter(o => !topVolunteer.includes(o))
        const allResults = [...topVolunteer, universalDonation, ...rest]
        displayedPrimary = allResults.slice(0, MAX_PRIMARY)
      }
    } else {
      displayedPrimary = curatedPrimary.slice(0, MAX_PRIMARY)
    }
    
    // Build final displayed secondary
    const displayedSecondary = scoredSecondary.slice(0, MAX_SECONDARY)
    
    // Format opportunity for output
    const formatOpp = (opp: ScoredOpportunity) => ({
      id: opp.id,
      title: opp.title,
      matchScore: opp.matchScore,
      matchReason: opp.matchReason,
      matchedInterest: opp.matchedInterest,
      tags: opp.tags,
      gradeRelevance: opp.gradeRelevance,
      type: opp.type,
      timeCommitment: opp.timeCommitment,
      commitmentType: opp.commitmentType,
      highNeed: opp.highNeed,
      category: opp.category,
      committee: opp.committee,
      isUniversalDonation: opp.isUniversalDonation || false
    })
    
    // Build response
    const result = {
      success: true,
      input: {
        grades,
        interests,
        time: timeParam,
        type: typeParam,
        resolvedIntent: userIntent
      },
      // Curation flags
      curation: {
        broadSelectionApplied: broadSelection,
        categoryDiversityApplied: broadSelection && scoredPrimary.length > MAX_PRIMARY,
        universalDonationIncluded: showUniversalDonation
      },
      // Internal counts (full pool before curation)
      summary: {
        totalFetched: allOpportunities.length,
        active: activeOpportunities.length,
        afterTypeFilter: typeFiltered.length,
        afterGradeFilter: gradeFiltered.length,
        primaryCount: fullPrimaryCount,
        secondaryCount: fullSecondaryCount
      },
      // DISPLAYED: Exact opportunities shown in the UI
      displayed: {
        primaryCount: displayedPrimary.length,
        secondaryCount: displayedSecondary.length,
        hasMorePrimary: fullPrimaryCount > MAX_PRIMARY,
        hasMoreSecondary: fullSecondaryCount > MAX_SECONDARY
      },
      // Actual opportunities displayed in UI (curated)
      displayedPrimaryOpportunities: displayedPrimary.map(formatOpp),
      displayedSecondaryOpportunities: displayedSecondary.map(formatOpp)
    }
    
    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { 
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" }
    })
  }
}
