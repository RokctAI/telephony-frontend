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
// No logo image: the home SDK declares the header logo (Ray, 2026-09-09,
// 14:15Z) and no telephony artwork exists in any source, so the header must
// draw none. base_sdk 1.20.0's HeaderMenu carries no field for that yet.
// TODO base 1.21.0: brand.logo "none" - when base_sdk 1.21.0's `brand`
// declaration lands on the header-menu registry, add `brand: { logo: "none" }`
// here and raise the manifest's base_sdk floor to 1.21.0.

import type { HeaderMenu } from "@/components/custom/landing/header-menu";

const TELEPHONY_HEADER_MENU: HeaderMenu = {
  anchors: ["features", "pricing"],
};

export default TELEPHONY_HEADER_MENU;
