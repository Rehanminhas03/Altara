import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaBand() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <div className="theme-dark relative overflow-hidden rounded-3xl border border-hairline p-10 text-center text-ink sm:p-16">
            <Image
              src="/hero/hero-2.jpg"
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(15,17,22,0.82), rgba(15,17,22,0.9))",
              }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold text-ink sm:text-4xl">
                Can&apos;t find it?{" "}
                <span className="chrome-text">We&apos;ll source it.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-muted">
                Tell us the exact specification you&apos;re after and we&apos;ll
                use our trade network to find your perfect car.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className={buttonVariants({ variant: "chrome", size: "lg" })}
                >
                  Request a car
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/inventory"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Browse stock
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
