# AI-Notes — Midi Design Engineer Take-Home

A running log of how I collaborated with Claude (Opus 4.7) through Claude Code to complete this assignment. Written while the work was happening, not after — so the sequencing is real.

---

## 0 · Framing decisions (before any code)

### Scoping the Button

The brief says "3 variants + states (hover, focus, disabled)." The actual Figma Button has a 4 × 6 × 5 × 2 matrix (size × hierarchy × state × icon-only) — ~200 symbols. Claude flagged the mismatch before starting and proposed scoping to **Primary / Secondary / Tertiary × Default / Hover / Focus / Disabled × md size**. That's what the brief literally asks for; the component API was architected so the omitted axes (size, icon-only, Link variants, Loading state) can layer in later without rewrites.

### Stack + tooling

- **Vite + React + TypeScript + Tailwind v3** (Claude suggested v3 over v4 for 2-hour-delivery risk; I agreed).
- **Token strategy: CSS custom properties as source of truth, Tailwind theme references them.** This mirrors the shape of the Figma MCP export (`var(--colors/brand/primary-400, #579fff)`), so we're translating one variable system into another rather than baking hex codes into config. It also leaves dark-mode and theming open for later with no rewrites.
- Single repo at `/Users/fox/midi-takehome`. Shareable as a GitHub repo or imported into StackBlitz for submission.

### Design-system bugs I flagged while reading the tokens

Claude surfaced these during the token scan. I parked them as known issues rather than "fixing" the design in code — we mirror Figma for fidelity and note the bugs in the write-up.

1. **Token typo.** The Hover fill on the Primary button resolves to `Colors/Brand/Primaryt 200` — note the stray `t` in `Primaryt`. The typo is baked into the Figma variable itself. We define both aliases in tokens.css so the Figma export still works.
2. **Green focus ring on a blue button.** `focus-ring` = `#B6E7A0` (which is `Colors/Brand/Secondary 200`). On `#006AF9` Primary-focused, this is a low-contrast pairing that probably doesn't meet WCAG 3:1 for focus indicators.
3. **"Utility/Brand" aliases resolve to greys, not blue.** Every `Component colors/Utility/Brand/*` token maps to the cool-grey Base palette, not the brand blue. So semantic tokens like `utility-brand-600` don't mean "brand 600" in the brand-color sense — they're neutral aliases that happen to live under a "Brand" folder. Worth raising with the design system owner.
4. **`text-tertiary` resolves to `#EEF5F7`** (near-white). Normally tertiary text is a muted foreground; this reads as a design error.
5. **Primary Hover is LIGHTER than Default; Primary Focus is DARKER.** Hover goes `primary-400 → primaryt-200`, focus goes `primary-400 → primary-600`. This is non-standard (usually hover darkens) but consistent across all three hierarchies, so it's an intentional style choice we mirror.
6. **Tertiary focus uses a "double ring"** — a 2px inset white ring, then a 4px green outer ring. Elegant trick: it creates a visual gap between the button and the focus halo. Preserved in code via stacked `box-shadow`.

---

## 1 · Prompts I gave Claude (the meta-log)

### Opening

> *"Here's the assignment that was given to me regarding the file you now have access to. Read it, and we will work through it"* — I didn't hand Claude a prescription. I handed it the brief and the Figma URL and made it negotiate scope.

### Pushback I gave

- When Claude started exploring, I told it to **"do a full scan of the entire file"** rather than just the single node I'd originally pointed at.
- I deferred the token-bug flags ("Not yet, let's keep those flagged observations for later") so they'd be logged in notes instead of polluting code decisions.
- I let Claude pick the stack defaults (Vite+TS, Tailwind v3, CSS-vars), but only after it explained the tradeoff.

### What Claude proposed and I accepted

- The 3 × 4 × md-size scope for Button.
- CSS-variable-first token strategy.
- Project layout (`src/tokens/tokens.css`, `src/components/Button.tsx`, etc.).
- Phased plan: tokens → Button → Pill → Card → Figma component → write-up.

### What I modified

