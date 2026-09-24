# Changelog

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
