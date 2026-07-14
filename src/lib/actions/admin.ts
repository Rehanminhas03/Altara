"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/dal";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { vehicleFormSchema } from "@/lib/validators/vehicle";
import { vehicleSlug } from "@/lib/utils";

const BUCKET = "vehicle-images";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function guard(): Promise<ActionResult> {
  if (!isSupabaseConfigured())
    return { ok: false, error: "Database is not configured." };
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) return { ok: false, error: "Not authorised." };
  return { ok: true };
}

async function ensureUniqueSlug(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  base: string,
  excludeId?: string,
): Promise<string> {
  let slug = base || "vehicle";
  let n = 1;
  // Try until an unused slug is found.
  for (;;) {
    const { data } = await admin
      .from("vehicles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data || data.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function toRow(v: ReturnType<typeof vehicleFormSchema.parse>) {
  return {
    title: v.title,
    make: v.make,
    model: v.model,
    variant: v.variant || null,
    year: v.year,
    mileage: v.mileage,
    fuel: v.fuel,
    transmission: v.transmission,
    engine_size: v.engine_size ?? null,
    power_bhp: v.power_bhp ?? null,
    colour: v.colour || null,
    body_type: v.body_type,
    doors: v.doors ?? null,
    seats: v.seats ?? null,
    price: v.price,
    previous_price: v.previous_price ?? null,
    description: v.description || null,
    features: v.features ?? [],
    status: v.status,
    featured: v.featured,
    reg_plate: v.reg_plate || null,
  };
}

export async function createVehicle(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const g = await guard();
  if (!g.ok) return g;

  const parsed = vehicleFormSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Please check the vehicle details." };
  const v = parsed.data;

  const admin = createSupabaseAdminClient();
  const base = v.slug?.trim() || vehicleSlug(v.title, v.year);
  const slug = await ensureUniqueSlug(admin, base);

  const { data, error } = await admin
    .from("vehicles")
    .insert({ ...toRow(v), slug })
    .select("id, slug")
    .single();

  if (error || !data)
    return { ok: false, error: error?.message ?? "Could not create vehicle." };

  revalidatePath("/admin/vehicles");
  revalidatePath("/inventory");
  return { ok: true, data: { id: data.id, slug: data.slug } };
}

export async function updateVehicle(
  id: string,
  input: unknown,
): Promise<ActionResult<{ slug: string }>> {
  const g = await guard();
  if (!g.ok) return g;

  const parsed = vehicleFormSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Please check the vehicle details." };
  const v = parsed.data;

  const admin = createSupabaseAdminClient();
  const base = v.slug?.trim() || vehicleSlug(v.title, v.year);
  const slug = await ensureUniqueSlug(admin, base, id);

  const { error } = await admin
    .from("vehicles")
    .update({ ...toRow(v), slug })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/vehicles");
  revalidatePath(`/inventory/${slug}`);
  revalidatePath("/inventory");
  return { ok: true, data: { slug } };
}

export async function deleteVehicle(id: string): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;

  const admin = createSupabaseAdminClient();
  // Remove storage objects first.
  const { data: imgs } = await admin
    .from("vehicle_images")
    .select("storage_path")
    .eq("vehicle_id", id);
  const paths = (imgs ?? [])
    .map((i) => i.storage_path)
    .filter((p): p is string => Boolean(p));
  if (paths.length) await admin.storage.from(BUCKET).remove(paths);

  const { error } = await admin.from("vehicles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/vehicles");
  revalidatePath("/inventory");
  return { ok: true };
}

export async function setVehicleStatus(
  id: string,
  status: "available" | "reserved" | "sold",
): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("vehicles").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/vehicles");
  revalidatePath("/inventory");
  return { ok: true };
}

export async function toggleFeatured(
  id: string,
  featured: boolean,
): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("vehicles")
    .update({ featured })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/vehicles");
  revalidatePath("/");
  return { ok: true };
}

export async function markEnquiryHandled(
  id: string,
  handled: boolean,
): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("enquiries")
    .update({ handled })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/enquiries");
  return { ok: true };
}

export async function deleteEnquiry(id: string): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("enquiries").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { ok: true };
}

export async function uploadVehicleImages(
  vehicleId: string,
  formData: FormData,
): Promise<ActionResult<{ added: number }>> {
  const g = await guard();
  if (!g.ok) return g;

  const admin = createSupabaseAdminClient();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return { ok: false, error: "No files selected." };

  // Next display_order after existing images.
  const { data: existing } = await admin
    .from("vehicle_images")
    .select("display_order")
    .eq("vehicle_id", vehicleId)
    .order("display_order", { ascending: false })
    .limit(1);
  let order = (existing?.[0]?.display_order ?? -1) + 1;

  let added = 0;
  for (const file of files) {
    try {
      const buf = Buffer.from(await file.arrayBuffer());
      const webp = await sharp(buf)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      const path = `vehicles/${vehicleId}/${crypto.randomUUID()}.webp`;
      const { error: upErr } = await admin.storage
        .from(BUCKET)
        .upload(path, webp, { contentType: "image/webp", upsert: false });
      if (upErr) continue;

      const url = admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      const { error: insErr } = await admin.from("vehicle_images").insert({
        vehicle_id: vehicleId,
        url,
        storage_path: path,
        is_placeholder: false,
        display_order: order,
      });
      if (!insErr) {
        order += 1;
        added += 1;
      }
    } catch {
      // Skip unreadable / non-image files.
    }
  }

  if (added === 0) return { ok: false, error: "No images could be processed." };
  revalidatePath(`/admin/vehicles/${vehicleId}/edit`);
  revalidatePath("/inventory");
  return { ok: true, data: { added } };
}

export async function deleteVehicleImage(
  imageId: string,
): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  const admin = createSupabaseAdminClient();

  const { data: img } = await admin
    .from("vehicle_images")
    .select("storage_path, vehicle_id")
    .eq("id", imageId)
    .maybeSingle();
  if (img?.storage_path) await admin.storage.from(BUCKET).remove([img.storage_path]);

  const { error } = await admin.from("vehicle_images").delete().eq("id", imageId);
  if (error) return { ok: false, error: error.message };

  if (img?.vehicle_id)
    revalidatePath(`/admin/vehicles/${img.vehicle_id}/edit`);
  revalidatePath("/inventory");
  return { ok: true };
}

export async function reorderVehicleImage(
  imageId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const g = await guard();
  if (!g.ok) return g;
  const admin = createSupabaseAdminClient();

  const { data: img } = await admin
    .from("vehicle_images")
    .select("id, vehicle_id, display_order")
    .eq("id", imageId)
    .maybeSingle();
  if (!img) return { ok: false, error: "Image not found." };

  const { data: siblings } = await admin
    .from("vehicle_images")
    .select("id, display_order")
    .eq("vehicle_id", img.vehicle_id)
    .order("display_order", { ascending: true });
  if (!siblings) return { ok: false, error: "No images." };

  const idx = siblings.findIndex((s) => s.id === img.id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= siblings.length) return { ok: true };

  const a = siblings[idx];
  const b = siblings[swapWith];
  await admin
    .from("vehicle_images")
    .update({ display_order: b.display_order })
    .eq("id", a.id);
  await admin
    .from("vehicle_images")
    .update({ display_order: a.display_order })
    .eq("id", b.id);

  revalidatePath(`/admin/vehicles/${img.vehicle_id}/edit`);
  revalidatePath("/inventory");
  return { ok: true };
}
