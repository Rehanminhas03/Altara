/**
 * One-shot database setup for a fresh Supabase project.
 *
 * Usage:
 *   1) Fill SUPABASE_DB_URL in .env.local (Supabase dashboard →
 *      Project Settings → Database → Connection string → URI).
 *   2) npm run db:setup            (schema + RLS + storage, then seed)
 *      npm run db:setup -- --no-seed   (schema only)
 *
 * Idempotent: safe to run more than once.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Minimal .env.local loader (avoids a dotenv dependency).
function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    /* no .env.local — rely on process env */
  }
}

async function main() {
  loadEnv();
  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error(
      "\n✗ SUPABASE_DB_URL is not set.\n" +
        "  Add it to .env.local (Supabase → Project Settings → Database → Connection string → URI).\n",
    );
    process.exit(1);
  }

  const seed = !process.argv.includes("--no-seed");
  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

  try {
    const migrationsDir = join(root, "supabase/migrations");
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const file of files) {
      console.log(`→ Applying migration ${file} …`);
      await sql.unsafe(readFileSync(join(migrationsDir, file), "utf8"));
    }
    console.log("  ✓ schema, RLS and storage in place");

    if (seed) {
      console.log("→ Seeding inventory …");
      await sql.unsafe(readFileSync(join(root, "supabase/seed.sql"), "utf8"));
      const [{ count }] = await sql`select count(*)::int as count from public.vehicles`;
      console.log(`  ✓ ${count} vehicles seeded`);
    }

    console.log("\n✓ Database ready.\n");
  } catch (err) {
    console.error("\n✗ Setup failed:\n", err?.message ?? err, "\n");
    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
