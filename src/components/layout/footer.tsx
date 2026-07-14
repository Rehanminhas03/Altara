import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { FacebookIcon, InstagramIcon } from "./social-icons";
import { BUSINESS, FOOTER_NAV, OPENING_HOURS } from "@/lib/constants";

export function Footer() {
  const year = 2026; // build-time constant; keep in sync at release
  const socials = [
    { href: BUSINESS.socials.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: BUSINESS.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-auto border-t border-hairline bg-graphite">
      <Container className="py-16">
        {/* Newsletter band */}
        <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-12 md:flex-row md:items-end">
          <div className="max-w-md">
            <h2 className="font-heading text-2xl font-semibold text-ink">
              New arrivals, first.
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Join our list for handpicked stock before it hits the forecourt.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {BUSINESS.tagline}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-ink-muted">
              {BUSINESS.phones.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="tnum">{p.display}</span>
                </a>
              ))}
              {BUSINESS.email ? (
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {BUSINESS.email}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2.5 text-ink-faint">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  Email address coming soon
                </span>
              )}
              <span className="inline-flex items-start gap-2.5 text-ink-faint">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {BUSINESS.address
                  ? `${BUSINESS.address.line1}, ${BUSINESS.address.city}, ${BUSINESS.address.postcode}`
                  : "Showroom location coming soon"}
              </span>
            </div>
          </div>

          {FOOTER_NAV.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {col.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
              Opening Hours
            </h3>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-ink-muted">
              {OPENING_HOURS.map((row) => (
                <li key={row.day} className="flex justify-between gap-3">
                  <span>{row.day.slice(0, 3)}</span>
                  <span className="tnum text-ink-faint">{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal + socials */}
        <div className="flex flex-col gap-4 border-t border-hairline pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-faint">
            © {year} {BUSINESS.legalName}. All rights reserved.
          </p>
          {socials.length > 0 ? (
            <div className="flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href as string}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-muted transition-colors hover:border-chrome-3 hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-faint">Facebook &amp; Instagram coming soon</p>
          )}
        </div>
      </Container>
    </footer>
  );
}
