import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Badge, statusToTone } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getDashboardStats,
  getRecentEnquiries,
  listVehiclesAdmin,
} from "@/lib/admin-queries";
import { displayTitle } from "@/lib/vehicle";
import { formatPrice, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const [stats, enquiries, recent] = await Promise.all([
    getDashboardStats(),
    getRecentEnquiries(6),
    listVehiclesAdmin({ page: 1 }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-ink">Dashboard</h1>
        <Link
          href="/admin/vehicles/new"
          className={buttonVariants({ variant: "chrome", size: "sm" })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add vehicle
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total stock" value={stats.total} />
        <StatCard label="Available" value={stats.available} />
        <StatCard label="Reserved" value={stats.reserved} />
        <StatCard label="Sold" value={stats.sold} />
        <StatCard label="Featured" value={stats.featured} />
        <StatCard label="Enquiries (7d)" value={stats.enquiriesWeek} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-hairline bg-graphite p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Recent enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          {enquiries.length === 0 ? (
            <p className="text-sm text-ink-faint">No enquiries yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-hairline">
              {enquiries.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {e.name || e.email || e.phone || "Anonymous"}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {humanize(e.kind)} · {fmtDate(e.created_at)}
                    </p>
                  </div>
                  {!e.handled && <Badge tone="accent">New</Badge>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-hairline bg-graphite p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Recent additions
            </h2>
            <Link
              href="/admin/vehicles"
              className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          {recent.vehicles.length === 0 ? (
            <p className="text-sm text-ink-faint">No vehicles yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-hairline">
              {recent.vehicles.slice(0, 6).map((v) => {
                const tone = statusToTone(v.status);
                return (
                  <li key={v.id} className="flex items-center justify-between gap-3 py-3">
                    <Link
                      href={`/admin/vehicles/${v.id}/edit`}
                      className="min-w-0 flex-1"
                    >
                      <p className="truncate text-sm font-medium text-ink hover:underline">
                        {displayTitle(v)}
                      </p>
                      <p className="tnum text-xs text-ink-faint">
                        {formatPrice(v.price)}
                      </p>
                    </Link>
                    <Badge tone={tone.tone}>{tone.label}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
