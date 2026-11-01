/**
 * Host-owned platform constants seam. Named in auth_sdk's manifest
 * `requires`; read by its `components/custom/auth-form.tsx`
 * (`PLATFORM_NAME`, `VOUCHER_OFFSET_Y`) and re-exported wholesale by
 * `app/config/platform.ts`, the way RokctAI/rokctai_frontend's copy is.
 *
 * `PLATFORM_NAME` is the wordmark base_sdk renders through
 * `components/custom/branding.tsx` in the `/landing` header and hero (and
 * auth_sdk's forms read). Until 2026-11-01 it was the platform's neutral
 * "Rokct"; since telephony_sdk 1.4.0 put the Rokct Telecom mark beside it
 * (brand.logo "auto"), it is "Rokct Telecom", the name Ray chose, so the
 * mark and the words beside it name the same product, as the `/` landing's
 * own header does. Everything ELSE the product is called - the
 * <title>, the site name, the description, the cards - is the home SDK's
 * (telephony_sdk's `components/custom/landing/telephony-site-metadata.ts`,
 * registered into base_sdk's site-metadata registry at compose time; its
 * siteName is "Rokct Telecom", the name Ray chose, since telephony_sdk
 * 1.2.1). No product copy lives in this shell.
 *
 * The layout numbers keep rokctai_frontend's values: nothing in this shell
 * renders the country superscript they position (the neutral branding
 * prints the plain wordmark), so they are here only so SDK code that
 * imports them by name resolves.
 */
export const PLATFORM_NAME = "Rokct Telecom";
export const LEGAL_COMPANY_NAME = "ROKCT INTELLIGENCE (PTY) LTD";

/**
 * UI Configuration for the "Use Voucher" banner.
 */
export const VOUCHER_OFFSET_Y = "6";

/**
 * Branding Configuration for the Country Code.
 * Centralize all "Position" adjustments here:
 */
export const BRANDING_COUNTRY_INDEX = PLATFORM_NAME.length; // Insertion position (0=prefix, name length=suffix)
export const BRANDING_COUNTRY_Y_OFFSET = "-0.2em"; // Sits at cap-height, not above
export const BRANDING_COUNTRY_SCALE = "0.28em"; // Noticeably small superscript
