import Link from "next/link"
import { ArrowLeft, Clock, Calendar, RefreshCw, AlertCircle } from "lucide-react"
import { fetchOpportunities, type Opportunity } from "@/lib/airtable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Opportunities - BeThere",
  description: "Browse all volunteer opportunities available at your school.",
}

// Helper to get time estimate level for color coding
function getTimeEstimateLevel(timeEstimate: string): "low" | "medium" | "high" {
  const lower = timeEstimate.toLowerCase()
  if (lower.includes("5") || lower.includes("10") || lower.includes("15") || lower.includes("quick")) {
    return "low"
  }
  if (lower.includes("1-3") || lower.includes("2") || lower.includes("3") || lower.includes("hour")) {
    return "high"
  }
  return "medium"
}

// Fallback: infer time estimate if not set
function inferTimeEstimate(timeCommitment: string): string {
  const lower = timeCommitment.toLowerCase()
  if (lower.includes("5 min") || lower.includes("10 min") || lower.includes("15 min") || 
      lower.includes("quick") || lower.includes("minimal")) {
    return "5-15 min"
  }
  if (lower.includes("2 hour") || lower.includes("3 hour") || lower.includes("hours") ||
      lower.includes("half day")) {
    return "1-3 hours"
  }
  return "30-60 min"
}

// Fallback: infer commitment type if not set
function inferCommitmentType(opportunity: Opportunity): string {
  const lower = (opportunity.timingWindow + " " + opportunity.timeCommitment + " " + opportunity.tags.join(" ")).toLowerCase()
  if (lower.includes("ongoing") || lower.includes("recurring") || lower.includes("weekly") || 
      lower.includes("monthly") || lower.includes("regular") || lower.includes("year-round")) {
    return "Ongoing"
  }
  return "One-time"
}

const timeLevelColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
}

export default async function OpportunitiesPage() {
  let opportunities: Opportunity[] = []
  let error: string | null = null

  try {
    const allOpportunities = await fetchOpportunities()
    // Filter to only active opportunities
    opportunities = allOpportunities.filter(o => o.active)
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load opportunities"
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <Link href="/" className="font-serif text-xl font-semibold text-primary">
          BeThere
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/pto-leaders" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            For PTO Leaders
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        className="px-6 py-16 md:py-20 relative"
        style={{ background: 'linear-gradient(135deg, #DDE7FF 0%, #C9D8FF 50%, #F6F8FC 100%)' }}
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 60%, rgba(245, 165, 36, 0.06), transparent 50%)' }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1D2A44] leading-tight text-balance">
            All Opportunities
          </h1>
          <p className="mt-4 text-lg text-[#5F6F8C] max-w-xl mx-auto">
            Browse all the ways you can help at school.
          </p>
        </div>
      </section>

      {/* Back link */}
      <div className="px-6 py-4 max-w-4xl mx-auto w-full">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Start the matching quiz
        </Link>
      </div>

      {/* Content */}
      <section className="px-6 pb-16 flex-1">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Link href="/" className="text-primary underline underline-offset-2">
                Go back home
              </Link>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No opportunities available right now.</p>
              <p className="text-sm text-muted-foreground">Check back soon — new ways to help pop up all the time!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {opportunities.map((opportunity) => {
                const timeEstimate = opportunity.timeEstimate || inferTimeEstimate(opportunity.timeCommitment)
                const timeLevel = getTimeEstimateLevel(timeEstimate)
                const commitmentType = opportunity.commitmentType || inferCommitmentType(opportunity)
                const isHighNeed = opportunity.highNeed === true

                return (
                  <div 
                    key={opportunity.id}
                    className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 transition-colors"
                  >
                    {/* High Need badge */}
                    {isHighNeed && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 w-fit mb-3">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs font-medium">High Need</span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="font-serif text-xl text-foreground mb-2">{opportunity.title}</h3>
                    
                    {/* Time estimate and commitment type badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${timeLevelColors[timeLevel]}`}>
                        <Clock className="w-3 h-3" />
                        <span>{timeEstimate}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {commitmentType.toLowerCase() === "ongoing" ? (
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
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {opportunity.description}
                    </p>

                    {/* Committee tag */}
                    {opportunity.committee && opportunity.committee !== "General" && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        {opportunity.committee}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12 bg-section-primary border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-foreground font-medium mb-3">
            Want personalized recommendations?
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
          >
            Take our quick matching quiz
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Made with care for busy parents everywhere</p>
      </footer>
    </div>
  )
}
