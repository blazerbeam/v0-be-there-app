"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Clock, Heart, Calendar, Sparkles, Check, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analytics } from "@/lib/analytics"
import type { Opportunity } from "@/lib/airtable"
import type { UserPreferences } from "@/app/page"

// Helper to determine time estimate category based on timeCommitment string
function getTimeEstimate(timeCommitment: string): { label: string; level: "low" | "medium" | "high" } {
  const lower = timeCommitment.toLowerCase()
  
  // Check for low time indicators (5-15 min or quick)
  if (lower.includes("5 min") || lower.includes("10 min") || lower.includes("15 min") || 
      lower.includes("quick") || lower.includes("minimal")) {
    return { label: "5-15 min", level: "low" }
  }
  
  // Check for medium time indicators (30-60 min)
  if (lower.includes("30 min") || lower.includes("45 min") || lower.includes("1 hour") ||
      lower.includes("hour") && !lower.includes("hours")) {
    return { label: "30-60 min", level: "medium" }
  }
  
  // Check for high time indicators (1-3 hours or more)
  if (lower.includes("2 hour") || lower.includes("3 hour") || lower.includes("hours") ||
      lower.includes("half day") || lower.includes("regular")) {
    return { label: "1-3 hours", level: "high" }
  }
  
  // Default to medium if we can't determine
  return { label: "30-60 min", level: "medium" }
}

// Helper to determine commitment type
function getCommitmentType(opportunity: Opportunity): "one-time" | "ongoing" {
  const lower = (opportunity.timingWindow + " " + opportunity.timeCommitment + " " + opportunity.tags.join(" ")).toLowerCase()
  
  if (lower.includes("ongoing") || lower.includes("recurring") || lower.includes("weekly") || 
      lower.includes("monthly") || lower.includes("regular") || lower.includes("year-round")) {
    return "ongoing"
  }
  
  return "one-time"
}

interface MatchesScreenProps {
  preferences: UserPreferences
  onSelect: (opportunities: Opportunity[]) => void
  onBack: () => void
}

interface MatchedOpportunity extends Opportunity {
  matchScore: number
  matchReason: string
}

interface MatchResponse {
  opportunities: MatchedOpportunity[]
  hasStrongMatches: boolean
  totalAvailable: number
  matchedCount: number
  message?: string
}

