/**
 * Replace the inventory with 3 real listings + real photos.
 *
 *   npm run db:seed-inventory
 *
 * Wipes ALL existing vehicles (and their storage objects), then inserts the
 * three vehicles below and uploads each one's photo through the same pipeline
 * the admin uses (sharp → WebP → Supabase Storage → vehicle_images row).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUCKET = "vehicle-images";

function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env))
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* ignore */
  }
}

const VEHICLES = [
  {
    image: "bmw-m5.jpg",
    row: {
      slug: "bmw-m5-competition-2019",
      title: "BMW M5 Competition",
      make: "BMW",
      model: "5 Series",
      variant: "M5 Competition",
      year: 2019,
      mileage: 28400,
      fuel: "petrol",
      transmission: "automatic",
      engine_size: 4.4,
      power_bhp: 616,
      colour: "Alpine White",
      body_type: "Saloon",
      doors: 4,
      seats: 5,
      price: 52995,
      previous_price: 55995,
      description:
        "A properly serious executive saloon. The Competition brings 616bhp from BMW's twin-turbo 4.4 V8, driving all four wheels through M xDrive — with a rear-wheel-drive mode when you want it. Finished in Alpine White over black Merino leather, with the Competition Package's firmer suspension and forged 20-inch wheels. Full BMW main-dealer service history, two keys and HPI clear.",
      features: [
        "M xDrive all-wheel drive",
        "Competition Package",
        "Harman Kardon surround sound",
        "Heated M Sport seats",
        "Head-up display",
        "360° camera",
        "Apple CarPlay",
      ],
      status: "sold",
      featured: false,
      reg_plate: "19 reg",
      registered_at: "2019-06-12",
    },
  },
  {
    image: "nissan-gtr.jpg",
    row: {
      slug: "nissan-gt-r-premium-2017",
      title: "Nissan GT-R Premium",
      make: "Nissan",
      model: "GT-R",
      variant: "3.8 V6 Premium",
      year: 2017,
      mileage: 34100,
      fuel: "petrol",
      transmission: "semi_auto",
      engine_size: 3.8,
      power_bhp: 562,
      colour: "Pearl White",
      body_type: "Coupe",
      doors: 2,
      seats: 4,
      price: 54995,
      previous_price: null,
      description:
        "The legendary R35 — a hand-built twin-turbo V6 sending 562bhp to all four wheels through a razor-sharp dual-clutch gearbox. Few cars at any price deliver this level of all-weather pace. Presented in Pearl White with black leather, and supplied with a documented service record and a recent major service. HPI clear with two keys.",
      features: [
        "Twin-turbo 3.8 V6",
        "ATTESA E-TS all-wheel drive",
        "Bose sound system",
        "Recaro heated seats",
        "Titanium exhaust",
        "Reversing camera",
      ],
      status: "sold",
      featured: false,
      reg_plate: "17 reg",
      registered_at: "2017-09-04",
    },
  },
  {
    image: "bmw-m4.jpg",
    row: {
      slug: "bmw-m4-competition-2018",
      title: "BMW M4 Competition",
      make: "BMW",
      model: "4 Series",
      variant: "M4 Competition",
      year: 2018,
      mileage: 31250,
      fuel: "petrol",
      transmission: "semi_auto",
      engine_size: 3.0,
      power_bhp: 444,
      colour: "Mineral Grey",
      body_type: "Coupe",
      doors: 2,
      seats: 4,
      price: 38995,
      previous_price: null,
      description:
        "A superb F82 M4 with the Competition Package — 444bhp from the S55 twin-turbo straight-six, adaptive M suspension and a sharper limited-slip differential. Specified with the carbon fibre roof, forged wheels and full black leather. Beautifully kept with full service history.",
      features: [
        "Competition Package",
        "Carbon fibre roof",
        "Adaptive M suspension",
        "Harman Kardon audio",
        "Heated front seats",
        "Reversing camera",
      ],
      status: "sold",
      featured: false,
      reg_plate: "18 reg",
      registered_at: "2018-03-21",
    },
  },
];

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or service key in .env.local");
    process.exit(1);
  }

  const sb = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Wipe existing stock + its stored images.
  console.log("→ Clearing existing inventory …");
  const { data: oldImgs } = await sb.from("vehicle_images").select("storage_path");
  const paths = (oldImgs ?? []).map((i) => i.storage_path).filter(Boolean);
  if (paths.length) await sb.storage.from(BUCKET).remove(paths);
  const { error: delErr } = await sb.from("vehicles").delete().not("id", "is", null);
  if (delErr) {
    console.error("✗ Could not clear vehicles:", delErr.message);
    process.exit(1);
  }
  console.log(`  ✓ removed old vehicles and ${paths.length} stored image(s)`);

  // 2. Insert the new stock + upload each photo.
  for (const { image, row } of VEHICLES) {
    const { data: created, error } = await sb
      .from("vehicles")
      .insert(row)
      .select("id, slug")
      .single();
    if (error || !created) {
      console.error(`✗ ${row.title}:`, error?.message);
      continue;
    }

    const webp = await sharp(readFileSync(join(root, "supabase/seed-images", image)))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const path = `vehicles/${created.id}/${randomUUID()}.webp`;
    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(path, webp, { contentType: "image/webp", upsert: false });
    if (upErr) {
      console.error(`  ✗ photo upload failed for ${row.title}:`, upErr.message);
      continue;
    }

    const publicUrl = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    await sb.from("vehicle_images").insert({
      vehicle_id: created.id,
      url: publicUrl,
      storage_path: path,
      is_placeholder: false,
      display_order: 0,
    });

    console.log(`  ✓ ${row.title} (${row.status}) — photo uploaded`);
  }

  const { count } = await sb
    .from("vehicles")
    .select("*", { count: "exact", head: true });
  console.log(`\n✓ Inventory now has ${count} vehicles.\n`);
}

main();
