/**
 * Central business + taxonomy constants — the single source of truth for
 * contact details, navigation and vehicle taxonomies.
 *
 * NOTE: This business does NOT offer financing — there is deliberately no
 * finance page, finance form, calculator or FCA disclosure anywhere.
 *
 * Values tagged `CLIENT-CONFIRM` / `null` are pending real details (see README
 * handover list). Nullable fields render as "coming soon" until provided.
 */

type Phone = { display: string; tel: string; whatsapp: string };

type Business = {
  name: string;
  legalName: string;
  tagline: string;
  phones: ReadonlyArray<Phone>;
  email: string | null;
  address:
    | { line1: string; line2?: string; city: string; postcode: string; country: string }
    | null;
  socials: { facebook: string | null; instagram: string | null };
};

export const BUSINESS: Business = {
  name: "Altara Automotive",
  legalName: "Altara Automotive Ltd", // CLIENT-CONFIRM: registered legal name
  tagline: "Handpicked premium used cars, delivered nationwide.",
  // Real, confirmed numbers. WhatsApp is available on the same numbers.
  phones: [
    { display: "07831 213807", tel: "+447831213807", whatsapp: "447831213807" },
    { display: "07848 689405", tel: "+447848689405", whatsapp: "447848689405" },
  ],
  email: null, // CLIENT-CONFIRM: email address to follow
  address: null, // CLIENT-CONFIRM: showroom location to follow
  socials: {
    facebook: null, // CLIENT-CONFIRM: Facebook page to follow
    instagram: null, // CLIENT-CONFIRM: Instagram profile to follow
  },
};

/** Convenience: the number shown in compact places (nav). */
export const PRIMARY_PHONE = BUSINESS.phones[0];

export const OPENING_HOURS: ReadonlyArray<{ day: string; hours: string }> = [
  { day: "Monday", hours: "09:00 – 18:00" },
  { day: "Tuesday", hours: "09:00 – 18:00" },
  { day: "Wednesday", hours: "09:00 – 18:00" },
  { day: "Thursday", hours: "09:00 – 18:00" },
  { day: "Friday", hours: "09:00 – 18:00" },
  { day: "Saturday", hours: "10:00 – 17:00" },
  { day: "Sunday", hours: "By appointment" },
]; // CLIENT-CONFIRM

export const PRIMARY_NAV: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Inventory", href: "/inventory" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV: ReadonlyArray<{
  heading: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    heading: "Browse",
    links: [
      { label: "All Inventory", href: "/inventory" },
      { label: "SUVs", href: "/inventory?body=SUV" },
      { label: "Saloons", href: "/inventory?body=Saloon" },
      { label: "Electric", href: "/inventory?fuel=electric" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Altara", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

/** Body types — used for filters and the "Browse by category" tiles. */
export const BODY_TYPES = [
  "SUV",
  "Saloon",
  "Hatchback",
  "Coupe",
  "Estate",
  "Convertible",
] as const;
export type BodyType = (typeof BODY_TYPES)[number];

/** Makes we commonly stock — used to populate filters. Extend freely from DB. */
export const MAKES = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Range Rover",
  "Tesla",
  "Toyota",
  "Volkswagen",
] as const;

/** Fuel types — labels for the `fuel_type` DB enum. */
export const FUEL_TYPES: ReadonlyArray<{ value: string; label: string }> = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "plug_in_hybrid", label: "Plug-in Hybrid" },
  { value: "electric", label: "Electric" },
];

/** Transmission types — labels for the `transmission` DB enum. */
export const TRANSMISSIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "semi_auto", label: "Semi-Automatic" },
];

export const SORT_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "newest", label: "Newest arrivals" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "mileage_asc", label: "Mileage: lowest" },
  { value: "year_desc", label: "Year: newest" },
];

/**
 * Modest, believable count-style figures for a business ~1 year old — each
 * shows a "+" (at least this many). CLIENT-CONFIRM: replace with real figures.
 */
export const STATS: ReadonlyArray<{
  value?: number;
  suffix?: string;
  decimals?: number;
  text?: string;
  label: string;
}> = [
  { value: 150, suffix: "+", label: "Cars delivered" }, // CLIENT-CONFIRM
  { value: 140, suffix: "+", label: "Happy customers" }, // CLIENT-CONFIRM (< cars delivered)
  { value: 45, suffix: "+", label: "5-star reviews" }, // CLIENT-CONFIRM
  { value: 1, suffix: "+", label: "Years of service" },
];