export function MatchesScreen({ preferences, onSelect, onBack }: MatchesScreenProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [data, setData] = useState<MatchResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasTrackedView = useRef(false)

  // Analytics: Track recommendations viewed (only once when data loads)
  useEffect(() => {
    if (data && data.opportunities.length > 0 && !hasTrackedView.current) {
      analytics.recommendationsViewed()
      hasTrackedView.current = true
    }
  }, [data])

  useEffect(() => {
    async function fetchMatches() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch matches")
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMatches()
  }, [preferences])

  const opportunities = data?.opportunities || []
  const hasStrongMatches = data?.hasStrongMatches ?? false
  const fallbackMessage = data?.message

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleContinue = () => {
    const selectedOpportunities = opportunities.filter((o) => selectedIds.has(o.id))
    onSelect(selectedOpportunities)
  }

  const selectedCount = selectedIds.size

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col px-4 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only md:not-sr-only">Back</span>
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Finding opportunities for you...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col px-4 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only md:not-sr-only">Back</span>
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t load the opportunities right now. Please try again in a moment.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    )
  }

  // Empty state
  if (opportunities.length === 0) {
    return (
      <div className="min-h-screen flex flex-col px-4 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only md:not-sr-only">Back</span>
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-2">No opportunities right now</h2>
          <p className="text-muted-foreground mb-6">
            Check back soon — new ways to help pop up all the time!
          </p>
          <Button onClick={onBack} variant="outline">
            Go back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 pb-28">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only md:not-sr-only">Back</span>
        </button>
      </header>

      {/* Title Section */}
      <div className="max-w-lg mx-auto w-full mb-8 text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
          {hasStrongMatches 
            ? "We found a few things that might work for you"
            : "Here are some ways you could help"
          }
        </h1>
        <p className="text-muted-foreground text-lg">
          {hasStrongMatches
            ? "Tap any that interest you — pick as many as you like."
            : fallbackMessage || "We're still building out opportunities for your profile. In the meantime, take a look!"
          }
        </p>
      </div>

      {/* Opportunity Cards */}
      <div className="max-w-lg mx-auto w-full flex-1">
        <div className="flex flex-col gap-4">
          {opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isSelected={selectedIds.has(opportunity.id)}
              onToggle={() => toggleSelection(opportunity.id)}
              isHighNeed={index === 0 || (opportunity.matchScore >= 80 && index < 2)}
            />
          ))}
        </div>
        
        {/* Reassurance text */}
        <p className="mt-6 text-center text-sm text-muted-foreground px-4">
          This is just to show interest — someone will follow up with details before anything is finalized.
        </p>
      </div>

      {/* Footer */}
      <footer className="max-w-lg mx-auto w-full pt-10 pb-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Nothing catching your eye? <button className="text-primary underline underline-offset-2 hover:text-primary/80">See everything</button>
        </p>
        <p className="text-xs text-muted-foreground/70">
          Not quite what you expected?{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfxqOuCkBYnwl8TjMCdzbqNvsKhOPn3pu-2G1H4owIc8AsbZg/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.feedbackLinkClicked()}
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Tell us what&apos;s missing
          </a>
        </p>
      </footer>

      {/* Sticky Bottom Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 transition-transform duration-300 ${
          selectedCount > 0 ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-foreground font-medium">
            {selectedCount} {selectedCount === 1 ? "way" : "ways"} you can help
          </p>
          <button
            onClick={handleContinue}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function OpportunityCard({
  opportunity,
  isSelected,
  onToggle,
  isHighNeed = false,
}: {
  opportunity: MatchedOpportunity
  isSelected: boolean
  onToggle: () => void
  isHighNeed?: boolean
}) {
  // Determine icon based on match reason text
  const getReasonIcon = () => {
    const reason = opportunity.matchReason.toLowerCase()
    if (reason.includes("interest")) return Heart
    if (reason.includes("schedule") || reason.includes("time") || reason.includes("quick")) return Calendar
    return Sparkles
  }
  const ReasonIcon = getReasonIcon()
  
  // Get time estimate and commitment type
  const timeEstimate = getTimeEstimate(opportunity.timeCommitment)
  const commitmentType = getCommitmentType(opportunity)
  
  // Time level colors
  const timeLevelColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
  }
  
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left bg-card rounded-2xl border p-5 transition-all ${
        isSelected 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/30"
      }`}
    >
      {/* Top row: Match reason + High Need badge + Selection indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <ReasonIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">{opportunity.matchReason}</span>
          </div>
          {isHighNeed && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              <AlertCircle className="w-3 h-3" />
              <span className="text-xs font-medium">High Need</span>
            </div>
          )}
        </div>
        
        {/* Selection indicator */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <span>I&apos;m interested</span>
          )}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="font-serif text-xl text-foreground mb-2">{opportunity.title}</h3>
      
      {/* Time estimate and commitment type badges */}
      <div className="flex items-center gap-2 mb-3">
        {/* Time estimate badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${timeLevelColors[timeEstimate.level]}`}>
          <Clock className="w-3 h-3" />
          <span>{timeEstimate.label}</span>
        </div>
        
        {/* Commitment type badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {commitmentType === "ongoing" ? (
            <>
              <RefreshCw className="w-3 h-3" />
              <span>Ongoing</span>
            </>
          ) : (
            <>
              <Calendar className="w-3 h-3" />
              <span>One-time</span>
            </>
          )}
        </div>
      </div>
      
      {/* Description */}
      <p className="text-muted-foreground text-sm line-clamp-2">
        {opportunity.description}
      </p>
    </button>
  )
}
