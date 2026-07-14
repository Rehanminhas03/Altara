import Link from "next/link";
import { Phone, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { MapPlaceholder } from "@/components/contact/map-placeholder";
import { BUSINESS, OPENING_HOURS } from "@/lib/constants";

export function ContactTeaser() {
  return (
    <section className="border-t border-hairline py-20">
      <Container>
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <MapPlaceholder className="h-full" />
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-faint">
              Visit or call
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-ink sm:text-4xl">
              Come and see the collection
            </h2>
            <p className="mt-3 max-w-md text-ink-muted">
              Viewings are by appointment so we can give you our full attention.
              Our showroom location will be published here shortly.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-ink-muted">
                <Phone className="h-4 w-4 text-chrome-2" aria-hidden />
                <span className="flex flex-wrap gap-x-3 tnum">
                  {BUSINESS.phones.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      className="transition-colors hover:text-ink"
                    >
                      {p.display}
                    </a>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-3 text-ink-muted">
                <Clock className="h-4 w-4 text-chrome-2" aria-hidden />
                <span>
                  Mon–Fri {OPENING_HOURS[0].hours} · Sat{" "}
                  {OPENING_HOURS[5].hours}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className={buttonVariants({ variant: "chrome" })}
              >
                Get in touch
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
