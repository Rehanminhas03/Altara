import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { ImageManager } from "@/components/admin/image-manager";
import { getVehicleByIdAdmin } from "@/lib/admin-queries";
import { getMakeModelSuggestions } from "@/lib/queries";
import { displayTitle } from "@/lib/vehicle";

export const metadata: Metadata = {
  title: "Edit vehicle",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [vehicle, suggestions] = await Promise.all([
    getVehicleByIdAdmin(id),
    getMakeModelSuggestions(),
  ]);
  if (!vehicle) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/vehicles"
            className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to vehicles
          </Link>
          <h1 className="mt-3 font-heading text-2xl font-bold text-ink">
            {displayTitle(vehicle)}
          </h1>
        </div>
        <Link
          href={`/inventory/${vehicle.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          View on site
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="order-2 lg:order-1">
          <VehicleForm
            mode="edit"
            vehicle={vehicle}
            makeSuggestions={suggestions.makes}
            modelSuggestions={suggestions.models}
          />
        </div>
        <aside className="order-1 lg:order-2">
          <div className="rounded-2xl border border-hairline bg-graphite p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">
              Photos
            </h2>
            <ImageManager
              vehicleId={vehicle.id}
              images={vehicle.vehicle_images ?? []}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
