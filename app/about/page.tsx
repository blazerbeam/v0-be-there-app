import { ArrowRight, Users, Sparkles, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InterestForm } from "@/components/interest-form"
import { AboutPageTracker } from "@/components/about-page-tracker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - BeThere",
  description: "Making it easier for parents to show up — in ways that actually fit real life.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Analytics: Track about page view */}
      <AboutPageTracker />
      
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <Link href="/" className="font-serif text-xl font-semibold text-primary">
          BeThere
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-foreground">
            About
          </Link>
          <Link href="/pto-leaders" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            For PTO Leaders
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        className="px-6 py-20 md:py-28 relative"
        style={{ background: 'linear-gradient(180deg, #0F2747 0%, #0B1B3A 60%)' }}
      >
        {/* Subtle focal glow behind headline */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255, 159, 28, 0.08), transparent 60%)' }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight text-balance">
            About BeThere
          </h1>
          <p className="mt-4 text-lg md:text-xl text-[#D6E1F0] max-w-xl mx-auto">
            Making it easier for parents to show up — in ways that actually fit real life.
          </p>
        </div>
      </section>

      {/* Callout Statement */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <blockquote className="text-center container-subtle rounded-2xl p-8 md:p-10">
            <p className="text-xl md:text-2xl text-foreground font-serif leading-relaxed text-balance">
              &ldquo;A small group of parents carry most of the load — while many others want to help, but don&apos;t have a clear way to do it.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* How It Works - Visual Cards */}
      <section className="px-6 py-16 md:py-20 bg-section-alt">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 text-center">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-2xl border border-border text-center card-interactive">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-medium mb-2">
                Tell us how you&apos;d like to help
              </h3>
              <p className="text-sm text-muted-foreground">
                Share your interests and availability
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border text-center card-interactive">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-medium mb-2">
                See small, relevant opportunities
              </h3>
              <p className="text-sm text-muted-foreground">
                Get matched to tasks that fit
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border text-center card-interactive">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-medium mb-2">
                Jump in when it works for you
              </h3>
              <p className="text-sm text-muted-foreground">
                Contribute on your schedule
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Goal */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
            The goal
          </h2>
          <p className="text-muted-foreground mb-4">
            Make it easier for more parents to be involved — without requiring a big commitment.
          </p>
          <p className="text-muted-foreground">
            Turn large, overwhelming roles into small, manageable ways to contribute.
          </p>
        </div>
      </section>

      {/* PTO Link Card */}
      <section className="px-6 py-12 md:py-16 bg-card">
        <div className="max-w-xl mx-auto">
          <div className="p-6 md:p-8 bg-primary/5 rounded-2xl border border-primary/20 text-center">
            <p className="text-foreground font-medium mb-3">
              Are you organizing events or part of a PTO?
            </p>
            <Link 
              href="/pto-leaders" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              See how this works for PTO leaders
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 text-balance">
            Ready to find ways to help?
          </h2>
          <p className="text-muted-foreground mb-8">
            Answer a few quick questions and see opportunities that match your time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full gap-2">
              <Link href="/">
                Try it now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <InterestForm
              trigger={
                <button className="text-primary hover:text-primary/80 underline underline-offset-4 text-sm cursor-pointer">
                  Contact us
                </button>
              }
            />
          </div>
        </div>
      </section>

      {/* Who's behind BeThere */}
      <section className="px-6 py-16 md:py-20 border-t border-border bg-section-primary">
        <div className="max-w-readable mx-auto">
          <h2 className="font-serif text-lg md:text-xl text-foreground mb-8 text-center">
            Who&apos;s behind BeThere
          </h2>
          
          <div className="container-subtle rounded-2xl p-6 md:p-8">
            <div className="text-center">
              <h3 className="text-base font-medium text-foreground">Jeremy Myrland</h3>
              <p className="text-xs text-secondary mt-1">Founder</p>
            </div>
            
            <div className="mt-8 space-y-5 text-sm text-body text-left leading-relaxed max-w-readable mx-auto">
              <p>
                I live in Lake Oswego, Oregon and am the dad of twin 4th graders. I currently serve as Vice President of the PTO at their elementary school and am also a board member with the Lake Oswego Schools Foundation.
              </p>
              <p>
                My wife is a 6th grade science teacher, so education is a part of our daily life — both at home and in the community.
              </p>
              <p>
                Like a lot of parents, I&apos;m balancing work, coaching, and trying to stay involved where I can.
              </p>
              <p>
                In my day job, I&apos;m a Principal Product Manager at Nike. I&apos;ve spent over 20 years working in technology, including roles at Apple, Wayfair, Workday, and several startups.
              </p>
              <p>
                BeThere started from a simple observation: a small group of parents tend to carry most of the load, while many others want to help but don&apos;t have a clear or manageable way to do it.
              </p>
              <p>
                I&apos;m building this to make it easier for more parents to show up in ways that actually fit their lives.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border text-xs text-secondary text-center space-y-1">
              <p>
                <a href="mailto:hello@bethere.community" className="hover:text-foreground transition-colors">
                  jeremy@bethere.community
                </a>
              </p>
              <p>
                <a 
                  href="https://www.linkedin.com/in/jpmyrland/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Made with care for busy parents everywhere</p>
      </footer>
    </div>
  )
}
