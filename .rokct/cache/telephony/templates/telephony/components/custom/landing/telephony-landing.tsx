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

// The telephony landing at `/`: the concept Ray approved on 2026-11-01
// ("proceed") - a hosted business line for South African small businesses,
// priced in rand. Header, hero with the ringing phone, the four outcomes,
// how a call flows, the five setup steps, what's included, the customer
// portal sketch, example menus, the three plans, the FAQ, the closing call
// to action and the footer credit.
//
// Server component and server-safe: the interactive parts are in
// telephony-landing.client.tsx, every word in telephony-landing-config.ts,
// the product's name in telephony-brand.ts, the tokens in
// telephony-landing.css and the faces in telephony-fonts.ts. Icons are
// Remixicon. Sign-up and log-in lead to the shell's auth routes through
// base_sdk's LANDING_CONFIG; the footer's last line is base_sdk's
// SiteCredit. No client showcase is drawn.

import "./telephony-landing.css";

import {
  RiAddLine,
  RiArrowLeftRightLine,
  RiArrowRightLine,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCloseLine,
  RiCustomerService2Line,
  RiInformationLine,
  RiLockLine,
  RiPhoneLine,
  RiSmartphoneLine,
} from "@remixicon/react";

import { SiteCredit } from "@/components/custom/site-credit";
import { LANDING_CONFIG } from "@/components/custom/landing/landing-config";

import { TELEPHONY_SITE_NAME, telephonyWordmark } from "./telephony-brand";
import {
  TELEPHONY_FAQ,
  TELEPHONY_FEATURES,
  TELEPHONY_FINAL,
  TELEPHONY_FLOW,
  TELEPHONY_FOOTER_NAV,
  TELEPHONY_HEADER,
  TELEPHONY_HERO,
  TELEPHONY_MENUS,
  TELEPHONY_OUTCOMES,
  TELEPHONY_PORTAL,
  TELEPHONY_PRICING,
  TELEPHONY_SETUP,
  type TelephonyFeature,
} from "./telephony-landing-config";
import {
  TelephonyCallFlow,
  TelephonyHeader,
  TelephonyProCalculator,
  TelephonyReveal,
} from "./telephony-landing.client";

/** The QR drawn on the last setup step (decorative, not a working code). */
const SETUP_QR_PATH =
  "M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2zM14 0h7v7h-7zM15 1v5h5V1zM16 2h3v3h-3zM0 14h7v7H0zM1 15v5h5v-5zM2 16h3v3H2zM8 0h1v2H8zM10 1h2v1h-2zM9 3h2v2H9zM12 4h1v3h-1zM8 6h2v2H8zM0 8h2v1H0zM3 8h3v1H3zM7 9h3v1H7zM11 8h2v2h-2zM14 8h1v2h-1zM16 9h3v1h-3zM20 8h1v3h-1zM1 10h2v2H1zM5 11h3v1H5zM9 11h1v3H9zM12 11h3v1h-3zM17 11h2v2h-2zM8 13h1v1H8zM11 13h2v2h-2zM14 14h2v1h-2zM18 14h3v1h-3zM8 15h2v2H8zM13 16h1v2h-1zM15 16h3v1h-3zM19 16h1v3h-1zM8 18h3v1H8zM12 19h2v2h-2zM15 18h2v3h-2zM10 20h1v1h-1zM18 20h3v1h-3z";

/** The QR on the portal sketch's Zoiper card (decorative). */
const PORTAL_QR_PATH =
  "M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2zM14 0h7v7h-7zM15 1v5h5V1zM16 2h3v3h-3zM0 14h7v7H0zM1 15v5h5v-5zM2 16h3v3H2zM8 1h2v2H8zM11 0h1v3h-1zM9 4h3v1H9zM8 8h3v1H8zM12 8h2v2h-2zM0 9h3v1H0zM4 9h2v2H4zM15 9h2v1h-2zM18 8h3v2h-3zM9 10h2v3H9zM13 11h3v1h-3zM17 12h2v2h-2zM1 12h2v1H1zM8 14h2v2H8zM11 14h3v1h-3zM15 15h2v2h-2zM18 16h3v1h-3zM10 17h3v1h-3zM8 19h2v2H8zM14 18h1v3h-1zM17 19h2v2h-2z";

/** The nine bars of the phone's voice wave, each with its own delay. */
const WAVE_DELAYS = ["-.1s", "-.5s", "-.3s", "-.8s", "-.2s", "-.6s", "-.4s", "-.9s", "-.15s"];

