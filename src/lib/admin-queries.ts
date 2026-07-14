import "server-only";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { Enquiry, VehicleWithImages } from "@/types";

const PAGE = 20;

export type DashboardStats = {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  featured: number;
  enquiriesWeek: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    total: 0,
    available: 0,
    reserved: 0,
    sold: 0,
    featured: 0,
    enquiriesWeek: 0,
  };
  if (!isSupabaseConfigured()) return empty;

  const supabase = await createSupabaseServerClient();
  const base = () =>
    supabase.from("vehicles").select("*", { count: "exact", head: true });

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const [total, available, reserved, sold, featured, enquiriesWeek] =
    await Promise.all([
      base(),
      base().eq("status", "available"),
      base().eq("status", "reserved"),
      base().eq("status", "sold"),
      base().eq("featured", true),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo),
    ]);

  return {
    total: total.count ?? 0,
    available: available.count ?? 0,
    reserved: reserved.count ?? 0,
    sold: sold.count ?? 0,
    featured: featured.count ?? 0,
    enquiriesWeek: enquiriesWeek.count ?? 0,
  };
}

export async function listVehiclesAdmin({
  q,
  status,
  page = 1,
}: {
  q?: string;
  status?: string;
  page?: number;
}): Promise<{ vehicles: VehicleWithImages[]; total: number; page: number; pageCount: number }> {
  if (!isSupabaseConfigured())
    return { vehicles: [], total: 0, page, pageCount: 1 };

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("vehicles")
    .select("*, vehicle_images(*)", { count: "exact" })
    .order("updated_at", { ascending: false });

  if (status) query = query.eq("status", status as never);
  if (q) {
    const term = q.replace(/[%,()]/g, " ").trim();
    if (term)
      query = query.or(
        `title.ilike.%${term}%,make.ilike.%${term}%,model.ilike.%${term}%`,
      );
  }

  const from = (page - 1) * PAGE;
  query = query.range(from, from + PAGE - 1);

  const { data, count } = await query;
  const total = count ?? 0;
  return {
    vehicles: (data as VehicleWithImages[] | null) ?? [],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE)),
  };
}

export async function getVehicleByIdAdmin(
  id: string,
): Promise<VehicleWithImages | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as VehicleWithImages | null) ?? null;
}

export async function listEnquiries({
  kind,
  page = 1,
}: {
  kind?: string;
  page?: number;
}): Promise<{ enquiries: Enquiry[]; total: number; page: number; pageCount: number }> {
  if (!isSupabaseConfigured())
    return { enquiries: [], total: 0, page, pageCount: 1 };

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (kind) query = query.eq("kind", kind as never);

  const from = (page - 1) * PAGE;
  query = query.range(from, from + PAGE - 1);

  const { data, count } = await query;
  const total = count ?? 0;
  return {
    enquiries: (data as Enquiry[] | null) ?? [],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE)),
  };
}

export async function getRecentEnquiries(limit = 5): Promise<Enquiry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Enquiry[] | null) ?? [];
}
