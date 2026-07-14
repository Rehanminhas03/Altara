import Link from "next/link";
import { Calendar, Gauge, Fuel, Cog, Clock } from "lucide-react";
import type { VehicleWithImages } from "@/types";
import { VehicleImage } from "@/components/vehicle/vehicle-image";
import { WishlistButton } from "./wishlist-button";
import { Badge, statusToTone } from "@/components/ui/badge";
import {
  displayTitle,
  getPrimaryImage,
  isRecentlyListed,
  vehicleHasDiscount,
} from "@/lib/vehicle";
import {
  formatDateShort,
  formatMileage,
  formatPrice,
  humanize,
} from "@/lib/utils";

const CARD_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: VehicleWithImages;
  priority?: boolean;
}) {
  const img = getPrimaryImage(vehicle);
  const status = statusToTone(vehicle.status);
  const discount = vehicleHasDiscount(vehicle);
  const title = displayTitle(vehicle);
  const isNew = isRecentlyListed(vehicle.created_at);
  const reduction =
    discount && vehicle.previous_price
      ? vehicle.previous_price - vehicle.price
      : 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-hairline bg-graphite shadow-[0_2px_12px_-6px_rgba(0,0,0,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-chrome-3 hover:shadow-[0_20px_44px_-20px_rgba(0,0,0,0.75)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <VehicleImage
          image={img}
          sizes={CARD_SIZES}
          priority={priority}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          <Badge tone={status.tone}>{status.label}</Badge>
          {isNew && vehicle.status === "available" && (
            <Badge tone="accent">New in</Badge>
          )}
          {reduction > 0 && (
            <Badge tone="available">{formatPrice(reduction)} off</Badge>
          )}
        </div>
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton id={vehicle.id} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 font-heading text-base font-semibold text-ink">
          {title}
        </h3>
        {vehicle.variant && (
          <p className="mt-0.5 line-clamp-1 text-sm text-ink-faint">
            {vehicle.variant}
          </p>
        )}

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          <li className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {vehicle.year}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" aria-hidden />
            {formatMileage(vehicle.mileage)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5" aria-hidden />
            {humanize(vehicle.fuel)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Cog className="h-3.5 w-3.5" aria-hidden />
            {humanize(vehicle.transmission)}
          </li>
        </ul>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="chrome-text tnum font-heading text-xl font-bold">
            {formatPrice(vehicle.price)}
          </span>
          {discount && (
            <span className="tnum text-sm text-ink-faint line-through">
              {formatPrice(vehicle.previous_price)}
            </span>
          )}
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-faint">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          Listed {formatDateShort(vehicle.created_at)}
        </p>
      </div>

      {/* Stretched primary link — keeps the wishlist button (z-10) clickable */}
      <Link href={`/inventory/${vehicle.slug}`} className="absolute inset-0">
        <span className="sr-only">View {title}</span>
      </Link>
    </article>
  );
}
