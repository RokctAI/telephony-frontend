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

// The page that serves `/` in a shell whose home SDK is telephony_sdk: the
// home SDK owns the root route (Ray, 2026-09-03: each home SDK holds its
// own landing page), as hosting_sdk's app/page.tsx does for the hosting
// shell. Since 1.2.0 it draws the telephony landing Ray approved on
// 2026-11-01 (components/custom/landing/telephony-landing.tsx) instead of
// redirecting to /landing. base_sdk's composed /landing (the control-site
// plans storefront this SDK's registry modules fill) and auth_sdk's /login
// and /register stay where they are. The page reads no session and no
// backend, so it is static.

import type { Metadata } from "next";

import { TELEPHONY_SITE_NAME } from "@/components/custom/landing/telephony-brand";
import { telephonyFontClassName } from "@/components/custom/landing/telephony-fonts";
import { TelephonyLanding } from "@/components/custom/landing/telephony-landing";
import { TELEPHONY_META } from "@/components/custom/landing/telephony-landing-config";

export const metadata: Metadata = {
  title: { absolute: TELEPHONY_SITE_NAME },
  description: TELEPHONY_META.description,
};

export default function Page() {
  return <TelephonyLanding fontClassName={telephonyFontClassName} />;
}
