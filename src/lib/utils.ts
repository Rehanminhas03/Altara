import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, de-duplicating conflicting Tailwind classes. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a GBP price for display, e.g. 24995 -> "£24,995" (no decimals). */
export function formatPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "POA";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "POA";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Format mileage, e.g. 28400 -> "28,400 miles". */
export function formatMileage(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }
  return `${new Intl.NumberFormat("en-GB").format(value)} miles`;
}

/** Format a plain integer with thousands separators, e.g. 1200 -> "1,200". */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-GB").format(value);
}

/**
 * Turn free text into a URL-safe slug.
 * NFKD decomposition splits accented characters into base + combining mark;
 * the non-alphanumeric filter then drops the marks, so "Škoda" -> "skoda".
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // drop non-alphanumerics (incl. combining marks)
    .replace(/[\s_-]+/g, "-") // collapse whitespace/underscores to a single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}

/** Build a vehicle slug from title + year, guaranteed non-empty. */
export function vehicleSlug(title: string, year: number): string {
  const base = slugify(title);
  const suffix = slugify(String(year));
  const combined = [base, suffix].filter(Boolean).join("-");
  return combined || `vehicle-${year}`;
}

/** Convert an enum-ish token to a human label, e.g. "semi_auto" -> "Semi Auto". */
export function humanize(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format a numeric year safely, e.g. 2022 -> "2022". */
export function formatYear(value: number | null | undefined): string {
  if (!value || !Number.isFinite(value)) return "—";
  return String(value);
}

/** Full date, e.g. "14 July 2026". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Short date, e.g. "14 Jul 2026". */
export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
