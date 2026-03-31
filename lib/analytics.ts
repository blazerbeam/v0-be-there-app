import { posthog } from "@/lib/posthog"

export const analytics = {
  homepageParentCtaClicked: () => {
    posthog.capture("homepage_parent_cta_clicked")
  },
  onboardingStepCompleted: (step: number, stepName: string) => {
    posthog.capture("onboarding_step_completed", { step, stepName })
  },
  recommendationsViewed: (matchCount: number, hasStrongMatches: boolean) => {
    posthog.capture("recommendations_viewed", { matchCount, hasStrongMatches })
  },
  opportunityClicked: (opportunityId: string, opportunityTitle: string, isSelected: boolean) => {
    posthog.capture("opportunity_clicked", {
      opportunityId,
      opportunityTitle,
      action: isSelected ? "deselected" : "selected",
    })
  },
  contactSubmitted: (selectedCount: number) => {
    posthog.capture("contact_submitted", { selectedCount })
  },
  homepagePtoLinkClicked: () => {
    posthog.capture("homepage_pto_link_clicked")
  },
  aboutPageViewed: () => {
    posthog.capture("about_page_viewed")
  },
  ptoPageViewed: () => {
    posthog.capture("pto_page_viewed")
  },
  feedbackLinkClicked: () => {
    posthog.capture("feedback_link_clicked")
  },
  ptoEarlyAccessCtaClicked: () => {
    posthog.capture("pto_early_access_cta_clicked")
  },
  ptoEarlyAccessFormSubmitted: () => {
    posthog.capture("pto_early_access_form_submitted")
  },
  interestFormSubmitted: () => {
    posthog.capture("interest_form_submitted")
  },
}
