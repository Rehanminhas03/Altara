import Link from "next/link";
import { X } from "lucide-react";
import type { InventoryFilters } from "@/lib/queries";
import {
  activeFilterEntries,
  filtersToQueryString,
} from "@/lib/inventory-params";
import { FUEL_TYPES, TRANSMISSIONS } from "@/lib/constants";
import { formatPrice, formatNumber } from "@/lib/utils";

function chipLabel(key: keyof InventoryFilters, value: string): string {
  switch (key) {
    case "q":
      return `“${value}”`;
    case "fuel":
      return FUEL_TYPES.find((f) => f.value === value)?.label ?? value;
    case "transmission":
      return TRANSMISSIONS.find((t) => t.value === value)?.label ?? value;
    case "priceMin":
      return `From ${formatPrice(Number(value))}`;
    case "priceMax":
      return `Up to ${formatPrice(Number(value))}`;
    case "yearMin":
      return `From ${value}`;
    case "yearMax":
      return `Up to ${value}`;
    case "mileageMax":
      return `Under ${formatNumber(Number(value))} miles`;
    default:
      return value;
  }
}

export function ActiveChips({ filters }: { filters: InventoryFilters }) {
  const entries = activeFilterEntries(filters);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {entries.map(({ key, value }) => {
        const rest: InventoryFilters = { ...filters, [key]: undefined, page: undefined };
        return (
          <Link
            key={`${key}-${value}`}
            href={`/inventory${filtersToQueryString(rest)}`}
            scroll={false}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-steel px-3 py-1 text-xs text-ink transition-colors hover:border-chrome-3"
          >
            {chipLabel(key, value)}
            <X className="h-3 w-3 text-ink-faint" aria-hidden />
          </Link>
        );
      })}
      <Link
        href="/inventory"
        scroll={false}
        className="text-xs text-ink-faint underline underline-offset-4 transition-colors hover:text-ink"
      >
        Clear all
      </Link>
    </div>
  );
}
