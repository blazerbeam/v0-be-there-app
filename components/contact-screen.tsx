"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Check, Sparkles, Loader2 } from "lucide-react"
import type { Opportunity } from "@/lib/airtable"
import type { UserPreferences } from "@/app/page"

interface ContactScreenProps {
  opportunities: Opportunity[]
  preferences: UserPreferences
  onSubmit: () => void
  onBack: () => void
}

const contactMethods = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "text", label: "Text" },
]

export function ContactScreen({ opportunities, preferences, onSubmit, onBack }: ContactScreenProps) {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "email",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/survey-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Contact info
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          preferredContact: formData.preferredContact,
          // Survey preferences
          school: preferences.school,
          grades: preferences.grades,
          timeAvailable: preferences.timeAvailable,
          availability: preferences.availability,
          interests: preferences.interests,
          contributionType: preferences.contributionType,
          // Selected opportunities
          selectedOpportunityIds: opportunities.map((o) => o.id),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Submission failed")
      }

      onSubmit()
    } catch (err) {
      console.error("Submit error:", err)
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.email && !isSubmitting
  const count = opportunities.length
  const isSingle = count === 1

  // Confirmation step before showing form
  if (!showForm) {
    return (
      <div className="min-h-screen flex flex-col px-6 py-4">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only md:not-sr-only">Back</span>
          </button>
        </header>

        <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center text-center -mt-16">
          {/* Sparkle Icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          {/* Confirmation Message */}
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
            Nice — {isSingle ? "this looks" : "these look"} like {isSingle ? "a great fit" : "great fits"}.
          </h1>

          {/* Selected Opportunities */}
          <div className="my-6 w-full max-w-sm space-y-3">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="bg-secondary/50 border-0">
                <CardContent className="p-4 text-left">
                  <h3 className="font-medium text-foreground mb-1">
                    {opportunity.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{opportunity.timeCommitment}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <p className="text-lg text-muted-foreground mb-8">
            Want us to connect you with the {isSingle ? "organizer" : "organizers"}?
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full py-6 text-base rounded-xl"
            >
              Yes, let&apos;s do it
            </Button>
            <button
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only md:not-sr-only">Back</span>
        </button>
      </header>

      <div className="max-w-md mx-auto w-full flex-1">
        {/* Opportunities Summary */}
        <Card className="mb-8 bg-secondary/50 border-0">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
              You&apos;re interested in {count} {isSingle ? "opportunity" : "opportunities"}
            </p>
            <div className="space-y-2">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>{opportunity.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Section */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            Just a few details
          </h1>
          <p className="text-muted-foreground">
            We&apos;ll pass this along to {isSingle ? "the organizer" : "each organizer"} so they can reach out.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1.5 h-12 rounded-xl bg-card border-border"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1.5 h-12 rounded-xl bg-card border-border"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone number <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1.5 h-12 rounded-xl bg-card border-border"
              />
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div>
            <Label className="text-foreground mb-3 block">
              Preferred contact method
            </Label>
            <div className="flex gap-2">
              {contactMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleInputChange("preferredContact", method.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    formData.preferredContact === method.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {formData.preferredContact === method.id && (
                    <Check className="w-4 h-4" />
                  )}
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-6 text-base rounded-xl mt-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Count me in"
            )}
          </Button>
        </form>

        {/* Privacy Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Don&apos;t worry — we only share this with the {isSingle ? "person" : "people"} organizing {isSingle ? "this opportunity" : "these opportunities"}.
        </p>
      </div>
    </div>
  )
}
