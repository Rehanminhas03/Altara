/**
 * Promote an existing Supabase Auth user to an Altara admin.
 *
 * First create the user in the Supabase dashboard (Authentication → Add user),
 * then:
 *   npm run db:add-admin -- you@altara-automotive.co.uk
 *
 * Requires SUPABASE_DB_URL in .env.local.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      if (!(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* ignore */
  }
}

async function main() {
  loadEnv();
  const email = process.argv[2];
  const url = process.env.SUPABASE_DB_URL;
  if (!email) {
    console.error("Usage: npm run db:add-admin -- <email>");
    process.exit(1);
  }
  if (!url) {
    console.error("✗ SUPABASE_DB_URL is not set in .env.local");
    process.exit(1);
  }

  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
  try {
    const rows = await sql`
      insert into public.admins (user_id, email)
      select id, email from auth.users where lower(email) = lower(${email})
      on conflict (user_id) do update set email = excluded.email
      returning user_id, email`;
    if (rows.length === 0) {
      console.error(
        `✗ No auth user found for ${email}.\n  Create it first: Supabase dashboard → Authentication → Add user.`,
      );
      process.exitCode = 1;
    } else {
      console.log(`✓ ${rows[0].email} is now an Altara admin.`);
    }
  } catch (err) {
    console.error("✗ Failed:", err?.message ?? err);
    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
