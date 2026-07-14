import Link from "next/link";
import { Car, Truck, Zap, Wind, Package, Crown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

const CATEGORIES: {
  label: string;
  href: string;
  Icon: typeof Car;
}[] = [
  { label: "SUV", href: "/inventory?body=SUV", Icon: Truck },
  { label: "Saloon", href: "/inventory?body=Saloon", Icon: Car },
  { label: "Hatchback", href: "/inventory?body=Hatchback", Icon: Package },
  { label: "Coupe", href: "/inventory?body=Coupe", Icon: Crown },
  { label: "Estate", href: "/inventory?body=Estate", Icon: Wind },
  { label: "Electric", href: "/inventory?fuel=electric", Icon: Zap },
];

export function CategoryTiles() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Find your shape"
          title="Browse by category"
          href="/inventory"
          linkLabel="View all"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ label, href, Icon }, i) => (
            <Reveal key={label} delay={i * 0.05}>
              <Link
                href={href}
                className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-graphite transition-colors hover:border-chrome-3 hover:bg-steel"
              >
                <Icon
                  className="h-7 w-7 text-chrome-2 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden
                />
                <span className="text-sm font-medium text-ink">{label}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
