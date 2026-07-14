import { ChromeA } from "@/components/brand/chrome-a";
import { cn } from "@/lib/utils";

/**
 * Branded placeholder shown until a real photo is uploaded. Fills its
 * (positioned) parent. On-brand obsidian→steel gradient with the chrome mark,
 * body-type label and a "Photo coming soon" caption.
 */
export function PlaceholderImage({
  bodyType,
  className,
  compact = false,
}: {
  bodyType?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "theme-dark absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-steel via-graphite to-obsidian",
        className,
      )}
      aria-hidden
    >
      <ChromeA className={compact ? "h-7 w-7" : "h-10 w-10"} />
      {!compact && (
        <span className="chrome-text font-heading text-sm font-bold tracking-[0.28em]">
          ALTARA
        </span>
      )}
      {bodyType && (
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-ink-faint">
          {bodyType}
        </span>
      )}
      <span className="text-[0.6rem] tracking-wide text-ink-faint">
        Photo coming soon
      </span>
    </div>
  );
}
