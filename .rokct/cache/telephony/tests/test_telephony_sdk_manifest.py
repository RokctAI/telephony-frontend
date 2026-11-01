# Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, version 3.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

"""Invariants over telephony_sdk's Next.js manifest and its storefront
templates (telephony/nextjs, 1.2.0): the two app_type halves, the landing
half's registrations against base_sdk's landing registries, the plans-query
literal, the no-invented-copy rule, and the approved `/` landing (1.2.0):
its rand prices, the one product-name value, Remixicon only and the footer
credit.

Run:  python -m pytest telephony/nextjs/tests -q
  or: python telephony/nextjs/tests/test_telephony_sdk_manifest.py
"""

import json
import os
import re
import unittest

SDK_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(SDK_DIR, "manifest.json")
TEMPLATES = os.path.join(SDK_DIR, "templates")
LANDING_TEMPLATES = os.path.join(TEMPLATES, "telephony")

LICENSE_FIRST_LINE = "Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD"

# base_sdk's seven landing registries and the marker each is filled at.
LANDING_MARKERS = {
    "components/custom/landing/hero-copy.ts": "// @rokct-sdk-hero-copy-start",
    "components/custom/landing/hero-form.ts": "// @rokct-sdk-hero-form-start",
    "components/custom/landing/page-sections.ts": "// @rokct-sdk-page-sections-start",
    "components/custom/landing/header-menu.ts": "// @rokct-sdk-header-menu-start",
    "components/custom/landing/site-metadata.ts": "// @rokct-sdk-site-metadata-start",
    "components/custom/landing/plans-query.ts": "// @rokct-sdk-plans-query-start",
}

# Words no shipped template may carry: nothing is demonstrative or invented.
FORBIDDEN_WORDS = ("demo", "sample", "example", "lorem", "ipsum")

# The approved landing at `/` (1.2.0): its own files. Its copy is the concept
# Ray approved word for word, which labels its menus "Example menu(s)", and
# its tokens are the concept's literal teal palette, so the registry-module
# rules below (no "example", no hex literal) are held for the rest only.
LANDING_PAGE_DIR = os.path.join(LANDING_TEMPLATES, "components", "custom", "landing")
LANDING_PAGE_FILES = (
    "telephony-brand.ts",
    "telephony-landing-config.ts",
    "telephony-fonts.ts",
    "telephony-landing.tsx",
    "telephony-landing.client.tsx",
    "telephony-landing.css",
)

# The plan names the fixtures spell; never in the filter, only in prose.
PLAN_NAMES = ("Telephony Free", "Telephony Pro")


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def landing_files():
    for root, _, names in os.walk(LANDING_TEMPLATES):
        for name in names:
            yield os.path.join(root, name)


class TestManifestShape(unittest.TestCase):
    def setUp(self):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            self.manifest = json.load(f)

    def test_identity(self):
        self.assertEqual(self.manifest["name"], "telephony_sdk")
        self.assertEqual(self.manifest["version"], "1.2.1")

    def test_top_level_installs_nothing(self):
        # Both halves are app_type-scoped: a host that names neither role
        # gets nothing from this SDK.
        self.assertEqual(self.manifest["installs"], [])
        self.assertEqual(self.manifest.get("dependencies", {}), {})
        self.assertEqual(self.manifest.get("devDependencies", {}), {})
        self.assertNotIn("integrations", self.manifest)

    def test_three_app_type_blocks(self):
        self.assertEqual(
            list(self.manifest["app_type"].keys()), ["control", "telephony", "tenant"]
        )
        self.assertEqual(self.manifest["app_type"]["tenant"], {})


