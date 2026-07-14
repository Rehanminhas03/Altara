import type { Metadata } from "next";
import Link from "next/link";
import { listEnquiries } from "@/lib/admin-queries";
import { Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { EnquiryItem } from "@/components/admin/enquiry-item";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false } };
export const dynamic = "force-dynamic";

const KINDS = [
  { value: "", label: "All types" },
  { value: "general", label: "General" },
  { value: "viewing", label: "Viewing" },
  { value: "test_drive", label: "Test drive" },
  { value: "newsletter", label: "Newsletter" },
];

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const kind = sp.kind;
  const page = Number(sp.page) || 1;
  const { enquiries, total, pageCount } = await listEnquiries({ kind, page });

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (kind) params.set("kind", kind);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/admin/enquiries?${s}` : "/admin/enquiries";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Enquiries</h1>
          <p className="text-sm text-ink-muted">{total} total</p>
        </div>
      </div>

      <form method="get" className="flex gap-3">
        <Select name="kind" defaultValue={kind ?? ""} className="sm:w-56" aria-label="Filter by type">
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </Select>
        <button type="submit" className={buttonVariants({ variant: "ghost", size: "md" })}>
          Filter
        </button>
      </form>

      {enquiries.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-graphite p-12 text-center text-sm text-ink-muted">
          No enquiries yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {enquiries.map((e) => (
            <EnquiryItem key={e.id} enquiry={e} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Previous
            </Link>
          )}
          <span className="text-sm text-ink-muted">
            Page {page} of {pageCount}
          </span>
          {page < pageCount && (
            <Link href={pageHref(page + 1)} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
