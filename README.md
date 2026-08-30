# BeThere

**Status: finished. BeThere shipped — as part of [Roost](https://roost.directory).**

This repository is the original BeThere prototype, kept online at
[bethere.community](https://www.bethere.community) as a record of where the idea
started. The product it became lives at [roost.directory](https://roost.directory).

---

## The problem it was built to test

> A small group of parents carry most of the load — while many others want to help,
> but don't have a clear way to do it.

Every PTO knows this. The usual response is a sign-up sheet and a guilt-tinged
newsletter, which reaches the same twenty people who already volunteer. The
hypothesis behind BeThere was that the barrier is not willingness, it is **matching**:
parents don't know which of the fifty things a PTO needs is the one that fits their
Tuesday afternoon and the fact that they're good at spreadsheets.

So the question to test was narrow and answerable: *will a parent answer six questions
about their time and interests if the reward is a short list of things they could
actually say yes to?*

## Three stages

### 1. An idea — early 2026

Framed at Forest Hills Elementary (Lake Oswego SD, Oregon). Break big volunteer asks
into 30–60 minute chunks, tag them by skill, interest, grade and availability, then
match rather than broadcast. Give the PTO side a view of which gaps are still open
*before* the event rather than the morning of.

### 2. A working prototype — March 2026

**This repo.** Built in about two weeks (first commit 18 March 2026, last 31 March
2026 — 134 commits), largely through [v0](https://v0.app), then hand-corrected.

More than a mockup, less than a product:

- A six-question onboarding flow (`components/onboarding-flow.tsx`)
- A real matching endpoint scoring opportunities against a parent's answers
  (`app/api/matches/route.ts`, `lib/airtable.ts`)
- Opportunities stored in Airtable, so a PTO chair could edit them without a deploy
- Resend notifications on submission, PostHog on the funnel to see where people dropped
- A separate `/pto-leaders` view arguing the case to the people who'd have to run it

Stack: Next.js App Router, Tailwind v4, shadcn/ui, Airtable, Resend, PostHog, Vercel.

**What it proved:** the flow held. The interesting failure was that the hard part was
never the matching algorithm — it was that a PTO's committees, events, shifts and
people already exist somewhere else, and asking a chair to re-enter all of it into a
second system is where a tool like this dies.

Which pointed directly at the next stage.

### 3. A real product — June 2026 onward, inside Roost

[Roost](https://roost.directory) is a school directory and community platform already
holding the thing BeThere was missing: the families, the students, the committees, the
clubs, the events, and the permissions governing who may see whom.

BeThere was rebuilt there rather than beside it:

| | |
|---|---|
| **Jun 2026** | Design reconciled with Roost's existing Clubs & Committees model (#994), and the shifts / time-slots / publish→match→message loop specified (#1002) |
| **Jun 2026** | Events, shifts and templates backend landed behind a `bethere` feature flag (#1003); count-pool event jobs followed (#1021) |
| **Jul 2026** | Chair-curated match notifications — notify a matched parent once per opportunity, not once per reminder (#1034) |
| **Aug 2026** | Schools own their own event templates (#1407); public sign-up links so a helper without an account can take a shift |

It runs in production today across four organizations and several thousand families,
with the matching fed by a directory that was already accurate — the problem the
prototype couldn't solve on its own.

## What's still running here

The prototype is live and functional. The onboarding flow, matching and success screens
all work against the Airtable base. It is a snapshot, not a maintained product: it gets
no new features, and the real version is at
[app.roost.directory/demo](https://app.roost.directory/demo).

## Running it locally

```bash
pnpm install
pnpm dev
```

Environment variables (see `lib/airtable.ts`, `lib/posthog.ts`, `app/api/survey-submit/route.ts`):

| Variable | Purpose |
|---|---|
| `AIRTABLE_TOKEN` | Read opportunities, write interest + survey rows |
| `AIRTABLE_BASE_ID` | The Airtable base |
| `RESEND_API_KEY` | Submission notification email |
| `NEXT_PUBLIC_POSTHOG_KEY` | Funnel analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host |

Without them the app builds and renders; the opportunity list comes back empty.

## Why keep it up

Two reasons. It is the honest version of how the feature was arrived at — an idea, a
throwaway thing built fast to see whether anyone would use it, and only then a product.
And bethere.community still gets traffic from people who heard the name, so it should
point somewhere useful.

---

Built by Jeremy Myrland. Roost is a product of Holdfast Community LLC.
