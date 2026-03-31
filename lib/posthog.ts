import posthog from "posthog-js"
const POSTHOG_API_KEY = "phc_mNJYmiCv8iKv8hrkPN3N6BgmqyUreRtAChEHUCzgpBNJ"
export function initPostHog() {
  if (typeof window === "undefined") return
  if (posthog.__loaded) return
  posthog.init(POSTHOG_API_KEY, {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always",
    capture_pageview: true,
    capture_pageleave: true,
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.opt_out_capturing()
    },
  })
}
export { posthog }
