import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { Logo } from "@/components/layout/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { signOutAdmin } from "@/lib/actions/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-hairline bg-graphite p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6">
        <div className="flex items-center justify-between">
          <Logo href="/admin" />
        </div>
        <AdminNav orientation="vertical" />
        <div className="mt-auto hidden flex-col gap-3 border-t border-hairline pt-4 lg:flex">
          <p className="truncate text-xs text-ink-faint" title={user.email ?? ""}>
            {user.email}
          </p>
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden bg-obsidian">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
