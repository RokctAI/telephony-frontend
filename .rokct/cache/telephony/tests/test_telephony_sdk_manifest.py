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
templates (telephony/nextjs, 1.4.0): the two app_type halves, the landing
half's registrations against base_sdk's landing registries, the plans-query
literal, the no-invented-copy rule, the approved `/` landing (1.2.0):
its rand prices, the one product-name value, Remixicon only and the footer
credit, and the Rokct Telecom logo and icons (1.4.0).

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
    "telephony-logo.tsx",
)

# The Rokct Telecom logo (1.4.0): the chosen artwork's geometry and colours.
BRAND_TEAL = "#0F7A6E"
MARK_PATHS = (
    "M17.75 48V39A8.5 8.5 0 0 1 26.25 30.5H49.75",
    "M37.75 16V38.5A6 6 0 0 0 43.75 44.5H48.25",
)
ICON_SVG = os.path.join(LANDING_TEMPLATES, "app", "icon.svg")
APPLE_ICON = os.path.join(LANDING_TEMPLATES, "app", "apple-icon.png")
PUBLIC_ICON = os.path.join(LANDING_TEMPLATES, "public", "rokct-telecom-icon.png")
# Icon artwork carries the literal brand colour; binary files carry no header.
BINARY_EXTENSIONS = (".png", ".ico", ".jpg", ".jpeg", ".webp")

# The plan names the fixtures spell; never in the filter, only in prose.
PLAN_NAMES = ("Telephony Free", "Telephony Pro")


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def landing_files():
    """Every text template of the landing half (binary icons are skipped)."""
    for root, _, names in os.walk(LANDING_TEMPLATES):
        for name in names:
            if name.lower().endswith(BINARY_EXTENSIONS):
                continue
            yield os.path.join(root, name)


def png_size(path):
    """(width, height) from a PNG's IHDR chunk."""
    with open(path, "rb") as f:
        head = f.read(24)
    assert head[:8] == b"\x89PNG\r\n\x1a\n", path
    return int.from_bytes(head[16:20], "big"), int.from_bytes(head[20:24], "big")


class TestManifestShape(unittest.TestCase):
    def setUp(self):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            self.manifest = json.load(f)

    def test_identity(self):
        self.assertEqual(self.manifest["name"], "telephony_sdk")
        self.assertEqual(self.manifest["version"], "1.4.0")

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
        self.assertEqual(len(installs), 19)
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
                "components/custom/landing/header-auth.ts",
                "components/custom/landing/header-menu.ts",
                "components/custom/landing/hero-copy.ts",
                "components/custom/landing/hero-form.ts",
                "components/custom/landing/landing-config.ts",
                "components/custom/landing/page-sections.ts",
                "components/custom/landing/plans-query.ts",
                "components/custom/landing/site-credit.ts",
                "components/custom/landing/site-metadata.ts",
                "components/custom/header-auth-slot.tsx",
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
        # base_sdk 1.21.0's HeaderMenu.brand. 1.4.0: "auto" draws the
        # registered Rokct Telecom icon beside the wordmark (was "none").
        self.assertIn('brand: { logo: "auto" }', menu.group(1))
        self.assertNotIn('logo: "none"', menu.group(1))
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
        # 1.4.0: the Rokct Telecom mark is the registered favicon, a file
        # this block installs, so the letter tile is never drawn.
        self.assertIn('icon: "/rokct-telecom-icon.png"', src)
        with open(MANIFEST, "r", encoding="utf-8") as f:
            block = json.load(f)["app_type"]["telephony"]
        self.assertIn("public/rokct-telecom-icon.png", {e["to"] for e in block["installs"]})
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
        # The favicon artwork is the brand teal itself (1.4.0).
        page_files.add(ICON_SVG)
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
                if name.lower().endswith(BINARY_EXTENSIONS):
                    continue
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


