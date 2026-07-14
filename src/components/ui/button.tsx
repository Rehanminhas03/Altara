import * as React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "chrome"
  | "primary"
  | "ghost"
  | "outline"
  | "accent"
  | "link";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium " +
  "transition-[background,color,border-color,transform,opacity] duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  // Signature metallic primary — brushed chrome surface, dark ink text.
  chrome:
    "chrome-surface text-obsidian font-semibold shadow-sm hover:brightness-105 active:brightness-95",
  // Solid off-white on dark.
  primary: "bg-ink text-obsidian hover:bg-white active:bg-chrome-2",
  // Quiet ghost with hairline border.
  ghost:
    "bg-transparent text-ink border border-hairline hover:bg-steel hover:border-chrome-3",
  outline:
    "bg-transparent text-ink border border-chrome-3 hover:border-chrome-1 hover:text-chrome-1",
  // Rare accent — reserve for a single primary control per view.
  accent: "bg-accent text-white hover:brightness-110 active:brightness-95",
  link: "bg-transparent text-ink underline-offset-4 hover:underline px-0 h-auto rounded-none",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
  icon: "h-11 w-11 p-0",
};

export function buttonVariants({
  variant = "chrome",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], variant === "link" ? "" : sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "chrome", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  ),
);
Button.displayName = "Button";
