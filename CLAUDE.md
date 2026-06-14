# DSHub Static

Online media about design systems in Russian digital products.
Astro 4 (SSG) + React islands, TypeScript strict, CSS Modules + design tokens. No Tailwind.

## Quick Start

```sh
npm run dev        # http://localhost:4321
npm run tokens     # regenerate src/styles/tokens.css from tokens/dshub-tokens.json
npm run build      # tokens + astro build → dist/
```

Node 20 (Netlify). `tokens.css` is generated and gitignored — always run `npm run tokens` before build.

## Architecture

### UDF Component System (atomic design, 7 layers)

| Prefix | Layer           | Example                        |
|--------|-----------------|--------------------------------|
| `Q_`   | Quark           | Q_Icon, Q_Logo, Q_BrandMark   |
| `A_`   | Atom            | A_Text, A_Button, A_Tag       |
| `M_`   | Molecule        | M_Segment, M_MetaRow          |
| `O_`   | Organism        | O_Header, O_Quiz, O_Paragraph |
| `W_`   | Wrapper         | W_SectionHeader                |
| `S_`   | Superorganism   | S_Hero                         |
| `T_`   | Template        | (planned: T_Home, T_Cases)     |

**Rules:**
- Figma name = Code name. Never rename on handoff.
- Build bottom-up: don't create an organism until its atoms/molecules exist.
- States (hover/pressed/disabled) = CSS pseudo-classes, never component props.
- Props are semantic: `variant`, `size`, `selected`, `disabled`.

### Two-Layer Token System

- **Core** — raw primitives: colors (neutral, pink, lime), spacing, sizes, radius, typography, breakpoints, durations.
- **Semantic** — roles referencing core: `--surface-button: var(--neutral-110)`, `--text-primary: var(--neutral-150)`.
- Components use **semantic tokens only**, never core directly.
- Source: `tokens/dshub-tokens.json` (Tokens Studio format). Generator: `scripts/build-tokens.mjs`.

### Styling

- CSS Modules scoped with `[name]__[local]` (e.g. `A_Button__ct-icon`).
- All values via `var(--token)`. No magic numbers.
- `src/styles/global.css` imports chain: `tokens.css` → `base.css` → `fonts.css`.

### Content Model

JSON collections in `src/content/{cases,terms,resources}/`. Cases have a `blocks[]` array with types:
`paragraph`, `heading`, `quote`, `code`, `image`, `links`, `numbered-list`, `summary`, `quiz-single`, `quiz-multiple`.

`src/lib/ContentRenderer.astro` maps block types to components.

### React Islands

Only for stateful interaction (O_Quiz, M_QuizOption). Hydrated with `client:visible`.
A_Button is `.astro` — cannot be used inside React; use native `<button>` styled with tokens.

## Key Paths

- `src/components/` — quarks/, atoms/, molecules/, organisms/, wrappers/, superorganisms/
- `src/styles/` — tokens.css (generated), base.css, fonts.css, global.css
- `src/layouts/BaseLayout.astro` — global wrapper (header, styles, fonts)
- `src/lib/ContentRenderer.astro` — block-type → component mapper
- `tokens/dshub-tokens.json` — token source
- `scripts/build-tokens.mjs` — CSS variable generator
- `scripts/build-icons.mjs` — Figma icon SVG → `icons.ts` registry
- `docs/` — design tokens (01-), UDF system (02-), build checklist (03-), content model (04-)
- `public/fonts/` — Suisse Int'l, Stapel Condensed (WOFF2)

## Critical Gotchas

1. Q_Icon uses `currentColor` — set color on the parent element, not competing classes.
2. `scrollbar-gutter: stable` on `<html>` prevents horizontal shift between routes.
3. Fonts: Inter from Google Fonts (fallback), Suisse Int'l + Stapel self-hosted with `font-display: swap`.
4. Path aliases: `@components/*`, `@lib/*`, `@content/*`, `@styles/*`.

## Figma

File key: `8iqoWPy7I1bhv2C4AEFHUa`. Use Figma MCP to extract design context. Convert generated Tailwind/React → CSS Modules + tokens.

## Deploy

Netlify static. `npm run build` → `dist/`. Soft 404 redirect configured.
