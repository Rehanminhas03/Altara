import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import { MapPlaceholder } from "@/components/contact/map-placeholder";
import { JsonLd } from "@/components/seo/json-ld";
import { dealerJsonLd } from "@/lib/seo";
import { BUSINESS, OPENING_HOURS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Altara Automotive — call, WhatsApp or send us a message. Viewings by appointment.",
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={dealerJsonLd()} />
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about a car or booking a viewing? Call or WhatsApp us, or drop us a message and we'll get back to you."
      />

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-ink">
              Send a message
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-hairline bg-graphite p-6">
              <h2 className="font-heading text-lg font-semibold text-ink">
                Contact details
              </h2>

              <div className="mt-4 flex flex-col gap-4 text-sm">
                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-ink-faint">
                    <Phone className="h-4 w-4" aria-hidden /> Call us
                  </p>
                  <div className="flex flex-col gap-1 pl-6">
                    {BUSINESS.phones.map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="tnum text-ink transition-colors hover:text-chrome-1"
                      >
                        {p.display}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-ink-faint">
                    <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                  </p>
                  <div className="flex flex-col gap-1 pl-6">
                    {BUSINESS.phones.map((p) => (
                      <a
                        key={p.whatsapp}
                        href={`https://wa.me/${p.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tnum text-ink transition-colors hover:text-chrome-1"
                      >
                        {p.display}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-ink-faint">
                    <Mail className="h-4 w-4" aria-hidden /> Email
                  </p>
                  <p className="pl-6 text-ink-muted">
                    {BUSINESS.email ?? "Email address coming soon"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-hairline bg-graphite p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
                <Clock className="h-4 w-4 text-chrome-2" aria-hidden />
                Opening hours
              </h2>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm">
                {OPENING_HOURS.map((row) => (
                  <li
                    key={row.day}
                    className="flex justify-between border-b border-hairline/60 py-1.5 last:border-0"
                  >
                    <span className="text-ink-muted">{row.day}</span>
                    <span className="tnum text-ink">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <MapPlaceholder />
          </div>
        </div>
      </Container>
    </>
  );
}
