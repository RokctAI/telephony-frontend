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

// The telephony storefront's hero copy, for base_sdk's hero-copy registry
// (components/custom/landing/hero-copy.ts, base_sdk >= 1.6.0): this
// product's words laid over HERO_CONFIG field by field, as
// hosting-hero-copy.ts does for the hosting shell.
//
// Every phrase is lifted from the Telephony plan fixtures
// (telephony/frappe/src/fixtures/Subscription_Plan/*.json): the headline
// cycles the three things the plans' feature lines are about - SIP lines
// ("1 Dedicated SIP Line" / "Multi-line SIP Support"), call routing ("IVR &
// Call Routing" / "Priority Voice Routing") and call history ("Call History
// (7 Days)" / "Call History & Analytics") - and the trust line states the
// facts all four plans share (billing_cycle Monthly or Yearly, currency
// USD) plus the one that tells the tiers apart (is_free_plan on Free,
// trial_period_days 14 on Pro). No user counts, no adoption claims: the
// sources carry none.
//
// The hero frame renders "<text> <verb> <suffix>"; the suffix carries the
// connective, so each word's verb is empty. There is no input on this hero
// (telephony-hero-form.tsx renders two calls to action instead), so the
// placeholders are empty and the rokctapp store badges are turned off.

import type { HeroCopy } from "@/components/custom/landing/hero-copy";

const TELEPHONY_HERO_COPY: HeroCopy = {
  headlineWords: [
    { text: "SIP lines", verb: "" },
    { text: "Call routing", verb: "" },
    { text: "Call history", verb: "" },
  ],
  headlineSuffix: "on one telephony plan",
  // No input on this hero (telephony-hero-form.tsx), so nothing to type into it.
  placeholders: [],
  backgroundImage: "",
  // Rendered by telephony-hero-form.tsx under its calls to action.
  trustLine: ["A free plan and a 14-day Pro trial", "Billed monthly or yearly in USD"],
  // No store badges: the product is bought on this page, not in a store.
  badges: [],
};

export default TELEPHONY_HERO_COPY;
