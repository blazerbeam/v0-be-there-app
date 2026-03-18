"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { MatchesScreen } from "@/components/matches-screen"
import { ContactScreen } from "@/components/contact-screen"
import { SuccessScreen } from "@/components/success-screen"
import type { Opportunity } from "@/lib/airtable"

export type Screen = "landing" | "onboarding" | "matches" | "contact" | "success"

export interface UserPreferences {
  school: string
  grades: string[]
  timeAvailable: string
  availability: string[]
  interests: string[]
  contributionType: string
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [selectedOpportunities, setSelectedOpportunities] = useState<Opportunity[]>([])

  const handleStartOnboarding = () => {
    setCurrentScreen("onboarding")
  }

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences)
    setCurrentScreen("matches")
  }

  const handleSelectOpportunities = (opportunities: Opportunity[]) => {
    setSelectedOpportunities(opportunities)
    setCurrentScreen("contact")
  }

  const handleContactSubmit = () => {
    // Show success screen instead of alert
    setCurrentScreen("success")
  }

  const handleStartOver = () => {
    setCurrentScreen("landing")
    setUserPreferences(null)
    setSelectedOpportunities([])
  }

  const handleBack = () => {
    if (currentScreen === "contact") {
      setCurrentScreen("matches")
    } else if (currentScreen === "matches") {
      setCurrentScreen("onboarding")
    } else if (currentScreen === "onboarding") {
      setCurrentScreen("landing")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "landing" && (
        <LandingPage onStart={handleStartOnboarding} />
      )}
      {currentScreen === "onboarding" && (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete} 
          onBack={handleBack}
        />
      )}
      {currentScreen === "matches" && userPreferences && (
        <MatchesScreen 
          preferences={userPreferences}
          onSelect={handleSelectOpportunities}
          onBack={handleBack}
        />
      )}
      {currentScreen === "contact" && selectedOpportunities.length > 0 && userPreferences && (
        <ContactScreen 
          opportunities={selectedOpportunities}
          preferences={userPreferences}
          onSubmit={handleContactSubmit}
          onBack={handleBack}
        />
      )}
      {currentScreen === "success" && selectedOpportunities.length > 0 && (
        <SuccessScreen
          opportunities={selectedOpportunities}
          onStartOver={handleStartOver}
        />
      )}
    </main>
  )
}
