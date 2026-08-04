import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact-schema";
import { sendContactEmail } from "@/lib/email/resend";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Honeypot preenchido: finge sucesso sem processar (bot).
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  try {
    await sendContactEmail(parsed.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/contact] Falha ao enviar e-mail:", error);
    return NextResponse.json(
      { success: false, errors: { _form: ["Não foi possível enviar sua mensagem. Tente novamente."] } },
      { status: 500 }
    );
  }
}
