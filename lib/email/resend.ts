import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import type { ContactFormValues } from "@/lib/validations/contact-schema";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendContactEmail(payload: ContactFormValues) {
  const client = getClient();

  if (!client) {
    console.warn(
      "[email] RESEND_API_KEY não configurada — logando o payload em vez de enviar e-mail. " +
        "Defina RESEND_API_KEY, RESEND_FROM_EMAIL e CONTACT_TO_EMAIL em .env.local para ativar o envio real."
    );
    console.info("[email] Payload recebido:", payload);
    return { success: true, mode: "logged" as const };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? siteConfig.contact.email;

  const subject =
    payload.type === "demo"
      ? `Nova solicitação de demonstração — ${payload.name}`
      : `Novo contato pelo site — ${payload.name}`;

  // O SDK do Resend NÃO lança exceção em erro de API — ele retorna
  // { data: null, error: {...} }. Se a gente não checar `error` aqui, um
  // envio que falhou (ex: domínio não verificado) é reportado como sucesso.
  const { error } = await client.emails.send({
    from: `${siteConfig.name} <${fromEmail}>`,
    to: toEmail,
    replyTo: payload.email,
    subject,
    html: `
      <h2>${subject}</h2>
      <p><strong>Nome:</strong> ${payload.name}</p>
      <p><strong>E-mail:</strong> ${payload.email}</p>
      <p><strong>Telefone:</strong> ${payload.phone}</p>
      ${payload.company ? `<p><strong>Empresa:</strong> ${payload.company}</p>` : ""}
      ${payload.solutionInterest ? `<p><strong>Solução de interesse:</strong> ${payload.solutionInterest}</p>` : ""}
      <p><strong>Mensagem:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    throw new Error(`[Resend] ${error.name}: ${error.message}`);
  }

  return { success: true, mode: "sent" as const };
}
