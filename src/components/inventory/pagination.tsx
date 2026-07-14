import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { InventoryFilters } from "@/lib/queries";
import { filtersToQueryString } from "@/lib/inventory-params";
import { cn } from "@/lib/utils";

export function Pagination({
  filters,
  page,
  pageCount,
}: {
  filters: InventoryFilters;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) =>
    `/inventory${filtersToQueryString({ ...filters, page: p === 1 ? undefined : p })}`;

  // Compact window of page numbers around the current page.
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, start + 4);
  for (let p = Math.max(1, end - 4); p <= end; p++) pages.push(p);

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors",
      active
        ? "border-chrome-2 bg-steel text-ink"
        : "border-hairline text-ink-muted hover:border-chrome-3 hover:text-ink",
    );

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link href={href(page - 1)} scroll className={linkClass(false)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          scroll
          className={linkClass(p === page)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}
      {page < pageCount && (
        <Link href={href(page + 1)} scroll className={linkClass(false)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
