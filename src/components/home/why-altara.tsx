import { Search, ShieldCheck, Truck, Handshake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

const VALUES = [
  {
    Icon: Search,
    title: "Handpicked stock",
    body: "Every car is individually selected for condition, history and desirability — no filler, no compromise.",
  },
  {
    Icon: ShieldCheck,
    title: "HPI-clear & inspected",
    body: "Multi-point inspected and HPI checked, so you buy with complete confidence and full transparency.",
  },
  {
    Icon: Handshake,
    title: "No-pressure buying",
    body: "Honest advice and straight answers — no hard sell, no gimmicks, ever.",
  },
  {
    Icon: Truck,
    title: "Nationwide delivery",
    body: "We deliver to your door anywhere in mainland UK, fully prepared and ready to drive.",
  },
];

export function WhyAltara() {
  return (
    <section className="border-y border-hairline bg-graphite/40 py-20">
      <Container>
        <SectionHeading
          eyebrow="Why Altara"
          title="A calmer way to buy a car"
          description="The standards of a premium dealership, without the theatre."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-hairline bg-obsidian/40 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-steel">
                  <Icon className="h-5 w-5 text-chrome-2" aria-hidden />
                </span>
                <h3 className="font-heading text-lg font-semibold text-ink">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
