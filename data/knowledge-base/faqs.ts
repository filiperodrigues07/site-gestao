export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  categorySlug?: string;
};

export const faqs: FAQItem[] = [
  {
    id: "1",
    question: "Quanto tempo leva a implantação do sistema?",
    answer:
      "O prazo varia conforme o porte e a complexidade da operação, mas a maioria das implantações é concluída entre 2 e 6 semanas, incluindo migração de dados, parametrização e treinamento da equipe.",
    categorySlug: "primeiros-passos",
  },
  {
    id: "2",
    question: "O sistema emite todos os tipos de nota fiscal?",
    answer:
      "Sim. A plataforma emite NF-e, NFC-e, NFS-e, CT-e e MDF-e, com atualizações automáticas frente a mudanças na legislação fiscal.",
    categorySlug: "fiscal",
  },
  {
    id: "3",
    question: "É possível usar o sistema em mais de uma filial?",
    answer:
      "Sim. O sistema suporta múltiplas filiais e depósitos, com consolidação de relatórios gerenciais entre unidades.",
    categorySlug: "estoque",
  },
  {
    id: "4",
    question: "Como funciona o suporte técnico?",
    answer:
      "O suporte é humanizado e disponível por telefone, WhatsApp e portal do cliente, em horário comercial, com SLA de atendimento conforme o plano contratado.",
  },
  {
    id: "5",
    question: "Existe contrato de fidelidade?",
    answer:
      "As condições comerciais variam por plano. Fale com nosso time comercial para conhecer as opções disponíveis para o seu caso.",
  },
  {
    id: "6",
    question: "O sistema funciona sem internet?",
    answer:
      "O PDV e o aplicativo de força de vendas externa possuem modo offline, sincronizando automaticamente as informações assim que a conexão é reestabelecida.",
    categorySlug: "vendas",
  },
];
