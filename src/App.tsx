import { useState, type ReactNode } from "react";
import { Button } from "./components/Button";
import { Pill } from "./components/Pill";

const FIGMA_URL =
  "https://www.figma.com/design/21q0b755dnwsRzUmViiTST/Copy-of-Mini-Design-System";
const GITHUB_URL = "https://github.com/smugfox/midi_ds_project";

const SYMPTOMS = [
  "Brain fog",
  "Hot flashes",
  "Night sweats",
  "Fatigue",
  "Mood changes",
  "Irregular periods",
];

export default function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <SymptomCard />
      <Notes />
      <Footer />
    </div>
  );
}

/* ────────────────────────────── Header ────────────────────────────── */

function Header() {
  return (
    <header className="border-b border-border-tertiary bg-white">
      <div className="mx-auto flex max-w-[880px] items-center justify-between px-token-xl py-token-lg">
        <div className="flex items-center gap-token-md">
          <div className="h-2 w-2 rounded-full bg-brand-400" aria-hidden="true" />
          <span className="text-text-sm font-semibold text-fg-primary">
            Midi — Design Engineer Take-Home
          </span>
        </div>
        <nav className="flex items-center gap-token-xl text-text-sm font-medium text-text-secondary">
          <a href="#notes" className="transition-colors hover:text-fg-primary">
            Notes
          </a>
          <a
            href={FIGMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg-primary"
          >
            Figma ↗
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg-primary"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ─────────────────────────── Symptom card ─────────────────────────── */

function SymptomCard() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (label: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const count = selected.size;

  return (
    <section className="px-token-xl py-token-8xl">
      <div
        className="mx-auto max-w-[560px] rounded-2xl border border-border-tertiary bg-white shadow-xs"
        aria-labelledby="symptom-title"
      >
        <div className="p-token-5xl">
          <header className="mb-token-3xl">
            <span className="inline-flex items-center rounded-full bg-brand-50 px-token-md py-token-xxs text-text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">
              Step 2 of 4
            </span>
            <h1
              id="symptom-title"
              className="mt-token-md text-display-xs font-semibold text-fg-primary"
            >
              Select the symptoms you're experiencing
            </h1>
            <p className="mt-token-md text-text-md text-fg-tertiary">
              Choose all that apply. You can update these at any time — this
              helps us tailor your care plan.
            </p>
          </header>

          <div
            className="flex flex-wrap gap-token-sm"
            role="group"
            aria-label="Symptom selection"
          >
            {SYMPTOMS.map((label) => (
              <Pill
                key={label}
                label={label}
                selected={selected.has(label)}
                onChange={() => toggle(label)}
              />
            ))}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-token-lg border-t border-border-tertiary px-token-5xl py-token-xl">
          <Button hierarchy="tertiary">Back</Button>
          <div className="flex items-center gap-token-lg">
            <p className="text-text-sm text-text-secondary" aria-live="polite">
              {count === 0 ? "None selected" : `${count} selected`}
            </p>
            <Button hierarchy="primary" disabled={count === 0}>
              Continue
            </Button>
          </div>
        </footer>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Notes ──────────────────────────────── */

function Notes() {
  return (
    <section
      id="notes"
      className="border-t border-border-tertiary bg-white py-token-8xl"
    >
      <div className="mx-auto max-w-[720px] px-token-xl">
        <header className="mb-token-5xl">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-token-md py-token-xxs text-text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">
            Write-up
          </span>
          <h2 className="mt-token-md text-display-sm font-semibold text-fg-primary">
            Notes
          </h2>
          <p className="mt-token-md text-text-md text-fg-tertiary">
            A curated version of the decision log. The full running log (with
            prompts and pushbacks in order) is in{" "}
            <a
              href={`${GITHUB_URL}/blob/main/AI-NOTES.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 underline decoration-brand-400 underline-offset-2 hover:text-brand-600/80"
            >
              AI-NOTES.md
            </a>{" "}
            in the repo.
          </p>
        </header>

        <NoteBlock title="Scope + approach" number="01">
          <P>
            The brief asked for "3 variants + states (hover, focus, disabled)."
            The Figma Button has ~200 symbols across size × hierarchy × state ×
            icon-only. I scoped the code to{" "}
            <strong className="font-semibold text-fg-primary">
              Primary / Secondary / Tertiary × Default / Hover / Focus /
              Disabled × md size
            </strong>{" "}
            — what the brief literally asks for — and architected the API so
            the omitted axes can layer in later without rewrites. The Pill got
            the full 6-variant matrix (Selected × State) because the evaluation
            explicitly calls for "variants" as a Figma deliverable.
          </P>
          <P>
            Stack: <strong className="font-semibold text-fg-primary">Vite + React 19 + TypeScript + Tailwind v3</strong>.
            Tokens as CSS custom properties ({" "}
            <code className="rounded bg-base-15 px-1 py-0.5 text-text-xs text-fg-primary">
              src/styles/tokens.css
            </code>
            ) — single source of truth — with the Tailwind theme referencing{" "}
            <code className="rounded bg-base-15 px-1 py-0.5 text-text-xs text-fg-primary">
              var(--…)
            </code>
            . This mirrors the shape of the Figma MCP export and keeps
            dark-mode/theming open for free.
          </P>
        </NoteBlock>

        <NoteBlock title="Key design decisions" number="02">
          <List>
            <Item>
              <strong className="font-semibold text-fg-primary">
                States are pseudo-classes, not props.
              </strong>{" "}
              Figma has <code className="mono">state=Hover/Focused/Disabled</code> as
              explicit variants; in code that becomes <code className="mono">:hover</code>,{" "}
              <code className="mono">:focus-visible</code>,{" "}
              <code className="mono">:disabled</code>. Avoids prop-drilling
              state and lets the browser handle keyboard-vs-mouse focus.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                <code className="mono">:focus-visible</code> over{" "}
                <code className="mono">:focus</code>.
              </strong>{" "}
              Keyboard users see the focus ring; mouse clickers don't. Figma
              variants can't express this distinction — code can.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                Selected-Pill fill is tonal, not solid brand.
              </strong>{" "}
              Chose <code className="mono">brand-primary-100</code> (#D6E4FF)
              after an A/B/C exploration in dev. Rationale: when the Primary
              CTA is also brand blue, solid-fill pills create three or four
              competing blue elements. Tonal treatment cedes hierarchy to the
              CTA while reading clearly as "on."
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                Border slot is reserved in every Button state.
              </strong>{" "}
              Without this, toggling <code className="mono">disabled</code>{" "}
              adds a 1px border → 2px total height change → footer layout shift.
              All buttons carry <code className="mono">border border-transparent</code>{" "}
              and only change color per state. 2px larger than Figma's "no
              border at rest" spec; interaction stability &gt; pixel fidelity.
            </Item>
          </List>
        </NoteBlock>

        <NoteBlock title="Design-system bugs I flagged" number="03">
          <P>
            Surfaced during the token scan. Preserved as-is in code for fidelity
            to the source — not my job to fix someone else's design system in a
            take-home.
          </P>
          <List>
            <Item>
              <strong className="font-semibold text-fg-primary">Token typo.</strong>{" "}
              The Primary button's Hover fill resolves to{" "}
              <code className="mono">Colors/Brand/Primaryt 200</code> — note the
              stray <code className="mono">t</code>. Baked into the Figma
              variable. Aliased in <code className="mono">tokens.css</code> so
              the Figma MCP export still works.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                Green focus ring on blue buttons.
              </strong>{" "}
              <code className="mono">focus-ring</code> resolves to{" "}
              <code className="mono">#B6E7A0</code> (which is{" "}
              <code className="mono">Colors/Brand/Secondary 200</code>). On{" "}
              <code className="mono">#006AF9</code> Primary-focused, low contrast — probably
              doesn't meet WCAG 3:1 for focus indicators.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                <code className="mono">Utility/Brand/*</code> tokens resolve to greys.
              </strong>{" "}
              Semantic tokens under a "Brand" folder that all alias to the cool-grey Base palette,
              not the brand blue.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                <code className="mono">text-tertiary</code> is near-white
              </strong>{" "}
              (<code className="mono">#EEF5F7</code>). Unreadable as text.
              Likely a design error in the Figma source.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                Primary hover lightens; focus darkens.
              </strong>{" "}
              Non-standard (hover usually darkens) but consistent across all
              three hierarchies — intentional choice, mirrored in code.
            </Item>
          </List>
        </NoteBlock>

        <NoteBlock title="Tokens I added to fill gaps" number="04">
          <P>
            The brand primary ramp was just 200 / 400 / 600. Three new steps
            were introduced to support the Pill's tonal treatment and the
            eyebrow badge. All three now live in the Figma{" "}
            <code className="mono">_Primitives</code> collection, the code's{" "}
            <code className="mono">tokens.css</code>, and the Tailwind theme.
          </P>
          <List>
            <Item>
              <code className="mono">brand-primary-50</code>{" "}
              <span className="text-text-secondary">(#EAF2FF)</span> — eyebrow badge fill
            </Item>
            <Item>
              <code className="mono">brand-primary-100</code>{" "}
              <span className="text-text-secondary">(#D6E4FF)</span> — Pill selected fill
            </Item>
            <Item>
              <code className="mono">brand-primary-150</code>{" "}
              <span className="text-text-secondary">(#B8D0FF)</span> — Pill selected-hover fill
            </Item>
          </List>
          <P>
            Also added a new{" "}
            <code className="mono">7. Strokes</code> collection in Figma with a{" "}
            <code className="mono">border-width-1 = 1</code> variable, bound to
            every Pill stroke and the card's border. No stroke widths are
            hard-coded anywhere.
          </P>
        </NoteBlock>

        <NoteBlock title="Honest assessment" number="05">
          <Subhead>What worked</Subhead>
          <List>
            <Item>
              <strong className="font-semibold text-fg-primary">
                CSS-variables-first token strategy.
              </strong>{" "}
              When the deeper tonal Pill fill was chosen, adding{" "}
              <code className="mono">brand-50</code> /{" "}
              <code className="mono">100</code> took two lines in{" "}
              <code className="mono">tokens.css</code>, two in{" "}
              <code className="mono">tailwind.config.js</code>, and zero
              component rewrites.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                A/B/C exploration.
              </strong>{" "}
              Rather than picking a Pill fill in the abstract, I had Claude
              build a temporary <code className="mono">variant</code> prop so
              alternatives rendered live side-by-side next to a Primary CTA.
              Visual decisions need to be made against pixels, not
              descriptions.
            </Item>
            <Item>
              <strong className="font-semibold text-fg-primary">
                Mirror-then-flag for DS bugs.
              </strong>{" "}
              Every quirk I spotted (typo, green ring, grey brand tokens, etc.)
              got preserved in code and documented. Not fixed.
            </Item>
          </List>

          <Subhead>Where Claude needed redirection</Subhead>
          <List>
            <Item>
              Its initial Pill recommendation was a solid brand fill. I pushed
              to a tonal treatment — without the pushback, the solid fill would
              have shipped.
            </Item>
            <Item>
              It would have built all ~200 Button variants if not scoped. "Follow
              the brief literally, make the API easy to extend later" had to
              come from me.
            </Item>
            <Item>
              The disabled-button layout shift was self-diagnosed by Claude
              (its own comment said "1px shift, accepted for spec fidelity"). I
              caught it live in the browser and pushed back that interaction
              stability outranks pixel fidelity. Fix landed.
            </Item>
            <Item>
              The selected-hover color stayed as a raw hex (
              <code className="mono">#B8D0FF</code>) in the first pass. I
              asked it to be tokenized — became{" "}
              <code className="mono">brand-primary-150</code>. Good reminder
              that a DS shouldn't have escape-hatch colors.
            </Item>
          </List>

          <Subhead>What I'd tell a teammate about working this way</Subhead>
          <P>
            The model is at its best when treated as a design engineer who
            hasn't seen the codebase before — it can extract intent from
            Figma, write idiomatic Tailwind, and catch 80% of design-system
            inconsistencies in a token scan. It's at its worst when asked for
            taste calls in a vacuum. The rhythm that worked:{" "}
            <em className="italic">
              generate alternatives → pick visually → clean up.
            </em>{" "}
            Faster and better work than either "AI proposes, I approve" or "I
            decide, AI executes" alone.
          </P>
        </NoteBlock>
      </div>
    </section>
  );
}

/* ────────────────────────────── Footer ────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border-tertiary bg-bg-primary py-token-4xl">
      <div className="mx-auto flex max-w-[880px] flex-col items-center justify-between gap-token-md px-token-xl text-text-sm text-text-secondary sm:flex-row">
        <p>Submitted by Robin Fox · built with Claude Code</p>
        <div className="flex items-center gap-token-xl">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg-primary"
          >
            GitHub
          </a>
          <a
            href={FIGMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg-primary"
          >
            Figma
          </a>
          <a
            href={`${GITHUB_URL}/blob/main/AI-NOTES.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg-primary"
          >
            Full write-up
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────── Note primitives ────────────────────────── */

function NoteBlock({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: ReactNode;
}) {
  return (
    <article className="border-t border-border-tertiary py-token-5xl first:border-t-0 first:pt-0">
      <header className="mb-token-xl">
        <span className="text-text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary">
          {number}
        </span>
        <h3 className="mt-token-xxs text-text-xl font-semibold text-fg-primary">
          {title}
        </h3>
      </header>
      <div className="space-y-token-lg text-text-md text-fg-tertiary">
        {children}
      </div>
    </article>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return (
    <h4 className="pt-token-md text-text-md font-semibold text-fg-primary">
      {children}
    </h4>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="leading-[var(--line-height-text-md)]">{children}</p>;
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-token-md pl-token-xl leading-[var(--line-height-text-md)] [list-style:disc] marker:text-text-secondary">
      {children}
    </ul>
  );
}

function Item({ children }: { children: ReactNode }) {
  return <li className="pl-token-xxs">{children}</li>;
}
