# Changelog

## 1.5.0

* Rokct Telecom login and register (Ray: every app shell gets its own
  design for register and login; the pattern hosting_sdk 1.21.0 set for
  Cortex). The telephony block, the home SDK, installs its own
  `components/custom/site-shell.tsx` over auth_sdk's default: login,
  register and forgot-password sit inside the landing's header and footer,
  faces (Gabarito, Geist, Geist Mono) and tokens (cream and teal in light,
  near-black and bright teal in dark), with a brand panel beside the card
  (`components/custom/telecom-auth/`: its copy, which repeats only the
  landing's plan facts, and its CSS, which maps the card's shadcn tokens to
  the landing palette). The mark above the card is the teal "rt" tile.
* `TelephonyHeader` takes an optional `base` prefix for its in-page anchors,
  so on `/login` the nav links go to `/#features` and so on (default `""`,
  so `/` is unchanged).
* auth_sdk >= 1.12.0 is required for the seam (before 1.12.0 the auth pages
  ignore `site-shell.tsx`). telephony-frontend pins auth_sdk 1.11.0 and must
  refresh its lock to pick this up.
* Presentation only: auth_sdk's views, actions and fields are untouched.

## 1.4.0

The Rokct Telecom logo, as Ray chose it (2026-11-01): a teal `#0F7A6E`
rounded tile with a white "rt" mark, and the wordmark "Rokct **Telecom**"
with Telecom in bold. 1.3.0 is the header-auth change in hardware#69, which
merges first.

New installs (app_type telephony): `components/custom/landing/telephony-logo.tsx`,
`app/icon.svg`, `app/apple-icon.png` and `public/rokct-telecom-icon.png`.

* `telephony-logo.tsx` is the logo in one component: `TelephonyMark` (the
  tile and the "rt") and `TelephonyLogo` (the mark plus the wordmark,
  linked to `/`). It is server-safe, so the server-rendered footer and the
  client header both use it.
* The landing header and the footer draw `TelephonyLogo` in place of the
  concept's ink tile with call arcs. The link always goes to `/`. The open
  phone menu drops below the header bar, which already shows the logo, so
  the menu draws no second one.
* Light and dark: the tile stays the brand teal in both themes
  (`--mark-tile` in `telephony-landing.css`). In dark it gets a faint ring
  so it stands off the near-black page. The wordmark uses the theme's ink.
* Favicon and app icons: `app/icon.svg` (the mark) and `app/apple-icon.png`
  (180px, full-bleed teal, because iOS rounds the corners itself), which Next
  serves by file convention. `public/rokct-telecom-icon.png` (512px) is
  registered as `icon` in `telephony-site-metadata.ts`. That covers the case
  where base_sdk's on-disk check can't see the app icon files (its known
  standalone-build limitation), so the browser tab never falls back to the
  generated letter tile.
* `telephony-header-menu.ts` now sets `brand: { logo: "auto" }` instead of
  `"none"`, so base's header on `/landing` draws the registered mark next
  to the wordmark.
* Icons in the landing are still Remixicon only. The mark is brand artwork,
  not an icon.

## 1.3.0

