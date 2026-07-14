/**
 * Create (or update) an Altara admin login directly via the Supabase Admin API
 * — no dashboard needed. Uses the service-role/secret key.
 *
 *   node scripts/create-admin.mjs <email> [password]
 *
 * If password is omitted, a strong one is generated and printed.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  const email = process.argv[2];
  const password =
    process.argv[3] ?? `Altara-${randomBytes(6).toString("base64url")}9!`;

  if (!url || !key) {
    console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or service/secret key in .env.local");
    process.exit(1);
  }
  if (!email) {
    console.error("Usage: node scripts/create-admin.mjs <email> [password]");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Create the user (idempotent — reuse if the email already exists).
  let userId;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const found = list?.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (!found) {
      console.error("✗ Could not create user:", error.message);
      process.exit(1);
    }
    userId = found.id;
    // Update the password so the printed one is valid.
    await supabase.auth.admin.updateUserById(userId, { password });
  } else {
    userId = data.user.id;
  }

  const { error: insErr } = await supabase
    .from("admins")
    .upsert({ user_id: userId, email });
  if (insErr) {
    console.error("✗ Could not grant admin:", insErr.message);
    process.exit(1);
  }

  console.log("\n✓ Admin ready. Sign in at /admin/login\n");
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}\n`);
}

main();
