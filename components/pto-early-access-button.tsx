"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { InterestForm } from "@/components/interest-form"
import { analytics } from "@/lib/analytics"

interface PTOEarlyAccessButtonProps {
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function PTOEarlyAccessButton({ size = "lg", className = "px-8 py-6 text-lg rounded-full gap-2" }: PTOEarlyAccessButtonProps) {
  // Analytics: Track CTA click when the button is clicked
  const handleClick = () => {
    analytics.ptoEarlyAccessCtaClicked()
  }

  return (
    <InterestForm
      isPtoForm={true}
      trigger={
        <Button size={size} className={className} onClick={handleClick}>
          Request early access
          <ArrowRight className="w-5 h-5" />
        </Button>
      }
    />
  )
}
