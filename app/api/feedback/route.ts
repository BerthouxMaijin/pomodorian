import { z } from "zod";
import { UI_LOCALES } from "@/lib/i18n/locales";

/**
 * Destinataires.
 *
 * hello@pomodorian.app est l'adresse cible à terme, mais le domaine n'a AUCUN
 * enregistrement MX (DNS chez Vercel, aucun forwarding en place) : tout mail
 * envoyé là-bas bounce. Tant que la boîte n'existe pas, le destinataire
 * principal est jean-baptiste@maijin.ch.
 *
 * Une fois le forwarding posé, il suffit de définir dans Vercel :
 *   FEEDBACK_TO_EMAIL=hello@pomodorian.app
 *   FEEDBACK_BCC_EMAIL=jean-baptiste@maijin.ch
 * pour revenir à la cible d'origine, sans toucher au code.
 */
const FEEDBACK_TO = process.env.FEEDBACK_TO_EMAIL?.trim() || "jean-baptiste@maijin.ch";
const FEEDBACK_BCC = process.env.FEEDBACK_BCC_EMAIL?.trim();
const FEEDBACK_FROM =
  process.env.FEEDBACK_FROM_EMAIL?.trim() || "Pomodorian <feedback@pomodorian.app>";
const PROJECT_INBOX = "hello@pomodorian.app";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Le quota protège les envois Resend, pas les requêtes : une soumission
 * invalide (message trop court, email mal tapé) ne doit pas consommer le
 * quota, sinon deux fautes de frappe bloquent l'utilisateur pendant une heure.
 * D'où la lecture seule ici, et l'incrément dans recordSend() après un envoi.
 */
function isRateLimited(ip: string): boolean {
  const entry = rateLimitMap.get(ip);
  if (!entry || Date.now() > entry.resetAt) return false;
  return entry.count >= RATE_LIMIT;
}

function recordSend(ip: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }

  entry.count++;
}

const feedbackSchema = z.object({
  type: z.enum(["bug", "feedback"]),
  message: z.string().trim().min(10).max(4000),
  email: z.union([z.literal(""), z.email().max(200)]).optional(),
  locale: z.enum(UI_LOCALES).catch("en"),
  context: z
    .object({
      viewport: z.string().max(40),
      timezone: z.string().max(80),
      path: z.string().max(300),
      theme: z.string().max(20),
    })
    .partial()
    .optional(),
  // Honeypot : invisible pour un humain, rempli par les bots. Le schéma
  // l'accepte non vide exprès — le rejeter ici renverrait une erreur de
  // validation, ce qui apprendrait au bot que le champ est piégé. Le tri se
  // fait plus bas, avec une réponse 200 indiscernable d'un envoi réussi.
  website: z.string().max(200).optional(),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Row = { label: string; value: string };

function buildHtml(heading: string, message: string, rows: readonly Row[]): string {
  const rowsHtml = rows
    .map(
      (row) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#8a8a8a;white-space:nowrap;vertical-align:top">${escapeHtml(
          row.label
        )}</td><td style="padding:4px 0;color:#1a1a1a">${escapeHtml(row.value)}</td></tr>`
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:28px">
<h1 style="margin:0 0 20px;font-size:18px;color:#1a1a1a">${escapeHtml(heading)}</h1>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:#1a1a1a;padding:16px;background:#fafaf9;border-radius:8px;border-left:3px solid #ef4444">${escapeHtml(
    message
  )}</div>
<table style="margin-top:20px;font-size:12px;border-collapse:collapse">${rowsHtml}</table>
</div></body></html>`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("Feedback error: RESEND_API_KEY is not configured");
    return Response.json({ error: "Feedback is unavailable." }, { status: 500 });
  }

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const parsed = feedbackSchema.safeParse(await request.json());

    if (!parsed.success) {
      return Response.json({ error: "Invalid feedback payload." }, { status: 400 });
    }

    const { type, message, email, locale, context, website } = parsed.data;

    // Piège à bots : on répond 200 sans rien envoyer, pour ne pas leur apprendre
    // que le champ est un honeypot.
    if (website) {
      return Response.json({ ok: true });
    }

    const label = type === "bug" ? "Bug" : "Feedback";
    const collapsed = message.replace(/\s+/g, " ");
    const excerpt = collapsed.slice(0, 70);
    const subject = `[Pomodorian] ${label}: ${excerpt}${collapsed.length > 70 ? "…" : ""}`;

    const rows: Row[] = [
      { label: "Type", value: label },
      { label: "Langue", value: locale },
      { label: "De", value: email || "anonyme" },
      { label: "Page", value: context?.path || "—" },
      { label: "Écran", value: context?.viewport || "—" },
      { label: "Thème", value: context?.theme || "—" },
      { label: "Fuseau", value: context?.timezone || "—" },
      { label: "User agent", value: request.headers.get("user-agent") || "—" },
    ];

    const text = [
      message,
      "",
      ...rows.map((row) => `${row.label}: ${row.value}`),
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FEEDBACK_FROM,
        to: [FEEDBACK_TO],
        ...(FEEDBACK_BCC ? { bcc: [FEEDBACK_BCC] } : {}),
        // Répondre au rapporteur en un clic quand il a laissé son email,
        // sinon on retombe sur l'adresse du projet.
        reply_to: email || PROJECT_INBOX,
        subject,
        html: buildHtml(subject, message, rows),
        text,
      }),
    });

    if (!response.ok) {
      console.error("Feedback error: Resend responded", response.status, await response.text());
      return Response.json({ error: "Could not send feedback." }, { status: 502 });
    }

    recordSend(ip);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return Response.json({ error: "Could not send feedback." }, { status: 500 });
  }
}
