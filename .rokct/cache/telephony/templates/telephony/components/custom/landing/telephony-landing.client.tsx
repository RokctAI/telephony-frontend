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
"use client";

// The interactive parts of the telephony landing (telephony-landing.tsx):
// the header (its rule on scroll, the light/dark switch through the shell's
// next-themes provider, the phone menu), the call-flow board (business tabs,
// menu keys, the ringing phone and the call log, pressed on a timer), the
// Pro line calculator and the reveal-on-scroll. Every word comes from
// telephony-landing-config.ts. The logo (mark + "Rokct **Telecom**",
// linked to "/") is telephony-logo.tsx's, in the bar (1.4.0); the open
// phone menu drops below that bar, so it draws no second logo.

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

import { RiAddLine, RiContrast2Line, RiMenu3Line, RiPhoneLine, RiSubtractLine } from "@remixicon/react";

import { HeaderAuthSlot } from "@/components/custom/header-auth-slot";

import {
  PRO_LINES,
  TELEPHONY_BUSINESSES,
  TELEPHONY_FLOW,
  TELEPHONY_HEADER,
  TELEPHONY_NAV,
  TELEPHONY_PRICING,
  proTotalLine,
} from "./telephony-landing-config";
import { TelephonyLogo } from "./telephony-logo";

// 1.3.0: Log in and Sign up are drawn by whatever SDK fills base's header
// auth slot (base_sdk >= 1.60.0; auth_sdk registers it), in this header's
// own classes: quiet `.login` links on the bar (hidden below the phone
// breakpoint, as Log in was) and plain rows in the phone menu, which
// closes on any tap. Nothing registered, nothing drawn.
const TELEPHONY_AUTH_BAR = { login: "login", signup: "login" };
const TELEPHONY_AUTH_MENU = { login: "menu-auth", signup: "menu-auth" };

