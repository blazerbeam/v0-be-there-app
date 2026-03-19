import { NextResponse } from "next/server"
import { fetchOpportunities, type Opportunity } from "@/lib/airtable"

// JSON API endpoint for automated testing of recommendation matching
// Usage: GET /api/test-match?grades=4th,5th&interests=Arts%20%26%20Crafts&time=flexible&type=volunteer

// ===================
// SHARED HELPERS (duplicated from /api/matches for independence)
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
  
  // Map time param to contributionType format
  const timeMapping: Record<string, string> = {
    "quick": "Just quick tasks when I can",
    "flexible": "Depends on the week", 
    "more": "I've got more time to give"
  }
  
  // Build preferences object
  const contributionType = typeParam === "donate" ? "I'd rather donate" : 
                           typeParam === "both" ? "A little of both" :
                           timeMapping[timeParam] || "Depends on the week"
  
  const preferences = {
    grades,
    interests,
    contributionType
  }
  
  const debugSteps: string[] = []
  
  try {
    // Step 1: Fetch opportunities
    debugSteps.push("Fetching opportunities from Airtable...")
    let allOpportunities: Opportunity[]
    try {
      allOpportunities = await fetchOpportunities()
      debugSteps.push(`SUCCESS: Fetched ${allOpportunities.length} opportunities`)
    } catch (fetchError) {
      debugSteps.push(`FAILED: Airtable fetch error - ${fetchError instanceof Error ? fetchError.message : "Unknown"}`)
      return NextResponse.json({
        error: "Airtable fetch failed",
        debugSteps,
        details: fetchError instanceof Error ? fetchError.message : "Unknown error"
      }, { 
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      })
    }
    
    // Step 2: Filter active
    const activeOpportunities = allOpportunities.filter(opp => opp.active)
    debugSteps.push(`Active opportunities: ${activeOpportunities.length}`)
    
    // Step 3: Determine user intent
    const userIntent = getUserContributionIntent(contributionType)
    debugSteps.push(`User intent: ${userIntent}`)
    
    // Step 4: Filter by type
    const typeFiltered = activeOpportunities.filter(opp => matchesContributionType(opp, userIntent))
    debugSteps.push(`After type filter: ${typeFiltered.length}`)
    
    // Step 5: Filter by grade
    const gradeFiltered = typeFiltered.filter(opp => isGradeEligible(opp, grades))
    debugSteps.push(`After grade filter: ${gradeFiltered.length}`)
    
    // Step 6: Split by interest match
    const primary: Array<{ opp: Opportunity; matchedInterest: string | null }> = []
    const secondary: Array<{ opp: Opportunity; matchedInterest: string | null }> = []
    
    for (const opp of gradeFiltered) {
      const { matches, matchedInterest } = matchesUserInterests(opp, interests)
      if (matches && matchedInterest) {
        primary.push({ opp, matchedInterest })
      } else {
        secondary.push({ opp, matchedInterest: null })
      }
    }
    
    debugSteps.push(`Primary (interest-matched): ${primary.length}`)
    debugSteps.push(`Secondary (grade-only): ${secondary.length}`)
    
    // Format results
    const formatOpp = (item: { opp: Opportunity; matchedInterest: string | null }) => ({
      id: item.opp.id,
      title: item.opp.title,
      matchedInterest: item.matchedInterest,
      tags: item.opp.tags,
      gradeRelevance: item.opp.gradeRelevance,
      type: item.opp.type,
      timeCommitment: item.opp.timeCommitment,
      timeEstimate: item.opp.timeEstimate,
      commitmentType: item.opp.commitmentType,
      highNeed: item.opp.highNeed,
      active: item.opp.active
    })
    
    const result = {
      success: true,
      input: {
        grades,
        interests,
        time: timeParam,
        type: typeParam,
        resolvedContributionType: contributionType,
        resolvedIntent: userIntent
      },
      debugSteps,
      summary: {
        totalFetched: allOpportunities.length,
        active: activeOpportunities.length,
        afterTypeFilter: typeFiltered.length,
        afterGradeFilter: gradeFiltered.length,
        primaryCount: primary.length,
        secondaryCount: secondary.length
      },
      primaryOpportunities: primary.map(formatOpp),
      secondaryOpportunities: secondary.slice(0, 5).map(formatOpp), // Limit for readability
      // Sample of all tags for debugging
      sampleTags: activeOpportunities.slice(0, 5).map(o => ({
        title: o.title,
        tags: o.tags
      }))
    }
    
    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      }
    })
  } catch (error) {
    debugSteps.push(`EXCEPTION: ${error instanceof Error ? error.message : "Unknown error"}`)
    return NextResponse.json({
      error: "Test failed",
      debugSteps,
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { 
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" }
    })
  }
}
