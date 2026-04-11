# IronIQ Design System Reference

This directory holds the source-of-truth DESIGN.md files that agents should reference when doing UI work on IronIQ. Both files come from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (via getdesign.md).

## Files

- **[DESIGN.md](./DESIGN.md)** — Stripe-inspired. The **house system**. Applies to every surface by default (Coach, Program, Insights, Profile, landing page, auth).
- **[DESIGN-track-superhuman.md](./DESIGN-track-superhuman.md)** — Superhuman-inspired. Scoped to **Track (live workout) surfaces only** — set logging, rest timer, active session banner. Use its purple-glow, tight-line-height, power-user language there and nowhere else.

## Dark-first adaptation (important)

Both source systems are **light-first** (white canvas, dark text). IronIQ is **forced dark** (`<html class="dark">`). When agents apply these rules, they must invert the surface logic:

- **Stripe's "brand dark" sections (`#1c1e54` background with white text) become IronIQ's default canvas**, not an accent. Every page is effectively a Stripe dark section.
- **Keep Stripe's purple CTA language (`#533afd`)** as-is — it works on both light and dark surfaces.
- **Keep Stripe's signature blue-tinted shadows (`rgba(50,50,93,0.25)`)** — they translate to dark mode unchanged (they're already blue-tinted).
- **Stripe's `#061b31` deep-navy headings invert to near-white text** (`oklch(0.985 0 0)`) — but the *principle* (warm, on-brand, not pure black/white) stays.
- **Stripe's white card surfaces become dark navy-tinted card surfaces** — use `oklch(~0.22 0.04 265)` instead of `#ffffff`.
- **Superhuman's Mysteria Purple hero (`#1b1938`)** maps directly to IronIQ's existing dark background — no inversion needed. The `#e9e5dd` warm-cream button becomes IronIQ's CTA color *on the Track surface only*.

## Typography substitution

Neither `sohne-var` (Stripe) nor `Super Sans VF` (Superhuman) is available to us. IronIQ uses **Outfit** via next/font, which is a reasonable stand-in:
- Outfit has full weight range (100–900), so weight 300 (Stripe display) and weight 460 (Superhuman body) approximations work.
- The OpenType `ss01` stylistic set from Stripe does not apply — skip it.
- Outfit does not have tabular numerals as a feature flag — for financial/metric displays, use `font-variant-numeric: tabular-nums` explicitly.

## Radius

Both systems use conservative rounding. IronIQ's current `--radius` is `0.625rem` (10px). Stripe caps at 8px; Superhuman uses only 8px and 16px. **Leave `--radius` at 10px** — it sits between the two and works for shadcn primitives. Don't go higher.

## Shadows

Adopt Stripe's blue-tinted two-layer formula as a custom property. See `src/app/globals.css` — `--shadow-stripe-standard` and `--shadow-stripe-elevated` expose them for use on cards and featured elements.

## Where NOT to apply

- **Tab bar navigation** — already works, leave it.
- **Auth forms** — already reads as Stripe-lite, minor polish only.
- **Landing page** — already uses Stripe-like gradient glow, treat it as the reference implementation for the system.
