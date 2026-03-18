import { Metadata } from "next"
import { Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About - BeThere",
  description: "Helping more parents show up — in ways that actually work for them",
}

export default function AboutPage() {
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
          <Link href="/about" className="text-sm font-medium text-foreground">
            About
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Helping more parents show up — in ways that actually work for them
          </h1>
          <div className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto space-y-4">
            <p>Most schools rely on the same small group of parents to do everything.</p>
            <p>Most parents want to help — they just don&apos;t know how in a way that fits their life.</p>
            <p className="text-foreground font-medium">BeThere bridges that gap.</p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full gap-2">
              <Link href="/">
                Try it
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <a
              href="mailto:hello@bethere.community"
              className="text-primary hover:text-primary/80 underline underline-offset-4 text-sm"
            >
              Bring this to your school
            </a>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* For PTOs */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                For PTOs / PTAs
              </h2>
              <p className="text-muted-foreground mb-6">
                You need volunteers to make everything happen — events, fundraisers, classroom support.
              </p>
              <p className="text-foreground font-medium mb-4">But in reality:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li>The same 4–5 parents end up doing most of the work</li>
                <li>Outreach is broad (&quot;we need help!&quot;) but not targeted</li>
                <li>It&apos;s hard to know who has time, interest, or specific skills</li>
              </ul>
              <p className="mt-6 text-muted-foreground">
                That leads to burnout for a few, and low engagement from everyone else.
              </p>
            </div>

            {/* For Parents */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                For Parents
              </h2>
              <p className="text-muted-foreground mb-6">
                Most parents care. They want to be involved.
              </p>
              <p className="text-foreground font-medium mb-4">But:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li>They don&apos;t know what opportunities exist</li>
                <li>They&apos;re not sure what they&apos;d actually be good at</li>
                <li>They worry about overcommitting</li>
                <li>They don&apos;t see options that fit their schedule</li>
              </ul>
              <p className="mt-6 text-muted-foreground">
                So they don&apos;t raise their hand — even when they would have said yes to the right thing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Idea Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
            A better way to connect people to how they can help
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Instead of asking parents to figure it out themselves…
          </p>
          <p className="text-lg text-foreground">
            What if we showed them where they&apos;re most likely to help — based on their time, interests, and availability?
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 text-center">
            How it works
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-6 bg-background rounded-2xl">
              <div className="text-3xl font-serif text-primary mb-4">1</div>
              <p className="text-foreground">
                Parents answer a few simple questions — time, interests, availability, how they want to contribute
              </p>
            </div>
            <div className="p-6 bg-background rounded-2xl">
              <div className="text-3xl font-serif text-primary mb-4">2</div>
              <p className="text-foreground">
                BeThere builds a simple interest profile
              </p>
            </div>
            <div className="p-6 bg-background rounded-2xl">
              <div className="text-3xl font-serif text-primary mb-4">3</div>
              <p className="text-foreground">
                We match them to real opportunities at their school — including smaller, more manageable ways to help
              </p>
            </div>
            <div className="p-6 bg-background rounded-2xl">
              <div className="text-3xl font-serif text-primary mb-4">4</div>
              <p className="text-foreground">
                Parents see options that actually feel doable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Different Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
            Not another sign-up sheet
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            This isn&apos;t another sign-up sheet.
          </p>
          <p className="text-muted-foreground mb-2">It&apos;s a shift from:</p>
          <p className="text-lg text-foreground mb-6">&quot;We need volunteers&quot;</p>
          <p className="text-muted-foreground mb-2">to:</p>
          <p className="text-lg text-primary font-medium">&quot;Here&apos;s where you&apos;d be a great fit&quot;</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                For PTOs
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>Reach more parents — not just the usual volunteers</li>
                <li>Break big roles into smaller, approachable tasks</li>
                <li>Match people to opportunities they&apos;re more likely to say yes to</li>
                <li>Reduce burnout and spread the load</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
                For Parents
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>See ways to help that fit your schedule</li>
                <li>Find opportunities aligned with what you enjoy</li>
                <li>Contribute in small, realistic ways</li>
                <li>Feel more connected to your school community</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Where We're Starting Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
            Where we&apos;re starting
          </h2>
          <p className="text-lg text-muted-foreground">
            We&apos;re currently piloting this with real opportunities at Forest Hills Elementary.
          </p>
          <p className="text-muted-foreground mt-4">
            This is an early version — and we&apos;re learning quickly from real parent feedback.
          </p>
        </div>
      </section>

      {/* Founder Note Section */}
      <section className="px-6 py-16 md:py-20 bg-card">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
            Why I built this
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I&apos;m a parent at Forest Hills and part of the PTO, and I kept seeing the same pattern — the same small group of parents doing everything, while a lot of others wanted to help but weren&apos;t sure how.
            </p>
            <p>
              At the same time, I know how busy life is. Between work, kids, and everything else, it&apos;s hard to commit to something that feels big or unclear.
            </p>
            <p>
              This started as a simple idea: What if we made it easier for parents to find small, realistic ways to contribute — based on what they actually have time for?
            </p>
            <p className="text-foreground">
              This is an early version, but I&apos;m excited about what it could become.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mb-6 text-balance">
            Every school has more parents who want to help than it realizes.
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            BeThere is about making it easier for them to show up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full gap-2">
              <Link href="/">
                Try it now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <a
              href="mailto:hello@bethere.community"
              className="text-primary hover:text-primary/80 underline underline-offset-4 text-sm"
            >
              Contact us
            </a>
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