class TestControlBlockIntact(unittest.TestCase):
    """The 1.0.0 control-site half must keep working unchanged."""

    def setUp(self):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            self.block = json.load(f)["app_type"]["control"]

    def test_installs(self):
        installs = [(e["from"], e["to"]) for e in self.block["installs"]]
        self.assertEqual(
            installs,
            [
                ("templates/control/app/services/control", "app/services/control"),
                ("templates/control/app/services/portal", "app/services/portal"),
                (
                    "templates/control/app/actions/handson/control/telephony",
                    "app/actions/handson/control/telephony",
                ),
                ("templates/control/app/actions/portal", "app/actions/portal"),
                (
                    "templates/control/app/handson/control/telephony",
                    "app/handson/control/telephony",
                ),
                ("templates/control/app/portal/telephony", "app/portal/telephony"),
            ],
        )
        for src, _ in installs:
            self.assertTrue(os.path.isdir(os.path.join(SDK_DIR, src)), src)

    def test_dependencies(self):
        self.assertEqual(
            sorted(self.block["dependencies"]),
            ["@remixicon/react", "date-fns", "sonner"],
        )

    def test_nav_integration(self):
        self.assertEqual(
            self.block["integrations"],
            [
                {
                    "target": "app/handson/sidebar-client.tsx",
                    "placeholder": "// @rokct-sdk-nav-start",
                    "replacement": '  { href: "/handson/control/telephony", label: "Telephony" },',
                }
            ],
        )

    def test_requires(self):
        self.assertIn("app/services/base/platform-gateway.ts", self.block["requires"])
        self.assertEqual(len(self.block["requires"]), 11)

    def test_control_block_touches_no_landing_registry(self):
        targets = {i["target"] for i in self.block["integrations"]}
        self.assertFalse(targets & set(LANDING_MARKERS))
        for entry in self.block["installs"]:
            self.assertFalse(entry["to"].startswith("components/custom/landing/"))
            self.assertNotEqual(entry["to"], "app/page.tsx")


class TestTelephonyBlock(unittest.TestCase):
    """The 1.1.0 storefront half, the home SDK of the telephony shell."""

    def setUp(self):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            self.block = json.load(f)["app_type"]["telephony"]

    def test_installs_mirror_the_host_layout(self):
        installs = self.block["installs"]
        self.assertEqual(len(installs), 15)
        for entry in installs:
            self.assertTrue(entry["from"].startswith("templates/telephony/"), entry)
            self.assertEqual(entry["from"][len("templates/telephony/") :], entry["to"])
            self.assertTrue(os.path.isfile(os.path.join(SDK_DIR, entry["from"])), entry)
        self.assertEqual(installs[0]["to"], "app/page.tsx")

    def test_landing_page_files_installed(self):
        installed = {e["to"] for e in self.block["installs"]}
        for name in LANDING_PAGE_FILES:
            self.assertIn(f"components/custom/landing/{name}", installed)

    def test_dependencies(self):
        # 1.2.0: the `/` landing imports Remixicon and next-themes directly.
        self.assertEqual(
            self.block["dependencies"],
            {"@remixicon/react": "^4.6.0", "next-themes": "^0.4.6"},
        )
        self.assertEqual(self.block["devDependencies"], {})

    def test_one_line_per_registry(self):
        integrations = self.block["integrations"]
        self.assertEqual(len(integrations), 7)
        by_target = {}
        for entry in integrations:
            self.assertEqual(LANDING_MARKERS[entry["target"]], entry["placeholder"])
            self.assertRegex(
                entry["replacement"],
                r'^  \{ id: "telephony-[a-z-]+", load: \(\) => import\("@/components/custom/[a-z/-]+"\) \},$',
            )
            by_target.setdefault(entry["target"], []).append(entry)
        # page-sections merges every contributor: two sections there; the
        # single-answer registries get exactly one line each.
        self.assertEqual(
            len(by_target["components/custom/landing/page-sections.ts"]), 2
        )
        for target, entries in by_target.items():
            if target != "components/custom/landing/page-sections.ts":
                self.assertEqual(len(entries), 1, target)
        self.assertEqual(set(by_target), set(LANDING_MARKERS))

    def test_every_registered_module_is_installed(self):
        installed = {e["to"] for e in self.block["installs"]}
        for entry in self.block["integrations"]:
            module = re.search(r'import\("@/([^"]+)"\)', entry["replacement"]).group(1)
            candidates = {module + ".ts", module + ".tsx"}
            self.assertTrue(candidates & installed, module)

    def test_requires_base_landing_host(self):
        self.assertEqual(
            self.block["requires"],
            [
                "app/actions/base/landing.ts",
                "app/landing/page.tsx",
                "components/custom/landing/header-menu.ts",
                "components/custom/landing/hero-copy.ts",
                "components/custom/landing/hero-form.ts",
                "components/custom/landing/landing-config.ts",
                "components/custom/landing/page-sections.ts",
                "components/custom/landing/plans-query.ts",
                "components/custom/landing/site-credit.ts",
                "components/custom/landing/site-metadata.ts",
                "components/custom/site-credit.tsx",
            ],
        )


