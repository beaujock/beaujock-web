import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Sora } from "next/font/google";
import "../globals.css";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales, ogLocales } from "@/lib/i18n";
import { alternatesFor, siteName, siteUrl } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sora = Sora({ subsets: ["latin", "latin-ext"], weight: ["500", "700"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#2A1B4D", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: "%s" },
    description: t.meta.description,
    applicationName: siteName,
    alternates: alternatesFor(lang),
    openGraph: {
      type: "website",
      siteName,
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
      url: `/${lang}`,
      title: t.meta.title,
      description: t.meta.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: siteName }],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description, images: ["/og.png"] },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <html lang={lang === "fr" ? "fr-CA" : "en-CA"} className={`${sora.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header lang={lang} t={t} />
        <main id="main" className="flex-1">{children}</main>
        <Footer lang={lang} t={t} />
      </body>
    </html>
  );
}
