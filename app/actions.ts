"use server";

import { fmt, getDictionary } from "@/dictionaries";
import { hasLocale, defaultLocale, formatCAD, type Locale } from "@/lib/i18n";
import { isPackageId, packages, pageSuggestions } from "@/lib/packages";
import { sendFormEmail, type MailField } from "@/lib/mail";

export type FormState = {
  status: "idle" | "success" | "error";
  errors?: Record<string, string>;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{7,20}$/;
const DOMAIN_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})*\.[a-z]{2,}$/i;
const SUBDOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

const str = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? "").trim().slice(0, max);

function localeOf(fd: FormData): Locale {
  const l = str(fd, "lang", 5);
  return hasLocale(l) ? l : defaultLocale;
}

/** Splits the free-text "other pages" box into names. */
function splitList(value: string): string[] {
  return value
    .split(/[,\n;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function submitOrder(_prev: FormState, fd: FormData): Promise<FormState> {
  const lang = localeOf(fd);
  const t = getDictionary(lang);
  const pkgId = str(fd, "package", 40);
  if (!isPackageId(pkgId)) return { status: "error", message: t.errors.send };
  const pkg = packages[pkgId];

  // Honeypot: real people never fill this hidden field.
  if (str(fd, "company_website")) return { status: "success" };

  const errors: Record<string, string> = {};
  const fullName = str(fd, "fullName", 120);
  const email = str(fd, "email", 200);
  const phone = str(fd, "phone", 40);
  const domain = str(fd, "domain", 253).toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  const notes = str(fd, "notes", 4000);

  if (!fullName) errors.fullName = t.errors.required;
  if (!email) errors.email = t.errors.required;
  else if (!EMAIL_RE.test(email)) errors.email = t.errors.email;
  if (!phone) errors.phone = t.errors.required;
  else if (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 7) errors.phone = t.errors.phone;
  if (!domain) errors.domain = t.errors.required;
  else if (!DOMAIN_RE.test(domain)) errors.domain = t.errors.domain;

  const allowed = new Set(pageSuggestions[pkgId]);
  const chosen = fd.getAll("pages").map(String).filter((p) => allowed.has(p));
  const otherPages = splitList(str(fd, "pagesOther", 1000));
  const totalPages = chosen.length + otherPages.length;
  if (totalPages === 0) errors.pages = t.errors.pagesMin;
  else if (totalPages > pkg.maxPages) errors.pages = fmt(t.errors.pagesMax, { n: pkg.maxPages });

  let database = "";
  if (pkg.databases > 0) {
    database = str(fd, "database", 4000);
    if (!database) errors.database = t.errors.required;
  }

  const subdomains: string[] = [];
  if (pkg.subdomains > 0) {
    for (let i = 0; i < pkg.subdomains; i++) {
      const s = str(fd, `subdomain${i}`, 63).toLowerCase();
      if (!s) continue;
      if (!SUBDOMAIN_RE.test(s)) errors[`subdomain${i}`] = t.errors.subdomain;
      else subdomains.push(s);
    }
  }

  if (Object.keys(errors).length) return { status: "error", errors, message: t.errors.form };

  // Emails to the Web Builder Manager are always written in English, with the client's language noted.
  const en = getDictionary("en");
  const pkgName = en.packages[pkgId].name;
  const pageNames = [...chosen.map((p) => en.pageOptions[p as keyof typeof en.pageOptions]), ...otherPages];
  const fields: MailField[] = [
    { label: "Package", value: `${pkgName} (setup ${formatCAD(pkg.setup, "en")}, maintenance ${formatCAD(pkg.maintenance, "en")}/yr)` },
    { label: "Full name", value: fullName },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Requested domain", value: domain },
    { label: `Pages (${totalPages} of ${pkg.maxPages})`, value: pageNames.join("\n") },
  ];
  if (pkg.databases > 0) fields.push({ label: "Database information", value: database });
  if (pkg.subdomains > 0) fields.push({ label: "Subdomains", value: subdomains.map((s) => `${s}.${domain}`).join("\n") });
  fields.push({ label: "Notes", value: notes }, { label: "Client language", value: lang === "fr" ? "French" : "English" });

  const sent = await sendFormEmail({ subject: `New ${pkgName} order: ${fullName} (${domain})`, replyTo: email, fields });
  return sent.ok ? { status: "success" } : { status: "error", message: t.errors.send };
}

export async function submitContact(_prev: FormState, fd: FormData): Promise<FormState> {
  const lang = localeOf(fd);
  const t = getDictionary(lang);
  if (str(fd, "company_website")) return { status: "success" };

  const errors: Record<string, string> = {};
  const fullName = str(fd, "fullName", 120);
  const email = str(fd, "email", 200);
  const phone = str(fd, "phone", 40);
  const topicKey = str(fd, "topic", 20);
  const message = str(fd, "message", 6000);

  if (!fullName) errors.fullName = t.errors.required;
  if (!email) errors.email = t.errors.required;
  else if (!EMAIL_RE.test(email)) errors.email = t.errors.email;
  if (phone && (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 7)) errors.phone = t.errors.phone;
  if (!message) errors.message = t.errors.required;
  if (Object.keys(errors).length) return { status: "error", errors, message: t.errors.form };

  const topics = getDictionary("en").contact.topics;
  const topic = topics[topicKey as keyof typeof topics] ?? topics.other;
  const sent = await sendFormEmail({
    subject: `Website message: ${topic} (${fullName})`,
    replyTo: email,
    fields: [
      { label: "Topic", value: topic },
      { label: "Full name", value: fullName },
      { label: "Email", value: email },
      { label: "Phone", value: phone },
      { label: "Message", value: message },
      { label: "Client language", value: lang === "fr" ? "French" : "English" },
    ],
  });
  return sent.ok ? { status: "success" } : { status: "error", message: t.errors.send };
}