class TestLandingTemplates(unittest.TestCase):
    def test_plans_query_literal(self):
        src = read(
            os.path.join(
                LANDING_TEMPLATES,
                "components/custom/landing/telephony-plans-query.ts",
            )
        )
        self.assertIn('const TELEPHONY_CATEGORY = "Telephony";', src)
        self.assertIn('["plan_category", "=", TELEPHONY_CATEGORY]', src)
        self.assertIn("LANDING_CONFIG.plansQuery", src)
        for name in PLAN_NAMES:
            self.assertNotIn(name, src)
        self.assertNotIn('"name"', src)

    def test_root_page_draws_the_landing(self):
        src = read(os.path.join(LANDING_TEMPLATES, "app/page.tsx"))
        self.assertNotIn("redirect(", src)
        self.assertIn(
            "<TelephonyLanding fontClassName={telephonyFontClassName} />", src
        )
        self.assertIn("title: { absolute: TELEPHONY_SITE_NAME }", src)

    def test_header_menu_has_no_actions_and_brand_logo_none(self):
        src = read(
            os.path.join(
                LANDING_TEMPLATES,
                "components/custom/landing/telephony-header-menu.ts",
            )
        )
        menu = re.search(
            r"const TELEPHONY_HEADER_MENU: HeaderMenu = \{(.*?)\};", src, re.DOTALL
        )
        self.assertIsNotNone(menu)
        self.assertIn('anchors: ["features", "pricing"]', menu.group(1))
        self.assertNotIn("actions", menu.group(1))
        self.assertNotIn("groups", menu.group(1))
        self.assertNotIn("links", menu.group(1))
        self.assertNotRegex(src, r"\.(png|svg|jpg|webp)")
        # base_sdk 1.21.0's HeaderMenu.brand: the wordmark alone, no image.
        self.assertIn('brand: { logo: "none" }', menu.group(1))
        self.assertNotIn("wordmark:", menu.group(1))
        self.assertNotIn("TODO", src)

    def test_site_metadata_reads_the_chosen_name(self):
        src = read(
            os.path.join(
                LANDING_TEMPLATES,
                "components/custom/landing/telephony-site-metadata.ts",
            )
        )
        self.assertIn("siteName: TELEPHONY_SITE_NAME", src)
        # 1.2.1: Ray named the product, so the name is no longer a placeholder.
        self.assertNotIn("PLACEHOLDER", src)
        self.assertNotIn("USD", src)
        self.assertNotIn("icon:", src)
        self.assertNotIn("ogImage:", src)

    def test_pricing_section_stands_down_without_rows(self):
        src = read(
            os.path.join(
                LANDING_TEMPLATES, "components/custom/telephony-pricing-section.tsx"
            )
        )
        self.assertIn("renders: ({ plans }) => showsPricing(plans)", src)
        self.assertIn("LANDING_CONFIG.planSignupUrl(plan.plan_name)", src)
        self.assertIn("is_per_seat_plan", src)

    def test_no_forbidden_words_no_literal_colours(self):
        page_files = {os.path.join(LANDING_PAGE_DIR, n) for n in LANDING_PAGE_FILES}
        for path in landing_files():
            if path in page_files:
                continue
            src = read(path)
            lowered = src.lower()
            for word in FORBIDDEN_WORDS:
                self.assertNotIn(word, lowered, f"{path}: {word}")
            # Colours route through the theme tokens, never a hex literal.
            self.assertIsNone(re.search(r"#[0-9a-fA-F]{3,8}\b", src), path)

    def test_license_header_on_every_template(self):
        for path in landing_files():
            self.assertIn(LICENSE_FIRST_LINE, read(path).splitlines()[1], path)

    def test_install_py_is_generic(self):
        src = read(os.path.join(SDK_DIR, "install.py"))
        self.assertIn("sdk_name = 'telephony_sdk'", src)
        self.assertIn("sdk_installer_base.install_sdk_files(sdk_name)", src)


