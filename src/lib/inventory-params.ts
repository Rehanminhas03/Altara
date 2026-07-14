import type { InventoryFilters } from "./queries";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const ONE = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

/** Parse Next.js `searchParams` into a typed, validated filter object. */
export function parseInventoryFilters(sp: RawSearchParams): InventoryFilters {
  const str = (k: string) => {
    const v = ONE(sp[k]);
    return v && v.trim() ? v.trim() : undefined;
  };
  const num = (k: string) => {
    const v = ONE(sp[k]);
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : undefined;
  };
  return {
    q: str("q"),
    make: str("make"),
    model: str("model"),
    body: str("body"),
    fuel: str("fuel"),
    transmission: str("transmission"),
    priceMin: num("priceMin"),
    priceMax: num("priceMax"),
    yearMin: num("yearMin"),
    yearMax: num("yearMax"),
    mileageMax: num("mileageMax"),
    sort: str("sort"),
    page: num("page"),
  };
}

const KEYS: (keyof InventoryFilters)[] = [
  "q",
  "make",
  "model",
  "body",
  "fuel",
  "transmission",
  "priceMin",
  "priceMax",
  "yearMin",
  "yearMax",
  "mileageMax",
  "sort",
  "page",
];

/** Serialise a filter object back to a URLSearchParams (omitting empties). */
export function filtersToSearchParams(f: InventoryFilters): URLSearchParams {
  const p = new URLSearchParams();
  for (const key of KEYS) {
    const v = f[key];
    if (v === undefined || v === "" || v === null) continue;
    p.set(key, String(v));
  }
  return p;
}

export function filtersToQueryString(f: InventoryFilters): string {
  const s = filtersToSearchParams(f).toString();
  return s ? `?${s}` : "";
}

/** Filters that count as "active" for chips / clear-all (excludes sort/page). */
export function activeFilterEntries(
  f: InventoryFilters,
): { key: keyof InventoryFilters; value: string }[] {
  const out: { key: keyof InventoryFilters; value: string }[] = [];
  for (const key of KEYS) {
    if (key === "sort" || key === "page") continue;
    const v = f[key];
    if (v === undefined || v === "" || v === null) continue;
    out.push({ key, value: String(v) });
  }
  return out;
}
