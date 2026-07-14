import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { Vehicle, VehicleWithImages } from "@/types";

const SELECT = "*, vehicle_images(*)";
const PAGE_SIZE = 12;

export type InventoryFilters = {
  q?: string;
  make?: string;
  model?: string;
  body?: string;
  fuel?: string;
  transmission?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  sort?: string;
  page?: number;
};

export type InventoryResult = {
  vehicles: VehicleWithImages[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

function escapeLike(input: string): string {
  return input.replace(/[%,()]/g, " ").trim();
}

export async function getFeaturedVehicles(
  limit = 6,
): Promise<VehicleWithImages[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vehicles")
    .select(SELECT)
    .eq("featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as VehicleWithImages[] | null) ?? [];
}

export async function getLatestVehicles(
  limit = 8,
): Promise<VehicleWithImages[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vehicles")
    .select(SELECT)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as VehicleWithImages[] | null) ?? [];
}

export async function getVehicleBySlug(
  slug: string,
): Promise<VehicleWithImages | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vehicles")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  return (data as VehicleWithImages | null) ?? null;
}

export async function getAllVehicleSlugs(): Promise<
  Pick<Vehicle, "slug" | "updated_at">[]
> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vehicles")
    .select("slug, updated_at")
    .neq("status", "sold");
  return data ?? [];
}

export async function getRelatedVehicles(
  vehicle: Pick<Vehicle, "id" | "body_type" | "make">,
  limit = 3,
): Promise<VehicleWithImages[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vehicles")
    .select(SELECT)
    .eq("status", "available")
    .neq("id", vehicle.id)
    .or(`body_type.eq.${vehicle.body_type},make.eq.${vehicle.make}`)
    .limit(limit);
  return (data as VehicleWithImages[] | null) ?? [];
}

export type InventoryFacets = {
  /** make → models present in stock (for the dependent dropdowns) */
  makeModel: Record<string, string[]>;
  bodyTypes: string[];
  fuels: string[];
  transmissions: string[];
};

/**
 * Every filter option derived from LIVE available stock — so the inventory
 * filters only ever show makes/models/body-types/etc. that a customer can
 * actually find. Driven entirely by what's entered in the admin panel.
 */
export async function getInventoryFacets(): Promise<InventoryFacets> {
  const empty: InventoryFacets = {
    makeModel: {},
    bodyTypes: [],
    fuels: [],
    transmissions: [],
  };
  if (!isSupabaseConfigured()) return empty;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vehicles")
    .select("make, model, body_type, fuel, transmission")
    .eq("status", "available");
  const rows = (data ?? []) as {
    make: string;
    model: string;
    body_type: string;
    fuel: string;
    transmission: string;
  }[];

  const mm: Record<string, Set<string>> = {};
  const bodies = new Set<string>();
  const fuels = new Set<string>();
  const trans = new Set<string>();
  for (const r of rows) {
    (mm[r.make] ??= new Set()).add(r.model);
    if (r.body_type) bodies.add(r.body_type);
    if (r.fuel) fuels.add(r.fuel);
    if (r.transmission) trans.add(r.transmission);
  }

  return {
    makeModel: Object.fromEntries(
      Object.entries(mm)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([make, models]) => [make, [...models].sort()]),
    ),
    bodyTypes: [...bodies].sort(),
    fuels: [...fuels],
    transmissions: [...trans],
  };
}

/** Distinct makes + models across ALL vehicles — powers admin form autocomplete
 *  so data stays consistent (no "BMW" vs "bmw"). */
export async function getMakeModelSuggestions(): Promise<{
  makes: string[];
  models: string[];
}> {
  if (!isSupabaseConfigured()) return { makes: [], models: [] };
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("vehicles").select("make, model");
  const rows = (data ?? []) as { make: string; model: string }[];
  const makes = new Set<string>();
  const models = new Set<string>();
  for (const r of rows) {
    if (r.make) makes.add(r.make);
    if (r.model) models.add(r.model);
  }
  return {
    makes: [...makes].sort(),
    models: [...models].sort(),
  };
}

export async function searchVehicles(
  filters: InventoryFilters,
): Promise<InventoryResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = PAGE_SIZE;

  if (!isSupabaseConfigured()) {
    return { vehicles: [], total: 0, page, pageSize, pageCount: 0 };
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("vehicles")
    .select(SELECT, { count: "exact" })
    .eq("status", "available");

  if (filters.make) query = query.eq("make", filters.make);
  if (filters.model) query = query.eq("model", filters.model);
  if (filters.body) query = query.eq("body_type", filters.body);
  if (filters.fuel) query = query.eq("fuel", filters.fuel);
  if (filters.transmission)
    query = query.eq("transmission", filters.transmission);
  if (filters.priceMin != null) query = query.gte("price", filters.priceMin);
  if (filters.priceMax != null) query = query.lte("price", filters.priceMax);
  if (filters.yearMin != null) query = query.gte("year", filters.yearMin);
  if (filters.yearMax != null) query = query.lte("year", filters.yearMax);
  if (filters.mileageMax != null)
    query = query.lte("mileage", filters.mileageMax);

  if (filters.q) {
    const q = escapeLike(filters.q);
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,make.ilike.%${q}%,model.ilike.%${q}%,variant.ilike.%${q}%`,
      );
    }
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "mileage_asc":
      query = query.order("mileage", { ascending: true });
      break;
    case "year_desc":
      query = query.order("year", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count } = await query;
  const total = count ?? 0;
  return {
    vehicles: (data as VehicleWithImages[] | null) ?? [],
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}
