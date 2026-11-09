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

"""telephony_sdk 1.5.0: the Rokct Telecom auth pages. The telephony block
installs its own components/custom/site-shell.tsx (auth_sdk >= 1.12.0's
SiteShell seam) with the SiteShell / SiteShellLogo contract, client-safe,
framed by the landing's header, faces and tokens, with scoped CSS and
panel copy that only repeats the landing's own facts."""

import json
import re
import unittest
from pathlib import Path

SDK = Path(__file__).resolve().parents[1]
T = SDK / "templates/telephony/components/custom"
SHELL = T / "site-shell.tsx"
COPY = T / "telecom-auth/telecom-auth-copy.ts"
CSS = T / "telecom-auth/telecom-auth.css"


class TelecomAuthTest(unittest.TestCase):
    def test_manifest_installs_the_shell(self):
        m = json.loads((SDK / "manifest.json").read_text())
        pairs = {(i["from"], i["to"]) for i in m["app_type"]["telephony"]["installs"]}
        self.assertIn(("templates/telephony/components/custom/site-shell.tsx", "components/custom/site-shell.tsx"), pairs)
        self.assertIn(("templates/telephony/components/custom/telecom-auth", "components/custom/telecom-auth"), pairs)
        self.assertIn("auth_sdk >= 1.12.0", m["_comment"]["components/custom/site-shell.tsx"])

    def test_contract(self):
        src = SHELL.read_text()
        self.assertIn('"use client";', src)
        self.assertIn("export interface SiteShellProps", src)
        self.assertIn("export function SiteShell(", src)
        self.assertIn("export function SiteShellLogo(", src)
        self.assertIn("TelephonyHeader", src)
        self.assertIn("telephonyFontClassName", src)
        self.assertIn('base="/"', src)
        self.assertNotRegex(src, r"server-only|next/headers")

    def test_css_scoped(self):
        body = re.sub(r"/\*.*?\*/", "", CSS.read_text(), flags=re.S)
        for sel in re.findall(r"([^{}]+)\{", body):
            if sel.strip().startswith("@media"):
                continue
            for part in sel.split(","):
                self.assertRegex(part.strip(), r"^(\.dark )?\.tel \.ta", part)

    def test_card_rules_do_not_read_the_shadowed_accent(self):
        # .ta-card redefines --accent as a shadcn triplet; its rules use --ta-acc.
        body = CSS.read_text().split("/* the spacing the reset")[1]
        self.assertNotIn("var(--accent)", body)

    def test_copy_only_states_landing_facts(self):
        src = COPY.read_text()
        cfg = (SDK / "templates/telephony/components/custom/landing/telephony-landing-config.ts").read_text()
        for fact in ("R50", "R185", "R0"):
            self.assertIn(fact, src)
            self.assertIn(fact, cfg)
        self.assertIn('"Log in to your Rokct Telecom account to carry on."', src)
        self.assertIn('"Create a Rokct Telecom account to get started."', src)


if __name__ == "__main__":
    unittest.main()
