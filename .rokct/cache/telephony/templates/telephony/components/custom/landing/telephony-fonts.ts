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

// The landing's three faces, as the concept sets them: Gabarito for the
// display type, Geist for running text, Geist Mono for labels and figures.
// All three are SIL OFL fonts served through next/font/google, so the shell
// self-hosts them at build time and the page loads nothing from Google at
// run time. They arrive in telephony-landing.css as --font-tel-display,
// --font-tel-body and --font-tel-mono on the landing's root.

import { Gabarito, Geist, Geist_Mono } from "next/font/google";

export const telephonyDisplay = Gabarito({
  subsets: ["latin"],
  variable: "--font-tel-display",
  display: "swap",
});

export const telephonyBody = Geist({
  subsets: ["latin"],
  variable: "--font-tel-body",
  display: "swap",
});

export const telephonyMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-tel-mono",
  display: "swap",
});

export const telephonyFontClassName = [telephonyDisplay.variable, telephonyBody.variable, telephonyMono.variable].join(" ");
