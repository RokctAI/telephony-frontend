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

// telephony_sdk 1.5.0: the Rokct Telecom frame for auth_sdk's pages (login,
// register, forgot-password). Ray: every app shell gets its own design for
// register and login.
//
// auth_sdk >= 1.12.0 wraps those pages in SiteShell from this path and
// installs a generic default here. telephony_sdk is the telephony shell's
// home SDK, so the installer keeps this copy (the seam hosting_sdk 1.21.0
// and delivery_sdk use): the card sits inside the landing's own header,
// footer, faces and tokens (telephony-landing.css, telephony-fonts.ts),
// with a brand panel beside it. Presentation only: auth_sdk's views, actions
// and fields are untouched. The header's Log in / Sign up come from its
// HeaderAuthSlot, so the page's popup handlers are not needed here.

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import "@/components/custom/landing/telephony-landing.css";
import "@/components/custom/telecom-auth/telecom-auth.css";

import { SiteCredit } from "@/components/custom/site-credit";
import { LANDING_CONFIG } from "@/components/custom/landing/landing-config";
import { TELEPHONY_SITE_NAME, telephonyWordmark } from "@/components/custom/landing/telephony-brand";
import { telephonyFontClassName } from "@/components/custom/landing/telephony-fonts";
import { TELEPHONY_FOOTER_NAV } from "@/components/custom/landing/telephony-landing-config";
import { TelephonyHeader } from "@/components/custom/landing/telephony-landing.client";
import { TelephonyLogo, TelephonyMark } from "@/components/custom/landing/telephony-logo";
import { TELECOM_AUTH_COPY, telecomAuthPanel } from "@/components/custom/telecom-auth/telecom-auth-copy";

export interface SiteShellProps {
  children: ReactNode;
  /** Header "Log in" handler from the auth page; the Rokct Telecom header ignores it. */
  openLoginPopup?: () => void;
  /** Header "Sign up" handler from the auth page; the Rokct Telecom header ignores it. */
  openSignupPopup?: () => void;
}

export function SiteShell({ children }: SiteShellProps) {
  const panel = telecomAuthPanel(usePathname());
  const { stem, suffix } = telephonyWordmark(TELEPHONY_SITE_NAME);
  return (
    <div className={`tel ${telephonyFontClassName}`}>
      <TelephonyHeader
        siteName={TELEPHONY_SITE_NAME}
        stem={stem}
        suffix={suffix}
        loginUrl={LANDING_CONFIG.loginUrl}
        signupUrl={LANDING_CONFIG.signupUrl}
        base="/"
      />
      <main className="ta">
        <div className="wrap ta-g">
          <aside className="ta-side" aria-label={TELECOM_AUTH_COPY.sideLabel}>
            <span className="eyebrow">{panel.kicker}</span>
            <h2 className="ta-h">
              {panel.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="lede ta-lede">{panel.lede}</p>
            <ul className="ta-pts">
              {TELECOM_AUTH_COPY.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </aside>
          <div className="ta-card">{children}</div>
        </div>
      </main>
      <footer>
        <div className="wrap foot">
          <TelephonyLogo className="brand foot-brand" />
          <SiteCredit as="span" siteName={TELEPHONY_SITE_NAME} heartClassName="heart" />
          <nav>
            {TELEPHONY_FOOTER_NAV.map((item) => (
              <a key={item.href} href={`/${item.href}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

/** The mark above the auth card: the header's own teal "rt" tile. */
export function SiteShellLogo({ size = 56 }: { size?: number }) {
  return (
    <span className="ta-mark" style={{ width: size, height: size }} aria-hidden="true">
      <TelephonyMark className="mark" />
    </span>
  );
}
