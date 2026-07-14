import { cn } from "@/lib/utils";

/** Shimmering placeholder block. Respects reduced-motion via globals.css. */
export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-lg bg-steel/80",
        className,
      )}
    />
  );
}
