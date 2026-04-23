# Midi — Design Engineer Take-Home

Submission for the Midi Design Engineer take-home assignment: translate a small design system from Figma into code, extend it with a new component, and apply both to a realistic product UI.

**Figma file:** https://www.figma.com/design/21q0b755dnwsRzUmViiTST/Copy-of-Mini-Design-System
**Write-up:** see [`AI-NOTES.md`](./AI-NOTES.md) — a running log of how the work happened, decisions made, and the human/AI collaboration.

## Getting started

```bash
npm install
npm run dev
```

Dev server: http://localhost:5173

## What's in here

```
src/
├── components/
│   ├── Button.tsx   — 3 hierarchies × 4 states, md size, token-driven
│   └── Pill.tsx     — Selectable Pill component (derived from Button primitives)
├── styles/
│   ├── tokens.css   — All 248 tokens from the Figma source, as CSS custom
│   │                  properties. Plus two new tokens (brand-primary-50 and
│   │                  brand-primary-100) added to support the Pill's tonal
│   │                  selected-state.
│   └── index.css    — Tailwind directives + base resets
└── App.tsx          — Symptom-selection card (the "real product UI" applying
                       Button + Pill together)
```

Tailwind config (`tailwind.config.js`) references the CSS custom properties rather than baking hex values into its theme, so tokens remain the single source of truth.

## Stack

- Vite + React 19 + TypeScript
- Tailwind v3 (theme bound to CSS custom properties)
- Zero runtime dependencies beyond `clsx`

## Design-system observations

Flagged during the initial token scan and preserved in code for fidelity to the source (not fixed — see `AI-NOTES.md` §0 for full list):

1. `brand-primaryt-200` — typo in the Figma variable, aliased
2. Focus ring `#B6E7A0` (green) on brand-blue buttons is low contrast
3. `Component colors/Utility/Brand/*` tokens resolve to cool-grey, not brand blue
4. `text-tertiary` resolves to `#EEF5F7` (near-white — likely a bug)
5. Primary button Hover lightens, Focus darkens — non-standard but consistent across all hierarchies
