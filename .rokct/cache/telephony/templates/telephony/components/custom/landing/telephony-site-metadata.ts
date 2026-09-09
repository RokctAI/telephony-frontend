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

// The telephony storefront's site metadata, for base_sdk's site-metadata
// registry (components/custom/landing/site-metadata.ts, base_sdk >= 1.15.0):
// the <title>, description and social-card facts the host layout, the
// landing page and the generated Open Graph / Twitter image read from ONE
// registered module.
//
// The shape is written out here rather than imported from base's file, as
// hosting-site-metadata.ts, lms-site-metadata.ts and agent-site-metadata.ts
// do: an `import type` of a module that is not on disk is a compile error,
// and the registry checks the default export structurally when it loads
// this module.
//
// No `icon`: the SDK ships no icon file, so base_sdk >= 1.17.0 draws the
// fallback favicon (the domain's first letter) itself. No `still`, no `logo`,
// no `ogImage`: there is no telephony artwork in the sources, and base's
// generated card draws the tagline on its own. No `url`: the storefront's
// host is not fixed in any source yet; base falls back to the shell's
// NEXT_PUBLIC_SITE_URL. Every claim in the description is a plan fixture
// fact (telephony/frappe/src/fixtures/Subscription_Plan/*.json: plan_name
// Free/Pro, billing_cycle Monthly/Yearly, currency USD, the feature lines,
// trial_period_days 14 on Pro).
//
// PLACEHOLDER: "Rokct Telephony" is not a product name any source carries -
// no telephony source names the product (the fixtures say "Telephony Free"
// / "Telephony Pro", control's sign-up page "a Telephony Plan"). It is the
// same "<platform> <category>" stand-in hosting-site-metadata.ts uses
// ("Rokct Hosting"), flagged in the 1.1.0 PR body; replace `siteName` and
// the `title` prefix when Ray names the product.

/** The subset of base_sdk >= 1.15.0's SiteMetadataCopy this module fills. */
export interface TelephonySiteMetadata {
  title: string;
  description: string;
  tagline: string;
  siteName?: string;
  url?: string;
  keywords?: string[];
  /** A ready-made png/jpg preview; none here, base generates one. */
  ogImage?: string;
  /** Asset path drawn into the generated preview image; none here. */
  logo?: string;
  locale?: string;
}

const TELEPHONY_SITE_METADATA: TelephonySiteMetadata = {
  // Placeholder product name - see the header comment.
  siteName: "Rokct Telephony",
  title: "Rokct Telephony — SIP lines, call routing, call history",
  tagline: "SIP lines, call routing and call history on one telephony plan",
  description:
    "Telephony plans from Rokct: Free and Pro, billed monthly or yearly in USD, from one dedicated SIP line with 7 days of call history to multi-line SIP support with IVR and call routing, call history and analytics, and a 14-day trial on Pro.",
  // Fixture feature lines and the plan category, plus the platform name.
  keywords: ["telephony", "SIP line", "call routing", "call history", "IVR", "Rokct"],
  locale: "en_ZA",
};

export default TELEPHONY_SITE_METADATA;
