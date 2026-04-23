import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

export type PillProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type"
> & {
  label: string;
  selected: boolean;
  onChange: (next: boolean) => void;
};

/*
 * Pill shares Button's DNA — same token system, same focus-ring treatment,
 * same font weight + line height — but diverges on shape (rounded-full) and
 * on semantics (it's a two-state toggle, not a trigger).
 *
 * State is driven by CSS pseudo-classes (:hover, :focus-visible, :disabled)
 * and by the `aria-pressed` attribute for the selected/unselected axis. That
 * keeps the API small (one boolean prop controls visuals + a11y) and reads
 * correctly to screen readers as a toggle button.
 *
 * Selected treatment: tonal — the deeper of the two tonal options explored.
 * Fill `brand-primary-100` with `brand-primary-600` text and
 * `brand-primary-400` border. Chosen over a solid-brand fill so selected
 * pills don't visually compete with the Primary CTA.
 *
 * Hover on selected darkens to `brand-primary-150` (#B8D0FF), a token we
 * introduced to fill the gap between `brand-primary-100` and
 * `brand-primary-200`. Available in the Figma file under _Primitives too.
 */

const base = [
  "inline-flex items-center justify-center",
  "font-semibold whitespace-nowrap select-none",
  "text-sm leading-[var(--line-height-text-sm)]",
  // Padding matches the sm CTA padding in Figma: spacing-lg (12px) × spacing-md (8px).
  "px-token-lg py-token-md",
  // `border` resolves to `border-width: var(--border-width-1)` via the
  // Tailwind theme override, keeping stroke width token-driven.
  "rounded-full border",
  "transition-[background-color,border-color,box-shadow,color] duration-100",
  "focus:outline-none",
  "focus-visible:shadow-focus-ring",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

const unselected = [
  "bg-white border-border-tertiary text-text-secondary",
  "hover:bg-bg-primary-hover hover:border-border-primary hover:text-text-secondary-hover",
].join(" ");

const selected = [
  "bg-brand-100 border-brand-400 text-brand-600",
  "hover:bg-brand-150",
].join(" ");

export function Pill({
  label,
  selected: isSelected,
  onChange,
  className,
  disabled,
  ...rest
}: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={() => onChange(!isSelected)}
      className={clsx(base, isSelected ? selected : unselected, className)}
      {...rest}
    >
      {label}
    </button>
  );
}
