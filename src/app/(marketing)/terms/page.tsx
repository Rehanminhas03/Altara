import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing the use of the Altara Automotive website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <Container className="py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              <strong>DRAFT.</strong> This is placeholder boilerplate and must be
              reviewed and finalised by the client&apos;s solicitor before
              publication.
            </p>
          </div>

          <div className="flex flex-col gap-6 leading-relaxed text-ink-muted [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
            <p className="text-sm text-ink-faint">Last updated: [client to confirm]</p>

            <section className="flex flex-col gap-3">
              <h2>1. About these terms</h2>
              <p>
                These terms govern your use of the {BUSINESS.name} website. By
                using the site you accept these terms. They do not affect your
                statutory rights as a consumer.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>2. Vehicle descriptions</h2>
              <p>
                We take care to describe our vehicles accurately, including
                specification, mileage and condition. Details are provided in good
                faith but should be confirmed with us before purchase. Images may
                be illustrative until a vehicle&apos;s own photographs are added.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>3. Pricing and availability</h2>
              <p>
                Prices are in pounds sterling and are subject to change. While we
                make every effort to keep stock and pricing up to date, a vehicle
                may be sold or reserved before the website reflects it.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>4. Reserving a vehicle</h2>
              <p>
                A vehicle may be reserved with a deposit as agreed with us. Deposit
                and refund terms are confirmed at the time of reservation. [Deposit
                terms — client to confirm.]
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>5. Delivery</h2>
              <p>
                Where delivery is arranged, timescales and any charges will be
                confirmed with you in advance. Risk in the vehicle passes on
                delivery or collection.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>6. Warranties and consumer rights</h2>
              <p>
                Vehicles may be supplied with a warranty as described for the
                specific car. Nothing in these terms limits your rights under the
                Consumer Rights Act 2015 or other applicable law. [Warranty details
                — client to confirm.]
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>7. Liability</h2>
              <p>
                We do not exclude or limit liability where it would be unlawful to
                do so. Otherwise, our liability in connection with the website is
                limited to the extent permitted by law.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>8. Governing law</h2>
              <p>
                These terms are governed by the laws of England and Wales, and the
                courts of England and Wales have exclusive jurisdiction.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
