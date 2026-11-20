import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { packageIds, packages } from "@/lib/packages";
import { siteName, siteUrl } from "@/lib/site";
import PackageCard from "@/components/PackageCard";

const includedIcons = [
  <path key="d" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />,
  <path key="m" d="M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5ZM11 18.5h2" />,
  <path key="s" d="M10.5 3a7.5 7.5 0 1 0 4.7 13.3L21 22M7.5 10.5h6M10.5 7.5v6" />,
  <path key="c" d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#business`,
    name: siteName,
    url: `${siteUrl}/${lang}`,
    logo: `${siteUrl}/icon.png`,
    image: `${siteUrl}/og.png`,
    description: t.meta.description,
    inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
    address: { "@type": "PostalAddress", addressLocality: "Edmonton", addressRegion: "AB", addressCountry: "CA" },
    areaServed: [{ "@type": "City", name: "Edmonton" }, { "@type": "Country", name: "Canada" }],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.home.serviceTitle,
      itemListElement: packageIds.map((id) => ({
        "@type": "Offer",
        name: t.packages[id].name,
        description: t.packages[id].tagline,
        price: packages[id].setup,
        priceCurrency: "CAD",
        url: `${siteUrl}/${lang}/web-presence/${id}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-night-900 text-white">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-aurora-cyan/25 blur-3xl" />
          <div className="absolute -bottom-48 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-aurora-magenta/25 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:28px_28px]" />
        </div>
        <div className="container-site grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="eyebrow !text-aurora-cyan">{t.home.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] text-white sm:text-6xl">
              {t.home.title1} <span className="text-aurora">{t.home.title2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">{t.home.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/${lang}#packages`} className="btn btn-aurora">{t.home.primary}</Link>
              <Link href={`/${lang}/contact`} className="btn btn-ghost">{t.home.secondary}</Link>
            </div>
            <p className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
              <span className="font-display text-xs uppercase tracking-[0.2em]">{t.home.stackLabel}</span>
              <span className="font-medium text-white/80">Next.js</span>
              <span className="font-medium text-white/80">Tailwind CSS</span>
              <span className="font-medium text-white/80">Postgres</span>
            </p>
          </div>
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div aria-hidden className="absolute inset-6 rounded-full bg-aurora opacity-40 blur-3xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/icon-gradient.svg" alt="" width={400} height={400} className="relative w-full drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Service */}
      <section className="container-site py-20 sm:py-24" aria-labelledby="service-title">
        <div className="max-w-3xl">
          <p className="eyebrow">{t.home.serviceEyebrow}</p>
          <h2 id="service-title" className="mt-3 text-3xl font-bold sm:text-4xl">{t.home.serviceTitle}</h2>
          <p className="mt-5 text-lg text-muted">{t.home.serviceLead}</p>
        </div>
        <h3 className="mt-14 text-lg font-bold">{t.home.includedTitle}</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.included.map((item, i) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-night/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-night text-aurora-cyan">
                <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {includedIcons[i]}
                </svg>
              </span>
              <h4 className="mt-4 font-bold">{item.title}</h4>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="scroll-mt-20 bg-white py-20 sm:py-24" aria-labelledby="packages-title">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{t.home.packagesEyebrow}</p>
            <h2 id="packages-title" className="mt-3 text-3xl font-bold sm:text-4xl">{t.home.packagesTitle}</h2>
            <p className="mt-4 text-muted">{t.home.packagesLead}</p>
          </div>
          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            {packageIds.map((id) => (
              <PackageCard key={id} pkg={packages[id]} lang={lang} t={t} highlight={id === "beaver-dam"} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            <Link href={`/${lang}/web-presence`} className="font-semibold text-deep-cyan underline-offset-4 hover:underline">
              {t.webPresence.title} →
            </Link>
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="container-site py-20 sm:py-24" aria-labelledby="process-title">
        <p className="eyebrow">{t.home.processEyebrow}</p>
        <h2 id="process-title" className="mt-3 text-3xl font-bold sm:text-4xl">{t.home.processTitle}</h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.process.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-display text-5xl font-bold text-aurora">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Personalized CTA */}
      <section className="container-site pb-24">
        <div className="relative isolate overflow-hidden rounded-3xl bg-night px-6 py-14 text-center sm:px-14">
          <div aria-hidden className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-aurora-magenta/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-20 -z-10 h-72 w-72 rounded-full bg-aurora-cyan/25 blur-3xl" />
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.home.customTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">{t.home.customText}</p>
          <Link href={`/${lang}/contact`} className="btn btn-aurora mt-8">{t.home.customCta}</Link>
        </div>
      </section>
    </>
  );
}
