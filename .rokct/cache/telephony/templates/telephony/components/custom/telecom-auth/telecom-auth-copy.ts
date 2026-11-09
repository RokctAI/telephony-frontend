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

// telephony_sdk 1.5.0: the words beside the auth card (../site-shell.tsx).
// Every claim is the landing's own (telephony-landing-config.ts): the plan
// prices and the free on-net calls. The card's own words stay auth_sdk's.

export interface TelecomAuthPanel {
  kicker: string;
  title: string[];
  lede: string;
}

export const TELECOM_AUTH_COPY = {
  sideLabel: "About Rokct Telecom",
  login: {
    kicker: "Rokct Telecom · Log in",
    title: ["Welcome", "back."],
    lede: "Log in to your Rokct Telecom account to carry on.",
  },
  register: {
    kicker: "Rokct Telecom · New account",
    title: ["Your landline number,", "on your phone."],
    lede: "Create a Rokct Telecom account to get started.",
  },
  forgot: {
    kicker: "Rokct Telecom · Account help",
    title: ["Lost your", "password?"],
    lede: "Password reset is not self-service yet. Get in touch from our home page and we will help you back in.",
  },
  points: [
    "Starter from R0 a month, plus R50 once-off for your number",
    "Pro at R185 per line a month, with R185 of airtime",
    "Free, unlimited calls on our network on every plan",
  ],
} as const;

/** The panel for the auth page at `pathname` (login when unknown). */
export function telecomAuthPanel(pathname: string | null): TelecomAuthPanel {
  const p = pathname ?? "";
  const c = p.startsWith("/register") ? TELECOM_AUTH_COPY.register : p.startsWith("/forgot") ? TELECOM_AUTH_COPY.forgot : TELECOM_AUTH_COPY.login;
  return { kicker: c.kicker, title: [...c.title], lede: c.lede };
}