export function TelephonyHeader({
  siteName,
  stem,
  suffix,
  loginUrl,
  signupUrl,
  base = "",
}: {
  siteName: string;
  stem: string;
  suffix: string;
  loginUrl: string;
  signupUrl: string;
  /** Prefix for the landing's in-page anchors: "" on `/`, "/" on any other route (the auth pages, 1.5.0). */
  base?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className={scrolled ? "top scrolled" : "top"} id="top">
      <div className="wrap nav">
        <TelephonyLogo siteName={siteName} stem={stem} suffix={suffix} />
        <nav className="nav-links" aria-label={TELEPHONY_HEADER.navLabel}>
          {TELEPHONY_NAV.map((item) => (
            <a key={item.href} href={`${base}${item.href}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-end">
          <button type="button" className="icon-btn" aria-label={TELEPHONY_HEADER.themeLabel} onClick={toggleTheme}>
            <i aria-hidden="true">
              <RiContrast2Line />
            </i>
          </button>
          <HeaderAuthSlot variant="bar" loginUrl={loginUrl} signupUrl={signupUrl} classes={TELEPHONY_AUTH_BAR} />
          <a className="btn btn-primary hide-sm" href={`${base}#pricing`}>
            {TELEPHONY_HEADER.start}
          </a>
          <button
            type="button"
            className="icon-btn burger"
            aria-label={TELEPHONY_HEADER.menuLabel}
            aria-expanded={open}
            aria-controls="tel-mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <i aria-hidden="true">
              <RiMenu3Line />
            </i>
          </button>
        </div>
      </div>
      <div className={open ? "mobile-menu open" : "mobile-menu"} id="tel-mobile-menu" onClick={() => setOpen(false)}>
        {TELEPHONY_NAV.map((item) => (
          <a key={item.href} href={`${base}${item.href}`}>
            {item.label}
          </a>
        ))}
        <HeaderAuthSlot variant="panel" loginUrl={loginUrl} signupUrl={signupUrl} classes={TELEPHONY_AUTH_MENU} />
      </div>
    </header>
  );
}

interface LogEntry {
  id: number;
  person: string;
  key: number;
}

/** The log the board opens with, as the concept seeds it: 1, then 2, then 1 again on top. */
function seedLog(bizIndex: number): LogEntry[] {
  const opts = TELEPHONY_BUSINESSES[bizIndex].options;
  return [
    { id: 3, person: opts[0].person, key: 1 },
    { id: 2, person: opts[1].person, key: 2 },
    { id: 1, person: opts[0].person, key: 1 },
  ];
}

export function TelephonyCallFlow() {
  const [biz, setBiz] = useState(0);
  const [sel, setSel] = useState(0);
  const [log, setLog] = useState<LogEntry[]>(() => seedLog(0));
  const nextId = useRef(4);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const bizRef = useRef(0);
  const selRef = useRef(0);

  const business = TELEPHONY_BUSINESSES[biz];

  const press = useCallback((bizIndex: number, option: number, reset: boolean) => {
    const person = TELEPHONY_BUSINESSES[bizIndex].options[option].person;
    const entry = { id: nextId.current++, person, key: option + 1 };
    selRef.current = option;
    setSel(option);
    setLog((rows) => (reset ? [entry] : [entry, ...rows].slice(0, 3)));
  }, []);

  const restartTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      press(bizRef.current, (selRef.current + 1) % 3, false);
    }, TELEPHONY_FLOW.intervalMs);
  }, [press]);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restartTimer]);

  const chooseBusiness = (index: number) => {
    bizRef.current = index;
    setBiz(index);
    press(index, 0, true);
    restartTimer();
  };

  const chooseKey = (option: number) => {
    press(biz, option, false);
    restartTimer();
  };

  const steps = TELEPHONY_FLOW.steps;

  return (
    <>
      <div className="biz-tabs" role="tablist" aria-label={TELEPHONY_FLOW.tabsLabel}>
        {TELEPHONY_BUSINESSES.map((b, i) => {
          const Icon = b.icon;
          return (
            <button key={b.id} type="button" role="tab" aria-selected={i === biz} onClick={() => chooseBusiness(i)}>
              <i aria-hidden="true">
                <Icon />
              </i>
              {b.tab}
            </button>
          );
        })}
      </div>
      <div className="board">
        <div className="node">
          <div className="step">
            <span>{steps.incoming.step}</span>
          </div>
          <h4>{steps.incoming.title}</h4>
          <p>{steps.incoming.text}</p>
          <div className="caller-big">
            <i aria-hidden="true">
              <RiPhoneLine />
            </i>
            <span>
              {steps.incoming.calling}
              <b>{steps.incoming.number}</b>
            </span>
          </div>
        </div>
        <div className="wire" aria-hidden="true" />
        <div className="node">
          <div className="step">
            <span>{steps.menu.step}</span>
            <span className="pro">{steps.menu.badge}</span>
          </div>
          <div className="greeting">{business.greeting}</div>
          <div className="keys">
            {business.options.map((o, i) => (
              <button key={o.label} type="button" className={i === sel ? "key on" : "key"} onClick={() => chooseKey(i)}>
                <kbd>{i + 1}</kbd>
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="wire" aria-hidden="true" />
        <div className="node">
          <div className="step">
            <span>{steps.rings.step}</span>
          </div>
          <p style={{ marginTop: 12 }}>{steps.rings.text}</p>
          <div className="staff" style={{ marginTop: 16 }}>
            {business.options.map((o, i) => {
              const Icon = o.icon;
              return (
                <div key={o.person} className={i === sel ? "st on" : "st"}>
                  <i aria-hidden="true">
                    <Icon />
                  </i>
                  {o.person}
                  <span className="tag">{steps.rings.ringing}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="wire" aria-hidden="true" />
        <div className="node">
          <div className="step">
            <span>{steps.record.step}</span>
          </div>
          <h4>{steps.record.title}</h4>
          <p>{steps.record.text}</p>
          <div className="logrow" aria-live="polite">
            {log.map((row, i) => (
              <div key={row.id} className={i === 0 ? "new" : undefined}>
                <span>{row.person}</span>
                <span>{steps.record.pressed(row.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function TelephonyProCalculator() {
  const [lines, setLines] = useState<number>(PRO_LINES.initial);
  return (
    <>
      <div className="stepper">
        <label htmlFor="tel-pro-lines">{TELEPHONY_PRICING.stepperLabel}</label>
        <div className="ctl">
          <button
            type="button"
            aria-label={TELEPHONY_PRICING.fewer}
            onClick={() => setLines((n) => Math.max(PRO_LINES.min, n - 1))}
          >
            <i aria-hidden="true">
              <RiSubtractLine />
            </i>
          </button>
          <output id="tel-pro-lines">{lines}</output>
          <button
            type="button"
            aria-label={TELEPHONY_PRICING.more}
            onClick={() => setLines((n) => Math.min(PRO_LINES.max, n + 1))}
          >
            <i aria-hidden="true">
              <RiAddLine />
            </i>
          </button>
        </div>
      </div>
      <div className="total">
        {TELEPHONY_PRICING.totalLabel} <b>{proTotalLine(lines)}</b>
      </div>
    </>
  );
}

/**
 * Arms the fade-in of every `.rv` block on the page and reveals each as it
 * scrolls into view. Until this runs (and with no JavaScript) nothing is
 * hidden; with no IntersectionObserver everything is shown at once.
 */
export function TelephonyReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".tel .rv"));
    if (!("IntersectionObserver" in window)) return;
    root.setAttribute("data-tel-reveal", "");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.removeAttribute("data-tel-reveal");
    };
  }, []);
  return null;
}
