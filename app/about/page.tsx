import { Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InterestForm } from "@/components/interest-form"
import { AboutPageTracker } from "@/components/about-page-tracker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - BeThere",
  description: "Built for parents who want to help — but need flexible, realistic ways to do it",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Analytics: Track about page view */}
      <AboutPageTracker />
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl text-foreground">BeThere</span>
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

      {/* Section 1: Intro / Audience */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            About BeThere
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            Built for parents who want to help — but need flexible, realistic ways to do it.
          </p>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
            The problem
          </h2>
          <div className="space-y-5 text-muted-foreground">
            <p>
              At most schools, the same small group of parents ends up doing most of the work.
            </p>
            <p>
              Meanwhile, many other parents want to help — but don&apos;t have a clear or manageable way to do it.
            </p>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">Roles feel too big to take on</li>
              <li className="list-disc">It&apos;s hard to know what&apos;s actually needed</li>
              <li className="list-disc">Opportunities don&apos;t match real schedules</li>
            </ul>
            <p className="pt-2 text-foreground">
              BeThere makes it easier for more parents to show up — in small, realistic ways that fit their lives.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10 text-center">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-2xl border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-serif text-lg flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <p className="text-foreground font-medium">
                Tell us how you&apos;d like to help
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-serif text-lg flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <p className="text-foreground font-medium">
                See small, relevant opportunities
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-serif text-lg flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <p className="text-foreground font-medium">
                Jump in when it works for you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: The Goal */}
      <section className="px-6 py-16 md:py-20 bg-card">
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

      {/* Section 5: PTO Link */}
      <section className="px-6 py-12 md:py-16">
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

      {/* Section: Who's behind BeThere */}
      <section className="px-6 py-12 md:py-16 border-t border-border">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-xl md:text-2xl text-foreground mb-8 text-center">
            Who&apos;s behind BeThere
          </h2>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground">Jeremy Myrland</h3>
            <p className="text-sm text-muted-foreground mt-1">Founder</p>
            
            <div className="mt-6 space-y-4 text-sm text-muted-foreground text-left">
              <p>
                I&apos;m a parent of twin boys in elementary school and currently serve as Vice President of the PTO at my kids&apos; school.
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
            
            <div className="mt-6 text-xs text-muted-foreground/70 space-y-1">
              <p>
                <a href="mailto:jeremy@bethere.community" className="hover:text-muted-foreground transition-colors">
                  jeremy@bethere.community
                </a>
              </p>
              <p>
                <a 
                  href="https://www.linkedin.com/in/jpmyrland/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-muted-foreground transition-colors"
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
