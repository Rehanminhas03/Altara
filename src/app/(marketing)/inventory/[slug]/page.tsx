import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Gauge, Fuel, Cog, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Gallery } from "@/components/vehicle/gallery";
import { SpecTable } from "@/components/vehicle/spec-table";
import { Features } from "@/components/vehicle/features";
import { ShareButtons } from "@/components/vehicle/share";
import { EnquiryRail } from "@/components/vehicle/enquiry-rail";
import { RecordView } from "@/components/vehicle/record-view";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge, statusToTone } from "@/components/ui/badge";
import { getVehicleBySlug, getRelatedVehicles } from "@/lib/queries";
import { getVehicleImages, displayTitle } from "@/lib/vehicle";
import { formatDate, formatMileage, formatPrice, humanize } from "@/lib/utils";
import { SITE_URL, breadcrumbJsonLd, vehicleJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found" };

  const title = displayTitle(vehicle);
  const description =
    vehicle.description?.slice(0, 155) ??
    `${title} — ${formatPrice(vehicle.price)} at Altara Automotive.`;
  const ogImage = getVehicleImages(vehicle).find((i) => !i.isPlaceholder)?.url;

  return {
    title,
    description,
    alternates: { canonical: `/inventory/${vehicle.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/inventory/${vehicle.slug}`,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const images = getVehicleImages(vehicle);
  const related = await getRelatedVehicles(vehicle, 3);
  const title = displayTitle(vehicle);
  const status = statusToTone(vehicle.status);
  const ogImage = images.find((i) => !i.isPlaceholder)?.url;

  const crumbs = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Inventory", url: `${SITE_URL}/inventory` },
    { name: title, url: `${SITE_URL}/inventory/${vehicle.slug}` },
  ];

  const quickFacts = [
    { Icon: Calendar, value: String(vehicle.year) },
    { Icon: Gauge, value: formatMileage(vehicle.mileage) },
    { Icon: Fuel, value: humanize(vehicle.fuel) },
    { Icon: Cog, value: humanize(vehicle.transmission) },
  ];

  return (
    <div className="pt-28">
      <JsonLd data={[vehicleJsonLd(vehicle, ogImage), breadcrumbJsonLd(crumbs)]} />
      <RecordView
        slug={vehicle.slug}
        title={vehicle.title}
        year={vehicle.year}
        price={vehicle.price}
      />

      <Container className="py-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-ink-faint"
        >
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href="/inventory" className="transition-colors hover:text-ink">
            Inventory
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="line-clamp-1 text-ink-muted">{title}</span>
        </nav>

        <header className="mt-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
              {title}
            </h1>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
          {vehicle.variant && (
            <p className="mt-1 text-ink-muted">{vehicle.variant}</p>
          )}
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            {quickFacts.map(({ Icon, value }) => (
              <li key={value} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-chrome-2" aria-hidden />
                {value}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink-faint">
            Listed on {formatDate(vehicle.created_at)}
          </p>
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="flex min-w-0 flex-col gap-10">
            <Gallery images={images} />

            <section>
              <h2 className="font-heading text-2xl font-semibold text-ink">
                Specification
              </h2>
              <div className="mt-5">
                <SpecTable vehicle={vehicle} />
              </div>
            </section>

            {vehicle.features && vehicle.features.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-semibold text-ink">
                  Features &amp; equipment
                </h2>
                <div className="mt-5">
                  <Features features={vehicle.features} />
                </div>
              </section>
            )}

            {vehicle.description && (
              <section>
                <h2 className="font-heading text-2xl font-semibold text-ink">
                  Description
                </h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-muted">
                  {vehicle.description}
                </p>
              </section>
            )}

            <div className="border-t border-hairline pt-6">
              <ShareButtons
                url={`${SITE_URL}/inventory/${vehicle.slug}`}
                title={title}
              />
            </div>
          </div>

          <aside>
            <div className="lg:sticky lg:top-28">
              <EnquiryRail
                vehicleId={vehicle.id}
                vehicleTitle={title}
                price={vehicle.price}
                previousPrice={vehicle.previous_price}
                status={vehicle.status}
              />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-semibold text-ink">
              You may also like
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
