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

// The telephony storefront's plans query, for base_sdk's plans-query registry
// (components/custom/landing/plans-query.ts, base_sdk >= 1.9.0): the
// platform's `Subscription Plan` catalog, TELEPHONY plans only.
//
// Ray, 2026-09-09: the telephony shell is "a telephony_sdk landing half
// selling the Telephony plan category on control", composed like the
// hosting shell - one control backend serves several storefront shells and
// each shell's home SDK filters the shared catalog by `plan_category`
// (hosting-plans-query.ts: Hosting; agent-plans-query.ts excludes the
// categories rokct.ai does not sell). No plan is named or numbered here;
// the category is the one the Telephony plan fixtures spell
// (telephony/frappe/src/fixtures/Subscription_Plan/*.json: "Telephony") and
// the one the control site's own sign-up page filters on
// (control/templates/pages/telephony_signup.py: {"plan_category":
// "Telephony"}).
//
// The query is base's generic default (LANDING_CONFIG.plansQuery: the same
// doctype, fields and order) with ONE filter laid over it, so a field base
// adds later reaches the pricing section without an edit here. The filter
// runs on the server: only the telephony rows are ever fetched. A host whose
// landing-config.ts sets `plansQuery` to null prefetches no plans at all,
// and this module honours that by exporting null too.
//
// Registered with one line at // @rokct-sdk-plans-query-start through this
// SDK's manifest integrations (app_type telephony). loadLandingPlansQuery()
// answers the FIRST registered entry that loads; as the home SDK this one
// is the only line the composer injects there.

import {
  LANDING_CONFIG,
  type LandingPlansQuery,
} from "@/components/custom/landing/landing-config";

/** The category, as the platform's plan fixtures spell it. */
const TELEPHONY_CATEGORY = "Telephony";

/** A `frappe.client.get_list` filter row: [fieldname, operator, value]. */
type PlanFilter = [string, string, string];

const ONLY_TELEPHONY: PlanFilter = ["plan_category", "=", TELEPHONY_CATEGORY];

/**
 * Lays the telephony filter over whatever `filters` the generic payload
 * already carries: appended to a list, added to a map keyed by fieldname,
 * or the sole filter when there are none.
 */
function onlyTelephony(payload: Record<string, unknown>): Record<string, unknown> {
  const existing = payload.filters;
  if (Array.isArray(existing)) {
    return { ...payload, filters: [...existing, ONLY_TELEPHONY] };
  }
  if (existing && typeof existing === "object") {
    return {
      ...payload,
      filters: {
        ...(existing as Record<string, unknown>),
        [ONLY_TELEPHONY[0]]: [ONLY_TELEPHONY[1], ONLY_TELEPHONY[2]],
      },
    };
  }
  return { ...payload, filters: [ONLY_TELEPHONY] };
}

const generic = LANDING_CONFIG.plansQuery;

const TELEPHONY_PLANS_QUERY: LandingPlansQuery | null = generic
  ? { cmd: generic.cmd, payload: onlyTelephony(generic.payload) }
  : null;

export default TELEPHONY_PLANS_QUERY;
