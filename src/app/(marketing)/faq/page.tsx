import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about buying, reserving, part-exchanging and delivery at Altara Automotive.",
};

const FAQS = [
  {
    q: "Are your cars HPI clear?",
    a: "Yes. Every car we sell is HPI checked and confirmed clear before it goes on sale, so there's no outstanding finance, insurance write-off history or mileage discrepancy.",
  },
  {
    q: "Do you offer nationwide delivery?",
    a: "We do. We can deliver anywhere in mainland UK, fully prepared and ready to drive. Get in touch for a delivery estimate to your postcode.",
  },
  {
    q: "How do I reserve a car?",
    a: "Get in touch and we can hold a car for you with a small refundable deposit while you arrange the details. The deposit comes off the final price. (Deposit terms — client to confirm.)",
  },
  {
    q: "Do your cars come with a warranty?",
    a: "Many of our cars include, or can be supplied with, a warranty. Cover varies by vehicle, so please ask us about the specific car you're interested in. (Warranty details — client to confirm.)",
  },
  {
    q: "Can I view or test drive before buying?",
    a: "Yes — viewings and test drives are by appointment so we can give you our full attention. Use the enquiry buttons on any car, or contact us to arrange a time.",
  },
  {
    q: "What happens after I buy?",
    a: "We prepare the car, complete the paperwork and either hand it over at our showroom or deliver it to your door. You'll receive all relevant documentation with the vehicle.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description="Everything you need to know about buying with Altara. Can't find your answer? Just get in touch."
      />

      <Container className="py-16">
        <div className="mx-auto max-w-3xl divide-y divide-hairline">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  className="h-5 w-5 shrink-0 text-chrome-2 transition-transform group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
