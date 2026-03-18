"use client"

import { Button } from "@/components/ui/button"
import { Heart, Users, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { analytics } from "@/lib/analytics"

interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  // Analytics: Track parent CTA click
  const handleStartClick = () => {
    analytics.homepageParentCtaClicked()
    onStart()
  }

  // Analytics: Track PTO link click
  const handlePtoLinkClick = () => {
    analytics.homepagePtoLinkClicked()
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl text-foreground">BeThere</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight text-balance">
            Find simple ways to help at your child&apos;s school
          </h1>

          <p className="mt-6 text-base text-muted-foreground/80">
            From 30-minute setup help to one-time event support.
          </p>
          
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-md mx-auto text-pretty">
            Answer a few quick questions and we&apos;ll show you ways to help that match your time and interests.
          </p>

          <p className="mt-3 text-sm text-muted-foreground/70">
            Help set up an event, run a 1-hour station, or pitch in behind the scenes.
          </p>

          <Button 
            onClick={handleStartClick}
            size="lg"
            className="mt-10 px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            See ways I can help
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Subtle PTO entry point */}
          <p className="mt-8 text-sm text-muted-foreground/70">
            Running a PTO or school event?{" "}
            <Link 
              href="/pto-leaders" 
              onClick={handlePtoLinkClick}
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              See how this works for you
            </Link>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12 md:py-16 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg text-foreground">Fits your schedule</h3>
              <p className="mt-2 text-muted-foreground">
                Whether you have 30 minutes or a few hours, there's something you can do.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg text-foreground">Matches your interests</h3>
              <p className="mt-2 text-muted-foreground">
                Love baking? Great with spreadsheets? We'll find something you'll actually enjoy.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg text-foreground">Builds community</h3>
              <p className="mt-2 text-muted-foreground">
                Small acts add up. Your help makes a real difference for kids and families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-muted-foreground">
        <p>Made with care for busy parents everywhere</p>
      </footer>
    </div>
  )
}
