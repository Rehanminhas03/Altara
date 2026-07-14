import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Styled placeholder for the Google Map embed. A real embed needs the client's
 * exact showroom address (CLIENT-CONFIRM) — until then this on-brand panel
 * stands in for it.
 */
export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "theme-dark relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-hairline text-ink",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 30%, rgba(76,125,240,0.10), transparent 40%), linear-gradient(135deg, var(--color-steel), var(--color-graphite))",
      }}
      role="img"
      aria-label="Map location coming soon"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-steel">
          <MapPin className="h-5 w-5 text-chrome-2" aria-hidden />
        </span>
        <p className="text-sm font-medium text-ink">Showroom location</p>
        <p className="text-xs text-ink-faint">Map &amp; address coming soon</p>
      </div>
    </div>
  );
}
