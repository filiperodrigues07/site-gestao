export type Differentiator = {
  id: string;
  iconKey: string;
  title: string;
  description: string;
};

export const differentiators: Differentiator[] = [
  {
    id: "implantacao",
    iconKey: "Rocket",
    title: "Implantação especializada",
    description:
      "Metodologia própria de implantação, com cronograma claro e time dedicado para colocar sua operação no ar sem dor de cabeça.",
  },
  {
    id: "consultoria",
    iconKey: "Compass",
    title: "Consultoria",
    description:
      "Especialistas que entendem do seu segmento e ajudam a desenhar o melhor processo antes, durante e depois da implantação.",
  },
  {
    id: "treinamentos",
    iconKey: "GraduationCap",
    title: "Treinamentos",
    description:
      "Capacitação da sua equipe para usar o sistema com autonomia desde o primeiro dia de operação.",
  },
  {
    id: "suporte",
    iconKey: "LifeBuoy",
    title: "Suporte técnico",
    description:
      "Atendimento ágil e resolutivo, com canais diretos para resolver qualquer questão sem burocracia.",
  },
  {
    id: "atendimento-humanizado",
    iconKey: "HeartHandshake",
    title: "Atendimento humanizado",
    description:
      "Relacionamento próximo e transparente — você fala com pessoas que conhecem o seu negócio, não apenas com um chamado numerado.",
  },
  {
    id: "integracao-fiscal",
    iconKey: "ShieldCheck",
    title: "Integração fiscal",
    description:
      "Conformidade fiscal garantida, com atualizações constantes frente às mudanças de legislação.",
  },
  {
    id: "automacao-comercial",
    iconKey: "Zap",
    title: "Automação Comercial",
    description:
      "Processos comerciais automatizados de ponta a ponta, reduzindo retrabalho e acelerando a operação.",
  },
  {
    id: "business-intelligence",
    iconKey: "BarChart3",
    title: "Business Intelligence",
    description:
      "Dashboards e indicadores em tempo real para decisões baseadas em dados, não em achismo.",
  },
];
