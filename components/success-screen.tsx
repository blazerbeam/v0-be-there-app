"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Clock, Check, ArrowRight } from "lucide-react"
import type { Opportunity } from "@/lib/airtable"

interface SuccessScreenProps {
  opportunities: Opportunity[]
  onStartOver: () => void
}

export function SuccessScreen({ opportunities, onStartOver }: SuccessScreenProps) {
  const count = opportunities.length

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <Heart className="w-10 h-10 text-primary" />
        </div>

        {/* Main Message */}
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
          Thanks — we&apos;ve saved your info
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-sm">
          We&apos;ve started identifying ways you could help. The {count === 1 ? "organizer" : "organizers"} will reach out soon.
        </p>

        {/* Selected Opportunities Summary */}
        <div className="w-full max-w-sm mb-10">
          <p className="text-sm font-medium text-muted-foreground mb-3 text-left">
            You&apos;re interested in:
          </p>
          <div className="space-y-2">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="bg-secondary/50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-foreground">
                        {opportunity.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{opportunity.timeCommitment}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div className="w-full max-w-sm text-left mb-10 p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-medium text-foreground mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>The organizer(s) will review your interest</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>They&apos;ll reach out via your preferred contact method</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>You&apos;ll get more details and can decide if it&apos;s the right fit</span>
            </li>
          </ul>
        </div>

        {/* Share section */}
        <div className="w-full max-w-sm mb-6 p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center">
          <p className="font-medium text-foreground mb-1">Know another Forest Hills parent?</p>
          <p className="text-sm text-muted-foreground mb-4">Send them this link — it takes 60 seconds.</p>
          <button
            onClick={() => {
              const url = "https://www.bethere.community"
              if (navigator.share) {
                navigator.share({ title: "BeThere", text: "Find simple ways to help at Forest Hills", url })
              } else {
                navigator.clipboard.writeText(url)
                alert("Link copied to clipboard!")
              }
            }}
            className="w-full py-3 px-6 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Share with a parent
          </button>
        </div>

        {/* Explore more - secondary action */}
        <Button
          onClick={onStartOver}
          variant="outline"
          className="gap-2 rounded-full px-6 my-8"
        >
          Explore more opportunities
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-full max-w-sm mx-auto mt-4 mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
        <p className="font-medium text-foreground mb-1">Have 1 minute?</p>
        <p className="text-sm text-muted-foreground mb-3">This is an early version — your feedback directly shapes what we build next.</p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfxqOuCkBYnwl8TjMCdzbqNvsKhOPn3pu-2G1H4owIc8AsbZg/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full py-3 px-6 rounded-full bg-white text-amber-700 font-medium border border-amber-300 hover:bg-amber-50 transition-colors"
        >
          Give feedback
        </a>
      </div>
    </div>
  )
}
