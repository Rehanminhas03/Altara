import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { listVehiclesAdmin } from "@/lib/admin-queries";
import { Badge, statusToTone } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { VehicleImage } from "@/components/vehicle/vehicle-image";
import { VehicleRowActions } from "@/components/admin/vehicle-row-actions";
import { getPrimaryImage, displayTitle } from "@/lib/vehicle";
import { formatMileage, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Vehicles", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q;
  const status = sp.status;
  const page = Number(sp.page) || 1;
  const { vehicles, total, pageCount } = await listVehiclesAdmin({
    q,
    status,
    page,
  });

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/admin/vehicles?${s}` : "/admin/vehicles";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Vehicles</h1>
          <p className="text-sm text-ink-muted">{total} in stock</p>
        </div>
        <Link
          href="/admin/vehicles/new"
          className={buttonVariants({ variant: "chrome", size: "sm" })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add vehicle
        </Link>
      </div>

      <form method="get" className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search title, make or model…"
            className="pl-10"
            aria-label="Search vehicles"
          />
        </div>
        <Select
          name="status"
          defaultValue={status ?? ""}
          className="sm:w-48"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </Select>
        <button
          type="submit"
          className={buttonVariants({ variant: "ghost", size: "md" })}
        >
          Filter
        </button>
      </form>

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-graphite p-12 text-center text-sm text-ink-muted">
          No vehicles found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-hairline">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline bg-graphite text-left text-xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Mileage</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const tone = statusToTone(v.status);
                return (
                  <tr
                    key={v.id}
                    className="border-b border-hairline last:border-0 hover:bg-graphite/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-hairline">
                          <VehicleImage
                            image={getPrimaryImage(v)}
                            sizes="64px"
                            compactPlaceholder
                          />
                        </div>
                        <Link
                          href={`/admin/vehicles/${v.id}/edit`}
                          className="font-medium text-ink hover:underline"
                        >
                          {displayTitle(v)}
                        </Link>
                      </div>
                    </td>
                    <td className="tnum px-4 py-3 text-ink">
                      {formatPrice(v.price)}
                    </td>
                    <td className="tnum px-4 py-3 text-ink-muted">
                      {formatMileage(v.mileage)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={tone.tone}>{tone.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {v.featured ? "Yes" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <VehicleRowActions
                        id={v.id}
                        featured={v.featured}
                        status={v.status}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={pageHref(page - 1)}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-ink-muted">
            Page {page} of {pageCount}
          </span>
          {page < pageCount && (
            <Link
              href={pageHref(page + 1)}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
