"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { FilterPanel } from "./filter-panel";
import { SORT_OPTIONS } from "@/lib/constants";
import type { InventoryFacets } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function InventoryToolbar({
  facets,
  total,
}: {
  facets: InventoryFacets;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawer, setDrawer] = React.useState(false);
  const [q, setQ] = React.useState(searchParams.get("q") ?? "");

  // Debounced search → URL.
  React.useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (q === current) return;
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  React.useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawer]);

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          aria-hidden
        />
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search make, model or keyword…"
          aria-label="Search inventory"
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="sort" className="sr-only">
          Sort
        </label>
        <Select
          id="sort"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => setSort(e.target.value)}
          className="w-full sm:w-52"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>

        <button
          type="button"
          onClick={() => setDrawer(true)}
          className={cn(
            buttonVariants({ variant: "ghost", size: "md" }),
            "shrink-0 lg:hidden",
          )}
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters
        </button>
      </div>

      {/* Mobile filter drawer */}
      {drawer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col bg-graphite">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <span className="font-heading text-lg font-semibold">Filters</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close filters"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <FilterPanel facets={facets} />
            </div>
            <div className="border-t border-hairline p-5">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className={buttonVariants({ variant: "chrome", size: "lg", className: "w-full" })}
              >
                Show {total} {total === 1 ? "result" : "results"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
