# Beaujock Enterprises website

Next.js 16.4.5 (App Router) + Tailwind CSS v4. Bilingual (English `/en`, French `/fr`).

## Run it
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Where things are
- `dictionaries/en.ts`, `dictionaries/fr.ts`: all page text. Edit wording here.
- `lib/packages.ts`: package prices, page/database/subdomain limits, page suggestions on each form.
- `app/[lang]/`: pages (home, web-presence, web-presence/[package] order forms, contact).
- `app/actions.ts`: form validation; `lib/mail.ts`: email delivery (Nodemailer over SMTP).
- `proxy.ts`: sends `/` to `/en` or `/fr` from the visitor's browser language (or their last choice).
- SEO: per-page titles/descriptions, canonical + hreflang, Open Graph image (`public/og.png`), `sitemap.xml`, `robots.txt`, JSON-LD (business, services, FAQ).

## Forms
Each package button opens `/[lang]/web-presence/<package>`. Submissions go to `WEB_BUILDER_EMAIL`.
Set the `SMTP_*` variables (see `.env.example`) for real delivery. Without `SMTP_HOST`, dev prints the email to the console and production shows an error to the visitor.
