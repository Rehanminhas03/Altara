import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const redirectTo = sp.redirect ?? "/admin";
  const initialError =
    sp.error === "not_admin"
      ? "You need an administrator account to access this area."
      : "";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container className="max-w-md py-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo href={null} className="h-16" />
          <h1 className="mt-6 font-heading text-2xl font-semibold text-ink">
            Admin sign in
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage inventory and enquiries
          </p>
        </div>
        <div className="rounded-2xl border border-hairline bg-graphite p-6 sm:p-8">
          <LoginForm redirectTo={redirectTo} initialError={initialError} />
        </div>
      </Container>
    </div>
  );
}