class TestApprovedLanding(unittest.TestCase):
    """The `/` landing Ray approved on 2026-11-01 (1.2.0)."""

    def setUp(self):
        self.src = {
            n: read(os.path.join(LANDING_PAGE_DIR, n)) for n in LANDING_PAGE_FILES
        }
        self.all = "\n".join(self.src.values())

    def test_product_name_is_one_value(self):
        self.assertIn(
            'export const TELEPHONY_SITE_NAME = "Rokct Telecom";',
            self.src["telephony-brand.ts"],
        )
        # Written once in the whole SDK: everything else reads the constant.
        hits = []
        for root, _, names in os.walk(TEMPLATES):
            for name in names:
                path = os.path.join(root, name)
                if '"Rokct Telecom"' in read(path):
                    hits.append(os.path.relpath(path, TEMPLATES))
        self.assertEqual(
            hits, ["telephony/components/custom/landing/telephony-brand.ts"]
        )

    def test_plans_in_rand(self):
        cfg = self.src["telephony-landing-config.ts"]
        for literal in (
            'price: "R0"',
            'price: "R185"',
            'price: "R699"',
            'badge: "Soon"',
            "locked: true",
        ):
            self.assertIn(literal, cfg)
        self.assertIn(
            "Plus a once-off R50 setup fee that reserves your number. If the number goes unused for 3 months, it is released.",
            cfg,
        )
        self.assertIn("Includes R185 of call airtime per line every month.", cfg)
        self.assertIn(
            "Every plan includes free, unlimited calls to numbers on our network.", cfg
        )
        # The calculator's figures agree with the copy.
        for literal in (
            "starterMonthly: 0",
            "starterReserveFee: 50",
            "starterReleaseMonths: 3",
            "proPerLine: 185",
            "proAirtimePerLine: 185",
            "unlimitedMonthly: 699",
        ):
            self.assertIn(literal, cfg)
        self.assertNotIn("$", re.sub(r"\$\{[^}]*\}", "", cfg))
        self.assertNotIn("USD", self.all)

    def test_teal_accent(self):
        css = self.src["telephony-landing.css"]
        self.assertIn("--accent:#0F7A6E;", css)
        self.assertIn(".dark .tel{", css)
        self.assertIn("--accent:#2DD4BF;", css)

    def test_remixicon_only(self):
        for name, src in self.src.items():
            self.assertNotIn("lucide-react", src, name)
            self.assertNotIn("@radix-ui/react-icons", src, name)
            self.assertNotRegex(src, r'className="ri-', name)
        self.assertIn('from "@remixicon/react"', self.src["telephony-landing.tsx"])

    def test_footer_credit(self):
        page = self.src["telephony-landing.tsx"]
        self.assertIn(
            'import { SiteCredit } from "@/components/custom/site-credit";', page
        )
        self.assertIn('<SiteCredit as="span" siteName={TELEPHONY_SITE_NAME}', page)

    def test_no_client_showcase(self):
        for word in ("showcase", "testimonial", "logos", "trusted by"):
            self.assertNotIn(
                word, self.all.lower().replace("no client showcase", ""), word
            )

    def test_entry_is_server_safe(self):
        self.assertNotIn('"use client"', self.src["telephony-landing.tsx"])
        self.assertTrue(
            self.src["telephony-landing.client.tsx"]
            .split("*/", 1)[1]
            .lstrip()
            .startswith('"use client";')
        )

    def test_no_lorem(self):
        for word in ("lorem", "ipsum", "demo", "sample"):
            self.assertNotIn(word, self.all.lower(), word)


if __name__ == "__main__":
    unittest.main()
