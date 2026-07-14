import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { InventoryToolbar } from "@/components/inventory/inventory-toolbar";
import { FilterPanel } from "@/components/inventory/filter-panel";
import { ActiveChips } from "@/components/inventory/active-chips";
import { Pagination } from "@/components/inventory/pagination";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { searchVehicles, getInventoryFacets } from "@/lib/queries";
import { parseInventoryFilters, type RawSearchParams } from "@/lib/inventory-params";

export const metadata: Metadata = {
  title: "Inventory",
  description:
    "Browse Altara Automotive's handpicked stock of premium used cars — HPI clear, inspected and ready for nationwide delivery.",
};

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseInventoryFilters(sp);
  const [result, facets] = await Promise.all([
    searchVehicles(filters),
    getInventoryFacets(),
  ]);
  const { vehicles, total, page, pageCount } = result;

  return (
    <div className="pt-28">
      <Container className="py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-faint">
            The collection
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-ink">
            Inventory
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {total} {total === 1 ? "vehicle" : "vehicles"} available
          </p>
        </header>

        <div className="mt-8">
          <InventoryToolbar facets={facets} total={total} />
        </div>

        <div className="mt-4">
          <ActiveChips filters={filters} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <h2 className="mb-5 font-heading text-lg font-semibold text-ink">
                Refine
              </h2>
              <FilterPanel facets={facets} />
            </div>
          </aside>

          <div>
            {vehicles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles.map((v, i) => (
                  <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-hairline bg-graphite/50 px-6 py-20 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-steel">
                  <SearchX className="h-6 w-6 text-ink-faint" aria-hidden />
                </span>
                <h2 className="mt-5 font-heading text-xl font-semibold text-ink">
                  No matching vehicles
                </h2>
                <p className="mt-2 max-w-sm text-sm text-ink-muted">
                  Try widening your filters, or let us know what you&apos;re
                  after and we&apos;ll source it for you.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/inventory"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Clear filters
                  </Link>
                  <Link
                    href="/contact"
                    className={buttonVariants({ variant: "chrome" })}
                  >
                    Request a car
                  </Link>
                </div>
              </div>
            )}

            <Pagination filters={filters} page={page} pageCount={pageCount} />
          </div>
        </div>
      </Container>
    </div>
  );
}
