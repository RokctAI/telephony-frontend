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
// no `ogImage`: base's generated card draws the tagline on its own. No
// `url`: the storefront's host is not fixed in any source yet; base falls
// back to the shell's NEXT_PUBLIC_SITE_URL.
//
// 1.2.0: the words are the approved landing's (Ray, 2026-11-01): the
// description is the `/` page's own (TELEPHONY_META in
// telephony-landing-config.ts) and the tagline its headline, so a shared
// link says what the page says - a local landline number for South African
// small businesses - and no longer the plan fixtures' dollar Free/Pro facts.
//
// The product's name is TELEPHONY_SITE_NAME (telephony-brand.ts), a
// PLACEHOLDER (the concept's Rokct Telephony) until Ray names the product; change it
// there and the title, the site name and the landing follow.

import { TELEPHONY_SITE_NAME } from "@/components/custom/landing/telephony-brand";
import { TELEPHONY_META } from "@/components/custom/landing/telephony-landing-config";

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
  siteName: TELEPHONY_SITE_NAME,
  title: TELEPHONY_SITE_NAME,
  tagline: "A landline number that rings anywhere.",
  description: TELEPHONY_META.description,
  keywords: ["hosted business phone lines", "landline number", "call routing", "IVR", "South Africa"],
  locale: "en_ZA",
};

export default TELEPHONY_SITE_METADATA;
