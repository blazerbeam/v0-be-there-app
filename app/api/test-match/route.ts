import { NextResponse } from "next/server"

// JSON API endpoint for automated testing of recommendation matching
// Usage: GET /api/test-match?grades=4th,5th&interests=Arts%20%26%20Crafts&time=flexible&type=volunteer

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
  
  // Map type param to contributionType format
  const typeMapping: Record<string, string> = {
    "volunteer": "I've got more time to give",
    "donate": "I'd rather donate",
    "both": "A little of both"
  }
  
  // Build preferences object
  const preferences = {
    grades,
    interests,
    contributionType: typeParam === "donate" ? "I'd rather donate" : 
                      typeParam === "both" ? "A little of both" :
                      timeMapping[timeParam] || "Depends on the week"
  }
  
  try {
    // Get the base URL from the request
    const baseUrl = new URL(request.url).origin
    
    // Call the matches API
    const response = await fetch(`${baseUrl}/api/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences)
    })
    
    if (!response.ok) {
      return NextResponse.json({
        error: "Matching API failed",
        status: response.status
      }, { status: 500 })
    }
    
    const data = await response.json()
    
    // Format response for easy reading
    const result = {
      input: {
        grades,
        interests,
        time: timeParam,
        type: typeParam,
        resolvedPreferences: preferences
      },
      summary: {
        primaryCount: data.opportunities?.length || 0,
        secondaryCount: data.secondaryOpportunities?.length || 0,
        hasStrongMatches: data.hasStrongMatches,
        hasMoreOpportunities: data.hasMoreOpportunities,
        message: data.message
      },
      primaryOpportunities: (data.opportunities || []).map((opp: Record<string, unknown>) => ({
        id: opp.id,
        title: opp.title,
        matchReason: opp.matchReason,
        matchScore: opp.matchScore,
        tags: opp.tags,
        timeCommitment: opp.timeCommitment,
        timeEstimate: opp.timeEstimate,
        commitmentType: opp.commitmentType,
        highNeed: opp.highNeed,
        gradeRelevance: opp.gradeRelevance,
        type: opp.type
      })),
      secondaryOpportunities: (data.secondaryOpportunities || []).map((opp: Record<string, unknown>) => ({
        id: opp.id,
        title: opp.title,
        matchReason: opp.matchReason,
        matchScore: opp.matchScore,
        tags: opp.tags,
        timeCommitment: opp.timeCommitment,
        timeEstimate: opp.timeEstimate,
        commitmentType: opp.commitmentType,
        highNeed: opp.highNeed,
        gradeRelevance: opp.gradeRelevance,
        type: opp.type
      }))
    }
    
    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: "Failed to run test",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
