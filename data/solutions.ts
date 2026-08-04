export type SolutionCategory = "Gestão" | "Varejo" | "Serviços" | "Indústria";

export type Solution = {
  id: string;
  slug: string;
  name: string;
  iconKey: string;
  category: SolutionCategory;
  shortDescription: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  accent: string;
};

export const solutions: Solution[] = [
  {
    id: "erp",
    slug: "erp",
    name: "ERP",
    iconKey: "Building2",
    category: "Gestão",
    shortDescription:
      "Gestão financeira, fiscal, estoque e compras em uma única plataforma.",
    longDescription:
      "Um ERP completo para centralizar as operações da sua empresa: financeiro, contábil, fiscal, estoque, compras e faturamento integrados em tempo real. Tome decisões com base em dados confiáveis e elimine retrabalho entre setores.",
    features: [
      "Contas a pagar e a receber",
      "Controle de estoque multi-depósito",
      "Emissão de notas fiscais (NF-e, NFC-e, NFS-e)",
      "Conciliação bancária automática",
      "Gestão de compras e cotações",
      "Relatórios gerenciais em tempo real",
    ],
    benefits: [
      "Redução de erros manuais",
      "Visão unificada do negócio",
      "Conformidade fiscal garantida",
      "Escalabilidade para crescer com a empresa",
    ],
    accent: "blue",
  },
  {
    id: "pdv",
    slug: "pdv",
    name: "PDV",
    iconKey: "ShoppingCart",
    category: "Varejo",
    shortDescription: "Frente de caixa ágil, estável e integrada ao seu ERP.",
    longDescription:
      "Sistema de ponto de venda pensado para agilidade no caixa e confiabilidade nas operações de balcão, com sincronização total com o estoque e o financeiro.",
    features: [
      "Emissão rápida de cupom fiscal",
      "Múltiplas formas de pagamento",
      "Funciona mesmo com instabilidade de internet",
      "Integração com balança e leitor de código de barras",
      "Controle de caixa e sangria",
    ],
    benefits: [
      "Atendimento mais rápido ao cliente",
      "Menos filas no caixa",
      "Dados de venda em tempo real",
    ],
    accent: "blue",
  },
  {
    id: "supermercados",
    slug: "supermercados",
    name: "Supermercados",
    iconKey: "ShoppingBasket",
    category: "Varejo",
    shortDescription: "Gestão completa para supermercados e mercearias.",
    longDescription:
      "Solução especializada para o varejo alimentar, com controle de balança, validade, promoções e reposição automática de estoque para operações de qualquer porte.",
    features: [
      "Gestão de balança e etiquetas de peso",
      "Controle de validade e perdas",
      "Promoções e tabelas de preço por loja",
      "Reposição automática de estoque",
      "Integração com PDV e ERP",
    ],
    benefits: [
      "Menos ruptura e perda de produtos",
      "Precificação centralizada e ágil",
      "Operação padronizada entre filiais",
    ],
    accent: "blue",
  },
  {
    id: "lojas-virtuais",
    slug: "lojas-virtuais",
    name: "Lojas Virtuais",
    iconKey: "Globe",
    category: "Varejo",
    shortDescription: "E-commerce integrado ao seu estoque e financeiro.",
    longDescription:
      "Conecte sua loja virtual diretamente ao ERP: estoque, preços e pedidos sincronizados automaticamente, sem planilhas paralelas ou lançamentos manuais.",
    features: [
      "Sincronização automática de estoque e preços",
      "Integração com marketplaces",
      "Gestão de pedidos centralizada",
      "Emissão fiscal automática por venda online",
      "Acompanhamento de status de entrega",
    ],
    benefits: [
      "Fim da divergência entre loja física e online",
      "Menos erros de venda sem estoque",
      "Escala de vendas sem aumentar retrabalho",
    ],
    accent: "blue",
  },
  {
    id: "vendas-e-distribuicao",
    slug: "vendas-e-distribuicao",
    name: "Vendas e Distribuição",
    iconKey: "TrendingUp",
    category: "Gestão",
    shortDescription: "Força de vendas externa conectada em tempo real.",
    longDescription:
      "Ferramentas para equipes de vendas e distribuidoras: pedidos em campo, roteirização e apuração de comissões, tudo integrado ao estoque e ao financeiro.",
    features: [
      "Aplicativo de força de vendas externa",
      "Pedidos offline com sincronização automática",
      "Roteirização de entregas",
      "Apuração automática de comissões",
      "Tabelas de preço e políticas comerciais por cliente",
    ],
    benefits: [
      "Mais produtividade da equipe externa",
      "Pedidos sem erro de digitação",
      "Visibilidade total do funil de vendas",
    ],
    accent: "blue",
  },
  {
    id: "ordem-de-servico",
    slug: "ordem-de-servico",
    name: "Ordem de Serviço",
    iconKey: "ClipboardList",
    category: "Serviços",
    shortDescription: "Controle completo de ordens de serviço e assistência técnica.",
    longDescription:
      "Gerencie abertura, execução e faturamento de ordens de serviço com rastreabilidade total — do orçamento até a entrega ao cliente.",
    features: [
      "Abertura e acompanhamento de OS",
      "Controle de peças e mão de obra",
      "Orçamento com aprovação do cliente",
      "Histórico completo por cliente/equipamento",
      "Faturamento integrado ao financeiro",
    ],
    benefits: [
      "Mais transparência com o cliente",
      "Redução de retrabalho na oficina",
      "Previsibilidade de faturamento",
    ],
    accent: "blue",
  },
  {
    id: "mecanica-auto-center",
    slug: "mecanica-auto-center",
    name: "Mecânica / Auto Center",
    iconKey: "Wrench",
    category: "Serviços",
    shortDescription: "Gestão especializada para oficinas e auto centers.",
    longDescription:
      "Sistema voltado para o dia a dia de oficinas mecânicas e auto centers: cadastro de veículos, histórico de manutenções e controle de peças em um só lugar.",
    features: [
      "Cadastro de veículos e histórico de manutenções",
      "Orçamento e ordem de serviço integrados",
      "Controle de estoque de peças e insumos",
      "Agenda de elevadores e mecânicos",
      "Emissão fiscal de peças e serviços",
    ],
    benefits: [
      "Fidelização por histórico do veículo",
      "Menos peças paradas em estoque",
      "Agenda organizada, sem conflitos",
    ],
    accent: "blue",
  },
  {
    id: "transportes-e-logistica",
    slug: "transportes-e-logistica",
    name: "Transportes e Logística",
    iconKey: "Truck",
    category: "Indústria",
    shortDescription: "Gestão de frotas, fretes e documentos de transporte.",
    longDescription:
      "Controle operações de transporte de carga com emissão de CT-e/MDF-e, gestão de frota e acompanhamento de fretes de ponta a ponta.",
    features: [
      "Emissão de CT-e e MDF-e",
      "Gestão de frota e manutenção de veículos",
      "Controle de fretes e romaneios",
      "Rastreamento de cargas",
      "Apuração de custos por rota",
    ],
    benefits: [
      "Conformidade fiscal no transporte",
      "Redução de custo por rota",
      "Menos tempo parado por manutenção não planejada",
    ],
    accent: "blue",
  },
  {
    id: "pet-shop",
    slug: "pet-shop",
    name: "Pet Shop",
    iconKey: "PawPrint",
    category: "Varejo",
    shortDescription: "Gestão de vendas, serviços e agenda para pet shops.",
    longDescription:
      "Solução completa para pet shops e clínicas veterinárias: agenda de banho e tosa, ficha do animal, vendas e controle de estoque em um único sistema.",
    features: [
      "Agenda de banho, tosa e serviços",
      "Ficha completa do animal e do tutor",
      "Controle de estoque de ração e produtos",
      "Pacotes e planos de assinatura",
      "PDV integrado",
    ],
    benefits: [
      "Mais recorrência de clientes",
      "Agenda sem overbooking",
      "Histórico completo do animal",
    ],
    accent: "blue",
  },
  {
    id: "cobranca",
    slug: "cobranca",
    name: "Cobrança",
    iconKey: "Banknote",
    category: "Gestão",
    shortDescription: "Gestão de contas a receber e cobrança automatizada.",
    longDescription:
      "Automatize a régua de cobrança, controle inadimplência e integre boletos, PIX e carnês diretamente ao financeiro da empresa.",
    features: [
      "Régua de cobrança automatizada",
      "Emissão de boletos e PIX",
      "Negativação e acordos de dívida",
      "Notificações automáticas por e-mail/SMS/WhatsApp",
      "Relatórios de inadimplência",
    ],
    benefits: [
      "Redução da inadimplência",
      "Menos tempo gasto cobrando manualmente",
      "Fluxo de caixa mais previsível",
    ],
    accent: "blue",
  },
  {
    id: "bares-e-restaurantes",
    slug: "bares-e-restaurantes",
    name: "Bares e Restaurantes",
    iconKey: "UtensilsCrossed",
    category: "Serviços",
    shortDescription: "Comandas, cardápio e cozinha conectados em tempo real.",
    longDescription:
      "Sistema para bares, restaurantes e lanchonetes com controle de comandas, mesas, cardápio digital e integração direta com a cozinha e o caixa.",
    features: [
      "Comandas eletrônicas e controle de mesas",
      "Cardápio digital com QR Code",
      "Integração com a cozinha (KDS)",
      "Divisão de conta e taxa de serviço",
      "Delivery integrado ao PDV",
    ],
    benefits: [
      "Atendimento mais rápido nas mesas",
      "Menos erros entre salão e cozinha",
      "Melhor controle de custo por prato",
    ],
    accent: "blue",
  },
  {
    id: "hoteis-e-pousadas",
    slug: "hoteis-e-pousadas",
    name: "Hotéis e Pousadas",
    iconKey: "BedDouble",
    category: "Serviços",
    shortDescription: "Reservas, hospedagem e faturamento em um só sistema.",
    longDescription:
      "Gestão hoteleira com mapa de reservas, controle de diárias, consumo de hóspedes e faturamento integrado — da reserva ao check-out.",
    features: [
      "Mapa de reservas e disponibilidade",
      "Check-in e check-out ágil",
      "Consumo de frigobar e serviços por apartamento",
      "Integração com canais de reserva (OTAs)",
      "Faturamento e nota fiscal por hospedagem",
    ],
    benefits: [
      "Menos overbooking",
      "Faturamento sem esquecer consumos",
      "Visão consolidada de ocupação",
    ],
    accent: "blue",
  },
  {
    id: "materiais-de-construcao",
    slug: "materiais-de-construcao",
    name: "Materiais de Construção",
    iconKey: "Hammer",
    category: "Varejo",
    shortDescription: "Gestão especializada para casas de material de construção.",
    longDescription:
      "Solução para lojas de material de construção com controle de vendas balcão e entrega, cotação de fornecedores e gestão de itens vendidos por metro, litro ou unidade.",
    features: [
      "Vendas balcão e entrega separadas",
      "Controle de múltiplas unidades de medida",
      "Cotação e pedido de compra a fornecedores",
      "Tabela de preços por volume/obra",
      "Orçamento de obra para o cliente",
    ],
    benefits: [
      "Menos divergência de estoque físico",
      "Orçamentos mais rápidos e precisos",
      "Melhor negociação com fornecedores",
    ],
    accent: "blue",
  },
  {
    id: "pcp",
    slug: "pcp",
    name: "PCP",
    iconKey: "Factory",
    category: "Indústria",
    shortDescription: "Planejamento e controle da produção industrial.",
    longDescription:
      "Ferramentas de PCP para planejar ordens de produção, controlar apontamentos de chão de fábrica e acompanhar o consumo de matéria-prima em tempo real.",
    features: [
      "Ordens de produção e roteiros de fabricação",
      "Apontamento de chão de fábrica",
      "Controle de matéria-prima e insumos",
      "Programação de capacidade produtiva",
      "Custo de produção em tempo real",
    ],
    benefits: [
      "Produção mais previsível",
      "Menos desperdício de insumos",
      "Custo de fabricação sob controle",
    ],
    accent: "blue",
  },
  {
    id: "crm",
    slug: "crm",
    name: "CRM",
    iconKey: "Users",
    category: "Gestão",
    shortDescription: "Relacionamento com o cliente do primeiro contato à fidelização.",
    longDescription:
      "Centralize o relacionamento com clientes e leads: funil de vendas, histórico de interações e automações de marketing integradas ao restante da operação.",
    features: [
      "Funil de vendas configurável",
      "Histórico completo de interações",
      "Automação de follow-up",
      "Segmentação de clientes e campanhas",
      "Integração com vendas e financeiro",
    ],
    benefits: [
      "Mais conversão de leads",
      "Relacionamento centralizado",
      "Decisões comerciais baseadas em dados",
    ],
    accent: "blue",
  },
];

export function getSolutionBySlug(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

export function getAllSolutionSlugs() {
  return solutions.map((solution) => solution.slug);
}

export function getRelatedSolutions(slug: string, count = 3) {
  const current = getSolutionBySlug(slug);
  if (!current) return [];
  return solutions
    .filter((solution) => solution.slug !== slug && solution.category === current.category)
    .slice(0, count)
    .concat(
      solutions.filter((solution) => solution.slug !== slug && solution.category !== current.category)
    )
    .slice(0, count);
}
