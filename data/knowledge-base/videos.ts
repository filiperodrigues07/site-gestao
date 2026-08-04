export type KBVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  durationLabel: string;
};

export const kbVideos: KBVideo[] = [
  {
    id: "1",
    title: "Tour completo pelo sistema",
    description: "Uma visão geral de todos os módulos principais em 8 minutos.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durationLabel: "8 min",
  },
  {
    id: "2",
    title: "Como emitir sua primeira nota fiscal",
    description: "Passo a passo prático de emissão de NF-e direto do pedido de venda.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durationLabel: "5 min",
  },
  {
    id: "3",
    title: "Configurando o PDV para sua loja",
    description: "Como parametrizar o frente de caixa antes da abertura da loja.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durationLabel: "6 min",
  },
  {
    id: "4",
    title: "Dashboards de Business Intelligence",
    description: "Como interpretar e customizar os indicadores gerenciais do sistema.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durationLabel: "7 min",
  },
];