function Check() {
  return (
    <i aria-hidden="true">
      <RiCheckLine />
    </i>
  );
}

function FeatureVisual({ visual }: { visual: TelephonyFeature["visual"] }) {
  if (visual === "lines") {
    return (
      <div className="lines-vis">
        {TELEPHONY_FEATURES.lines.map((line) => (
          <span key={line}>
            <i aria-hidden="true">
              <RiCheckboxBlankCircleFill />
            </i>
            {line}
          </span>
        ))}
      </div>
    );
  }
  if (visual === "free") {
    return (
      <div className="free-int">
        <span className="ph">
          <i aria-hidden="true">
            <RiSmartphoneLine />
          </i>
        </span>
        <span className="ln">
          <b>{TELEPHONY_FEATURES.unlimited}</b>
        </span>
        <span className="ph">
          <i aria-hidden="true">
            <RiSmartphoneLine />
          </i>
        </span>
      </div>
    );
  }
  if (visual === "history") {
    return (
      <div className="hist">
        {TELEPHONY_FEATURES.history.map((row) => (
          <div key={row.label} className={row.missed ? "miss" : undefined}>
            <i aria-hidden="true">
              <RiPhoneLine />
            </i>
            <span>{row.label}</span>
            <span>{row.state}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export interface TelephonyLandingProps {
  /** The next/font variables (telephony-fonts.ts), set on the landing's root. */
  fontClassName?: string;
}

export function TelephonyLanding({ fontClassName = "" }: TelephonyLandingProps) {
  const { stem, suffix } = telephonyWordmark(TELEPHONY_SITE_NAME);
  const loginUrl = LANDING_CONFIG.loginUrl;
  const signupUrl = LANDING_CONFIG.signupUrl;

  return (
    <div className={`tel ${fontClassName}`.trim()}>
      <TelephonyReveal />
      <TelephonyHeader siteName={TELEPHONY_SITE_NAME} stem={stem} suffix={suffix} loginUrl={loginUrl} />

      <main>
        <section className="hero" id="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">{TELEPHONY_HERO.eyebrow}</span>
              <h1>
                {TELEPHONY_HERO.headline}
                <span className="hl">
                  {TELEPHONY_HERO.highlight}
                  <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 14 C 60 4, 140 4, 297 11" stroke="var(--accent)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".35" />
                  </svg>
                </span>
              </h1>
              <p className="lede">{TELEPHONY_HERO.lede}</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#pricing">
                  {TELEPHONY_HERO.primary}{" "}
                  <i aria-hidden="true">
                    <RiArrowRightLine />
                  </i>
                </a>
                <a className="btn btn-ghost" href="#talk">
                  <i aria-hidden="true">
                    <RiCustomerService2Line />
                  </i>{" "}
                  {TELEPHONY_HERO.secondary}
                </a>
              </div>
              <div className="trust">
                {TELEPHONY_HERO.trust.map((t) => (
                  <span key={t}>
                    <Check />
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="stage" aria-hidden="true">
              <svg className="rings" viewBox="0 0 560 594">
                <circle className="ring" cx="280" cy="297" r="270" />
                <circle className="ring r2" cx="280" cy="297" r="205" />
                <circle className="ring" cx="280" cy="297" r="140" />
                <circle className="pulse" cx="280" cy="297" r="270" />
                <circle className="pulse p2" cx="280" cy="297" r="270" />
              </svg>
              <div className="phone">
                <div className="screen">
                  <div className="notch" />
                  <div className="lab">{TELEPHONY_HERO.phone.label}</div>
                  <div className="who">{TELEPHONY_HERO.phone.who}</div>
                  <div className="via">
                    {TELEPHONY_HERO.phone.via[0]}
                    <br />
                    {TELEPHONY_HERO.phone.via[1]}
                  </div>
                  <div className="wave">
                    {WAVE_DELAYS.map((d, i) => (
                      <b key={i} style={{ animationDelay: d }} />
                    ))}
                  </div>
                  <div className="answer">
                    <span className="no">
                      <i>
                        <RiCloseLine />
                      </i>
                    </span>
                    <span className="yes">
                      <i>
                        <RiPhoneLine />
                      </i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="outcomes">
          <div className="wrap outcome-row">
            {TELEPHONY_OUTCOMES.map((o, i) => {
              const Icon = o.icon;
              return (
                <div key={o.title} className="outcome rv">
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true">
                    <Icon />
                  </i>
                  <h3>{o.title}</h3>
                  <p>{o.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flow" id="flow">
          <div className="wrap">
            <div className="flow-head">
              <div>
                <span className="eyebrow">{TELEPHONY_FLOW.eyebrow}</span>
                <h2 style={{ marginTop: 16 }}>{TELEPHONY_FLOW.heading}</h2>
              </div>
              <p>{TELEPHONY_FLOW.blurb}</p>
            </div>
            <TelephonyCallFlow />
            <div className="flow-foot">
              <span>
                <i aria-hidden="true">
                  <RiInformationLine />
                </i>
                {TELEPHONY_FLOW.note}
              </span>
            </div>
          </div>
        </section>

        <section className="section" id="setup">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow">{TELEPHONY_SETUP.eyebrow}</span>
                <h2>{TELEPHONY_SETUP.heading}</h2>
              </div>
              <p className="lede">{TELEPHONY_SETUP.lede}</p>
            </div>
            <div className="steps">
              {TELEPHONY_SETUP.steps.map((s, i) => (
                <div key={s.title} className="stepc rv">
                  {i === TELEPHONY_SETUP.steps.length - 1 && (
                    <svg className="qr" viewBox="0 0 21 21" aria-hidden="true" shapeRendering="crispEdges">
                      <g fill="var(--accent)">
                        <path d={SETUP_QR_PATH} />
                      </g>
                    </svg>
                  )}
                  <div className="num">{i + 1}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section flush" id="features">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow">{TELEPHONY_FEATURES.eyebrow}</span>
                <h2>{TELEPHONY_FEATURES.heading}</h2>
              </div>
            </div>
            <div className="bento">
              {TELEPHONY_FEATURES.cards.map((c) => {
                const Icon = c.icon;
                const cls = ["card", `span${c.span}`, c.lead ? "wide feature-a" : "", "rv"].filter(Boolean).join(" ");
                return (
                  <div key={c.title} className={cls}>
                    <div className="ic">
                      <i aria-hidden="true">
                        <Icon />
                      </i>
                    </div>
                    <h3>
                      {c.title}
                      {c.pro && (
                        <>
                          {" "}
                          <span className="pro">{TELEPHONY_FEATURES.proBadge}</span>
                        </>
                      )}
                    </h3>
                    <p>{c.text}</p>
                    <FeatureVisual visual={c.visual} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section flush">
          <div className="wrap portal">
            <div>
              <span className="eyebrow">{TELEPHONY_PORTAL.eyebrow}</span>
              <h2 style={{ marginTop: 16 }}>{TELEPHONY_PORTAL.heading}</h2>
              <div className="ticks">
                {TELEPHONY_PORTAL.ticks.map((t) => (
                  <div key={t}>
                    <Check />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="rv">
              <div className="sketch" role="img" aria-label={TELEPHONY_PORTAL.sketchLabel}>
                <div className="sk-bar">
                  <b />
                  <b />
                  <b />
                  <span>{TELEPHONY_PORTAL.bar}</span>
                </div>
                <div className="sk-body">
                  <div className="sk-card">
                    <div className="t">{TELEPHONY_PORTAL.balance}</div>
                    <span className="sk-btn">{TELEPHONY_PORTAL.topUp}</span>
                  </div>
                  <div className="sk-card">
                    <div className="t">{TELEPHONY_PORTAL.subscription}</div>
                    <div className="v">{TELEPHONY_PORTAL.plan}</div>
                  </div>
                  <div className="sk-card sk-wide">
                    <div className="t" style={{ marginBottom: 6 }}>
                      {TELEPHONY_PORTAL.lineDetails}
                    </div>
                    {TELEPHONY_PORTAL.rows.map((r) => (
                      <div key={r.label} className="sk-row">
                        <span>{r.label}</span>
                        <span className={r.live ? "live" : undefined}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="sk-card sk-wide sk-qr">
                    <svg viewBox="0 0 21 21" shapeRendering="crispEdges" aria-hidden="true">
                      <rect width="21" height="21" fill="var(--surface)" />
                      <g fill="var(--ink)">
                        <path d={PORTAL_QR_PATH} />
                      </g>
                    </svg>
                    <div>
                      <div className="t">{TELEPHONY_PORTAL.zoiper}</div>
                      <p>{TELEPHONY_PORTAL.zoiperText}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sketch-note">
                <i aria-hidden="true">
                  <RiInformationLine />
                </i>
                {TELEPHONY_PORTAL.note}
              </div>
            </div>
          </div>
        </section>

        <section className="section flush">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow">{TELEPHONY_MENUS.eyebrow}</span>
                <h2>{TELEPHONY_MENUS.heading}</h2>
              </div>
            </div>
            <div className="who-grid">
              {TELEPHONY_MENUS.items.map((w) => {
                const Icon = w.icon;
                return (
                  <div key={w.title} className="who rv">
                    <i aria-hidden="true">
                      <Icon />
                    </i>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                    <div className="menu">
                      {w.menu.map((m, i) => (
                        <span key={m}>
                          <kbd>{i + 1}</kbd>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pricing" id="pricing">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow">{TELEPHONY_PRICING.eyebrow}</span>
                <h2>{TELEPHONY_PRICING.heading}</h2>
              </div>
              <p className="net-note">
                <i aria-hidden="true">
                  <RiArrowLeftRightLine />
                </i>
                {TELEPHONY_PRICING.network}
              </p>
            </div>
            <div className="plans">
              {TELEPHONY_PRICING.plans.map((plan) => {
                const cls = ["plan", plan.id === "pro" ? "pro-plan" : "", plan.locked ? "locked" : ""].filter(Boolean).join(" ");
                return (
                  <div key={plan.id} className={cls} aria-disabled={plan.locked ? true : undefined}>
                    <div className="pn">
                      <h3>
                        {plan.locked && (
                          <>
                            <i aria-hidden="true">
                              <RiLockLine />
                            </i>{" "}
                          </>
                        )}
                        {plan.name}
                      </h3>
                      {plan.badge && <span className="pro">{plan.badge}</span>}
                    </div>
                    <div className="price">
                      <b>{plan.price}</b>
                      <span>{plan.per}</span>
                    </div>
                    <p className="sub">{plan.sub}</p>
                    {plan.id === "pro" && <TelephonyProCalculator />}
                    <ul>
                      {plan.features.map((f) => (
                        <li key={f}>
                          <Check />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {plan.locked ? (
                      <button type="button" className="btn btn-ghost" disabled>
                        {plan.cta}
                      </button>
                    ) : plan.id === "pro" ? (
                      <a className="btn btn-primary" href={signupUrl}>
                        {plan.cta}{" "}
                        <i aria-hidden="true">
                          <RiArrowRightLine />
                        </i>
                      </a>
                    ) : (
                      <a className="btn btn-ghost" href={signupUrl}>
                        {plan.cta}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="talk" id="talk">
              <i aria-hidden="true">
                <RiCustomerService2Line />
              </i>
              <p>
                <b>{TELEPHONY_PRICING.talk.lead}</b>
                {TELEPHONY_PRICING.talk.text}
              </p>
              {TELEPHONY_PRICING.talk.href && (
                <a className="btn btn-ghost" href={TELEPHONY_PRICING.talk.href}>
                  {TELEPHONY_PRICING.talk.cta}
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="wrap faq">
            <div>
              <span className="eyebrow">{TELEPHONY_FAQ.eyebrow}</span>
              <h2>{TELEPHONY_FAQ.heading}</h2>
            </div>
            <div>
              {TELEPHONY_FAQ.items.map((item, i) => (
                <details key={item.q} open={i === 0}>
                  <summary>
                    {item.q}
                    <i aria-hidden="true">
                      <RiAddLine />
                    </i>
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final">
          <div className="wrap">
            <div className="final-box">
              <svg className="bg" viewBox="0 0 460 460" aria-hidden="true">
                <g fill="none" stroke="var(--accent-ink)" strokeWidth="2">
                  <circle cx="230" cy="230" r="220" />
                  <circle cx="230" cy="230" r="160" strokeDasharray="4 10" />
                  <circle cx="230" cy="230" r="100" />
                  <circle cx="230" cy="230" r="40" />
                </g>
              </svg>
              <div>
                <h2>{TELEPHONY_FINAL.heading}</h2>
                <p>{TELEPHONY_FINAL.text}</p>
              </div>
              <div className="cta-row">
                <a className="btn btn-dark" href="#pricing">
                  {TELEPHONY_FINAL.primary}{" "}
                  <i aria-hidden="true">
                    <RiArrowRightLine />
                  </i>
                </a>
                <a className="btn btn-line" href="#talk">
                  {TELEPHONY_FINAL.secondary}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot">
          <SiteCredit as="span" siteName={TELEPHONY_SITE_NAME} heartClassName="heart" />
          <nav>
            {TELEPHONY_FOOTER_NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={loginUrl}>{TELEPHONY_HEADER.login}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default TelephonyLanding;
