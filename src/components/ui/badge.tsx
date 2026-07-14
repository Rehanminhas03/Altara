import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "available" | "reserved" | "sold" | "accent";

const tones: Record<Tone, string> = {
  neutral: "border-hairline bg-steel text-ink-muted",
  available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  reserved: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  sold: "border-hairline bg-steel text-ink-faint",
  accent: "border-accent/40 bg-accent/10 text-accent-ink",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Map a vehicle status to a badge tone + label. */
export function statusToTone(status: string): { tone: Tone; label: string } {
  switch (status) {
    case "available":
      return { tone: "available", label: "Available" };
    case "reserved":
      return { tone: "reserved", label: "Reserved" };
    case "sold":
      return { tone: "sold", label: "Sold" };
    default:
      return { tone: "neutral", label: status };
  }
}
