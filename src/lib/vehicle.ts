import type { ResolvedImage, Vehicle, VehicleWithImages } from "@/types";

/** Full display title, e.g. "2022 BMW M340i xDrive". */
export function displayTitle(v: Pick<Vehicle, "year" | "title">): string {
  return `${v.year} ${v.title}`;
}

type WithImages = Pick<Vehicle, "year" | "title" | "body_type"> & {
  vehicle_images?: VehicleWithImages["vehicle_images"] | null;
};

/**
 * Resolve the images to render for a vehicle. Real (uploaded) photos always
 * win; placeholder rows come next; and a vehicle with no image rows at all
 * falls back to a single branded placeholder. Every component reads images
 * through here, so the *source* of an image is irrelevant to the rest of the
 * app — uploading a real photo supersedes placeholders automatically.
 */
export function getVehicleImages(v: WithImages): ResolvedImage[] {
  const rows = (v.vehicle_images ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order);

  const real = rows.filter((r) => !r.is_placeholder && r.url);
  const pool = real.length > 0 ? real : rows.filter((r) => r.url);
  const title = displayTitle(v);

  if (pool.length > 0) {
    return pool.map((r, i) => ({
      url: r.url,
      alt: `${title} — photo ${i + 1}`,
      isPlaceholder: r.is_placeholder,
      bodyType: v.body_type,
    }));
  }

  return [
    {
      url: "",
      alt: `${title} — photo coming soon`,
      isPlaceholder: true,
      bodyType: v.body_type,
    },
  ];
}

/** The single image used on cards / previews. */
export function getPrimaryImage(v: WithImages): ResolvedImage {
  return getVehicleImages(v)[0];
}

export function vehicleHasDiscount(
  v: Pick<Vehicle, "price" | "previous_price">,
): boolean {
  return Boolean(v.previous_price && v.previous_price > v.price);
}

/** Was the vehicle listed within the last `days` days? (Date.now lives here,
 *  out of component render, to satisfy the React Compiler purity rule.) */
export function isRecentlyListed(createdAt: string, days = 14): boolean {
  const t = new Date(createdAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < days * 86_400_000;
}
