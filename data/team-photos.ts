export interface TeamPhoto {
  id: string;
  alt: string;
  /** Drop real files in `public/team/` and set e.g. "/team/equipe-1.jpg" */
  src?: string;
  /** Natural pixel dimensions of the file — used for correct lightbox aspect ratio */
  width: number;
  height: number;
}

export const teamPhotos: TeamPhoto[] = [
  { id: "1", alt: "Equipe Gestão Consultorias", src: "/team/equipe.jpg", width: 1600, height: 1067 },
  { id: "2", alt: "Diretoria", src: "/team/diretoria.jpg", width: 1600, height: 2400 },
  { id: "3", alt: "Família Gestão", src: "/team/familia.jpg", width: 1600, height: 2400 },
  { id: "4", alt: "Atendimento ao cliente", src: "/team/atendimento.jpg", width: 1600, height: 1067 },
  {
    id: "5",
    alt: "Central de atendimento",
    src: "/team/central-atendimento.jpg",
    width: 1600,
    height: 1067,
  },
  { id: "6", alt: "Equipe trabalhando no escritório", src: "/team/equipe-06.jpg", width: 5568, height: 3712 },
  { id: "7", alt: "Estações de trabalho com o sistema Gestão", src: "/team/equipe-07.jpg", width: 5568, height: 3712 },
  { id: "8", alt: "Colaboradora Gestão Consultorias", src: "/team/equipe-08.jpg", width: 3712, height: 5568 },
  { id: "9", alt: "Colaboradora Gestão Consultorias", src: "/team/equipe-09.jpg", width: 3712, height: 4138 },
  { id: "10", alt: "Colaborador Gestão Consultorias", src: "/team/equipe-10.jpg", width: 3343, height: 5263 },
  { id: "11", alt: "Colaborador Gestão Consultorias", src: "/team/equipe-11.jpg", width: 3712, height: 5279 },
  { id: "12", alt: "Colaborador Gestão Consultorias", src: "/team/equipe-12.jpg", width: 3712, height: 5231 },
  { id: "13", alt: "Equipe Gestão Consultorias", src: "/team/equipe-13.jpg", width: 5568, height: 3712 },
  { id: "14", alt: "Colaboradora Gestão Consultorias", src: "/team/equipe-14.jpg", width: 3503, height: 4379 },
];
