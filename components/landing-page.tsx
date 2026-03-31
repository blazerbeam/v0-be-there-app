"use client"

import { Button } from "@/components/ui/button"
import { Users, Calendar, Heart, ArrowRight } from "lucide-react"
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
        <span className="font-serif text-xl font-semibold text-primary">BeThere</span>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative"
        style={{ background: 'linear-gradient(135deg, #DDE7FF 0%, #C9D8FF 50%, #F6F8FC 100%)' }}
      >
        {/* Subtle warm glow accent */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 60%, rgba(245, 165, 36, 0.06), transparent 50%)' }}
        />
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1D2A44] leading-tight text-balance">
            Find simple ways to help at your child&apos;s school
          </h1>

          <p className="mt-4 text-base text-[#5F6F8C]">
            Built for Forest Hills families. Takes 60 seconds.
          </p>
          
          <p className="mt-3 text-lg md:text-xl text-[#3D4F6F] max-w-md mx-auto text-pretty">
            Answer a few quick questions and we&apos;ll show you ways to help that match your time and interests.
          </p>

          <p className="mt-3 text-sm text-[#5F6F8C]">
            No big commitments. No guilt. Just small ways to show up for your kids' school.
          </p>

          <Button 
            onClick={handleStartClick}
            size="lg"
            className="mt-10 px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 btn-primary-glow"
          >
            See ways I can help
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Subtle PTO entry point */}
          <p className="mt-8 text-sm text-[#5F6F8C]">
            Running a PTO or school event?{" "}
            <Link 
              href="/pto-leaders" 
              onClick={handlePtoLinkClick}
              className="underline underline-offset-2 hover:text-[#1D2A44] transition-colors"
            >
              See how this works for you
            </Link>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:py-20 bg-section-primary section-divider-top">
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
