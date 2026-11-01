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

"use client";

// The telephony storefront's hero body, for base_sdk's hero-form registry
// (components/custom/landing/hero-form.ts, base_sdk >= 1.7.0). The base
// hero is a frame whose body the home SDK injects (Ray, 2026-09-08); with
// nothing registered it renders no call to action at all, and the trust
// line it carries is only drawn beside store badges this product has none
// of. So, as hosting-hero-form.tsx and lms-hero-form.tsx do, this body is
// two calls to action and no input: the sign-up the header also carries,
// and the pricing section on this page.
//
// The primary label is the control site's own telephony sign-up heading
// (control/templates/pages/telephony_signup.html: "Subscribe to a Telephony
// Plan"); the secondary is hosting-hero-form.tsx's. The two buttons route
// through the shell's theme tokens (bg-primary / text-primary-foreground
// and the border token), never a literal colour, so the storefront wears
// whatever primary the host sets.
//
// 1.1.2: the secondary call to action is an in-page anchor, and the pricing
// section is not always on the page - it turns itself down when there are
// no plans to price. So it is drawn from `nav` (base_sdk >= 1.48.0), the
// page's live section list, rather than the hero offering a button that
// scrolls nowhere. The primary is a route and is always drawn.

import React from "react";
import Link from "next/link";

import type { HeroFormProps } from "@/components/custom/landing/hero-form";

const PRICING_SECTION_ID = "pricing";
const PRICING_ANCHOR = `#${PRICING_SECTION_ID}`;

export default function TelephonyHeroForm({
  hero,
  signupUrl,
  nav,
}: HeroFormProps) {
  // `nav` absent (a host older than base_sdk 1.48.0) keeps the button, as before.
  const hasPricing = nav
    ? nav.some((item) => item.id === PRICING_SECTION_ID)
    : true;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
        <Link
          href={signupUrl}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
        >
          Subscribe to a Telephony Plan
        </Link>
        {hasPricing && (
          <a
            href={PRICING_ANCHOR}
            className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 px-8 py-3 text-base font-semibold text-zinc-900 transition-colors hover:border-primary hover:text-primary dark:border-zinc-700 dark:text-white sm:w-auto"
          >
            See pricing
          </a>
        )}
      </div>

      {hero.trustLine.length > 0 && (
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {hero.trustLine.join(" · ")}
        </p>
      )}
    </div>
  );
}
