import type { VendorId } from "./vendors";

export type SolutionCategory = "Gestão" | "Varejo" | "Serviços" | "Indústria" | "RH" | "Mobile";

export type Solution = {
  id: string;
  slug: string;
  name: string;
  iconKey: string;
  category: SolutionCategory;
  vendor: VendorId;
  shortDescription: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  screenshots?: string[];
};

export const solutions: Solution[] = [
  {
    id: "erp",
    slug: "erp",
    name: "ERP",
    iconKey: "Building2",
    category: "Gestão",
    vendor: "ch-sistemas",
    shortDescription:
      "Gestão financeira, fiscal, estoque e compras em uma única plataforma.",
    longDescription:
      "Um ERP completo, local ou em nuvem, para centralizar as operações da sua empresa: financeiro, contábil, fiscal, estoque, compras e faturamento integrados em tempo real. Interface de clique único e processos centralizados numa mesma tela reduzem retrabalho entre setores, com relatórios e BI para decisões baseadas em dados confiáveis.",
    features: [
      "Contas a pagar e a receber",
      "Controle de estoque multi-depósito",
      "Emissão de notas fiscais (NF-e, NFC-e, NFS-e)",
      "Conciliação bancária automática",
      "Gestão de compras e cotações",
      "Pedido digital direto do celular do cliente via link (Instagram/WhatsApp)",
      "CHMob: BI e indicadores em tempo real no celular ou tablet",
      "Criação e edição de relatórios, gráficos e análises",
    ],
    benefits: [
      "Redução de erros manuais",
      "Visão unificada do negócio",
      "Conformidade fiscal garantida",
      "Menos cliques para cada tarefa do dia a dia",
      "Escalabilidade para crescer com a empresa",
    ],
    screenshots: ["/products/erp-modules/erp.png"],
  },
  {
    id: "pdv",
    slug: "pdv",
    name: "PDV",
    iconKey: "ShoppingCart",
    category: "Varejo",
    vendor: "ch-sistemas",
    shortDescription: "Frente de caixa ágil, estável e integrada ao seu ERP.",
    longDescription:
      "Sistema de ponto de venda que opera on-line ou off-line, independente de servidor local ou nuvem, com sincronização total com o estoque e o financeiro. Rapidez no caixa, interface amigável e integração nativa com PIX, TEF e clubes de promoção.",
    features: [
      "Emissão de NFC-e, NF-e e NFS-e",
      "Gestão de pré-vendas e DAV's",
      "Integração com todos os TEFs do mercado",
      "PIX QR Code direto no PDV, sem depender de extrato bancário",
      "Controle de abertura, fechamento e sangria de caixa",
      "Consulta rápida de preço de venda (CPV)",
      "Integração com clube de promoções (Scanntech)",
      "Funciona mesmo com instabilidade de internet",
    ],
    benefits: [
      "Atendimento mais rápido ao cliente",
      "Menos filas no caixa",
      "Recebimento de PIX sem conferência manual",
      "Dados de venda em tempo real",
    ],
    screenshots: ["/products/erp-modules/pdv.png"],
  },
  {
    id: "supermercados",
    slug: "supermercados",
    name: "Supermercados",
    iconKey: "ShoppingBasket",
    category: "Varejo",
    vendor: "ch-sistemas",
    shortDescription: "Gestão completa para supermercados e mercearias.",
    longDescription:
      "Solução especializada para o varejo alimentar, com controle de balança, validade, promoções e reposição automática de estoque, sobre a mesma base robusta de PDV usada em operações de qualquer porte — com PIX, TEF e emissão fiscal integrados.",
    features: [
      "Gestão de balança e etiquetas de peso",
      "Controle de validade e perdas",
      "Promoções e tabelas de preço por loja",
      "Reposição automática de estoque",
      "Emissão de NFC-e, NF-e e NFS-e",
      "PIX QR Code e integração com todos os TEFs",
      "Integração com clube de promoções (Scanntech)",
      "Integração com PDV e ERP em tempo real",
    ],
    benefits: [
      "Menos ruptura e perda de produtos",
      "Precificação centralizada e ágil",
      "Operação padronizada entre filiais",
      "Caixa rápido mesmo em horário de pico",
    ],
  },
  {
    id: "lojas-virtuais",
    slug: "lojas-virtuais",
    name: "Lojas Virtuais",
    iconKey: "Globe",
    category: "Varejo",
    vendor: "ch-sistemas",
    shortDescription: "E-commerce integrado ao seu estoque e financeiro.",
    longDescription:
      "Conecte sua loja virtual diretamente ao ERP: cadastro de clientes, produtos, imagens, estoque e pedidos sincronizados automaticamente. Delivery com pedido digital, integração com os principais marketplaces e clube de promoções, sem planilhas paralelas ou lançamentos manuais.",
    features: [
      "Cadastro unificado de clientes, produtos, imagens e estoque",
      "Delivery com pedido digital direto do celular do cliente",
      "Integração com marketplaces (Tray, Ideris, Loja Integrada)",
      "Integração direta com o site institucional da empresa",
      "Integração com clube de promoções (Scanntech)",
      "Gestão de pedidos centralizada",
      "Emissão fiscal automática por venda online",
    ],
    benefits: [
      "Fim da divergência entre loja física e online",
      "Menos erros de venda sem estoque",
      "Escala de vendas sem aumentar retrabalho",
      "Presença em múltiplos marketplaces com um só cadastro",
    ],
  },
  {
    id: "vendas-e-distribuicao",
    slug: "vendas-e-distribuicao",
    name: "Vendas e Distribuição",
    iconKey: "TrendingUp",
    category: "Gestão",
    vendor: "ch-sistemas",
    shortDescription: "Força de vendas externa conectada em tempo real.",
    longDescription:
      "Ferramentas para equipes de vendas e distribuidoras: pedidos, cotações e venda ambulante direto do celular com o CHMobile, roteirização de entregas e apuração automática de comissões — tudo integrado ao estoque e ao financeiro em tempo real.",
    features: [
      "CHMobile: aplicativo para pedidos, cotações e venda ambulante",
      "Cadastro de clientes e emissão/posição de boletos e títulos",
      "Faturamento de NF-e",
      "Flex: verba de desconto recorrente por cliente",
      "Estoque e reserva por empresa/filial",
      "Pedidos de venda por lote e rotas de entrega",
      "Regiões de venda por representante e romaneios de carga",
      "Relatórios, gráficos e análises de desempenho",
    ],
    benefits: [
      "Mais produtividade da equipe externa",
      "Pedidos sem erro de digitação, mesmo offline",
      "Visibilidade total do funil de vendas",
      "Comissionamento apurado automaticamente",
    ],
  },
  {
    id: "ordem-de-servico",
    slug: "ordem-de-servico",
    name: "Ordem de Serviço",
    iconKey: "ClipboardList",
    category: "Serviços",
    vendor: "ch-sistemas",
    shortDescription: "Controle completo de ordens de serviço e assistência técnica.",
    longDescription:
      "Gerencie abertura, execução e faturamento de ordens de serviço com rastreabilidade total — do diagnóstico à entrega ao cliente — com agenda, ficha técnica por equipamento e aplicativo mobile para a equipe em campo.",
    features: [
      "Abertura e acompanhamento de OS com painel informativo",
      "Agenda com controle de atendimento",
      "Diagnósticos, análises e tempo de execução por serviço",
      "Ficha técnica e histórico completo de manutenções",
      "Avisos automáticos de retorno ao cliente",
      "Controle de serviço realizado por item",
      "Emissão de NFC-e, NF-e e NFS-e",
      "CHMob (OS): gestão da ordem de serviço pelo celular ou tablet",
    ],
    benefits: [
      "Mais transparência com o cliente",
      "Redução de retrabalho na execução",
      "Previsibilidade de faturamento",
      "Histórico completo por cliente e equipamento",
    ],
    screenshots: ["/products/erp-modules/ordem-de-servico.png"],
  },
  {
    id: "mecanica-auto-center",
    slug: "mecanica-auto-center",
    name: "Mecânica / Auto Center",
    iconKey: "Wrench",
    category: "Serviços",
    vendor: "ch-sistemas",
    shortDescription: "Gestão especializada para oficinas e auto centers.",
    longDescription:
      "Sistema voltado para o dia a dia de oficinas mecânicas e auto centers: cadastro de veículos, orçamento com aprovação do cliente, histórico de manutenções e controle de peças, com aplicativo mobile para gestão da ordem de serviço em qualquer lugar.",
    features: [
      "Cadastro de veículos e histórico de manutenções",
      "Orçamento e ordem de serviço integrados, com aprovação do cliente",
      "Controle de estoque de peças e insumos",
      "Agenda de elevadores e mecânicos",
      "Diagnósticos e tempo de execução por serviço",
      "Emissão fiscal de peças e serviços (NFC-e, NF-e, NFS-e)",
      "CHMob (OS): gestão mobile da ordem de serviço",
    ],
    benefits: [
      "Fidelização por histórico do veículo",
      "Menos peças paradas em estoque",
      "Agenda organizada, sem conflitos",
      "Orçamento aprovado pelo cliente antes de iniciar o serviço",
    ],
  },
  {
    id: "transportes-e-logistica",
    slug: "transportes-e-logistica",
    name: "Transportes e Logística",
    iconKey: "Truck",
    category: "Indústria",
    vendor: "ch-sistemas",
    shortDescription: "Gestão de frotas, fretes e documentos de transporte.",
    longDescription:
      "Para transportadoras, agentes de carga, operadores logísticos e centros de distribuição: acertos de viagem, manifestos, controle de frota, pneus e combustíveis, tabelas de frete e cargas perigosas, com emissão de CT-e, MDF-e, CT-e OS e CIOT integrada.",
    features: [
      "Acertos de viagem, manifestos e ordem de abastecimento",
      "Controle de motoristas, veículos, pneus e combustíveis",
      "Gestão de avarias nas entregas e despesas de manutenção da frota",
      "Tabelas e cotações de frete, gestão de cargas perigosas",
      "Comissões e mapas de rota",
      "Integrações com seguro de carga (AT&M), EDI Proceda, CIOT (Extratta/eFrete)",
      "Emissão de CT-e, MDF-e, CT-e OS e CIOT",
    ],
    benefits: [
      "Conformidade fiscal no transporte",
      "Redução de custo por rota",
      "Menos tempo parado por manutenção não planejada",
      "Rastreabilidade completa da frota e da carga",
    ],
    screenshots: ["/products/erp-modules/transportes-e-logistica.png"],
  },
  {
    id: "pet-shop",
    slug: "pet-shop",
    name: "Pet Shop",
    iconKey: "PawPrint",
    category: "Varejo",
    vendor: "ch-sistemas",
    shortDescription: "Gestão de vendas, serviços e agenda para pet shops.",
    longDescription:
      "Solução completa para pet shops e clínicas veterinárias: ficha do animal com imagem, sala de espera com prontuário, agenda de banho, tosa e atendimento veterinário, e geração automática de ordem de serviço ao concluir o atendimento.",
    features: [
      "Ficha completa do animal (com imagem), tutor e histórico",
      "Cadastro de procedimentos, vacinas, patologias e planos/convênios",
      "Sala de espera com prontuário e OS gerada automaticamente",
      "Agenda de banho, tosa e atendimento veterinário por período",
      "Controle de gaiola, tempo agendado e serviço de busca/entrega",
      "Lembretes de agenda e vacinas na tela principal",
      "PDV e controle de estoque de ração e produtos integrados",
      "CHMob (OS): gestão mobile da ordem de serviço",
    ],
    benefits: [
      "Mais recorrência de clientes",
      "Agenda sem overbooking",
      "Histórico completo do animal em um só lugar",
      "Menos esquecimento de vacinas e retornos",
    ],
    screenshots: ["/products/erp-modules/pet-shop.png"],
  },
  {
    id: "cobranca",
    slug: "cobranca",
    name: "Cobrança",
    iconKey: "Banknote",
    category: "Gestão",
    vendor: "ch-sistemas",
    shortDescription: "Gestão de contas a receber e cobrança automatizada.",
    longDescription:
      "Automatize a cobrança de ponta a ponta: emissão de boletos via API, retorno automático com baixa no contas a receber, conciliação bancária e negativação de títulos, integrado a diversos bancos e com envio por WhatsApp e e-mail.",
    features: [
      "Integração com diversos bancos do país",
      "Emissão de boletos via API",
      "Retorno automático com baixa do contas a receber",
      "Geração automática de lançamentos bancários",
      "Conciliação bancária",
      "Gestão de débito automático, retornos e ocorrências",
      "Renegociação, prorrogação e negativação de títulos",
      "Envio de boleto por WhatsApp e/ou e-mail",
    ],
    benefits: [
      "Redução da inadimplência",
      "Menos tempo gasto cobrando manualmente",
      "Fluxo de caixa mais previsível",
      "Conciliação bancária sem retrabalho",
    ],
  },
  {
    id: "bares-e-restaurantes",
    slug: "bares-e-restaurantes",
    name: "Bares e Restaurantes",
    iconKey: "UtensilsCrossed",
    category: "Serviços",
    vendor: "ch-sistemas",
    shortDescription: "Comandas, cardápio e cozinha conectados em tempo real.",
    longDescription:
      "Sistema para bares, restaurantes e lanchonetes, em modo convencional ou touch: controle de mesas, comandas e cartão consumo, pedido digital por QR Code na mesa ou pelo delivery, com gerenciador automático de impressão para cozinha e integração com o iFood.",
    features: [
      "Controle de mesas, comandas, cartão consumo e delivery",
      "Produtos favoritos, composições, complementos e promoções",
      "Transferência/agrupamento de mesas e pagamento parcial da conta",
      "Pedido digital local via QR Code na mesa",
      "Pedido digital delivery direto do Instagram/WhatsApp do cliente",
      "Integração com iFood e com diversas balanças",
      "Gerenciador automático de impressão para cozinha e monitor de preparo",
      "CHMob (BRS): gestão de mesas, comanda e cartão consumo pelo celular",
    ],
    benefits: [
      "Atendimento mais rápido nas mesas",
      "Menos erros entre salão e cozinha",
      "Melhor controle de custo por prato",
      "Delivery e presencial na mesma operação",
    ],
    screenshots: ["/products/erp-modules/bares-e-restaurantes.png"],
  },
  {
    id: "hoteis-e-pousadas",
    slug: "hoteis-e-pousadas",
    name: "Hotéis e Pousadas",
    iconKey: "BedDouble",
    category: "Serviços",
    vendor: "ch-sistemas",
    shortDescription: "Reservas, hospedagem e faturamento em um só sistema.",
    longDescription:
      "Gestão hoteleira com mapa de reservas, controle de diárias, tempo de permanência e taxas de ocupação, do check-in ao check-out — com consumo de hóspedes por apartamento e faturamento integrado ao restante da operação.",
    features: [
      "Mapa de reservas e disponibilidade",
      "Controle de diárias, tempo de permanência e taxas de ocupação",
      "Check-in e check-out ágil",
      "Consumo de frigobar e serviços por apartamento",
      "Integração com canais de reserva (OTAs)",
      "Emissão de NFC-e, NF-e e NFS-e por hospedagem",
      "Relatórios de rentabilidade e ocupação",
    ],
    benefits: [
      "Menos overbooking",
      "Faturamento sem esquecer consumos",
      "Visão consolidada de ocupação e rentabilidade",
    ],
  },
  {
    id: "materiais-de-construcao",
    slug: "materiais-de-construcao",
    name: "Materiais de Construção",
    iconKey: "Hammer",
    category: "Varejo",
    vendor: "ch-sistemas",
    shortDescription: "Gestão especializada para casas de material de construção.",
    longDescription:
      "Solução para lojas de material de construção com vendas para entrega futura (encomenda), controle de estoque, PDV, compras e crédito integrados, além de condicionais com gestão de devoluções e romaneios de entrega.",
    features: [
      "Vendas balcão e para entrega futura (por encomenda)",
      "Controle de múltiplas unidades de medida (metro, litro, unidade)",
      "Gestão de estoque, PDV, compras e crédito integrados",
      "Cotação e pedido de compra a fornecedores",
      "Controle de entregas, ordem de entrega e romaneios",
      "Condicionais com gestão de devoluções",
      "Orçamento de obra para o cliente",
    ],
    benefits: [
      "Menos divergência de estoque físico",
      "Orçamentos mais rápidos e precisos",
      "Melhor negociação com fornecedores",
      "Controle de crédito e condicionais sem planilha paralela",
    ],
  },
  {
    id: "pcp",
    slug: "pcp",
    name: "PCP",
    iconKey: "Factory",
    category: "Indústria",
    vendor: "ch-sistemas",
    shortDescription: "Planejamento e controle da produção industrial.",
    longDescription:
      "Automatize o processo de produção: cadastro de fórmulas e índices técnicos, ordens de produção do consumo de matéria-prima ao produto acabado, e análise de custos, perdas e curva ABCD em tempo real — com integrações específicas para o segmento de tintas.",
    features: [
      "Cadastro de fórmulas (índices técnicos) e estágios de produção",
      "Ordem de produção: da matéria-prima ao produto acabado",
      "Apontamento e controle da produção por local de armazenagem",
      "Análise de custos, perdas e curva ABCD",
      "Integração com máquinas de tinta (Sherwin Williams, Suvinil, Skylack, Auto Color)",
      "Programação de capacidade produtiva",
      "Relatórios, gráficos e estatísticas de produção",
    ],
    benefits: [
      "Produção mais previsível",
      "Menos desperdício de insumos",
      "Custo de fabricação sob controle",
      "Rastreabilidade completa do lote produzido",
    ],
    screenshots: ["/products/erp-modules/pcp.png"],
  },
  {
    id: "crm",
    slug: "crm",
    name: "CRM",
    iconKey: "Users",
    category: "Gestão",
    vendor: "ch-sistemas",
    shortDescription: "Relacionamento com o cliente do primeiro contato à fidelização.",
    longDescription:
      "Centralize o relacionamento com clientes e leads: funil de vendas, telemarketing e análise de pós-venda, faturamento de contratos recorrentes e automações de follow-up integradas ao restante da operação.",
    features: [
      "Funil de vendas configurável",
      "Telemarketing e análise de pós-venda por critérios",
      "Faturamento de contratos: NFS-e a partir de títulos provisionados",
      "Histórico completo de interações com o cliente",
      "Automação de follow-up",
      "Segmentação de clientes e campanhas",
      "Integração com vendas e financeiro",
    ],
    benefits: [
      "Mais conversão de leads",
      "Relacionamento centralizado",
      "Decisões comerciais baseadas em dados",
      "Faturamento recorrente sem esquecer contratos",
    ],
  },
  {
    id: "secullum-ponto",
    slug: "secullum-ponto",
    name: "Secullum Ponto",
    iconKey: "Fingerprint",
    category: "RH",
    vendor: "secullum",
    shortDescription:
      "Controle de ponto eletrônico com reconhecimento facial, apps e cálculo de folha transparente.",
    longDescription:
      "O Secullum Ponto moderniza o controle de jornada da sua equipe: relógios com reconhecimento facial, aplicativos individual e coletivo para registro em campo, e indicadores em tempo real de banco de horas e horas extras. Segurança jurídica com assinatura eletrônica do espelho de ponto e memória de cálculo transparente na folha.",
    features: [
      "Relógio de ponto com reconhecimento facial",
      "Aplicativo individual e coletivo para registro em campo",
      "Registro offline com geolocalização",
      "Assinatura eletrônica do espelho de ponto",
      "Indicadores em tempo real de banco de horas e horas extras",
      "Cálculo de folha com memória de cálculo transparente",
      "Dashboards e relatórios gerenciais de RH",
      "Integração com sistemas de folha de pagamento",
    ],
    benefits: [
      "Redução de tempo gasto em apuração de ponto",
      "Conformidade com a legislação trabalhista",
      "Menos disputas trabalhistas por transparência no cálculo",
      "Gestão de RH orientada por dados",
      "Redução de custos com retrabalho manual",
    ],
  },
  {
    id: "chmob-sd",
    slug: "chmob-sd",
    name: "CH Mob SD",
    iconKey: "Smartphone",
    category: "Mobile",
    vendor: "ch-sistemas",
    shortDescription: "Vendas externas offline, direto do celular do seu representante.",
    longDescription:
      "Aplicativo mobile para força de vendas externa, com funcionamento offline após a primeira sincronização. O vendedor faz pedidos, consulta preços e estoque, coleta assinatura do cliente e organiza a rota de visitas mesmo sem internet — tudo sincronizado automaticamente com o ERP assim que a conexão volta.",
    features: [
      "Pedidos, cotações e venda ambulante direto do celular",
      "Funciona offline com banco de dados local no dispositivo",
      "Sincronização automática de produtos, estoque, preços e clientes",
      "Seleção de tabela de preço e condição de pagamento por cliente",
      "Assinatura digital do cliente e do vendedor",
      "Emissão e impressão de boletos em campo",
      "Consulta de títulos a vencer e vencidos",
      "Agenda e check-in por rota de visitas, com registro de motivo de não-venda",
    ],
    benefits: [
      "Vendedor nunca para por falta de internet",
      "Pedido sem erro de digitação, sincronizado na hora",
      "Mais visitas por dia com rota organizada",
      "Menos inadimplência com consulta de títulos em campo",
    ],
    screenshots: [
      "/products/chmob-sd/chmob-sd-01-menu.jpg",
      "/products/chmob-sd/chmob-sd-02-pedido.jpg",
      "/products/chmob-sd/chmob-sd-03-produto.jpg",
      "/products/chmob-sd/chmob-sd-04-titulos.jpg",
      "/products/chmob-sd/chmob-sd-05-rota.jpg",
      "/products/chmob-sd/chmob-sd-06-checkin.jpg",
    ],
  },
  {
    id: "chmob-os",
    slug: "chmob-os",
    name: "CH Mob OS",
    iconKey: "ClipboardCheck",
    category: "Mobile",
    vendor: "ch-sistemas",
    shortDescription: "Ordem de serviço completa na mão do técnico, mesmo sem internet.",
    longDescription:
      "Aplicativo mobile para prestadores de serviço e técnicos em campo: abertura de OS, diagnóstico, seleção de peças e serviços, fotos de validação e assinatura do cliente direto do celular ou tablet — com operação offline e sincronização automática assim que a conexão retorna.",
    features: [
      "Abertura de OS com diagnóstico e seleção de equipamento",
      "Funciona offline com sincronização automática",
      "Seleção rápida de produtos e serviços, com leitor de código de barras",
      "Laudo técnico com foto de validação anexada à OS",
      "Assinatura digital do cliente e do técnico",
      "Agenda integrada para organizar o dia em campo",
      "Acesso a estoque, preços e histórico do cliente em tempo real",
    ],
    benefits: [
      "Técnico não depende de papel nem de voltar à empresa",
      "Cliente aprova e assina o serviço na hora",
      "Histórico e fotos ficam registrados na própria OS",
      "Menos retrabalho entre campo e escritório",
    ],
    screenshots: [
      "/products/chmob-os/chmob-os-01-menu.jpg",
      "/products/chmob-os/chmob-os-02-abertura.jpg",
      "/products/chmob-os/chmob-os-03-carrinho.jpg",
      "/products/chmob-os/chmob-os-04-laudo.jpg",
      "/products/chmob-os/chmob-os-05-assinatura.jpg",
    ],
  },
  {
    id: "chmob-bi",
    slug: "chmob-bi",
    name: "CH Mob BI",
    iconKey: "BarChart3",
    category: "Mobile",
    vendor: "ch-sistemas",
    shortDescription: "Indicadores do seu negócio em tempo real, na palma da mão.",
    longDescription:
      "Business Intelligence mobile que consulta os dados direto do servidor no momento do acesso: faturamento, contas a pagar e receber, ticket médio e ranking de produtos, sempre atualizados, de onde você estiver.",
    features: [
      "Faturamento anual com comparação ao ano anterior",
      "Saldo de contas caixa e contas bancárias",
      "Relação de contas a receber e a pagar, com filtro de baixados",
      "Vendas por representante",
      "Resumo de vendas diário, mensal e por hora",
      "Ticket médio, quantidade de documentos faturados e preço médio",
      "Ranking de produtos por volume de vendas",
    ],
    benefits: [
      "Decisão baseada em dados atualizados na hora",
      "Acompanhamento do negócio de qualquer lugar",
      "Menos dependência de relatórios prontos por terceiros",
      "Visão clara de quem vende mais e o que vende mais",
    ],
    screenshots: [
      "/products/chmob-bi/chmob-bi-01-faturamento.png",
      "/products/chmob-bi/chmob-bi-02-saldo.png",
      "/products/chmob-bi/chmob-bi-03-indicadores.png",
      "/products/chmob-bi/chmob-bi-04-ranking.png",
      "/products/chmob-bi/chmob-bi-05-receberpagar.png",
    ],
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
  const sameVendor = solutions.filter(
    (solution) => solution.slug !== slug && solution.vendor === current.vendor
  );
  return sameVendor
    .filter((solution) => solution.category === current.category)
    .concat(sameVendor.filter((solution) => solution.category !== current.category))
    .slice(0, count);
}
