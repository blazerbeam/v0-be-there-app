import { track } from "@vercel/analytics"

export const analytics = {
  homepageParentCtaClicked: () => {
    track("homepage_parent_cta_clicked")
  },
  onboardingStepCompleted: (step: number, stepName: string) => {
    track("onboarding_step_completed", { step, stepName })
  },
  recommendationsViewed: (matchCount: number, hasStrongMatches: boolean) => {
    track("recommendations_viewed", { matchCount, hasStrongMatches })
  },
  opportunityClicked: (opportunityId: string, opportunityTitle: string, isSelected: boolean) => {
    track("opportunity_clicked", {
      opportunityId,
      opportunityTitle,
      action: isSelected ? "deselected" : "selected",
    })
  },
  contactSubmitted: (selectedCount: number) => {
    track("contact_submitted", { selectedCount })
  },
  homepagePtoLinkClicked: () => {
    track("homepage_pto_link_clicked")
  },
  aboutPageViewed: () => {
    track("about_page_viewed")
  },
  ptoPageViewed: () => {
    track("pto_page_viewed")
  },
  feedbackLinkClicked: () => {
    track("feedback_link_clicked")
  },
  ptoEarlyAccessCtaClicked: () => {
    track("pto_early_access_cta_clicked")
  },
  ptoEarlyAccessFormSubmitted: () => {
    track("pto_early_access_form_submitted")
  },
  interestFormSubmitted: () => {
    track("interest_form_submitted")
  },
}
