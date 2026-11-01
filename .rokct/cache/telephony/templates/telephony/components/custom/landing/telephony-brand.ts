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

// The product's name, in ONE place: "Rokct Telecom", the name Ray chose
// (2026-11-01) in place of the concept's "Rokct Telephony". Change
// TELEPHONY_SITE_NAME and every place the name is drawn follows: the
// landing's header wordmark and its aria-label, the footer's
// `© <year> <name> · Built with ♥ by ROKCT` line, the `/` page <title> and
// the site metadata (telephony-site-metadata.ts) the host layout and the
// link-preview cards read.

/** The product's name, as Ray chose it. */
export const TELEPHONY_SITE_NAME = "Rokct Telecom";

/**
 * The header wordmark's two halves: the name up to its last space in the
 * display face, the rest as the quieter suffix ("Rokct" + "Telecom"). A
 * one-word name is drawn whole, with no suffix.
 */
export function telephonyWordmark(name: string = TELEPHONY_SITE_NAME): { stem: string; suffix: string } {
  const trimmed = name.trim();
  const cut = trimmed.lastIndexOf(" ");
  if (cut <= 0) return { stem: trimmed, suffix: "" };
  return { stem: trimmed.slice(0, cut), suffix: trimmed.slice(cut + 1) };
}
