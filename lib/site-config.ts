/**
 * Fonte única de dados institucionais/placeholder.
 * Troque estes valores pelos dados reais da empresa quando disponíveis —
 * nenhum outro arquivo deve hardcodar telefone, WhatsApp, e-mail, endereço etc.
 */

export const siteConfig = {
  name: "Gestão Consultorias & Sistemas Integrados",
  shortName: "Gestão",
  description:
    "Soluções completas em gestão empresarial e automação comercial: implantação, treinamento, suporte e consultoria especializada para o seu negócio.",
  keywords: [
    "ERP",
    "gestão empresarial",
    "automação comercial",
    "PDV",
    "software de gestão",
    "consultoria ERP",
    "implantação de sistemas",
  ],
  url: "https://www.gestaoconsultorias.com.br",
  ogImage: "/og-image.png",

  contact: {
    phoneDisplay: "(49) 3522-9014",
    phoneHref: "tel:+554935229014",
    whatsappDisplay: "(49) 99110-6297",
    whatsappNumber: "5549991106297", // E.164 sem "+", usado nos links wa.me
    email: "contato@gestaoconsultorias.com.br",
    address: {
      street: "Av. Barão do Rio Branco, 104 - Ed. Prime Offices, sala 1004",
      city: "Joaçaba",
      state: "SC",
      zip: "", // TODO: preencher quando o CEP for confirmado
      mapEmbedUrl:
        "https://www.google.com/maps?q=Av.+Bar%C3%A3o+do+Rio+Branco%2C+104%2C+Joa%C3%A7aba%2C+SC&output=embed",
    },
    businessHours: [
      { day: "Segunda a Sexta", hours: "08:00 – 18:00" },
      { day: "Sábado", hours: "08:00 – 12:00" },
      { day: "Domingo", hours: "Fechado" },
    ],
  },

  whatsappMessage:
    "Olá! Vim pelo site e gostaria de saber mais sobre as soluções da Gestão.",

  social: {
    instagram: "https://instagram.com/gestaoconsultorias",
    linkedin: "https://linkedin.com/company/gestaoconsultorias",
    facebook: "https://facebook.com/gestaoconsultorias",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Soluções", href: "/solucoes" },
    { label: "Institucional", href: "/institucional" },
    { label: "Base de Conhecimento", href: "/base-de-conhecimento" },
    { label: "Contato", href: "/contato" },
  ],
} as const;

export function buildWhatsappUrl(message: string = siteConfig.whatsappMessage) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encoded}`;
}
