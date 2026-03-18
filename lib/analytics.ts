import { track } from "@vercel/analytics"

/**
 * Analytics event names for BeThere
 * 
 * Parent-facing events:
 * - homepage_parent_cta_clicked: When parent clicks "See ways I can help" on homepage
 * - homepage_pto_link_clicked: When someone clicks the PTO link on homepage
 * - about_page_viewed: When About page is viewed
 * - pto_page_viewed: When PTO Leaders page is viewed
 * - recommendations_viewed: When matches/recommendations screen is shown
 * - feedback_link_clicked: When feedback link is clicked
 * - interest_form_submitted: When interest form is successfully submitted
 * 
 * PTO-facing events:
 * - pto_early_access_cta_clicked: When PTO leader clicks early access CTA
 * - pto_early_access_form_submitted: When PTO early access form is submitted
 */

export const analytics = {
  // Parent-facing events
  homepageParentCtaClicked: () => {
    track("homepage_parent_cta_clicked")
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

  recommendationsViewed: () => {
    track("recommendations_viewed")
  },

  feedbackLinkClicked: () => {
    track("feedback_link_clicked")
  },

  interestFormSubmitted: () => {
    track("interest_form_submitted")
  },

  // PTO-facing events
  ptoEarlyAccessCtaClicked: () => {
    track("pto_early_access_cta_clicked")
  },

  ptoEarlyAccessFormSubmitted: () => {
    track("pto_early_access_form_submitted")
  },
}