- **Rejected Option A** (solid brand-primary-400 fill) for the selected-pill state. Claude had it as its lead recommendation — I pushed back that the card felt "like a bunch of selected CTAs" with four blues competing for attention, asked for a tonal alternative, and iterated to a third option (deeper tonal) that landed.
- **Insisted on the full 6-variant matrix in Figma** (Selected × State). Claude had recommended scoping to 2 variants ("Selected=true/false only") for time. I wanted the matrix so the Figma and code surfaces stayed aligned and the hover/focus treatments were documented for the next designer.
- **Caught the footer layout shift** — Claude had this note in its own write-up as "1px shift on disable, accepted for spec fidelity," but I flagged it live when I saw the footer moving between toggle states. Claude then reconsidered and added `border border-transparent` to the Button base to reserve the slot. Design-system fidelity ≠ pixel fidelity if the interaction is broken.
- **Bumped the helper text and eyebrow** after the first-draft card review. The "Step 2 of 4" became a rounded-full brand-50 badge instead of plain text; helper moved from `text-secondary` to `fg-tertiary` for one step more weight.

### What I accepted as-proposed

- The 3 × 4 × md-size scope for Button.
- CSS-variable-first token strategy.
- Project layout (`src/styles/tokens.css`, `src/components/Button.tsx`, etc.).
- Phased plan: tokens → Button → Pill → Card → Figma component → write-up.
- Pseudo-class based state styling (`:hover`, `:focus-visible`, `:disabled`) rather than a `state` prop.
- The A/B/C showcase pattern for the Pill's selected-fill decision — showing alternatives rather than picking one.

---

## 2 · Phase log (filled during the work)

### Phase 0 — Discovery ✅
- Pulled all 248 tokens from 7 collections (Primitives, Color modes, Radius, Spacing, Widths, Containers, Typography).
- Pulled all 12 md Button variants' generated code (3 hierarchies × 4 states).
- Logged design-system bugs above.

### Phase 1 — Tokens + Button (code complete, pending visual QA)

**Files added**
- `src/styles/tokens.css` — all 248 tokens as CSS custom properties, organized by category. Includes the `--colors-brand-primaryt-200` typo alias to keep Figma MCP exports compatible.
- `src/styles/index.css` — Tailwind directives + base body styles + global `:focus { outline: none }` (we rely on `:focus-visible` for keyboard-only rings).
- `tailwind.config.js` — theme keys reference `var(--…)` rather than hex literals. Spacing uses `token-*` prefixes (e.g. `p-token-xs`) to avoid colliding with Tailwind's numeric scale. Custom shadow utilities: `shadow-xs`, `shadow-xs-skeuomorphic`, `shadow-focus-ring-skeuomorphic`, `shadow-focus-ring-tertiary`.
- `src/components/Button.tsx` — 3 × 4 matrix. API: `hierarchy`, `size="md"`, `leadingIcon?`, `trailingIcon?`, plus all native `<button>` attributes.

**Design decisions (worth flagging in submission)**

1. **States are pseudo-classes, not a prop.** Figma has `state=Hover/Focused/Disabled` as explicit variants. In code that becomes `:hover`, `:focus-visible`, `:disabled`. Avoids prop-drilling state and lets the browser handle keyboard-vs-mouse focus correctly.
2. **`:focus-visible` over `:focus`.** Keyboard users see the green ring; mouse clickers don't. The Figma variants can't express this distinction; code can.
3. **Size is already a typed union** even though only `md` is implemented, so adding `sm | lg | xl` later is a one-line widening.
4. **Icon slots stay generic (`ReactNode`)** rather than baking a specific icon system in. Leaves the caller free to use Lucide, a custom set, or SVG directly.
5. **Token typo carried forward intentionally.** `bg-brand-primaryt-200` is valid because the alias exists. This preserves round-trip compatibility with the Figma MCP export — if anyone pastes its generated classes directly, they work.
6. **No `iconOnly` prop in v1.** The brief didn't need it, and the Pill is label-only. Leaving it out reduces surface area until there's a real use case.

**Prompt technique used here**

Rather than pasting the Figma MCP code verbatim (which would have produced absolutely-positioned divs with inline class strings), I had Claude *read* the per-state generated snippets, extract the visual intent (bg, text, border, shadow per state), and re-author idiomatic Tailwind against our token-based theme. The output is about 1/4 the length of the raw Figma export and uses semantic names (`bg-brand-400`, `shadow-focus-ring-skeuomorphic`) instead of raw hex.

**Sanity check**
- `tsc -p tsconfig.app.json --noEmit` → clean
- Vite dev server starts without errors at http://localhost:5173
- Pending: human eyeball check against Figma variants before moving on.


### Phase 2 — Selectable Pill ✅

