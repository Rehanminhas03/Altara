import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { Reveal } from "@/components/motion/reveal";
import type { VehicleWithImages } from "@/types";

export function VehicleShowcase({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  vehicles,
  priorityFirst = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  vehicles: VehicleWithImages[];
  priorityFirst?: boolean;
}) {
  if (vehicles.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          href={href}
          linkLabel={href ? linkLabel : undefined}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.06}>
              <VehicleCard vehicle={v} priority={priorityFirst && i === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
