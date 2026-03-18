"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle2 } from "lucide-react"

interface InterestFormProps {
  trigger: React.ReactNode
}

type FormState = "form" | "success" | "error"

export function InterestForm({ trigger }: InterestFormProps) {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    isPtoMember: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrorMessage("")
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      school: "",
      isPtoMember: false,
    })
    setFormState("form")
    setErrorMessage("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when dialog closes
      setTimeout(resetForm, 200)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Submission failed")
      }

      setFormState("success")
    } catch (err) {
      console.error("Submit error:", err)
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
      setFormState("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.email && formData.school && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {formState === "success" ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <DialogTitle className="font-serif text-2xl mb-2">
              Thanks for your interest
            </DialogTitle>
            <DialogDescription className="text-base">
              We&apos;ve recorded your interest. We&apos;ll be in touch soon.
            </DialogDescription>
            <Button
              onClick={() => handleOpenChange(false)}
              className="mt-6 rounded-xl"
            >
              Close
            </Button>

            {/* Feedback prompt */}
            <div className="mt-6 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Have 1 minute? Help us improve this early version.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfxqOuCkBYnwl8TjMCdzbqNvsKhOPn3pu-2G1H4owIc8AsbZg/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Share feedback
              </a>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                Show your interest
              </DialogTitle>
              <DialogDescription>
                Let us know you&apos;re interested in bringing BeThere to your school.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1.5 h-11 rounded-xl bg-card border-border"
                />
              </div>

              <div>
                <Label htmlFor="interest-email" className="text-foreground">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="interest-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1.5 h-11 rounded-xl bg-card border-border"
                />
              </div>

              <div>
                <Label htmlFor="school" className="text-foreground">
                  School <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="school"
                  type="text"
                  placeholder="Your school name"
                  required
                  value={formData.school}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  className="mt-1.5 h-11 rounded-xl bg-card border-border"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="pto-member"
                  checked={formData.isPtoMember}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPtoMember", checked === true)
                  }
                />
                <Label
                  htmlFor="pto-member"
                  className="text-sm text-foreground cursor-pointer"
                >
                  I&apos;m a PTO/PTA member
                </Label>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full h-11 text-base rounded-xl mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
