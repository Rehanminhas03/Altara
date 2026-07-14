import { Container } from "@/components/ui/container";
import { getInventoryFacets } from "@/lib/queries";

export async function BrandsStrip() {
  const { makeModel } = await getInventoryFacets();
  const makes = Object.keys(makeModel);

  // Only show real brands that are currently in stock.
  if (makes.length === 0) return null;

  return (
    <section className="py-16">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-ink-faint">
          Brands in stock
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {makes.map((make) => (
            <span
              key={make}
              className="font-heading text-lg font-semibold tracking-wide text-ink-faint transition-colors duration-300 hover:text-chrome-1 sm:text-xl"
            >
              {make}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
