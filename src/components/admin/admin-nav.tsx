"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/vehicles", label: "Vehicles", Icon: Car, exact: false },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox, exact: false },
];

export function AdminNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className={cn(
        orientation === "vertical"
          ? "flex flex-col gap-1"
          : "flex gap-1 overflow-x-auto",
      )}
    >
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(l.href, l.exact)
              ? "bg-steel text-ink"
              : "text-ink-muted hover:bg-graphite hover:text-ink",
          )}
        >
          <l.Icon className="h-4 w-4" aria-hidden />
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
