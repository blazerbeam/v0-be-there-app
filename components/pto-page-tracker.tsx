"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

export function PTOPageTracker() {
  useEffect(() => {
    // Analytics: Track PTO page view on mount
    analytics.ptoPageViewed()
  }, [])

  return null
}
