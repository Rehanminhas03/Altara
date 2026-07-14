"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Menu, X, Phone, Search } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, PRIMARY_PHONE } from "@/lib/constants";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 16,
    () => false,
  );

  const isHome = pathname === "/";
  // Transparent only over the dark home hero; solid dark bar everywhere else.
  const solid = scrolled || !isHome || searchOpen;

  // Lock body scroll + ESC-to-close while the sheet is open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/inventory?q=${encodeURIComponent(term)}` : "/inventory");
    setSearchOpen(false);
    setOpen(false);
    setQ("");
  };

  return (
    <header
      className={cn(
        "theme-dark fixed inset-x-0 top-0 z-50 text-ink transition-colors duration-300",
        solid
          ? "border-b border-hairline bg-obsidian/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Logo priority className="h-14" />

        <div className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.href) ? "text-ink" : "text-ink-muted hover:text-ink",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search inventory"
            aria-expanded={searchOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>
          <ThemeToggle />
          <a
            href={`tel:${PRIMARY_PHONE.tel}`}
            className="inline-flex items-center gap-2 pl-1 pr-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span className="tnum">{PRIMARY_PHONE.display}</span>
          </a>
          <Link
            href="/inventory"
            className={buttonVariants({ variant: "chrome", size: "sm" })}
          >
            Browse Inventory
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-0.5 lg:hidden">
          <ThemeToggle className="h-11 w-11 text-ink" />
          <button
            type="button"
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search inventory"
            aria-expanded={searchOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </nav>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="border-t border-hairline bg-obsidian/95 backdrop-blur-xl">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 sm:px-8"
          >
            <Search className="h-5 w-5 shrink-0 text-ink-faint" aria-hidden />
            <input
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search make, model or keyword…"
              aria-label="Search inventory"
              className="flex-1 bg-transparent text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              type="submit"
              className={buttonVariants({ variant: "chrome", size: "sm" })}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </form>
        </div>
      )}

      {/* Mobile full-screen sheet */}
      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="theme-dark fixed inset-0 z-50 flex flex-col bg-obsidian/95 text-ink backdrop-blur-2xl lg:hidden"
        >
          <div className="flex h-20 items-center justify-between px-5">
            <Logo className="h-14" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
              aria-label="Close menu"
              autoFocus
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between px-5 pb-10 pt-6">
            <div className="flex flex-col gap-1">
              <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 rounded-xl border border-hairline bg-steel px-4">
                <Search className="h-5 w-5 shrink-0 text-ink-faint" aria-hidden />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search inventory…"
                  aria-label="Search inventory"
                  className="h-12 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-faint"
                />
              </form>
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-hairline py-4 font-heading text-2xl font-semibold transition-colors",
                    isActive(item.href) ? "text-ink" : "text-ink-muted",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/inventory"
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "chrome", size: "lg" })}
              >
                Browse Inventory
              </Link>
              <a
                href={`tel:${PRIMARY_PHONE.tel}`}
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call {PRIMARY_PHONE.display}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
