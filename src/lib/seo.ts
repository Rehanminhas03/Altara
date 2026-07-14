import type { Vehicle } from "@/types";
import { BUSINESS } from "./constants";
import { displayTitle } from "./vehicle";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const FUEL_SCHEMA: Record<string, string> = {
  petrol: "Gasoline",
  diesel: "Diesel",
  hybrid: "Hybrid",
  plug_in_hybrid: "Plug-in Hybrid",
  electric: "Electric",
};

/** JSON-LD for a vehicle detail page (Product + Vehicle + Offer). */
export function vehicleJsonLd(vehicle: Vehicle, imageUrl?: string) {
  const url = `${SITE_URL}/inventory/${vehicle.slug}`;
  const availability =
    vehicle.status === "available"
      ? "https://schema.org/InStock"
      : vehicle.status === "reserved"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/SoldOut";

  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: displayTitle(vehicle),
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    ...(vehicle.variant ? { vehicleConfiguration: vehicle.variant } : {}),
    vehicleModelDate: String(vehicle.year),
    ...(vehicle.colour ? { color: vehicle.colour } : {}),
    ...(vehicle.body_type ? { bodyType: vehicle.body_type } : {}),
    fuelType: FUEL_SCHEMA[vehicle.fuel] ?? vehicle.fuel,
    ...(vehicle.doors ? { numberOfDoors: vehicle.doors } : {}),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "SMI",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: vehicle.price,
      availability,
      url,
      seller: { "@type": "AutoDealer", name: BUSINESS.name },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function dealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: BUSINESS.name,
    description:
      "Handpicked premium used cars with HPI-clear inspection and nationwide delivery.",
    url: SITE_URL,
    telephone: BUSINESS.phones[0]?.tel,
    areaServed: "GB",
    ...(BUSINESS.email ? { email: BUSINESS.email } : {}),
  };
}
