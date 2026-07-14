import type { Metadata } from "next";
import { Search, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { Logo } from "@/components/layout/logo";
import { CtaBand } from "@/components/home/cta-band";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Altara Automotive is a premium used-car specialist — handpicked stock, honest advice and nationwide delivery.",
};

const STEPS = [
  {
    Icon: Search,
    title: "We hunt",
    body: "We source through trusted trade channels and reject far more cars than we buy — only the best make the cut.",
  },
  {
    Icon: ShieldCheck,
    title: "We check",
    body: "Every car is HPI checked and thoroughly inspected before it goes on sale, so there are no surprises.",
  },
  {
    Icon: Truck,
    title: "We deliver",
    body: "Reserve online and we'll prepare and deliver your car anywhere in mainland UK, ready to drive.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Altara"
        title="A better way to buy a used car"
        description="We built Altara to take the theatre and the hard sell out of buying a premium used car — replacing it with genuinely good stock, straight answers and effortless delivery."
      />

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-5 text-lg leading-relaxed text-ink-muted">
              <p>
                Altara Automotive is a specialist in premium used cars. Rather
                than filling a forecourt with volume, we curate a smaller
                collection of cars we&apos;d be happy to own ourselves — each one
                handpicked for its condition, history and specification.
              </p>
              <p>
                Every vehicle is HPI-clear and fully inspected before it&apos;s
                listed, and we&apos;re transparent about everything we know. With
                nationwide delivery, your next car can arrive at your door, fully
                prepared and ready to enjoy.
              </p>
              <p>
                No pressure, no gimmicks — just a calmer, more considered way to
                buy a great car.
              </p>
            </div>
          </div>
          <aside>
            <div className="rounded-2xl border border-hairline bg-graphite p-6">
              <h2 className="font-heading text-lg font-semibold text-ink">
                What you can expect
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-ink-muted">
                {[
                  "Handpicked, inspected stock",
                  "HPI clear, no hidden history",
                  "Nationwide delivery",
                  "Honest, no-pressure advice",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-chrome-2" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <h2 className="font-heading text-3xl font-semibold text-ink">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-hairline bg-graphite p-6">
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
        </div>
      </Container>

      {/* Brand statement band — the chrome logo reads on dark */}
      <section
        className="theme-dark text-ink"
        style={{
          background:
            "radial-gradient(90% 120% at 50% 0%, rgba(185,191,198,0.10) 0%, transparent 55%), #14161c",
        }}
      >
        <Container className="py-20 text-center">
          <Reveal>
            <Logo href={null} priority className="mx-auto h-20 sm:h-24" />
            <blockquote className="mx-auto mt-10 max-w-3xl font-heading text-2xl font-medium leading-relaxed text-ink sm:text-3xl">
              &ldquo;We started Altara to make buying a premium used car feel
              effortless — the right cars, honest advice, and no theatre.&rdquo;
            </blockquote>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-ink-faint">
              The Altara Team
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