**Approach: I explicitly rejected "pick one, build it."** Instead I asked Claude to build the Pill with a temporary `variant` prop so multiple selected-fill treatments could render side-by-side in the dev UI. That turned into a three-round A/B/C exploration:

1. **Option A — solid brand fill** (`bg-brand-primary-400`, white text). Claude's lead recommendation. Built first. My response: rejected because the card with 2 selected pills + a Primary CTA had four same-blue elements stacking visually; the eye lost the CTA.
2. **Option B — light tonal** (`#EAF2FF` fill, brand-400 border, brand-600 text). Quieter. Better hierarchy vs. the CTA, but selected pills were almost too soft to read at a glance.
3. **Option C — deeper tonal** (`#D6E4FF` fill, same border + text, `#B8D0FF` on hover). Picked. Clear "on" state without the CTA-competition problem.

**What this proved about the token system.** The Figma primary ramp is just 200/400/600. A real tonal treatment needs a 50 or a 100. So we formalized both: `--colors-brand-primary-50: #eaf2ff` and `--colors-brand-primary-100: #d6e4ff` became new tokens in `tokens.css` and new `brand.50` / `brand.100` keys in the Tailwind theme. The "50 for eyebrow backgrounds, 100 for selected fills" convention emerged from the design decision — not picked in advance. I added both to the Figma file as primitives in Phase 4 so the design and code rams match.

**Post-decision cleanup.** The `variant` prop and losing branches were removed from `Pill.tsx`. The component now has a single API: `{ label, selected, onChange, ...buttonAttrs }`. Uses `aria-pressed` for accessibility AND as a CSS state selector. Same pseudo-class strategy as Button (`:hover`, `:focus-visible`, `:disabled`).

**Lineage from Button.** Pill shares Button's DNA (same tokens, same focus-ring shadow utility, same font weight and line height) but diverges on shape (`rounded-full`) and semantics (two-state toggle, not a trigger). Commented in the source so the intent survives.

### Phase 3 — Symptom Card ✅

Built from the A/B/C scaffold — I reused the `PillDemo` helper layout as the starting point and tightened it into a real card. After first draft, Claude asked four questions:

1. Visual hierarchy — OK.
2. Footer balance — OK.
3. Density (560px × 40px padding) — OK.
4. Eyebrow "Step 2 of 4" — I asked for it to stand out with a background. Became a rounded-full brand-50 chip with brand-600 uppercase tracked text.

