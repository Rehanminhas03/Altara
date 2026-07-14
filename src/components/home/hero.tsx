"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const trust = [
  { Icon: BadgeCheck, label: "HPI clear & inspected" },
  { Icon: ShieldCheck, label: "Buy with confidence" },
  { Icon: Truck, label: "Nationwide delivery" },
];

export function Hero() {
  const reduce = usePrefersReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      className="theme-dark relative isolate flex min-h-[94vh] items-center overflow-hidden text-ink"
      style={{ backgroundColor: "#13151b" }}
    >
      {/* Photographic background */}
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
      </div>

      {/* Scrims (inline so they render reliably): darken the left for text,
          fade the bright sky at top, and blend into the page at the bottom. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,17,22,0.94) 0%, rgba(15,17,22,0.8) 40%, rgba(15,17,22,0.42) 70%, rgba(15,17,22,0.15) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-44"
        style={{ background: "linear-gradient(180deg, rgba(15,17,22,0.9), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-44"
        style={{ background: "linear-gradient(0deg, #13151b, transparent)" }}
      />

      <Container className="relative z-10 pt-28 pb-24">
        <motion.p
          {...rise(0)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-ink backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          Handpicked premium used cars · UK nationwide delivery
        </motion.p>

        <h1 className="max-w-3xl font-heading text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[1.03] tracking-tight">
          <motion.span {...rise(0.05)} className="block text-ink">
            The finest used cars,
          </motion.span>
          <motion.span {...rise(0.18)} className="chrome-text block">
            chosen with precision.
          </motion.span>
        </h1>

        <motion.p
          {...rise(0.32)}
          className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted"
        >
          Every Altara vehicle is HPI-clear, fully inspected and delivered to
          your door. Browse the collection or let us source the exact car
          you&apos;re looking for.
        </motion.p>

        <motion.div
          {...rise(0.44)}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/inventory"
            className={buttonVariants({ variant: "chrome", size: "lg" })}
          >
            Browse Inventory
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Get in touch
          </Link>
        </motion.div>

        <motion.ul
          {...rise(0.58)}
          className="mt-14 flex flex-wrap gap-x-8 gap-y-4 text-sm text-ink-muted"
        >
          {trust.map(({ Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2.5">
              <Icon className="h-5 w-5 text-chrome-1" aria-hidden />
              {label}
            </li>
          ))}
        </motion.ul>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <ChevronDown
          className="h-6 w-6 animate-bounce text-ink-faint"
          aria-hidden
        />
      </div>
    </section>
  );
}
