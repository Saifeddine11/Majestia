import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "light" | "outline" | "outline-light" | "ghost";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,scale] duration-200 ease-soft " +
  "active:scale-[0.98] disabled:opacity-55 disabled:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-blue text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-slate-deep",
  light: "bg-cream text-charcoal hover:bg-paper",
  outline: "border border-charcoal/25 text-charcoal hover:border-charcoal/45 hover:bg-charcoal/5",
  "outline-light": "border border-cream/55 text-cream hover:bg-cream/15",
  ghost: "text-charcoal hover:bg-charcoal/8",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-[0.9375rem]",
  lg: "min-h-13 px-6 text-base",
};

const arrowCaps: Record<ButtonVariant, string> = {
  primary: "bg-cream/20 text-cream",
  light: "bg-slate-blue text-cream",
  outline: "bg-charcoal/8 text-charcoal",
  "outline-light": "bg-cream/20 text-cream",
  ghost: "bg-charcoal/8 text-charcoal",
};

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Adds the circular arrow cap used on main actions. */
  arrow?: boolean;
  className?: string;
}

export function buttonClass({
  variant = "primary",
  size = "md",
  arrow,
  className,
}: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], arrow && "pr-2", className);
}

function Content({
  children,
  arrow,
  variant = "primary",
}: {
  children: ReactNode;
  arrow?: boolean;
  variant?: ButtonVariant;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2">{children}</span>
      {arrow ? (
        <span
          aria-hidden
          className={cn("grid size-8 shrink-0 place-items-center rounded-full", arrowCaps[variant])}
        >
          <ArrowRight className="size-4" />
        </span>
      ) : null}
    </>
  );
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: StyleProps & ComponentProps<"button">) {
  return (
    <button type={type} className={buttonClass({ variant, size, arrow, className })} {...rest}>
      <Content arrow={arrow} variant={variant}>
        {children}
      </Content>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  arrow,
  className,
  children,
  ...rest
}: StyleProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass({ variant, size, arrow, className })} {...rest}>
      <Content arrow={arrow} variant={variant}>
        {children}
      </Content>
    </Link>
  );
}
