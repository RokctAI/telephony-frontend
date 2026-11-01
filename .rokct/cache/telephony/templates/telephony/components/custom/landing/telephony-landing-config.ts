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

// Every word on the telephony landing at `/` (telephony-landing.tsx), in
// the order the page draws it - the file to edit to change what the page
// says, the way agent-landing-config.ts holds rokct.ai's. The look and the
// copy are the concept Ray approved on 2026-11-01 ("proceed"): a hosted
// business line for South African small businesses, priced in rand.
//
// The product's name is not written here: it is TELEPHONY_SITE_NAME in
// telephony-brand.ts. Prices are written into the copy as the concept words
// them; TELEPHONY_PRICES holds the same figures for the Pro line
// calculator, so a price change edits both (the tests pin that they agree).
//
// Plans (Ray): Starter R0 a month plus a once-off R50 that reserves the
// number, released after 3 months unused; Pro R185 per line a month,
// including R185 of airtime; Unlimited R699, locked and labelled "Soon".
// Every plan gets free, unlimited calls on our network. South Africa only.

import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiArrowLeftRightLine,
  RiBriefcase4Line,
  RiCalculatorLine,
  RiCalendarCheckLine,
  RiDashboard3Line,
  RiFileList3Line,
  RiGitBranchLine,
  RiHammerLine,
  RiHeartPulseLine,
  RiHistoryLine,
  RiLightbulbFlashLine,
  RiPaletteLine,
  RiPhoneLine,
  RiQrCodeLine,
  RiRestartLine,
  RiSimCard2Line,
  RiSmartphoneLine,
  RiStethoscopeLine,
  RiStore2Line,
  RiTeamLine,
  RiTruckLine,
  RiUserHeartLine,
  RiUserStarLine,
  RiWallet3Line,
} from "@remixicon/react";

/** The figures the copy states, in rand. */
export const TELEPHONY_PRICES = {
  currency: "R",
  starterMonthly: 0,
  starterReserveFee: 50,
  starterReleaseMonths: 3,
  proPerLine: 185,
  proAirtimePerLine: 185,
  unlimitedMonthly: 699,
} as const;

