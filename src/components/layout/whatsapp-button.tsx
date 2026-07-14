import { PRIMARY_PHONE } from "@/lib/constants";
import { WhatsappIcon } from "./social-icons";

/** Floating WhatsApp chat button — shown on every public page. */
export function WhatsappButton() {
  const text = encodeURIComponent("Hi Altara, I'm interested in a car.");
  return (
    <a
      href={`https://wa.me/${PRIMARY_PHONE.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95"
    >
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}
