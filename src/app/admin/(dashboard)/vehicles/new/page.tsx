import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { getMakeModelSuggestions } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Add vehicle",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  const { makes, models } = await getMakeModelSuggestions();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/vehicles"
          className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back to vehicles
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-bold text-ink">
          Add a vehicle
        </h1>
        <p className="text-sm text-ink-muted">
          Add the photos and details together — photos upload as soon as you
          create the vehicle.
        </p>
      </div>
      <VehicleForm
        mode="create"
        makeSuggestions={makes}
        modelSuggestions={models}
      />
    </div>
  );
}
