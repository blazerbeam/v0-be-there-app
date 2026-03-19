"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import useSWR from "swr"
import { Clock, Calendar, AlertCircle, RefreshCw, Check } from "lucide-react"
import type { Opportunity } from "@/lib/airtable"

// =====================
// INTERNAL TESTING ONLY
// =====================

interface MatchedOpportunity extends Opportunity {
  matchScore: number
  matchReason: string
  isUniversalDonation?: boolean
}

interface MatchResponse {
  opportunities: MatchedOpportunity[]
  secondaryOpportunities?: MatchedOpportunity[]
  hasStrongMatches: boolean
  totalAvailable: number
  matchedCount: number
  message?: string
  hasMoreOpportunities?: boolean
}

// Parse query params into UserPreferences format
function parseQueryParams(searchParams: URLSearchParams) {
  // grades: comma-separated, e.g., "4th,5th" or "4th"
  const gradesParam = searchParams.get("grades") || ""
  const grades = gradesParam ? gradesParam.split(",").map(g => g.trim()) : []
  
  // interests: comma-separated with underscores, e.g., "reading_literacy,arts_crafts"
  const interestsParam = searchParams.get("interests") || ""
  const interests = interestsParam 
    ? interestsParam.split(",").map(i => i.trim().replace(/_/g, " ").replace(/&/g, " & "))
    : []
  
  // Normalize interest names to match expected format
  const normalizedInterests = interests.map(i => {
    const lower = i.toLowerCase()
    // Map common variations
    if (lower.includes("reading") || lower.includes("literacy")) return "Reading & Literacy"
    if (lower.includes("arts") || lower.includes("crafts")) return "Arts & Crafts"
    if (lower.includes("sports") || lower.includes("fitness")) return "Sports & Fitness"
    if (lower.includes("stem") || lower.includes("tech")) return "STEM & Tech"
    if (lower.includes("outdoor")) return "Outdoor Activities"
    if (lower.includes("event") || lower.includes("planning")) return "Event Planning"
    if (lower.includes("food") || lower.includes("hospitality")) return "Food & Hospitality"
    if (lower.includes("photo")) return "Photography"
    if (lower.includes("music")) return "Music"
    if (lower.includes("fundrais")) return "Fundraising"
    if (lower.includes("admin")) return "Administrative"
    if (lower.includes("mentor")) return "Mentoring"
    return i
  })
  
  // time: "minimal", "moderate", "flexible"
  const time = searchParams.get("time") || "flexible"
  
  // type: "volunteer", "donate", "both"
  const type = searchParams.get("type") || "volunteer"
  
  return {
    school: "Test School",
    grades,
    timeAvailable: time,
    availability: ["flexible"],
    interests: normalizedInterests,
    contributionType: type === "volunteer" ? "I've got some time" 
      : type === "donate" ? "I'd rather donate" 
      : "A little of both",
  }
}

const fetcher = async ([url, body]: [string, object]) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

