"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

// CLIENT-CONFIRM: replace with real customer reviews before launch.
const REVIEWS = [
  {
    name: "James H.",
    car: "BMW M340i xDrive",
    rating: 5,
    quote:
      "Faultless from start to finish. The car was exactly as described, immaculately prepared, and delivered to my driveway in Leeds two days later. Genuinely the easiest car purchase I've made.",
  },
  {
    name: "Priya S.",
    car: "Range Rover Evoque",
    rating: 5,
    quote:
      "No pressure, no gimmicks — just honest advice and a beautiful car. They kept me updated at every step and delivered exactly on time.",
  },
  {
    name: "Daniel O.",
    car: "Porsche 911 Carrera",
    rating: 5,
    quote:
      "Buying a car of this level online was a leap of faith, but Altara made it effortless. The history was spotless and it drove even better than I hoped.",
  },
  {
    name: "Sarah W.",
    car: "Tesla Model 3",
    rating: 5,
    quote:
      "Professional, quick to respond and completely transparent. The whole experience felt premium — I'll be recommending them to everyone.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const review = REVIEWS[i];
  const go = (dir: number) =>
    setI((prev) => (prev + dir + REVIEWS.length) % REVIEWS.length);

  return (
    <section className="border-y border-hairline bg-graphite/40 py-20">
      <Container>
        <SectionHeading eyebrow="Reviews" title="Trusted by our customers" />

        <div className="mt-10 rounded-3xl border border-hairline bg-obsidian/40 p-8 sm:p-12">
          <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: review.rating }).map((_, s) => (
              <Star
                key={s}
                className="h-5 w-5 fill-chrome-1 text-chrome-1"
                aria-hidden
              />
            ))}
          </div>

          <blockquote className="mt-6 font-heading text-xl leading-relaxed text-ink sm:text-2xl">
            &ldquo;{review.quote}&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="font-medium text-ink">{review.name}</p>
              <p className="text-sm text-ink-faint">
                Purchased a {review.car}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-muted transition-colors hover:border-chrome-3 hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-muted transition-colors hover:border-chrome-3 hover:text-ink"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-1.5">
            {REVIEWS.map((_, d) => (
              <button
                key={d}
                type="button"
                onClick={() => setI(d)}
                aria-label={`Go to review ${d + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  d === i ? "w-6 bg-chrome-2" : "w-1.5 bg-hairline",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
