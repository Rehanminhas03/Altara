import { Hero } from "@/components/home/hero";
import { VehicleShowcase } from "@/components/home/vehicle-showcase";
import { CategoryTiles } from "@/components/home/category-tiles";
import { WhyAltara } from "@/components/home/why-altara";
import { StatsBand } from "@/components/home/stats-band";
import { Testimonials } from "@/components/home/testimonials";
import { BrandsStrip } from "@/components/home/brands-strip";
import { CtaBand } from "@/components/home/cta-band";
import { ContactTeaser } from "@/components/home/contact-teaser";
import { getFeaturedVehicles, getLatestVehicles } from "@/lib/queries";

// Data-driven from Supabase on every request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedVehicles(6),
    getLatestVehicles(6),
  ]);

  return (
    <>
      <Hero />
      <VehicleShowcase
        eyebrow="Featured"
        title="This week's highlights"
        description="A rotating selection of our most sought-after stock."
        href="/inventory"
        vehicles={featured}
        priorityFirst
      />
      <CategoryTiles />
      <VehicleShowcase
        eyebrow="Just in"
        title="Latest arrivals"
        href="/inventory?sort=newest"
        vehicles={latest}
      />
      <WhyAltara />
      <StatsBand />
      <Testimonials />
      <BrandsStrip />
      <CtaBand />
      <ContactTeaser />
    </>
  );
}
