import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Hierarchies implemented in v1: primary / secondary / tertiary.
 * The Figma source also defines `secondary-on-brand`, `link-color`, and
 * `link-gray` — those are deliberately out of scope for the take-home brief
 * and are represented by `secondary`/`tertiary` as nearest equivalents.
 */
export type ButtonHierarchy = "primary" | "secondary" | "tertiary";

/**
 * v1 ships `md` only (matches the playground instance and the brief's scope).
 * The type is authored as a union so adding `sm | lg | xl` later is a
 * one-line extension — no API reshape.
 */
export type ButtonSize = "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const base = [
  "inline-flex items-center justify-center gap-token-xs",
  "font-semibold whitespace-nowrap select-none",
  "rounded-sm",
  // Reserve the 1px border slot in every state so toggling disabled
  // doesn't change the element's box size (prevents layout shift in
  // footers/toolbars that swap a Primary CTA between enabled and disabled).
  // Color is transparent by default and only painted where a hierarchy/state
  // needs it.
  "border border-transparent",
  "transition-[background-color,box-shadow,color,border-color] duration-100",
  "focus:outline-none",
  "disabled:cursor-not-allowed",
].join(" ");

const sizeClasses: Record<ButtonSize, string> = {
  md: "text-sm leading-[var(--line-height-text-sm)] px-[14px] py-[10px]",
};

/**
 * Pseudo-class state styling is used (`:hover`, `:focus-visible`, `:disabled`)
 * rather than a `state` prop. This matches how native `<button>` behaves,
 * keeps the API small, and lets the browser handle focus-vs-click correctly.
 * The Figma "state=Hover/Focused/Disabled" variants map 1:1 to these.
 *
 * `:focus-visible` (not `:focus`) ensures the ring appears for keyboard users
 * but not on mouse clicks — an accessibility improvement over what the Figma
 * variants alone can express.
 *
 * Note: the Hover state for Primary uses `brand-primaryt-200` (the stray `t`
 * preserves the typo from the Figma variable). Aliased in tokens.css.
 */
const hierarchyClasses: Record<ButtonHierarchy, string> = {
  primary: clsx(
    "bg-brand-400 text-text-white shadow-xs-skeuomorphic",
    "hover:bg-brand-primaryt-200",
    "focus-visible:bg-brand-600 focus-visible:shadow-focus-ring-skeuomorphic",
    "disabled:bg-bg-disabled disabled:text-fg-disabled disabled:shadow-xs",
    "disabled:border-border-disabled-subtle",
  ),
  secondary: clsx(
    "bg-white text-text-secondary",
    "border-border-primary shadow-xs-skeuomorphic",
    "hover:bg-bg-primary-hover hover:text-text-secondary-hover",
    "focus-visible:bg-white focus-visible:shadow-focus-ring-skeuomorphic",
    "disabled:bg-white disabled:text-fg-disabled",
    "disabled:border-border-disabled-subtle disabled:shadow-none",
  ),
  tertiary: clsx(
    "bg-transparent text-text-secondary",
    "hover:bg-bg-primary-hover hover:text-text-secondary-hover",
    "focus-visible:bg-white focus-visible:shadow-focus-ring-tertiary",
    "disabled:bg-transparent disabled:text-fg-disabled disabled:shadow-none",
  ),
};

export function Button({
  hierarchy = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        base,
        sizeClasses[size],
        hierarchyClasses[hierarchy],
        className,
      )}
      {...rest}
    >
      {leadingIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {leadingIcon}
        </span>
      )}
      <span className="px-token-xxs">{children}</span>
      {trailingIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
