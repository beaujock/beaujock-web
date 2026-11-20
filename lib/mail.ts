import "server-only";
import nodemailer from "nodemailer";

export type MailField = { label: string; value: string };

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Sends a form submission to the Web Builder Manager.
 * Sends over SMTP with Nodemailer when SMTP_HOST is set. Without it, development
 * builds print the message to the console; production refuses so nothing is lost silently.
 */
export async function sendFormEmail({ subject, replyTo, fields }: { subject: string; replyTo: string; fields: MailField[] }) {
  const to = process.env.WEB_BUILDER_EMAIL || "info.beaujock@gmail.com";
  const text = fields.map((f) => `${f.label}:\n${f.value || "-"}`).join("\n\n");
  const html = `<div style="font-family:Arial,sans-serif;color:#14121C">
<h2 style="color:#2A1B4D;margin:0 0 16px">${escapeHtml(subject)}</h2>
<table cellpadding="8" style="border-collapse:collapse;max-width:640px">${fields
    .map(
      (f) =>
        `<tr><td style="vertical-align:top;font-weight:bold;border-bottom:1px solid #eee;white-space:nowrap">${escapeHtml(
          f.label,
        )}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(f.value || "-")}</td></tr>`,
    )
    .join("")}</table></div>`;

  const host = process.env.SMTP_HOST;
  if (!host) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[mail:dev] To: ${to}\nReply-To: ${replyTo}\nSubject: ${subject}\n\n${text}\n`);
      return { ok: true as const };
    }
    console.error("[mail] SMTP_HOST is not set; form submission was not delivered.");
    return { ok: false as const };
  }

  try {
    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      replyTo,
      subject,
      text,
      html,
    });
    return { ok: true as const };
  } catch (error) {
    console.error("[mail] SMTP send failed", error);
    return { ok: false as const };
  }
}
