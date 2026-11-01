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

// The telephony storefront's header menu, for base_sdk's header-menu registry
// (components/custom/landing/header-menu.ts, base_sdk >= 1.14.0), which the
// shared header renders inside itself: inline beside the logo from the `lg`
// breakpoint up, behind a burger below it.
//
// Flat entries only, as hosting-header-menu.ts. The two are ANCHORS, not
// links: telephony-features-section.tsx and telephony-pricing-section.tsx
// register their own `{ id, label }` in meta.nav, base resolves each id
// against the page's live nav, lifts the label from there, and drops the
// entry on a render where the section is not on the page (the pricing
// section turns itself down when the platform returns no plan rows), which
// a hand-written "#pricing" href could not do. No groups: a storefront for
// one product has no product panel. No `actions`: the header already draws
// Log in and Sign up beside the row (components/custom/header.tsx, the auth
// link and the auth pill), and a second pair would only repeat them.
//
// `brand: { logo: "auto" }` (base_sdk >= 1.21.0's HeaderMenu.brand): the
// home SDK declares whether the header shows a logo (Ray, 2026-09-09,
// 14:15Z). Since 1.4.0 there is telephony artwork - the Rokct Telecom mark
// Ray chose on 2026-11-01 - registered as the `icon` in
// telephony-site-metadata.ts, and "auto" draws that registered icon beside
// the wordmark (the host's branding.tsx) on base's header at /landing.
// Until 1.3.x the logo was "none": no artwork existed, so the wordmark was
// drawn alone. `wordmark` is left at its default, true. Against a base_sdk
// older than 1.21.0 the field is unknown to the registry's HeaderMenu type
// and the compose fails to type-check, which is the floor the manifest
// names.

import type { HeaderMenu } from "@/components/custom/landing/header-menu";

const TELEPHONY_HEADER_MENU: HeaderMenu = {
  // The registered Rokct Telecom mark beside the wordmark (1.4.0).
  brand: { logo: "auto" },
  anchors: ["features", "pricing"],
};

export default TELEPHONY_HEADER_MENU;
