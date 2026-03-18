"use client"

import { useState } from "react"
import useSWR from "swr"
import { ArrowLeft, Clock, Heart, Calendar, Sparkles, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Opportunity } from "@/lib/airtable"

interface MatchesScreenProps {
  onSelect: (opportunities: Opportunity[]) => void
  onBack: () => void
}

type MatchReason = "interests" | "schedule" | "quick"

interface OpportunityWithReason extends Opportunity {
  matchReason: MatchReason
}

const matchReasonConfig: Record<MatchReason, { icon: typeof Heart; label: string }> = {
  interests: { icon: Heart, label: "Right up your alley" },
  schedule: { icon: Calendar, label: "Works with your schedule" },
  quick: { icon: Sparkles, label: "Quick win" },
}

// Determine match reason based on opportunity data
function getMatchReason(opportunity: Opportunity): MatchReason {
  const timeCommitment = opportunity.timeCommitment.toLowerCase()
  if (timeCommitment.includes("one-time") || timeCommitment.includes("1 hour") || timeCommitment.includes("half")) {
    return "quick"
  }
  if (opportunity.availabilityTags.length > 0) {
    return "schedule"
  }
  return "interests"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MatchesScreen({ onSelect, onBack }: MatchesScreenProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  
  const { data, error, isLoading } = useSWR<{ opportunities: Opportunity[] }>(
    "/api/opportunities",
    fetcher
  )

  const opportunities: OpportunityWithReason[] = (data?.opportunities || []).map((opp) => ({
    ...opp,
    matchReason: getMatchReason(opp),
  }))

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
          We found a few things that might work for you
        </h1>
        <p className="text-muted-foreground text-lg">
          Tap any that interest you — pick as many as you like.
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
      <footer className="max-w-lg mx-auto w-full pt-10 pb-6 text-center">
        <p className="text-sm text-muted-foreground">
          Nothing catching your eye? <button className="text-primary underline underline-offset-2 hover:text-primary/80">See everything</button>
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
  opportunity: OpportunityWithReason
  isSelected: boolean
  onToggle: () => void
}) {
  const { icon: ReasonIcon, label: reasonLabel } = matchReasonConfig[opportunity.matchReason]
  
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
          <span className="text-xs font-medium text-primary">{reasonLabel}</span>
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
