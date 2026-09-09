/*
 * Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// The copy of the telephony storefront's two landing sections
// (components/custom/telephony-features-section.tsx and
// telephony-pricing-section.tsx), in one place the way
// hosting-page-sections.ts holds the hosting shell's. Every claim here is
// lifted from the Telephony plan seed records the Frappe half of this SDK
// carries (telephony/frappe/src/fixtures/Subscription_Plan/*.json - four
// plans: Free and Pro, each Monthly and Yearly; their Items under
// fixtures/Item/), from the control site's telephony sign-up page
// (control/templates/pages/telephony_signup.html: "Choose a plan that fits
// your needs. Pro plans are priced per line.") and from this SDK's own
// control-portal templates (templates/control/app/portal/telephony/*: the
// sign-up steps "Choose Your Number" / "Select an Area Code" / "Assigned
// Number (DID)", the top-up page's "Pay with Paystack", the subscription
// page's "SIP Credentials" and "Call History"). No figure, feature or
// support promise appears that a source does not state, and the live prices
// are never written here - the pricing section renders the rows the control
// site returns.
//
// The plan tiers are named in the FEATURES copy only because the fixtures
// name them; nothing here filters or looks plans up by name or id - the
// plans query (landing/telephony-plans-query.ts) selects by `plan_category`.

export interface TelephonyFeature {
  /** Stable key. */
  id: string;
  name: string;
  text: string;
}

export interface TelephonyPricingLabels {
  select: (plan: string) => string;
  trial: (days: number) => string;
  monthly: string;
  yearly: string;
  perMonth: string;
  perYear: string;
  /** Shown under the price of a plan whose row carries is_per_seat_plan. */
  perLine: string;
}

export interface TelephonyPageSectionsConfig {
  features: {
    heading: string;
    blurb: string;
    items: TelephonyFeature[];
  };
  pricing: {
    heading: string;
    blurb: string;
    labels: TelephonyPricingLabels;
  };
}

export const TELEPHONY_PAGE_SECTIONS: TelephonyPageSectionsConfig = {
  features: {
    // Heading as hosting-page-sections.ts words it; the blurb's facts:
    // fixtures (plan_name Free/Pro, billing_cycle Monthly/Yearly, currency
    // USD, is_per_seat_plan 1 on Pro) and telephony_signup.html ("Pro plans
    // are priced per line").
    heading: "What the plans include",
    blurb:
      "Two plans - Free and Pro - billed monthly or yearly in USD. Pro plans are priced per line.",
    items: [
      {
        // Free features[0] "1 Dedicated SIP Line"; Pro features[0]
        // "Multi-line SIP Support".
        id: "sip-lines",
        name: "SIP lines",
        text: "1 Dedicated SIP Line on Free; Multi-line SIP Support on Pro.",
      },
      {
        // Pro (Monthly and Yearly) features[1] "Unlimited Internal Calls".
        id: "internal-calls",
        name: "Unlimited Internal Calls",
        text: "Included with Telephony Pro.",
      },
      {
        // Pro Monthly features[3] "IVR & Call Routing"; Pro Yearly
        // features[3] "Priority Voice Routing".
        id: "routing",
        name: "Call routing",
        text: "IVR & Call Routing on Pro (Monthly); Priority Voice Routing on Pro (Yearly).",
      },
      {
        // Free features[2] "Call History (7 Days)"; Pro Monthly features[2]
        // "Call History & Analytics"; Pro Yearly features[2] "Advanced Call
        // Analytics".
        id: "call-history",
        name: "Call history and analytics",
        text: "Call History (7 Days) on Free; Call History & Analytics on Pro (Monthly), Advanced Call Analytics on Pro (Yearly).",
      },
      {
        // Free features[1] "Basic Web Portal Access".
        id: "portal",
        name: "Basic Web Portal Access",
        text: "Included with Telephony Free.",
      },
      {
        // This SDK's control-portal sign-up (templates/control/app/portal/
        // telephony/signup/page.tsx: "Step 3: Choose Your Number", "Select
        // an Area Code") and subscription page ("Assigned Number (DID)");
        // telephony/frappe/manifest.json: "signup path incl. DID assignment".
        id: "number",
        name: "Your own number",
        text: "Choose an area code at sign-up and a number (DID) is assigned to your subscription.",
      },
      {
        // This SDK's control-portal top-up page (templates/control/app/
        // portal/telephony/top-up/page.tsx: "Amount to Top Up", "Pay with
        // Paystack"); telephony/frappe/manifest.json: "the Paystack top-up
        // webhook".
        id: "top-up",
        name: "Top up with Paystack",
        text: "Add to your balance from the portal; payment is taken through Paystack.",
      },
      {
        // trial_period_days: 14 on both Pro plans, 0 on both Free plans;
        // is_free_plan: 1 on Free.
        id: "trial",
        name: "Free plan and a 14-day Pro trial",
        text: "The Free plan costs nothing; Telephony Pro starts with a 14-day trial period.",
      },
    ],
  },
  pricing: {
    heading: "Pricing",
    // Fixtures (plan tiers, billing_cycle, currency USD, is_per_seat_plan)
    // and telephony_signup.html ("Pro plans are priced per line").
    blurb: "Free and Pro, billed monthly or yearly. Pro plans are priced per line. Prices in USD.",
    labels: {
      select: (plan) => `Select ${plan}`,
      trial: (days) => `Start ${days}-day trial`,
      monthly: "Monthly",
      yearly: "Yearly",
      perMonth: "/ month",
      perYear: "/ year",
      // telephony_signup.html: "Pro plans are priced per line"; the
      // control-portal sign-up's "Number of Lines:" field.
      perLine: "per line",
    },
  },
};
