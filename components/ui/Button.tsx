"use client";

import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "rose" | "lavender";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface ButtonLinkProps extends ButtonBaseProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  as: "link";
  href: string;
}

interface ButtonButtonProps extends ButtonBaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button";
}

type ButtonProps = ButtonLinkProps | ButtonButtonProps;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-parchment-200 text-ink-900 hover:bg-parchment-100 border border-parchment-200 hover:border-parchment-100 font-medium",
  secondary:
    "bg-transparent text-parchment-300 border border-ink-500 hover:border-parchment-400 hover:text-parchment-200",
  ghost:
    "bg-transparent text-parchment-400 hover:text-parchment-200 underline underline-offset-4 decoration-parchment-500 hover:decoration-parchment-300 border-none px-0",
  rose:
    "bg-rose/10 text-rose border border-rose/25 hover:bg-rose/20 hover:border-rose/40",
  lavender:
    "bg-lavender/10 text-lavender border border-lavender/25 hover:bg-lavender/20 hover:border-lavender/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-4 py-2 rounded",
  md: "text-sm px-6 py-2.5 rounded-md",
  lg: "text-sm px-8 py-3.5 rounded-md",
};

function buildClasses(variant: Variant, size: Size, extra = "") {
  return [
    "inline-flex items-center justify-center gap-2 transition-all duration-200",
    "font-sans tracking-wide cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900",
    variantClasses[variant],
    sizeClasses[size],
    extra,
  ].filter(Boolean).join(" ");
}

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "" } = props;
  const classes = buildClasses(variant, size, className);

  if (props.as === "link") {
    const { as: _as, variant: _v, size: _s, ...rest } = props;
    return <Link {...rest} className={classes}>{props.children}</Link>;
  }

  const { as: _as, variant: _v, size: _s, ...rest } = props as ButtonButtonProps;
  return <button {...rest} className={classes}>{rest.children}</button>;
}