/** `R1,295`: the rand figure the calculator prints. */
export function formatRand(amount: number): string {
  return TELEPHONY_PRICES.currency + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** The Pro calculator's line: `R555 / month for 3 lines`. */
export function proTotalLine(lines: number): string {
  return `${formatRand(TELEPHONY_PRICES.proPerLine * lines)} / month for ${lines} line${lines > 1 ? "s" : ""}`;
}

/** The Pro calculator's bounds and where it starts. */
export const PRO_LINES = { min: 1, max: 50, initial: 3 } as const;

/** One in-page anchor of the header, the phone menu and the footer. */
export interface TelephonyAnchor {
  href: string;
  label: string;
}

export const TELEPHONY_NAV: TelephonyAnchor[] = [
  { href: "#flow", label: "How calls flow" },
  { href: "#setup", label: "Setup" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/** The footer's links (Log in is added by the page, from the shell's login route). */
export const TELEPHONY_FOOTER_NAV: TelephonyAnchor[] = [
  { href: "#flow", label: "How calls flow" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export const TELEPHONY_HEADER = {
  themeLabel: "Toggle light and dark",
  login: "Log in",
  start: "Get your number",
  menuLabel: "Menu",
  navLabel: "Primary",
} as const;

export const TELEPHONY_META = {
  description:
    "A local landline number in your area code that rings on your phone wherever you are. Hosted business phone lines for South African small businesses.",
} as const;

export const TELEPHONY_HERO = {
  eyebrow: "Hosted business phone lines",
  /** The headline before the highlighted word. */
  headline: "A landline number that rings ",
  highlight: "anywhere.",
  lede: "A normal landline only rings where it was installed, at home or in the office. You get a local landline number in your area code that customers trust, and it rings on your phone wherever you are. There is no PBX to install.",
  primary: "Get your number",
  secondary: "Talk to us",
  trust: ["Starter from R0 a month", "Free calls on our network"],
  phone: {
    label: "Incoming call",
    who: "New customer",
    via: ["Pressed 1 · Bookings", "Ringing Front desk"],
  },
} as const;

export interface TelephonyOutcome {
  icon: RemixiconComponentType;
  title: string;
  text: string;
}

export const TELEPHONY_OUTCOMES: TelephonyOutcome[] = [
  { icon: RiSimCard2Line, title: "A real landline number", text: "Choose an area code at sign-up. The number isn’t tied to one building." },
  { icon: RiSmartphoneLine, title: "Works on your phones", text: "Install Zoiper and scan the QR code from your portal. No desk phone needed." },
  { icon: RiGitBranchLine, title: "Calls reach the right person", text: "Callers press a number on the menu and that person’s phone rings." },
  { icon: RiArrowLeftRightLine, title: "Free calls on our network", text: "Unlimited on every plan, including calls between your own lines." },
];

/** One option of a business's example menu: what the caller presses, who it rings. */
export interface TelephonyMenuOption {
  label: string;
  person: string;
  icon: RemixiconComponentType;
}

export interface TelephonyBusiness {
  id: string;
  tab: string;
  icon: RemixiconComponentType;
  greeting: string;
  options: [TelephonyMenuOption, TelephonyMenuOption, TelephonyMenuOption];
}

export const TELEPHONY_FLOW = {
  eyebrow: "How a call flows",
  heading: "Where each call goes",
  blurb: "Choose a business type, then press 1, 2 or 3. The menu and call routing come with Pro.",
  tabsLabel: "Kind of business",
  steps: {
    incoming: { step: "1 · Call comes in", title: "A customer dials your business number", text: "One number for the whole business.", calling: "Calling", number: "Your business number" },
    menu: { step: "2 · The menu answers", badge: "Pro" },
    rings: { step: "3 · The right phone rings", text: "Each person answers on their own line.", ringing: "Ringing" },
    record: { step: "4 · On record", title: "Logged in your call history", text: "You can see it in your portal.", pressed: (key: number) => `pressed ${key}` },
  },
  note: "Example menu. You set the wording and who each option rings.",
  /** Milliseconds between the board's automatic key presses. */
  intervalMs: 4200,
} as const;

export const TELEPHONY_BUSINESSES: TelephonyBusiness[] = [
  {
    id: "clinic",
    tab: "Clinic",
    icon: RiHeartPulseLine,
    greeting: "Thanks for calling the practice. Press 1 for appointments, 2 for results, 3 for accounts.",
    options: [
      { label: "Appointments", person: "Reception", icon: RiUserHeartLine },
      { label: "Results", person: "Nurse", icon: RiStethoscopeLine },
      { label: "Accounts", person: "Practice manager", icon: RiBriefcase4Line },
    ],
  },
  {
    id: "shop",
    tab: "Shop",
    icon: RiStore2Line,
    greeting: "Thanks for calling. Press 1 for orders and stock, 2 for deliveries, 3 for returns.",
    options: [
      { label: "Orders & stock", person: "Shop floor", icon: RiStore2Line },
      { label: "Deliveries", person: "Dispatch", icon: RiTruckLine },
      { label: "Returns", person: "Store manager", icon: RiUserStarLine },
    ],
  },
  {
    id: "agency",
    tab: "Agency",
    icon: RiPaletteLine,
    greeting: "Hi there. Press 1 to start a new project, 2 if you’re a client, 3 for accounts.",
    options: [
      { label: "New project", person: "Founder", icon: RiLightbulbFlashLine },
      { label: "Existing client", person: "Account lead", icon: RiTeamLine },
      { label: "Accounts", person: "Finance", icon: RiCalculatorLine },
    ],
  },
  {
    id: "trades",
    tab: "Trades",
    icon: RiHammerLine,
    greeting: "Thanks for calling. Press 1 to book a call-out, 2 for quotes, 3 for the team on site.",
    options: [
      { label: "Book a call-out", person: "Dispatcher", icon: RiCalendarCheckLine },
      { label: "Quotes", person: "Estimator", icon: RiFileList3Line },
      { label: "On-site team", person: "Foreman", icon: RiHammerLine },
    ],
  },
];

export const TELEPHONY_SETUP = {
  eyebrow: "Setup",
  heading: "Set up in five steps",
  lede: "Sign up on the web, then each person scans a code on their phone.",
  steps: [
    { title: "Choose a plan", text: "Starter or Pro." },
    { title: "Your details", text: "Name, company, country and email." },
    { title: "Choose your number", text: "Pick an area code. We assign your number." },
    { title: "Confirm your lines", text: "Choose how many lines you need." },
    { title: "Scan and answer", text: "Scan the QR code in the Zoiper app on each phone." },
  ],
} as const;

/** A card of the features grid: `span` is its width on the six-column grid. */
export interface TelephonyFeature {
  icon: RemixiconComponentType;
  title: string;
  text: string;
  span: 2 | 3 | 4;
  pro?: boolean;
  /** The drawing under the text, if any. */
  visual?: "lines" | "free" | "history";
  /** The accent-filled lead card. */
  lead?: boolean;
}

export const TELEPHONY_FEATURES = {
  eyebrow: "Features",
  heading: "What’s included",
  proBadge: "Pro",
  lines: ["Line 1", "Line 2", "Line 3"],
  unlimited: "unlimited",
  history: [
    { label: "Inbound · Line 1", state: "answered", missed: false },
    { label: "Inbound · Line 2", state: "missed", missed: true },
  ],
  cards: [
    { icon: RiGitBranchLine, title: "Caller menu & call routing", text: "Callers hear a menu, for example “press 1 for bookings, 2 for accounts”, and go to the person who handles it.", span: 4, pro: true, lead: true },
    { icon: RiSimCard2Line, title: "Your own number", text: "Choose an area code at sign-up and we assign a number to your account.", span: 2 },
    { icon: RiPhoneLine, title: "A line for every person", text: "Starter has one line. Pro supports multiple lines, priced per line.", span: 3, pro: true, visual: "lines" },
    { icon: RiArrowLeftRightLine, title: "Free calls on our network", text: "Unlimited on every plan, including calls between your own lines.", span: 3, visual: "free" },
    { icon: RiHistoryLine, title: "Call history & analytics", text: "See who called and when, and call back anyone you missed. Starter keeps 7 days. Pro adds analytics.", span: 3, visual: "history" },
    { icon: RiQrCodeLine, title: "Set up by QR code", text: "Each line has a QR code in your portal. Scan it in the Zoiper app and the line sets itself up.", span: 3 },
    { icon: RiWallet3Line, title: "Top up with Paystack", text: "Top up your account balance from the portal.", span: 2 },
    { icon: RiDashboard3Line, title: "One web portal", text: "Your balance, lines, number and call history.", span: 2 },
    { icon: RiRestartLine, title: "Restart within 90 days", text: "If you cancel, you can restart the same subscription within 90 days.", span: 2 },
  ] as TelephonyFeature[],
} as const;

export const TELEPHONY_PORTAL = {
  eyebrow: "Customer portal",
  heading: "Manage your lines online",
  ticks: [
    "See your balance and top it up",
    "Your number and line details",
    "A Zoiper QR code for each line",
    "Call history for every subscription",
  ],
  sketchLabel: "Illustrative sketch of the customer portal",
  bar: "portal / telephony",
  balance: "Balance",
  topUp: "Top up with Paystack",
  subscription: "Subscription",
  plan: "Telephony Pro",
  lineDetails: "Line details",
  rows: [
    { label: "Number of lines", value: "3", live: false },
    { label: "Status", value: "Active", live: true },
  ],
  zoiper: "Zoiper softphone",
  zoiperText: "Scan with your Zoiper app to set up this line automatically.",
  note: "Sketch of the portal, not a screenshot.",
} as const;

export const TELEPHONY_MENUS = {
  eyebrow: "Example menus",
  heading: "Set up for how you work",
  items: [
    { icon: RiHeartPulseLine, title: "Clinics & practices", text: "Bookings to reception. Results to the nurse.", menu: ["Appointments", "Results", "Accounts"] },
    { icon: RiStore2Line, title: "Shops", text: "Stock questions to the shop floor. Deliveries to dispatch.", menu: ["Orders & stock", "Deliveries", "Returns"] },
    { icon: RiPaletteLine, title: "Agencies", text: "New work to the founder. Clients to their account lead.", menu: ["New project", "Existing client", "Accounts"] },
    { icon: RiHammerLine, title: "Trades", text: "Call-outs go to the dispatcher while the team is on site.", menu: ["Book a call-out", "Quotes", "On-site team"] },
  ],
} as const;

export interface TelephonyPlan {
  id: "starter" | "pro" | "unlimited";
  name: string;
  price: string;
  per: string;
  sub: string;
  features: string[];
  cta: string;
  locked?: boolean;
  badge?: string;
}

export const TELEPHONY_PRICING = {
  eyebrow: "Pricing",
  heading: "Monthly plans",
  network: "Every plan includes free, unlimited calls to numbers on our network.",
  stepperLabel: "How many lines?",
  fewer: "Fewer lines",
  more: "More lines",
  totalLabel: "Total:",
  plans: [
    {
      id: "starter",
      name: "Starter",
      price: "R0",
      per: "/ month",
      sub: "Plus a once-off R50 setup fee that reserves your number. If the number goes unused for 3 months, it is released.",
      features: ["1 line", "Free calls on our network", "Web portal access", "Call history, last 7 days"],
      cta: "Reserve your number",
    },
    {
      id: "pro",
      name: "Pro",
      price: "R185",
      per: "per line / month",
      sub: "Includes R185 of call airtime per line every month.",
      features: [
        "A line for every person",
        "R185 airtime per line, monthly",
        "Free calls on our network",
        "Call history & analytics",
        "Caller menu (IVR) & call routing",
      ],
      cta: "Choose Pro",
    },
    {
      id: "unlimited",
      name: "Unlimited",
      price: "R699",
      per: "/ month",
      sub: "Unlimited calls for one monthly price.",
      features: ["Unlimited calls", "Free calls on our network"],
      cta: "Not available yet",
      locked: true,
      badge: "Soon",
    },
  ] as TelephonyPlan[],
  talk: {
    lead: "Not sure how many lines you need?",
    text: " Tell us how you take calls and we’ll help you set it up.",
    cta: "Talk to us",
    /**
     * Where the talk box's "Talk to us" button goes. No source names a
     * contact channel for this product yet, so it is null and the button
     * is not drawn (a button that leads nowhere is worse than none). Set an
     * address (`mailto:`, `https://wa.me/...`, a route) to draw it.
     */
    href: null as string | null,
  },
} as const;

export const TELEPHONY_FAQ = {
  eyebrow: "FAQ",
  heading: "Common questions",
  items: [
    { q: "Is it a real landline number?", a: "Yes. You get a local landline number in your area code. A normal landline only rings where it’s installed. This one rings on your phone wherever you are." },
    { q: "Do I need to buy a phone system or desk phones?", a: "No. We host the system. Each person installs the Zoiper app on their phone or computer and scans the QR code from the portal to set up their line." },
    { q: "How do I get a business number?", a: "During sign-up you choose an area code from the ones available, and a number is assigned to your account." },
    { q: "What’s the difference between the plans?", a: "Starter is R0 a month with one line, portal access and seven days of call history. Pro is R185 per line a month and includes R185 of call airtime per line. It adds multiple lines, call analytics and a caller menu with call routing. Unlimited, at R699 a month for unlimited calls, is coming soon. Every plan includes free, unlimited calls to numbers on our network." },
    { q: "Why is there a R50 setup fee on Starter?", a: "The once-off R50 reserves your number for you. Numbers are limited, so a Starter number that goes unused for 3 months is released to someone else." },
    { q: "How do I pay?", a: "Plans are billed monthly. You can top up your account balance from the portal through Paystack." },
    { q: "What if I cancel and change my mind?", a: "You can restart a cancelled subscription within 90 days." },
  ],
} as const;

export const TELEPHONY_FINAL = {
  heading: "Get your business number today.",
  text: "Starter is R0 a month, plus R50 once-off to reserve your number.",
  primary: "Get your number",
  secondary: "Talk to us",
} as const;
