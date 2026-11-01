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

// The Rokct Telecom logo (1.4.0, Ray, 2026-11-01): the mark - a teal
// rounded tile with a white "rt" - and the wordmark "Rokct **Telecom**"
// (the stem regular, the suffix bold). One component for the header and the
// footer, so the two never drift. Server-safe: no
// hooks, so telephony-landing.tsx (server) and telephony-landing.client.tsx
// (client) both render it.
//
// The mark's geometry is the chosen artwork's (app/icon.svg draws the same
// paths for the favicon). The tile is the brand teal in light AND dark
// (--mark-tile in telephony-landing.css, which also rings it in dark so it
// lifts off the near-black page); the wordmark follows the theme's --ink.
// The link always goes to "/" (Ray's rule for every shell's logo).

import Link from "next/link";

import { TELEPHONY_SITE_NAME, telephonyWordmark } from "./telephony-brand";

/** The mark alone: the teal tile and the white "rt". Decorative; the link carries the name. */
export function TelephonyMark({ className = "mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="var(--mark-tile)" />
      <g fill="none" stroke="var(--mark-ink)" strokeWidth="7" strokeLinecap="butt" strokeLinejoin="miter">
        <path d="M17.75 48V39A8.5 8.5 0 0 1 26.25 30.5H49.75" />
        <path d="M37.75 16V38.5A6 6 0 0 0 43.75 44.5H48.25" />
      </g>
    </svg>
  );
}

/**
 * The mark and the wordmark, linked to "/". `stem`/`suffix` default to
 * telephonyWordmark(siteName) ("Rokct" + "Telecom").
 */
export function TelephonyLogo({
  siteName = TELEPHONY_SITE_NAME,
  stem,
  suffix,
  className = "brand",
}: {
  siteName?: string;
  stem?: string;
  suffix?: string;
  className?: string;
}) {
  const split = telephonyWordmark(siteName);
  const head = stem ?? split.stem;
  const tail = suffix ?? split.suffix;
  return (
    <Link href="/" className={className} aria-label={`${siteName} home`}>
      <TelephonyMark />
      <span className="wordmark">
        {head}
        {tail && (
          <>
            {" "}
            <b>{tail}</b>
          </>
        )}
      </span>
    </Link>
  );
}