Helper text also felt too quiet on first pass — bumped from `text-secondary` (#6B7C88) to `fg-tertiary` (#415465).

**The layout-shift bug.** Toggling a pill between the enabled/disabled CTA made the footer jump ~2px. Claude's original Button added `disabled:border` only in the disabled state. With `box-sizing: border-box` and no explicit height, 1px top + 1px bottom = 2px box growth on disable. Fix: `border border-transparent` on every button, toggle color only. Tradeoff: every Primary button now renders 2px larger than the Figma spec (which has no border at rest). Tradeoff accepted — interaction stability > pixel fidelity when the spec's choice causes visible shift.

Also flagged in this phase: **Tailwind config changes require dev-server restart, not just HMR.** When I added `brand.50` / `brand.100` to `tailwind.config.js`, Vite's HMR reloaded CSS but PostCSS/Tailwind didn't re-read its config. `bg-brand-100` classes fell through to no-op. Kill and restart `npm run dev` to pick up config changes.

### Phase 4 — Figma component creation ✅

Used the Figma MCP plugin's `use_figma` tool to write a new page and component directly in the source file.

**Steps taken:**
1. Inspected the file to find existing pages, components, and variable IDs.
2. Created two new primitives (`Colors/Brand/Primary 50` and `Colors/Brand/Primary 100`) to match the tokens we'd added in code. Set their `scopes` explicitly to `["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"]` — never the default `ALL_SCOPES`, which pollutes every property picker.
3. Created a new page "Selectable Pill".
4. Built 6 component frames in a 2-column × 3-row grid (Selected × State). Each frame uses auto-layout, 14/8 padding, 1px inside stroke, `radius-full` bound to the radius variable, and a single text child with `fontSize` / `lineHeight` bound to the `text-sm` tokens.
5. Combined them into a `COMPONENT_SET` named "Pill" via `figma.combineAsVariants()`.
6. Added a `TEXT` component property `Label` on the set and wired each variant's text node's `componentPropertyReferences.characters` to it — so instances expose a single editable Label field in the Inspector.
7. Built the section layout on the same page: outer card frame (560px, `radius-2xl`, `shadow-xs`), eyebrow chip, title, helper, 6 Pill instances with per-instance `Selected` + `Label` overrides, divider, and a footer with instances of the existing Figma Button component (Tertiary `Back` on the left, Primary `Continue` on the right, with the icon-leading/trailing BOOLEAN properties set to `false` to match our label-only use case).

**What's bound to variables in Figma** (the deliverable quality question):

- **Every fill and stroke** on the Pill — background, border, text color — is bound to a named color variable. No hardcoded hex except the one-off `#B8D0FF` for selected-hover (flagged below).
- **Every padding, itemSpacing, counterAxisSpacing, and corner radius** on the Pill and the card uses a bound variable (spacing-md, spacing-sm, spacing-5xl, radius-full, radius-2xl, etc.).
- **Every `fontSize` and `lineHeight`** is bound to its typography variable. Font family and weight are not bound: the source file specifies `Test Söhne` which isn't installed on my machine, so DM Sans SemiBold (what the MCP export uses as fallback) is hardcoded.

**Deliberate deviations I'm documenting:**
- `#B8D0FF` on selected-hover has no matching variable. Left as a raw hex with a comment; if the treatment spreads beyond the Pill we'd formalize a `--pill-selected-bg-hover` semantic token or a `brand-primary-150` primitive.
- Shadow-xs on the card uses a raw rgba rather than the `Colors/Effects/Shadows/shadow-xs` variable. Minor.

### Phase 5 — Write-up

This doc.

---

## 3 · Honest assessment

**What worked.**

- *The CSS-variables-first token strategy was the single best early decision.* When Option C was chosen, adding `brand-50` / `brand-100` took two lines of tokens.css, two lines of `tailwind.config.js`, and zero component rewrites. If we'd hardcoded hex codes or used Tailwind's default palette, the Pill would have needed to rework its Tailwind classes or hold a private color map.
- *The A/B/C exploration.* Giving the AI a temporary `variant` prop so alternatives could render live beat the "propose → decide in abstract → build once" loop. Visual decisions should be made against pixels, not descriptions.
- *Mirror-then-flag, don't fix.* For the design-system bugs (token typo, green focus ring on blue buttons, Utility/Brand tokens resolving to greys, Primary hover lightening instead of darkening), I built to spec and wrote them up. A 2-hour take-home isn't the right place to "fix" someone else's design system.

**What I'd redo.**

- *The layout-shift bug should have been caught by Claude before I saw it.* We wrote the spec from Figma verbatim; Figma represented the disabled Primary state with a real stroke. On the Figma canvas that's identical box size, but in CSS with `border-box` and no explicit height, it's a 2px tax. A check-yourself pass looking for "state changes that grow the box" would have found it without me toggling a real pill in the browser.
- *I should have spun up a second dev loop for the Figma file earlier.* I did all the code work first and only touched Figma in Phase 4. Knowing what token-binding looked like on the other side of the pipeline earlier would have shaped tokens.css more surgically (e.g., I'd probably have introduced `--shadow-xs` as a composite variable from day one rather than as a CSS utility).

**Where Claude was wrong or needed redirection.**

- Claude's lead recommendation for the Pill selected-state was Option A (solid brand fill). Taste disagreement — I pushed to a tonal treatment. In a pure "generate" mode without a human in the loop, the solid fill would have shipped.
- Claude would have built ALL of the Button (every hierarchy × size × state × icon-only = ~200 variants) if I hadn't insisted on scoping. "Follow the brief literally, then make the API easy to extend" had to come from me.
- Claude's initial Button had the disabled-border bug. It wrote a note saying "1px shift preserved from Figma spec" — meaning it knew about the shift but accepted it for fidelity. The right instinct is "this shift breaks interaction, override the spec." That judgment came from the human-in-the-loop review, not the AI.

**What I'd tell a teammate about using AI this way.**

The model is at its best when you treat it as a design engineer who hasn't seen the codebase before — it can extract intent from Figma, write idiomatic Tailwind, and catch 80% of design-system inconsistencies in a token scan. It's at its worst when you ask it for taste calls in a vacuum ("which pill fill is right?"). Build scaffolds that let you SEE alternatives, make the call visually, then have it cleanly remove the losing branches. That rhythm — generate alternatives, pick visually, clean up — is faster and produces better work than either "AI proposes, I approve" or "I decide, AI executes" alone.
