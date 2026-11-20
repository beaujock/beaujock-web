import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, getDictionary } from "@/dictionaries";
import { formatCAD, hasLocale } from "@/lib/i18n";
import { packageIds, packages } from "@/lib/packages";
import { alternatesFor } from "@/lib/site";
import PackageCard from "@/components/PackageCard";
import PackageIcon from "@/components/PackageIcon";

export async function generateMetadata({ params }: PageProps<"/[lang]/web-presence">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.meta.webPresenceTitle,
    description: t.meta.webPresenceDescription,
    alternates: alternatesFor(lang, "/web-presence"),
    openGraph: { title: t.meta.webPresenceTitle, description: t.meta.webPresenceDescription, url: `/${lang}/web-presence` },
  };
}

export default async function WebPresencePage({ params }: PageProps<"/[lang]/web-presence">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const w = t.webPresence;
  const yes = (
    <span className="inline-flex items-center gap-1.5 text-deep-cyan">
      <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg>
      {w.yes}
    </span>
  );
  const no = <span className="text-muted">{w.no}</span>;

  const rows: { label: string; cell: (id: (typeof packageIds)[number]) => React.ReactNode }[] = [
    { label: w.rows.setup, cell: (id) => <strong className="font-display text-night">{formatCAD(packages[id].setup, lang)}</strong> },
    { label: w.rows.maintenance, cell: (id) => formatCAD(packages[id].maintenance, lang) },
    { label: w.rows.domain, cell: () => yes },
    { label: w.rows.pages, cell: (id) => fmt(w.upTo, { n: packages[id].maxPages }) },
    { label: w.rows.subdomains, cell: (id) => (packages[id].subdomains ? fmt(w.upTo, { n: packages[id].subdomains }) : <span className="text-muted">{w.none}</span>) },
    {
      label: w.rows.databases,
      cell: (id) => {
        const n = packages[id].databases;
        return n === 0 ? <span className="text-muted">{w.none}</span> : n === 1 ? "1" : fmt(w.upTo, { n });
      },
    },
    { label: w.rows.admin, cell: (id) => (packages[id].adminSite ? yes : no) },
    { label: w.rows.seo, cell: () => yes },
    { label: w.rows.responsive, cell: () => yes },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: w.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <section className="bg-white">
        <div className="container-site py-16 sm:py-20">
          <p className="eyebrow">{w.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{w.title}</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted">{w.lead}</p>
          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
            {packageIds.map((id) => (
              <PackageCard key={id} pkg={packages[id]} lang={lang} t={t} highlight={id === "beaver-dam"} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-16 sm:py-20" aria-labelledby="compare-title">
        <h2 id="compare-title" className="text-3xl font-bold">{w.compareTitle}</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-night/10">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-night/10">
                <th scope="col" className="p-4 font-display font-medium text-muted">{w.feature}</th>
                {packageIds.map((id) => (
                  <th key={id} scope="col" className="p-4">
                    <span className="flex items-center gap-2 font-display text-base font-bold text-night">
                      <PackageIcon id={id} className="h-7 w-7" />
                      {t.packages[id].name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-night/5 last:border-0">
                  <th scope="row" className="p-4 font-medium text-ink">{row.label}</th>
                  {packageIds.map((id) => (
                    <td key={id} className="p-4">{row.cell(id)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4" />
                {packageIds.map((id) => (
                  <td key={id} className="p-4">
                    <Link href={`/${lang}/web-presence/${id}`} className="btn btn-primary !px-4 !py-2 !text-xs">{t.packages[id].button}</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-site pb-20 sm:pb-24" aria-labelledby="faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="faq-title" className="text-3xl font-bold">{w.faqTitle}</h2>
            <p className="mt-4 text-muted">{t.home.customText}</p>
            <Link href={`/${lang}/contact`} className="btn btn-primary mt-6">{t.home.customCta}</Link>
          </div>
          <div className="space-y-3">
            {w.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-white p-5 ring-1 ring-night/10 open:ring-deep-cyan/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold text-night [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-xl text-deep-cyan transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
