"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Heart, Calendar, Sparkles, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Opportunity } from "@/lib/airtable"
import type { UserPreferences } from "@/app/page"

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
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isSelected={selectedIds.has(opportunity.id)}
              onToggle={() => toggleSelection(opportunity.id)}
            />
          ))}
        </div>
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
}: {
  opportunity: MatchedOpportunity
  isSelected: boolean
  onToggle: () => void
}) {
  // Determine icon based on match reason text
  const getReasonIcon = () => {
    const reason = opportunity.matchReason.toLowerCase()
    if (reason.includes("interest")) return Heart
    if (reason.includes("schedule") || reason.includes("time") || reason.includes("quick")) return Calendar
    return Sparkles
  }
  const ReasonIcon = getReasonIcon()
  
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left bg-card rounded-2xl border p-5 transition-all ${
        isSelected 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/30"
      }`}
    >
      {/* Match reason badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <ReasonIcon className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{opportunity.matchReason}</span>
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
      
      {/* Title and time badge row */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-serif text-xl text-foreground">{opportunity.title}</h3>
        <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{opportunity.timeCommitment}</span>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-muted-foreground text-sm line-clamp-2">
        {opportunity.description}
      </p>
    </button>
  )
}
