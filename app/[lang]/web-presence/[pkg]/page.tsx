import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, getDictionary } from "@/dictionaries";
import { formatCAD, hasLocale, locales } from "@/lib/i18n";
import { isPackageId, packageIds, packages, pageSuggestions, subdomainSuggestions } from "@/lib/packages";
import { alternatesFor, siteUrl } from "@/lib/site";
import OrderForm from "@/components/OrderForm";
import PackageIcon from "@/components/PackageIcon";
import { packageFeatures } from "@/components/PackageCard";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((lang) => packageIds.map((pkg) => ({ lang, pkg })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/web-presence/[pkg]">): Promise<Metadata> {
  const { lang, pkg } = await params;
  if (!hasLocale(lang) || !isPackageId(pkg)) return {};
  const t = getDictionary(lang);
  const p = packages[pkg];
  const name = t.packages[pkg].name;
  const extra = p.subdomains
    ? `, ${t.webPresence.rows.subdomains.toLowerCase()}, ${t.webPresence.rows.databases.toLowerCase()}`
    : p.databases
      ? `, ${t.order.databaseLegend.toLowerCase()}`
      : "";
  const title = fmt(t.meta.orderTitle, { name });
  const description = fmt(t.meta.orderDescription, { name, extra, setup: formatCAD(p.setup, lang), maintenance: formatCAD(p.maintenance, lang) });
  return { title, description, alternates: alternatesFor(lang, `/web-presence/${pkg}`), openGraph: { title, description, url: `/${lang}/web-presence/${pkg}` } };
}

export default async function OrderPage({ params }: PageProps<"/[lang]/web-presence/[pkg]">) {
  const { lang, pkg: pkgId } = await params;
  if (!hasLocale(lang) || !isPackageId(pkgId)) notFound();
  const t = getDictionary(lang);
  const pkg = packages[pkgId];
  const copy = t.packages[pkgId];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${t.home.serviceTitle}: ${copy.name}`,
    description: copy.tagline,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: "CA",
    offers: { "@type": "Offer", price: pkg.setup, priceCurrency: "CAD", url: `${siteUrl}/${lang}/web-presence/${pkgId}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd).replace(/</g, "\\u003c") }} />
      <div className="container-site py-12 sm:py-16">
        <Link href={`/${lang}/web-presence`} className="inline-flex items-center gap-2 text-sm font-semibold text-deep-cyan hover:underline">
          <span aria-hidden>←</span> {t.order.back}
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <p className="eyebrow">{t.order.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{fmt(t.order.title, { name: copy.name })}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{t.order.lead}</p>
            <div className="mt-10">
              <OrderForm
                pkg={pkg}
                lang={lang}
                t={t}
                suggestions={pageSuggestions[pkgId]}
                subdomainSuggestions={subdomainSuggestions}
              />
            </div>
          </div>

          <aside className="lg:pt-24" aria-label={t.order.summary}>
            <div className="sticky top-24 rounded-3xl bg-night p-7 text-white">
              <PackageIcon id={pkgId} className="h-12 w-12" />
              <h2 className="mt-4 text-2xl font-bold text-white">{copy.name}</h2>
              <p className="mt-1 text-sm text-white/70">{copy.tagline}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-aurora">{formatCAD(pkg.setup, lang)}</span>
                <span className="text-sm text-white/70">{t.packages.setup}</span>
              </p>
              <p className="mt-1 text-sm text-white/70">+ {fmt(t.packages.maintenance, { price: formatCAD(pkg.maintenance, lang) })}</p>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-sm">
                {packageFeatures(pkg, t).map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className="text-aurora-cyan">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
