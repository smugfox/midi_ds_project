import { useState } from "react";
import { Button } from "./components/Button";
import { Pill } from "./components/Pill";

const SYMPTOMS = [
  "Brain fog",
  "Hot flashes",
  "Night sweats",
  "Fatigue",
  "Mood changes",
  "Irregular periods",
];

export default function App() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (label: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const count = selected.size;

  return (
    <main className="min-h-screen bg-bg-primary px-token-xl py-token-8xl">
      <section
        className="mx-auto max-w-[560px] rounded-2xl bg-white shadow-xs border border-border-tertiary"
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
            <p
              className="text-text-sm text-text-secondary"
              aria-live="polite"
            >
              {count === 0
                ? "None selected"
                : `${count} selected`}
            </p>
            <Button hierarchy="primary" disabled={count === 0}>
              Continue
            </Button>
          </div>
        </footer>
      </section>
    </main>
  );
}
