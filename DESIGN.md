# Memecoin 101 — Design system

Direction: a dark trading-desk look taken from the Memecoin 101 logo set: near-black surfaces, one acid-green accent, heavy grotesk headings and spaced monospace labels. It should feel technical and sober, not like a casino. Dark is the default; light mode follows the system or the toggle.

This direction was chosen from the brand's own logo, not compared against reference sites.

## Color

| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | `#0A0B0E` | `#F6F7F4` | Page background |
| `--surface` | `#16171C` | `#FFFFFF` | Cards, panels |
| `--surface-2` | `#1E2027` | `#EDEFEA` | Raised rows, code chips |
| `--border` | `#2A2D35` | `#D9DCD4` | Dividers, card borders |
| `--text` | `#F4F5F2` | `#0A0B0E` | Headings, body |
| `--text-muted` | `#9A9FAA` | `#5A5F68` | Secondary text |
| `--primary` | `#4ADE80` | `#4ADE80` | Primary button fill, logo, chart up-candles |
| `--on-primary` | `#0A0B0E` | `#0A0B0E` | Text on primary |
| `--link` | `#4ADE80` | `#15803D` | Links and green text (light uses a darker green for 4.5:1 contrast) |
| `--warning` | `#FBBF24` | `#B45309` | Caution states, placeholders |
| `--danger` | `#F87171` | `#B91C1C` | Red flags, down-candles |

There's one accent and no gradients. Green marks actions and "passed" checks only.

## Typography

- **Archivo** (700/800, slightly condensed width 88) for headings and the wordmark. **Archivo** 400/500 for body.
- **JetBrains Mono** 500 for eyebrows, labels, numbers and prices. Eyebrows use uppercase with 0.18em tracking, like "101 COURSE" in the logo.

Scale (px / line-height): 64/1.0 display, 44/1.05 h2, 24/1.2 h3, 18/1.6 lead, 16/1.6 body, 14/1.5 small, 12/1.4 label. Headings shrink with `clamp()` on small screens. Keep body text at 65ch max.

## Spacing and layout

4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Sections are 96px apart on desktop and 64px on mobile. Content width is 1120px with a 16px gutter on phones and 24px above 640px.

## Shape and depth

Radius: 8px (chips, inputs), 14px (buttons), 24px (cards, matching the logo tiles). Borders do the separating. There are no shadows, except one soft glow on the primary button's hover state.

## Components

- **Primary button**: green fill, dark text, 14px radius, 48px tall. Hover brightens and adds a glow. Focus shows a 2px outline offset 3px in `--text`.
- **Secondary button**: transparent with a `--border` outline. Hover changes the border to `--text`.
- **Link**: `--link` color, underlined on hover and focus.
- **Card**: `--surface`, 1px `--border`, 24px radius, 24–32px padding.
- **Check row**: mono label, value, and a status chip (pass / warn / fail).
- **FAQ**: native `<details>` with a `+` marker.
- **Placeholder**: dashed `--warning` outline, mono text in brackets. Each one must be replaced before launch.

## Imagery and icons

The logo marks (candlesticks, up-trend coin, up arrow) are the only illustration. Charts and checklists are drawn in inline SVG or HTML. Icons are simple 2px-stroke inline SVGs. No emoji, stock photos, rocket ships or Lambos.
