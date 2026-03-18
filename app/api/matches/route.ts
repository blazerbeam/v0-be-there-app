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

// Check if opportunity is grade-specific and matches user's grades
function checkGradeFit(opportunity: Opportunity, userGrades: string[]): { fits: boolean; score: number } {
  const titleLower = opportunity.title.toLowerCase()
  const descLower = opportunity.description.toLowerCase()
  const combined = `${titleLower} ${descLower}`
  
  // Grade patterns to detect
  const gradePatterns: { pattern: RegExp; grades: string[] }[] = [
    { pattern: /\bpre-?k\b|\bprek\b/i, grades: ["Pre-K"] },
    { pattern: /\bkindergarten\b|\b\bk\b(?!\d)/i, grades: ["K"] },
    { pattern: /\b1st\s*grade\b|\bfirst\s*grade\b/i, grades: ["1st"] },
    { pattern: /\b2nd\s*grade\b|\bsecond\s*grade\b/i, grades: ["2nd"] },
    { pattern: /\b3rd\s*grade\b|\bthird\s*grade\b/i, grades: ["3rd"] },
    { pattern: /\b4th\s*grade\b|\bfourth\s*grade\b/i, grades: ["4th"] },
    { pattern: /\b5th\s*grade\b|\bfifth\s*grade\b/i, grades: ["5th"] },
    { pattern: /\b6th\s*grade\b|\bsixth\s*grade\b/i, grades: ["6th"] },
    { pattern: /\b7th\s*grade\b|\bseventh\s*grade\b/i, grades: ["7th"] },
    { pattern: /\b8th\s*grade\b|\beighth\s*grade\b/i, grades: ["8th"] },
    { pattern: /\bhigh\s*school\b/i, grades: ["9th", "10th", "11th", "12th"] },
    { pattern: /\bmiddle\s*school\b/i, grades: ["6th", "7th", "8th"] },
    { pattern: /\belementary\b/i, grades: ["Pre-K", "K", "1st", "2nd", "3rd", "4th", "5th"] },
  ]
  
  const detectedGrades: string[] = []
  for (const { pattern, grades } of gradePatterns) {
    if (pattern.test(combined)) {
      detectedGrades.push(...grades)
    }
  }
  
  // If no grade specificity detected, assume it fits all
  if (detectedGrades.length === 0) {
    return { fits: true, score: 1 }
  }
  
  // Check if any user grades overlap
  const overlap = userGrades.some(grade => detectedGrades.includes(grade))
  return { fits: overlap, score: overlap ? 2 : 0 }
}

// Check if opportunity is school-specific and matches user's school
function checkSchoolFit(opportunity: Opportunity, userSchool: string): { fits: boolean; score: number } {
  const titleLower = opportunity.title.toLowerCase()
  const descLower = opportunity.description.toLowerCase()
  const combined = `${titleLower} ${descLower}`
  const userSchoolLower = userSchool.toLowerCase()
  
  // Known schools to check against
  const knownSchools = ["forest hills", "oak creek", "lake grove", "loms", "lohs"]
  
  // Check if opportunity mentions a specific school
  const mentionedSchools = knownSchools.filter(school => combined.includes(school))
  
  // If no specific school mentioned, fits all
  if (mentionedSchools.length === 0) {
    return { fits: true, score: 1 }
  }
  
  // If user's school is mentioned, great fit
  if (mentionedSchools.some(school => userSchoolLower.includes(school))) {
    return { fits: true, score: 3 }
  }
  
  // If another school is mentioned, doesn't fit
  return { fits: false, score: 0 }
}

// Check interest overlap
function checkInterestFit(opportunity: Opportunity, userInterests: string[]): { score: number; reason?: string } {
  const skillTags = opportunity.skillTags || []
  const category = opportunity.category || ""
  
  // Map user interests to potential skill tags
  const interestToTags: Record<string, string[]> = {
    "Arts & Crafts": ["art", "craft", "creative", "design"],
    "Sports & Fitness": ["sport", "fitness", "athletic", "physical"],
    "Reading & Literacy": ["reading", "literacy", "library", "book"],
    "STEM & Tech": ["stem", "tech", "science", "math", "computer"],
    "Outdoor Activities": ["outdoor", "garden", "nature", "field"],
    "Event Planning": ["event", "planning", "coordination", "organize"],
    "Food & Hospitality": ["food", "hospitality", "snack", "kitchen", "cook"],
    "Photography": ["photo", "camera", "media"],
    "Music": ["music", "band", "choir", "instrument"],
    "Fundraising": ["fundrais", "donation", "money"],
    "Administrative": ["admin", "office", "clerical", "data"],
    "Mentoring": ["mentor", "tutor", "teach", "guide"],
  }
  
  let score = 0
  let matchedInterest = ""
  
  const combinedText = [...skillTags, category, opportunity.title, opportunity.description]
    .join(" ")
    .toLowerCase()
  
  for (const interest of userInterests) {
    const keywords = interestToTags[interest] || [interest.toLowerCase()]
    if (keywords.some(kw => combinedText.includes(kw))) {
      score += 2
      if (!matchedInterest) matchedInterest = interest
    }
  }
  
  return { score, reason: matchedInterest ? `Matches your interest in ${matchedInterest}` : undefined }
}

