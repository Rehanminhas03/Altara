import { cn } from "@/lib/utils";

/** Lightweight vector version of the Altara "A" mark with chrome gradient.
 *  Used where a crisp scalable mark is needed (placeholders, loaders).
 *  The gradient id is constant — every instance is identical, so browsers
 *  resolve `url(#altara-chrome-a)` to the same definition (no hydration risk). */
export function ChromeA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Altara" className={cn(className)}>
      <defs>
        <linearGradient id="altara-chrome-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F4F6" />
          <stop offset="0.45" stopColor="#B9BFC6" />
          <stop offset="1" stopColor="#6C7278" />
        </linearGradient>
      </defs>
      <path d="M24 3 L43 45 L33 45 L24 23 L15 45 L5 45 Z" fill="url(#altara-chrome-a)" />
      <path
        d="M11 33 C22 25, 31 25, 41 18"
        stroke="url(#altara-chrome-a)"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
