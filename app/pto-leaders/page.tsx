import { Heart, ArrowRight, Users, Calendar, CheckCircle, Eye, FileEdit, Sparkles, Zap, LayoutDashboard, AlertCircle, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InterestForm } from "@/components/interest-form"
import { PTOCommandView } from "@/components/pto-command-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "For PTO Leaders - BeThere",
  description: "Run PTO events without chasing volunteers. Turn committees and events into small, realistic ways parents can actually help.",
}

export default function PTOLeadersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl text-foreground">BeThere</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/pto-leaders" className="text-sm font-medium text-foreground">
            For PTO Leaders
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Run PTO events without chasing volunteers
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn committees and events into small, realistic ways parents can actually help.
          </p>
          <div className="mt-10">
            <InterestForm
              trigger={
                <Button size="lg" className="px-8 py-6 text-lg rounded-full gap-2">
                  Request early access
                  <ArrowRight className="w-5 h-5" />
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10 text-center">
            Sound familiar?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-background rounded-2xl border border-border">
              <Users className="w-6 h-6 text-muted-foreground mb-3" />
              <p className="text-foreground">The same parents do most of the work</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border">
              <AlertCircle className="w-6 h-6 text-muted-foreground mb-3" />
              <p className="text-foreground">Hard to know who can actually help</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border">
              <ClipboardList className="w-6 h-6 text-muted-foreground mb-3" />
              <p className="text-foreground">Roles feel too big for busy parents</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border">
              <Calendar className="w-6 h-6 text-muted-foreground mb-3" />
              <p className="text-foreground">Last-minute scrambling before events</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 text-center">
            How it works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-xl text-primary">1</span>
              </div>
              <div>
                <h3 className="font-medium text-lg text-foreground mb-2">Add committees and events</h3>
                <p className="text-muted-foreground">Import from your existing tools or add them manually. Start with what you already have.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-xl text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium text-lg text-foreground mb-2">Break work into smaller tasks</h3>
                <p className="text-muted-foreground">Use AI-assisted suggestions to turn big roles into manageable pieces with helpful tags for matching.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-xl text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium text-lg text-foreground mb-2">Match parents to opportunities</h3>
                <p className="text-muted-foreground">See who&apos;s interested, identify gaps, and connect the right people to the right tasks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PTO Command View Mock */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 text-center">
            Your PTO command center
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Manage committees, events, and volunteers in one place. See who&apos;s helping and where you need more support.
          </p>
          <PTOCommandView />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 text-center">
            Built for busy PTO leaders
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-2xl border border-border">
              <Sparkles className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-medium text-foreground mb-2">Smart setup</h3>
              <p className="text-sm text-muted-foreground">AI-assisted breakdown of committees and events into tasks parents can actually take on.</p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border">
              <Zap className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-medium text-foreground mb-2">Fast manual entry</h3>
              <p className="text-sm text-muted-foreground">Quick add what you need now, edit and refine later. No complex setup required.</p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border">
              <LayoutDashboard className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-medium text-foreground mb-2">PTO command view</h3>
              <p className="text-sm text-muted-foreground">See all your committees, chairs, events, and volunteers in one organized place.</p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border">
              <Eye className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-medium text-foreground mb-2">Gap visibility</h3>
              <p className="text-sm text-muted-foreground">Quickly identify where you&apos;re missing help so you can focus your outreach.</p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border">
              <FileEdit className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-medium text-foreground mb-2">Draft and publish</h3>
              <p className="text-sm text-muted-foreground">Control what parents see. Prepare opportunities in draft, publish when ready.</p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border">
              <CheckCircle className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-medium text-foreground mb-2">Better matching</h3>
              <p className="text-sm text-muted-foreground">Connect parents to opportunities based on their interests, time, and availability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Walkthrough Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 text-center">
            See it in action
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Here&apos;s how BeThere transforms your Spring Carnival planning
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <span className="text-muted-foreground">Before:</span> The usual way
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li>&quot;We need volunteers for Spring Carnival!&quot;</li>
                <li>Same 5 parents sign up</li>
                <li>Everyone else thinks it&apos;s too much</li>
                <li>Scrambling the week before</li>
                <li>Burnout for the core team</li>
              </ul>
            </div>
            
            {/* After */}
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">After:</span> With BeThere
              </h3>
              <ul className="space-y-3 text-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Setup crew (Friday 4-6pm)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Ticket table shift (1 hour)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Game booth helper (pick your time)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Cleanup crew (Saturday 7-8pm)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Donate prizes (no time needed)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="text-center text-muted-foreground mt-8 text-sm">
            Small, specific tasks matched to parents who said they can help evenings, weekends, or from home.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-24 bg-card">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mb-6 text-balance">
            Ready to get more parents involved?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Request early access and we&apos;ll be in touch to set up your school.
          </p>
          <InterestForm
            trigger={
              <Button size="lg" className="px-8 py-6 text-lg rounded-full gap-2">
                Request early access
                <ArrowRight className="w-5 h-5" />
              </Button>
            }
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Made with care for busy PTO leaders everywhere</p>
      </footer>
    </div>
  )
}