function TestMatchContent() {
  const searchParams = useSearchParams()
  const preferences = parseQueryParams(searchParams)
  
  const { data, error, isLoading } = useSWR<MatchResponse>(
    ["/api/matches", preferences],
    fetcher
  )
  
  const primaryCount = data?.opportunities?.length || 0
  const secondaryCount = data?.secondaryOpportunities?.length || 0
  
  return (
    <div className="min-h-screen bg-background p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium text-sm">
            INTERNAL TESTING ONLY - Recommendation UAT Route
          </p>
        </div>
        
        {/* Input Summary */}
        <div className="mb-8 p-6 bg-card border rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Selected Inputs</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Grades:</span>
              <span className="ml-2 font-medium">
                {preferences.grades.length > 0 ? preferences.grades.join(", ") : "(none)"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Interests:</span>
              <span className="ml-2 font-medium">
                {preferences.interests.length > 0 ? preferences.interests.join(", ") : "(none)"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Time:</span>
              <span className="ml-2 font-medium">{preferences.timeAvailable}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Contribution:</span>
              <span className="ml-2 font-medium">{preferences.contributionType}</span>
            </div>
          </div>
          
          {/* Raw query string */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground font-mono break-all">
              ?{searchParams.toString()}
            </p>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading recommendations...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            Error loading recommendations: {error.message}
          </div>
        )}
        
        {/* Results */}
        {data && !isLoading && (
          <>
            {/* Counts Summary */}
            <div className="mb-6 p-4 bg-secondary/50 rounded-lg flex gap-8">
              <div>
                <span className="text-muted-foreground text-sm">Primary Results:</span>
                <span className="ml-2 font-bold text-lg">{primaryCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Secondary Results:</span>
                <span className="ml-2 font-bold text-lg">{secondaryCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Total Available:</span>
                <span className="ml-2 font-bold text-lg">{data.totalAvailable}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Has More:</span>
                <span className="ml-2 font-bold text-lg">{data.hasMoreOpportunities ? "Yes" : "No"}</span>
              </div>
            </div>
            
            {/* Message */}
            {data.message && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                {data.message}
              </div>
            )}
            
            {/* Primary Recommendations */}
            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                Primary Recommendations
                <span className="text-sm font-normal text-muted-foreground">
                  (Interest-matched)
                </span>
              </h2>
              
              {primaryCount === 0 ? (
                <p className="text-muted-foreground italic">No primary recommendations</p>
              ) : (
                <div className="space-y-3">
                  {data.opportunities.map((opp, idx) => (
                    <OpportunityCard key={opp.id} opportunity={opp} index={idx + 1} />
                  ))}
                </div>
              )}
            </div>
            
            {/* Secondary Recommendations */}
            <div>
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                Secondary Recommendations
                <span className="text-sm font-normal text-muted-foreground">
                  (Grade-matched only)
                </span>
              </h2>
              
              {secondaryCount === 0 ? (
                <p className="text-muted-foreground italic">No secondary recommendations</p>
              ) : (
                <div className="space-y-3">
                  {data.secondaryOpportunities?.map((opp, idx) => (
                    <OpportunityCard key={opp.id} opportunity={opp} index={idx + 1} isSecondary />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Usage Examples */}
        <div className="mt-12 p-6 bg-muted/30 rounded-xl">
          <h3 className="font-semibold mb-3">Example URLs:</h3>
          <ul className="space-y-2 text-sm font-mono text-muted-foreground">
            <li>/test-match?grades=4th&interests=reading_literacy&time=flexible&type=volunteer</li>
            <li>/test-match?grades=K,1st,2nd&interests=arts_crafts,music&time=minimal&type=both</li>
            <li>/test-match?grades=5th&interests=sports_fitness,outdoor&time=moderate&type=volunteer</li>
            <li>/test-match?type=donate</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function OpportunityCard({ 
  opportunity, 
  index,
  isSecondary = false 
}: { 
  opportunity: MatchedOpportunity
  index: number
  isSecondary?: boolean 
}) {
  const timeEstimate = opportunity.timeEstimate || "Varies"
  const commitmentType = opportunity.commitmentType || "One-time"
  
  return (
    <div className={`p-4 border rounded-xl ${isSecondary ? "bg-muted/30" : "bg-card"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Index + Title */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">#{index}</span>
            <h3 className="font-medium">{opportunity.title}</h3>
            {opportunity.isUniversalDonation && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">Universal</span>
            )}
          </div>
          
          {/* Match reason */}
          <p className="text-sm text-primary mb-2">{opportunity.matchReason}</p>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>
          
          {/* Badges */}
          <div className="flex items-center gap-2 mt-3">
            {opportunity.highNeed && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs">
                <AlertCircle className="w-3 h-3" />
                High Need
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
              <Clock className="w-3 h-3" />
              {timeEstimate}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
              {commitmentType.toLowerCase() === "ongoing" ? (
                <RefreshCw className="w-3 h-3" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {commitmentType}
            </span>
          </div>
          
          {/* Tags */}
          {opportunity.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Tags:</span>
              {opportunity.tags.map((tag, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 bg-secondary rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Score */}
        <div className="text-right">
          <div className="text-2xl font-bold text-muted-foreground">{opportunity.matchScore}</div>
          <div className="text-xs text-muted-foreground">score</div>
        </div>
      </div>
    </div>
  )
}

export default function TestMatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <TestMatchContent />
    </Suspense>
  )
}
