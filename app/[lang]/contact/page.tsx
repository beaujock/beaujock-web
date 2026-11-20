import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.meta.contactTitle,
    description: t.meta.contactDescription,
    alternates: alternatesFor(lang, "/contact"),
    openGraph: { title: t.meta.contactTitle, description: t.meta.contactDescription, url: `/${lang}/contact` },
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const c = t.contact;
  return (
    <div className="container-site grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{c.title}</h1>
        <p className="mt-5 text-lg text-muted">{c.lead}</p>
        <div className="mt-10 flex items-start gap-4 rounded-2xl bg-night p-6 text-white">
          <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 text-aurora-cyan" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          <p className="text-sm text-white/85">{c.location}</p>
        </div>
      </div>
      <ContactForm lang={lang} t={t} />
    </div>
  );
}