* Log in and Sign up in the header come from the SDK that owns sign-in
  (Ray, 2026-11-01: "sites that have auth sdk i think they should get the
  login signup buttons in header", and "we just moving login and signup
  buttons to injection"). `TelephonyHeader` renders base_sdk 1.60.0's
  `HeaderAuthSlot` in `.nav-end` and in `#tel-mobile-menu` in place of its
  hard-coded "Log in" link: quiet `.login` links on the bar (hidden below
  the phone breakpoint, as Log in was) and plain rows in the phone menu.
  "Get your number" stays as it was. auth_sdk >= 1.11.0 fills the slot; a
  shell without it shows neither, and the footer's "Log in" shows only when
  something fills it (`hasHeaderAuth()`).
* `TelephonyHeader` takes `signupUrl` (the landing passes
  `LANDING_CONFIG.signupUrl`).
* `components/custom/header-auth-slot.tsx` and
  `components/custom/landing/header-auth.ts` join `requires`: needs
  base_sdk >= 1.60.0.

## 1.2.1

* The product is named "Rokct Telecom", Ray's choice (2026-11-01), in
  place of the concept's placeholder "Rokct Telephony".
  `TELEPHONY_SITE_NAME` in `telephony-brand.ts` is the only place the name
  is written, so the header wordmark ("Rokct" + "Telecom"), the `/` title,
  `telephony-site-metadata.ts` and the footer credit
  (`© 2026 Rokct Telecom · Built with ♥ by ROKCT`) all follow.
* The header, hero and closing buttons read "Get your number" instead of
  "Start free". Starter costs a once-off R50 to reserve the number, so
  "free" misled. This copy reached main with the 1.2.0 merge (#65) after
  that entry was written; 1.2.1 records it.

## 1.2.0

New installs (app_type telephony), all under `components/custom/landing/`:
`telephony-landing.tsx`, `telephony-landing.client.tsx`,
`telephony-landing-config.ts`, `telephony-brand.ts`, `telephony-fonts.ts`
and `telephony-landing.css`.

* `/` is the telephony landing Ray approved on 2026-11-01 ("proceed"),
  instead of a redirect to `/landing`. It follows the concept's look and
  copy: a hosted business line for South African small businesses, priced
  in rand. The page has a header with a light/dark switch and a phone
  menu, the hero with the ringing phone, four outcomes, a call-flow board
  (business tabs, menu keys, the phone that rings and the call log), five
  setup steps, what's included, a customer-portal sketch, example menus,
  the three plans with a Pro line calculator, the FAQ, a closing call to
  action and the footer.
* Plans: Starter is R0 a month plus a once-off R50 that reserves the
  number, and a number unused for 3 months is released. Pro is R185 per
  line a month and includes R185 of airtime. Unlimited is R699, locked and
  labelled "Soon". Every plan gets free, unlimited calls on our network.
* The product's name is one value, `TELEPHONY_SITE_NAME` in
  `telephony-brand.ts`. It is the concept's "Rokct Telephony", a
  placeholder until Ray names the product. The header wordmark, the
  footer, the `/` title and `telephony-site-metadata.ts` all read it.
* Every word is in `telephony-landing-config.ts`, the way agent_sdk keeps
  rokct.ai's in `agent-landing-config.ts`. The entry module is server-safe
  and the interactive parts live in `telephony-landing.client.tsx`.
* Teal accent, #0F7A6E light and #2DD4BF dark. The tokens are scoped to
  `.tel` and follow the shell's next-themes class. The fonts are Gabarito,
  Geist and Geist Mono through `next/font/google`.
* Icons are Remixicon only. The block now declares `@remixicon/react` and
  `next-themes` as dependencies.
* The footer ends with base_sdk's `SiteCredit`:
  `© 2026 Rokct Telephony · Built with ♥ by ROKCT`, with the heart
  aria-labelled "love". The telephony block's base_sdk floor rises to
  1.54.0.
* No client showcase.
* The talk box's "Talk to us" button is drawn only once
  `TELEPHONY_PRICING.talk.href` is set. No source names a contact channel
  yet. The hero and closing "Talk to us" buttons scroll to that box.
* `telephony-site-metadata.ts` takes its description from the landing and
  its tagline from the landing's headline, so it no longer states the plan
  fixtures' USD facts. base_sdk's `/landing` storefront and the other
  registry modules are unchanged. `app_type.control` is unchanged.

## 1.1.3

* fix(icons): the telephony portal and control pages import their icons
  from `@remixicon/react` instead of lucide-react. The manifest declares
  `@remixicon/react` ^4.6.0 in place of lucide-react.

## 1.1.2

* The storefront hero no longer offers a call to action that goes nowhere.
  `telephony-hero-form.tsx` draws "See pricing" only when the pricing
  section is on the page, reading base_sdk 1.48.0's `HeroFormProps.nav` -
  the page's live section list. The pricing section already turns itself
  down when there are no plans to price (`telephony-pricing-section.tsx`
  `meta.renders`), which is every render while the Telephony plan catalog
  cannot be read, and until now the hero kept a button pointing at a
  `#pricing` anchor the page did not have. "Subscribe to a Telephony Plan"
  is a route, not an anchor, so it is unaffected and the hero still leads
  somewhere that works. A host that hands no `nav` over keeps the button
  exactly as before.

## 1.1.1

* `telephony-header-menu.ts` declares `brand: { logo: "none" }` (base_sdk
  1.21.0's `HeaderMenu.brand`), closing 1.1.0's `TODO base 1.21.0` line: the
  home SDK declares whether the header shows a logo (Ray, 2026-09-09), and no
  telephony artwork exists, so the header draws no image and the wordmark
  alone is the logo. `wordmark` stays at its default.
* base_sdk floor for the telephony block raised to 1.21.0, the version that
  added the field; against an older base the compose fails to type-check.
  `app_type.control`, `app_type.tenant` and `install.py` are unchanged.
* `tests/test_telephony_sdk_manifest.py` pins the brand declaration and the
  absence of the TODO.

## 1.1.0

* The storefront half: `app_type.telephony`, the home SDK of the telephony
  shell (RokctAI/telephony-frontend, composed by the protocol's
  `core/utils/frappe/composer/telephony.json`). Ray, 2026-09-09: "For
  telephony I suggest the hosting shape: a telephony_sdk landing half
  selling the Telephony plan category on control, telephony-frontend
  composed like hosting #6" - "we breaking up platform into pieces without
  breaking it". It mirrors hosting_sdk 1.0.0 (`hosting/nextjs`) file for
  file, under `templates/telephony/` so the composer strips it from a
  control-site host and strips `templates/control/` from a telephony-shell
  host (`sdk_composer.py` `strip_unused_role_folders()`); the installer
  merges the block's `installs` and `integrations` only when the host's
  `.rokct/config/app_type` reads `telephony`.
  * `templates/telephony/app/page.tsx` owns `/`: every visitor is
    redirected to base_sdk's composed landing at `/landing`. The signed-in
    telephony portal is the control block's, on the control site, so there
    is no signed-in home to send anyone to.
  * `components/custom/landing/telephony-plans-query.ts` registers at
    `// @rokct-sdk-plans-query-start`: `LANDING_CONFIG.plansQuery` with one
    filter laid over its payload, `["plan_category", "=", "Telephony"]` -
    the category `telephony/frappe`'s plan fixtures spell and the one
    control's own `telephony_signup.py` filters on. No plan id or name is in
    the filter.
  * `telephony-hero-copy.ts` (`// @rokct-sdk-hero-copy-start`) and
    `telephony-hero-form.tsx` (`// @rokct-sdk-hero-form-start`): the
    headline cycles SIP lines, call routing and call history (the fixtures'
    feature lines), the trust line states the free plan, the 14-day Pro
    trial and the shared billing facts, and the body is two calls to action
    with no input - "Subscribe to a Telephony Plan" (control's
    `telephony_signup.html` heading) to the sign-up, and the pricing
    section.
  * `telephony-features-section.tsx` and `telephony-pricing-section.tsx`
    (`// @rokct-sdk-page-sections-start`, copy in
    `landing/telephony-page-sections.ts`): what the plans include, one card
    per inclusion from the plan fixtures, the control site's sign-up copy
    and this SDK's own control-portal templates (area code and DID at
    sign-up, Paystack top-up), and the live plan rows the control site
    returns. The pricing section is hosting's with one addition: a row
    whose `is_per_seat_plan` is set says "per line" under its price
    (`telephony_signup.html`: "Pro plans are priced per line"). It declares
    `meta.renders` over the prefetched rows so it and its Pricing nav stop
    drop together when there are none.
  * `telephony-header-menu.ts` (`// @rokct-sdk-header-menu-start`): two
    anchors, `features` and `pricing`; no groups, no actions (base's header
    draws Log in and Sign up), and no logo image - the home SDK declares the
    header logo (Ray, 2026-09-09 14:15Z); base_sdk 1.20.0's registry has no
    field for it yet, so the file carries a `TODO base 1.21.0: brand.logo
    "none"` line.
  * `telephony-site-metadata.ts` (`// @rokct-sdk-site-metadata-start`): the
    title, tagline, description and keywords, every claim a plan fixture
    fact. It declares its own shape rather than importing base's and
    registers no `icon`, so base_sdk >= 1.17.0's generated letter favicon
    applies. `siteName` "Rokct Telephony" is a flagged PLACEHOLDER: no
    source names the product.
  * Every word rendered comes from `telephony/frappe/src/fixtures` (the four
    Telephony Subscription Plan records and their Items),
    `control/templates/pages/telephony_signup.html` or this SDK's
    `templates/control/app/portal/telephony/*`; colours route through the
    shell's theme tokens, never a literal brand colour.
  * base_sdk floor 1.20.0 for the telephony block (the home_sdk composer,
    protocol #390, and the base the hosting shell composed against);
    auth_sdk composes before this SDK because the landing's sign-up and
    login links are its routes.
  * `app_type.control` and `app_type.tenant` are unchanged from 1.0.0; the
    top-level `installs` stays empty. `tests/test_telephony_sdk_manifest.py`
    (new) pins the manifest shape, both blocks, the plans-query literal and
    the no-invented-copy rule.

## 1.0.0

* The control-site half (`app_type.control`): the `/handson/control/telephony`
  admin page, the `/portal/telephony` customer portal (sign-up, checkout,
  top-up, subscription detail), their services and actions, and the sidebar
  nav line at `// @rokct-sdk-nav-start`. `app_type.tenant` is empty.
