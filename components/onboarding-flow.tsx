"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import type { UserPreferences } from "@/app/page"

interface OnboardingFlowProps {
  onComplete: (preferences: UserPreferences) => void
  onBack: () => void
}

const schools = [
  { id: "forest-hills", name: "Forest Hills", active: true },
  { id: "oak-creek", name: "Oak Creek", active: false },
  { id: "lake-grove", name: "Lake Grove", active: false },
  { id: "loms", name: "LOMS", active: false },
  { id: "lohs", name: "LOHS", active: false },
]

const grades = ["Pre-K", "K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]

const timeOptions = [
  { id: "minimal", label: "Just a little", description: "30 min to an hour, here and there" },
  { id: "moderate", label: "A few hours when I can", description: "Maybe 2-4 hours a month" },
  { id: "regular", label: "I've got more time to give", description: "5+ hours a month" },
]

const availabilityOptions = [
  { id: "weekday-morning", label: "Mornings (while kids are in school)" },
  { id: "weekday-afternoon", label: "Afternoons (after pickup)" },
  { id: "weekday-evening", label: "Evenings (after bedtime, maybe)" },
  { id: "weekend", label: "Weekends work better for me" },
  { id: "flexible", label: "It really depends on the week" },
]

const interestTags = [
  "Arts & Crafts",
  "Sports & Fitness",
  "Reading & Literacy",
  "STEM & Tech",
  "Outdoor Activities",
  "Event Planning",
  "Food & Hospitality",
  "Photography",
  "Music",
  "Fundraising",
  "Administrative",
  "Mentoring",
]

const contributionTypes = [
  { id: "volunteer", label: "I'd rather give my time" },
  { id: "donate", label: "I'd rather donate" },
  { id: "both", label: "A little of both works for me" },
]

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState<UserPreferences>({
    school: "Forest Hills",
    grades: [],
    timeAvailable: "",
    availability: [],
    interests: [],
    contributionType: "",
  })

  const totalSteps = 6

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayItem = (key: "grades" | "availability" | "interests", item: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((i) => i !== item)
        : [...prev[key], item],
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.school !== ""
      case 2:
        return preferences.grades.length > 0
      case 3:
        return preferences.timeAvailable !== ""
      case 4:
        return preferences.availability.length > 0
      case 5:
        return preferences.interests.length > 0
      case 6:
        return preferences.contributionType !== ""
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(preferences)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      onBack()
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only md:not-sr-only">Back</span>
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {step} of {totalSteps}
        </span>
      </header>

      {/* Intro Text */}
      <p className="text-center text-sm text-muted-foreground mt-4 mb-6">
        This takes about 60 seconds. No commitment — just ideas that might fit.
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-secondary rounded-full mb-10 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="flex-1 max-w-lg mx-auto w-full">
        {step === 1 && (
          <StepContainer
            title="Which school?"
            subtitle="So we can show you what's happening there"
          >
            <div className="space-y-3">
              {schools.map((school) => (
                <TapButton
                  key={school.id}
                  label={school.name}
                  badge={!school.active ? "Coming Soon" : undefined}
                  selected={preferences.school === school.name}
                  onClick={() => school.active && updatePreference("school", school.name)}
                  disabled={!school.active}
                />
              ))}
            </div>
          </StepContainer>
        )}

        {step === 2 && (
          <StepContainer
            title="What grade(s) are your kids in?"
            subtitle="Tap all that apply"
          >
            <div className="flex flex-wrap gap-3">
              {grades.map((grade) => (
                <ChipButton
                  key={grade}
                  label={grade}
                  selected={preferences.grades.includes(grade)}
                  onClick={() => toggleArrayItem("grades", grade)}
                />
              ))}
            </div>
          </StepContainer>
        )}

        {step === 3 && (
          <StepContainer
            title="Realistically, how much time can you spare?"
            subtitle="No wrong answer here"
          >
            <div className="space-y-4">
              {timeOptions.map((option) => (
                <TapButton
                  key={option.id}
                  label={option.label}
                  description={option.description}
                  selected={preferences.timeAvailable === option.id}
                  onClick={() => updatePreference("timeAvailable", option.id)}
                />
              ))}
            </div>
          </StepContainer>
        )}

        {step === 4 && (
          <StepContainer
            title="When are you usually free?"
            subtitle="Pick as many as you like"
          >
            <div className="space-y-3">
              {availabilityOptions.map((option) => (
                <TapButton
                  key={option.id}
                  label={option.label}
                  selected={preferences.availability.includes(option.id)}
                  onClick={() => toggleArrayItem("availability", option.id)}
                  multiSelect
                />
              ))}
            </div>
          </StepContainer>
        )}

        {step === 5 && (
          <StepContainer
            title="What do you actually enjoy?"
            subtitle="We'll try to match you with things you won't dread"
          >
            <div className="flex flex-wrap gap-3">
              {interestTags.map((tag) => (
                <ChipButton
                  key={tag}
                  label={tag}
                  selected={preferences.interests.includes(tag)}
                  onClick={() => toggleArrayItem("interests", tag)}
                />
              ))}
            </div>
          </StepContainer>
        )}

        {step === 6 && (
          <StepContainer
            title="Last one! How would you like to help?"
            subtitle="Whatever works best for your situation"
          >
            <div className="space-y-4">
              {contributionTypes.map((type) => (
                <TapButton
                  key={type.id}
                  label={type.label}
                  selected={preferences.contributionType === type.id}
                  onClick={() => updatePreference("contributionType", type.id)}
                />
              ))}
            </div>
          </StepContainer>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-lg mx-auto w-full pt-8 pb-6">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          size="lg"
          className="w-full py-6 text-base rounded-full gap-2"
        >
          {step === totalSteps ? "Show me what you've got" : "Next"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

function StepContainer({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-balance">{title}</h2>
      <p className="text-muted-foreground mb-10 text-lg">{subtitle}</p>
      {children}
    </div>
  )
}

function TapButton({
  label,
  description,
  badge,
  selected,
  onClick,
  multiSelect = false,
  disabled = false,
}: {
  label: string
  description?: string
  badge?: string
  selected: boolean
  onClick: () => void
  multiSelect?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-5 rounded-2xl text-left transition-all duration-200 border-2 flex items-center gap-4 ${
        disabled
          ? "border-border bg-muted/50 cursor-not-allowed opacity-60"
          : selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/30 hover:bg-card/80"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-medium text-lg ${disabled ? "text-muted-foreground" : "text-foreground"}`}>{label}</p>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {!disabled && (selected || multiSelect) && (
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            selected ? "bg-primary" : "bg-secondary"
          }`}
        >
          <Check
            className={`w-4 h-4 ${
              selected ? "text-primary-foreground" : "text-transparent"
            }`}
          />
        </div>
      )}
    </button>
  )
}

function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-full text-base font-medium transition-all duration-200 ${
        selected
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-card text-foreground border-2 border-border hover:border-primary/30"
      }`}
    >
      {label}
    </button>
  )
}
