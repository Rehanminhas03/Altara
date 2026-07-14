import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Altara Automotive collects, uses and protects your data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
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
              <h2>1. Who we are</h2>
              <p>
                {BUSINESS.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the
                data controller for personal data collected through this website.
                Our contact details are on our Contact page.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>2. What we collect</h2>
              <p>
                We collect information you provide when you make an enquiry,
                request a valuation, book a viewing or subscribe to updates —
                typically your name, contact details, vehicle details and any
                message you send us. We may also collect basic technical data such
                as your device and usage information.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>3. How we use your information</h2>
              <p>
                We use your information to respond to enquiries, provide
                valuations and quotes, arrange viewings and delivery, and — where
                you have opted in — to send you information about our stock. We do
                not sell your personal data.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>4. Legal basis (UK GDPR / Data Protection Act 2018)</h2>
              <p>
                We process your data on the basis of your consent, our legitimate
                interests in operating and marketing our business, and where
                necessary to take steps to enter into a contract with you.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>5. Cookies</h2>
              <p>
                This website uses cookies and similar technologies necessary for
                its operation and, where applicable, to understand how the site is
                used. You can control cookies through your browser settings. [A
                full cookie policy is to be confirmed by the client.]
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>6. Sharing your data</h2>
              <p>
                We may share your data with trusted service providers who help us
                operate the business (for example delivery partners and IT
                providers), and where required by law. Any such providers act on
                our instructions and are bound to protect your data.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>7. Your rights</h2>
              <p>
                You have the right to access, correct, delete or restrict the use
                of your personal data, and to object to processing or withdraw
                consent. To exercise these rights, contact us using the details on
                our Contact page. You also have the right to complain to the
                Information Commissioner&apos;s Office (ICO).
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2>8. Retention</h2>
              <p>
                We keep your personal data only for as long as necessary for the
                purposes described above or as required by law.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
