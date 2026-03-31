import posthog from "posthog-js"

const POSTHOG_API_KEY = "phc_mNJYmiCv8iKv8hrkPN3N6BgmqyUreRtAChEHUCzgpBNJ"

export function initPostHog() {
  if (typeof window !== "undefined") {
    posthog.init(POSTHOG_API_KEY, {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    })
  }
}

export { posthog }
