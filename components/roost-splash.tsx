import { ArrowRight } from "lucide-react"

/**
 * The milestone banner. BeThere started here as a prototype and now ships
 * inside Roost, so this is the first thing the page says.
 *
 * The palette is the site's own, inverted: the navy that is normally body
 * text becomes the ground, and the orange that is normally a button becomes
 * the only accent. Nothing foreign is imported — it reads as the same brand,
 * one chapter later.
 */

const ARC = [
  {
    when: "March 2026",
    what: "An idea",
    detail:
      "A small group of parents carries most of the load. Everyone else wants to help and has no clear way in.",
  },
  {
    when: "March 2026",
    what: "A working prototype",
    detail:
      "Two weeks, a survey, and a matching engine on top of a spreadsheet. Enough to prove parents would answer six questions.",
  },
  {
    when: "Live in Roost",
    what: "A real product",
    detail:
      "Committees, events, shifts, sign-ups and match notifications — running in schools with thousands of families.",
    now: true,
  },
]

export function RoostSplash() {
  return (
    <section className="relative overflow-hidden bg-[#111C33] px-6 py-20 md:py-28">
      {/* Warm glow, same gesture as the original hero, other direction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(245,165,36,0.16), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5A524]">
          BeThere has a new home
        </p>

        <h2 className="mt-5 font-serif text-4xl leading-tight text-balance text-[#F4F7FD] md:text-5xl">
          Everything BeThere promised is now built into Roost
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-[#A9BEDD]">
          The volunteer matching you see below is no longer a demo. It is a
          shipped part of Roost, alongside the school directory, committees,
          events and sign-ups &mdash; one login, for the whole school.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://roost.directory"
            className="inline-flex items-center gap-2 rounded-full bg-[#F5A524] px-8 py-4 text-lg font-medium text-[#111C33] transition-colors hover:bg-[#FFB944] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5A524]"
          >
            Visit Roost
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="https://app.roost.directory/demo"
            className="inline-flex items-center gap-2 rounded-full border border-[#3B5480] px-8 py-4 text-lg font-medium text-[#DCE6F7] transition-colors hover:border-[#F5A524] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5A524]"
          >
            See the live demo
          </a>
        </div>
      </div>

      {/* The arc. Ordered because it genuinely is a sequence. */}
      <ol className="relative z-10 mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
        {ARC.map((step, i) => (
          <li
            key={step.what}
            className={`rounded-2xl border p-6 text-left ${
              step.now
                ? "border-[#F5A524]/50 bg-[#F5A524]/10"
                : "border-[#2A3C5E] bg-white/[0.04]"
            }`}
          >
            <div className="flex items-baseline gap-3">
              <span
                className={`font-serif text-2xl ${
                  step.now ? "text-[#F5A524]" : "text-[#5D77A6]"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8FA3C4]">
                {step.when}
              </span>
            </div>
            <h3
              className={`mt-3 text-lg font-medium ${
                step.now ? "text-[#FFD79A]" : "text-[#E4ECFA]"
              }`}
            >
              {step.what}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#9CB2D4]">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
