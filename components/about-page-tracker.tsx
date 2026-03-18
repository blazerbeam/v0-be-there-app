"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

export function AboutPageTracker() {
  useEffect(() => {
    // Analytics: Track about page view on mount
    analytics.aboutPageViewed()
  }, [])

  return null
}
