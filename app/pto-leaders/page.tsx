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
      <section className="px-6 pt-16 md:pt-24 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Run PTO events without chasing volunteers
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn committees and events into small, realistic ways parents can actually help.
          </p>
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
                <h3 className="font-medium text-lg text-foreground mb-2">Add your committees and events in minutes</h3>
                <p className="text-muted-foreground">Import or enter your PTO structure quickly — no heavy setup required.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-xl text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium text-lg text-foreground mb-2">Automatically turn events into small, manageable tasks</h3>
                <p className="text-muted-foreground">Get suggested opportunities like setup crew, ticket table shifts, and cleanup — with tags and time estimates.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-serif text-xl text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium text-lg text-foreground mb-2">Connect parents and see gaps instantly</h3>
                <p className="text-muted-foreground">Parents see relevant ways to help, and you can quickly identify what still needs coverage.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Walkthrough Section */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Example</span>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mt-2">
              Spring Carnival
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Before */}
            <div className="p-6 md:p-8 bg-background rounded-2xl border border-border">
              <h3 className="font-serif text-lg text-muted-foreground mb-5">Before</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">One person owns most of the work</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Tasks are unclear or too large</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Last-minute coordination</span>
                </li>
              </ul>
            </div>
            
            {/* After */}
            <div className="p-6 md:p-8 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 className="font-serif text-lg text-primary mb-5">With BeThere</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Event entered once</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-foreground">
                    <span>Tasks automatically suggested:</span>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      <li>Setup crew (30 min)</li>
                      <li>Ticket table shifts</li>
                      <li>Cleanup team</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Parents matched based on interest</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">PTO can see gaps ahead of time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PTO Command View Mock */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground">
              Example PTO Command View
            </h2>
            <p className="mt-3 text-muted-foreground">
              See committees, events, volunteers, and gaps in one place.
            </p>
          </div>
          <PTOCommandView />
          
          {/* CTA below mock */}
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">Want to try this with your PTO?</p>
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

      {/* Before vs After Comparison Section */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Before */}
            <div className="p-6 md:p-8 bg-background rounded-2xl border border-border">
              <h3 className="font-serif text-xl text-muted-foreground mb-6">Before</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground/60 flex-shrink-0" />
                  <span className="text-muted-foreground">Same parents do most of the work</span>
                </li>
                <li className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground/60 flex-shrink-0" />
                  <span className="text-muted-foreground">Roles feel too big</span>
                </li>
                <li className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground/60 flex-shrink-0" />
                  <span className="text-muted-foreground">Hard to know who can help</span>
                </li>
                <li className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground/60 flex-shrink-0" />
                  <span className="text-muted-foreground">Last-minute scrambling</span>
                </li>
              </ul>
            </div>
            
            {/* After */}
            <div className="p-6 md:p-8 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 className="font-serif text-xl text-primary mb-6">After</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">More parents helping in small ways</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Tasks broken into 30–60 minute chunks</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Clear visibility into who&apos;s helping</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Gaps identified before the event</span>
                </li>
              </ul>
            </div>
          </div>
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
              <h3 className="font-medium text-foreground mb-2">Smart suggestions</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>Suggests tasks like setup crew, ticket shifts, cleanup</li>
                <li>Recommends tags like fundraising, classroom, or setup</li>
              </ul>
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

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mb-3 text-balance">
            Want to try this with your PTO?
          </h2>
          <p className="text-muted-foreground mb-8">
            We&apos;re starting with a small group of schools.
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
