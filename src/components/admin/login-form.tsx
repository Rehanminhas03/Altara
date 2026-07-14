"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm({
  redirectTo = "/admin",
  initialError = "",
}: {
  redirectTo?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Allow a bare username (e.g. "uzair") — map it to the account email.
    const email = username.includes("@")
      ? username.trim()
      : `${username.trim()}@altara-automotive.co.uk`;
    const supabase = createSupabaseBrowserClient();
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signErr) {
      setError("Invalid username or password.");
      setLoading(false);
      return;
    }
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setError("This account is not an administrator.");
      setLoading(false);
      return;
    }
    router.push(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field label="Username" htmlFor="username">
        <Input
          id="username"
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="uzair"
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button
        type="submit"
        variant="chrome"
        size="lg"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
