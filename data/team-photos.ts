export interface TeamPhoto {
  id: string;
  alt: string;
  /** Drop real files in `public/team/` and set e.g. "/team/equipe-1.jpg" */
  src?: string;
}

export const teamPhotos: TeamPhoto[] = [
  { id: "1", alt: "Equipe Gestão Consultorias", src: "/team/equipe.jpg" },
  { id: "2", alt: "Diretoria", src: "/team/diretoria.jpg" },
  { id: "3", alt: "Família Gestão", src: "/team/familia.jpg" },
  { id: "4", alt: "Atendimento ao cliente", src: "/team/atendimento.jpg" },
  {
    id: "5",
    alt: "Central de atendimento",
    src: "/team/central-atendimento.jpg",
  },
];