// Check availability/time fit
function checkTimeFit(
  opportunity: Opportunity, 
  userTimeAvailable: string, 
  userAvailability: string[]
): { score: number; reason?: string } {
  const timeCommitment = opportunity.timeCommitment.toLowerCase()
  const availabilityTags = opportunity.availabilityTags || []
  
  let score = 0
  let reason: string | undefined
  
  // Time commitment scoring
  if (userTimeAvailable === "minimal") {
    // Prefer short commitments
    if (timeCommitment.includes("one-time") || timeCommitment.includes("hour") || timeCommitment.includes("30 min")) {
      score += 2
      reason = "Quick commitment"
    }
  } else if (userTimeAvailable === "moderate") {
    if (timeCommitment.includes("2-4") || timeCommitment.includes("month")) {
      score += 2
      reason = "Works with your schedule"
    }
  } else if (userTimeAvailable === "regular") {
    if (timeCommitment.includes("week") || timeCommitment.includes("5+") || timeCommitment.includes("regular")) {
      score += 2
      reason = "Great for your availability"
    }
  }
  
  // Availability window scoring
  const availabilityMap: Record<string, string[]> = {
    "weekday-morning": ["morning", "am", "weekday"],
    "weekday-afternoon": ["afternoon", "pm", "after school", "weekday"],
    "weekday-evening": ["evening", "night", "weekday"],
    "weekend": ["weekend", "saturday", "sunday"],
    "flexible": ["flexible", "varies", "any time"],
  }
  
  for (const userAvail of userAvailability) {
    const keywords = availabilityMap[userAvail] || []
    const availText = availabilityTags.join(" ").toLowerCase()
    if (keywords.some(kw => availText.includes(kw))) {
      score += 1
      if (!reason) reason = "Fits your schedule"
    }
  }
  
  return { score, reason }
}

// Check contribution type fit
function checkContributionFit(opportunity: Opportunity, userContributionType: string): { score: number } {
  const combined = `${opportunity.title} ${opportunity.description}`.toLowerCase()
  
  // Detect if opportunity is donation-focused
  const isDonation = combined.includes("donat") || combined.includes("sponsor") || combined.includes("fund")
  const isVolunteer = !isDonation || combined.includes("volunteer") || combined.includes("help")
  
  if (userContributionType === "donate" && isDonation) {
    return { score: 2 }
  } else if (userContributionType === "volunteer" && isVolunteer && !isDonation) {
    return { score: 2 }
  } else if (userContributionType === "both") {
    return { score: 1 }
  }
  
  return { score: 0 }
}

// Determine best match reason
function getBestMatchReason(
  interestReason?: string,
  timeReason?: string,
  scores: { interest: number; time: number; grade: number; school: number }
): string {
  // Priority: specific match reasons first
  if (interestReason && scores.interest >= 2) return interestReason
  if (timeReason && scores.time >= 2) return timeReason
  if (scores.school >= 3) return "Perfect for your school"
  if (scores.grade >= 2) return "Great for your kids' grade level"
  if (scores.time >= 1) return "Fits your schedule"
  return "Good match for you"
}

export async function POST(request: Request) {
  try {
    const preferences: UserPreferences = await request.json()
    
    // Fetch all opportunities
    const allOpportunities = await fetchOpportunities()
    
    // Score and filter opportunities
    const matchedOpportunities: MatchedOpportunity[] = []
    
    for (const opp of allOpportunities) {
      // Check hard filters first
      const schoolFit = checkSchoolFit(opp, preferences.school)
      if (!schoolFit.fits) continue
      
      const gradeFit = checkGradeFit(opp, preferences.grades)
      if (!gradeFit.fits) continue
      
      // Soft scoring
      const interestFit = checkInterestFit(opp, preferences.interests)
      const timeFit = checkTimeFit(opp, preferences.timeAvailable, preferences.availability)
      const contributionFit = checkContributionFit(opp, preferences.contributionType)
      
      // Calculate total score
      const totalScore = 
        schoolFit.score + 
        gradeFit.score + 
        interestFit.score + 
        timeFit.score + 
        contributionFit.score
      
      // Determine match reason
      const matchReason = getBestMatchReason(
        interestFit.reason,
        timeFit.reason,
        {
          interest: interestFit.score,
          time: timeFit.score,
          grade: gradeFit.score,
          school: schoolFit.score,
        }
      )
      
      matchedOpportunities.push({
        ...opp,
        matchScore: totalScore,
        matchReason,
      })
    }
    
    // Sort by score (highest first)
    matchedOpportunities.sort((a, b) => b.matchScore - a.matchScore)
    
    // Return top matches (max 6)
    const topMatches = matchedOpportunities.slice(0, 6)
    
    // Determine if we have strong matches
    const hasStrongMatches = topMatches.some(m => m.matchScore >= 4)
    
    return NextResponse.json({
      opportunities: topMatches,
      hasStrongMatches,
      totalAvailable: allOpportunities.length,
      matchedCount: matchedOpportunities.length,
    })
  } catch (error) {
    console.error("Matching error:", error)
    return NextResponse.json(
      { error: "Failed to find matches" },
      { status: 500 }
    )
  }
}
