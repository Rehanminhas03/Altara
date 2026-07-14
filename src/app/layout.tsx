import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { BUSINESS } from "@/lib/constants";
import { LoadingScreen } from "@/components/motion/loading-screen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BUSINESS.name} — Premium Used Cars`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Handpicked, HPI-clear premium used cars from Altara Automotive, with nationwide delivery.",
  applicationName: BUSINESS.name,
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — Premium Used Cars`,
    description:
      "Handpicked, HPI-clear premium used cars with nationwide delivery.",
    url: siteUrl,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} — Premium Used Cars`,
    description: "Handpicked, HPI-clear premium used cars. Nationwide delivery.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-ink">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('altara:theme');if(t==='dark')document.documentElement.dataset.theme='dark';}catch(e){}`,
          }}
        />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