class TestRokctTelecomLogo(unittest.TestCase):
    """The logo Ray chose on 2026-11-01 (1.4.0)."""

    def setUp(self):
        self.logo = read(os.path.join(LANDING_PAGE_DIR, "telephony-logo.tsx"))
        self.client = read(os.path.join(LANDING_PAGE_DIR, "telephony-landing.client.tsx"))
        self.page = read(os.path.join(LANDING_PAGE_DIR, "telephony-landing.tsx"))
        self.css = read(os.path.join(LANDING_PAGE_DIR, "telephony-landing.css"))
        with open(MANIFEST, "r", encoding="utf-8") as f:
            self.block = json.load(f)["app_type"]["telephony"]

    def test_mark_geometry_is_the_chosen_artwork(self):
        for src in (self.logo, read(ICON_SVG)):
            self.assertIn('viewBox="0 0 64 64"', src)
            self.assertIn('width="64" height="64" rx="16"', src)
            for d in MARK_PATHS:
                self.assertIn(f'd="{d}"', src)

    def test_logo_links_home_with_bold_suffix(self):
        self.assertIn('<Link href="/" className={className}', self.logo)
        self.assertIn("aria-label={`${siteName} home`}", self.logo)
        self.assertIn("<b>{tail}</b>", self.logo)
        self.assertNotIn('"use client"', self.logo)
        self.assertNotIn("useState", self.logo)
        self.assertIn("telephonyWordmark(siteName)", self.logo)

    def test_header_and_footer_draw_the_logo_once(self):
        self.assertIn('import { TelephonyLogo } from "./telephony-logo";', self.client)
        self.assertIn("<TelephonyLogo siteName={siteName} stem={stem} suffix={suffix} />", self.client)
        # Exactly one logo in the header; the open phone menu drops below
        # the bar that already shows it, so it draws none of its own.
        self.assertEqual(self.client.count("<TelephonyLogo"), 1)
        menu = self.client.split('id="tel-mobile-menu"', 1)[1].split("</div>", 1)[0]
        self.assertNotIn("TelephonyLogo", menu)
        self.assertNotIn("menu-brand", self.client + self.css)
        self.assertIn('import { TelephonyLogo } from "./telephony-logo";', self.page)
        footer = self.page.split("<footer>", 1)[1].split("</footer>", 1)[0]
        self.assertIn('<TelephonyLogo className="brand foot-brand" />', footer)
        # The concept's ink tile with call arcs is gone.
        for src in (self.client, self.page):
            self.assertNotIn("function TelephonyMark", src)
            self.assertNotIn("<small>{suffix}</small>", src)

    def test_tile_is_brand_teal_in_both_themes(self):
        self.assertIn(f"--mark-tile:{BRAND_TEAL}; --mark-ink:#FFFFFF;", self.css)
        dark = self.css.split(".dark .tel{", 1)[1].split("}", 1)[0]
        self.assertNotIn("--mark-tile", dark)
        self.assertIn("--mark-ring:", dark)
        self.assertIn('fill="var(--mark-tile)"', self.logo)
        self.assertIn(".tel .brand b{font-weight:800}", self.css)
        self.assertIn("color:var(--ink)", self.css.split(".tel .brand{", 1)[1].split("}", 1)[0])

    def test_icon_files(self):
        svg = read(ICON_SVG)
        self.assertTrue(svg.startswith("<svg "))
        self.assertIn(f'fill="{BRAND_TEAL}"', svg)
        self.assertIn('stroke="#FFFFFF"', svg)
        self.assertNotIn("<metadata", svg)
        self.assertEqual(png_size(APPLE_ICON), (180, 180))
        self.assertEqual(png_size(PUBLIC_ICON), (512, 512))
        installed = {(e["from"], e["to"]) for e in self.block["installs"]}
        for to in ("app/icon.svg", "app/apple-icon.png", "public/rokct-telecom-icon.png",
                   "components/custom/landing/telephony-logo.tsx"):
            self.assertIn((f"templates/telephony/{to}", to), installed)

    def test_changelog_records_1_4_0(self):
        log = read(os.path.join(SDK_DIR, "CHANGELOG.md"))
        self.assertTrue(log.startswith("# Changelog\n\n## 1.4.0\n"))
        self.assertIn("hardware#69", log.split("## 1.2.1", 1)[0])


class TestHeaderAuthSlot(unittest.TestCase):
    """1.3.0 (Ray, 2026-11-01: "we just moving login and signup buttons to
    injection"): the header's Log in is no longer hard-coded; it renders
    base_sdk 1.60.0's HeaderAuthSlot on the bar and in the phone menu, and
    the footer's Log in shows only where the slot is filled."""

    def setUp(self):
        self.client = read(
            os.path.join(LANDING_PAGE_DIR, "telephony-landing.client.tsx")
        )
        start = self.client.index("export function TelephonyHeader(")
        self.header = self.client[
            start : self.client.index("\nexport function ", start + 1)
        ]
        self.page = read(os.path.join(LANDING_PAGE_DIR, "telephony-landing.tsx"))

    def test_slot_replaces_the_hard_coded_login(self):
        self.assertIn(
            'import { HeaderAuthSlot } from "@/components/custom/header-auth-slot";',
            self.client,
        )
        self.assertNotIn("TELEPHONY_HEADER.login", self.header)
        self.assertNotIn('className="login" href', self.header)
        end = self.header[
            self.header.index('<div className="nav-end">') : self.header.index(
                'id="tel-mobile-menu"'
            )
        ]
        self.assertIn(
            '<HeaderAuthSlot variant="bar" loginUrl={loginUrl} signupUrl={signupUrl} classes={TELEPHONY_AUTH_BAR} />',
            end,
        )
        self.assertIn('className="btn btn-primary hide-sm" href="#pricing"', end)
        menu = self.header[self.header.index('id="tel-mobile-menu"') :]
        self.assertIn(
            '<HeaderAuthSlot variant="panel" loginUrl={loginUrl} signupUrl={signupUrl} classes={TELEPHONY_AUTH_MENU} />',
            menu,
        )
        self.assertIn(
            'const TELEPHONY_AUTH_BAR = { login: "login", signup: "login" };',
            self.client,
        )

    def test_page_passes_both_routes_and_gates_the_footer(self):
        self.assertIn("signupUrl={signupUrl}", self.page)
        self.assertIn(
            'import { hasHeaderAuth } from "@/components/custom/landing/header-auth";',
            self.page,
        )
        self.assertIn(
            "{hasHeaderAuth() && <a href={loginUrl}>{TELEPHONY_HEADER.login}</a>}",
            self.page,
        )

    def test_names_no_auth_sdk(self):
        imports = "\n".join(
            line
            for line in (self.client + self.page).splitlines()
            if line.startswith("import ")
        )
        for gone in ("@/app/(auth)", "next-auth", "components/custom/auth/"):
            self.assertNotIn(gone, imports)


if __name__ == "__main__":
    unittest.main()
