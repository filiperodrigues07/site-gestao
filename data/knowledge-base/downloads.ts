export type KBDownload = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: "PDF" | "XLSX" | "DOCX";
  fileSizeLabel: string;
};

export const kbDownloads: KBDownload[] = [
  {
    id: "1",
    title: "Checklist de implantação",
    description: "Tudo que sua equipe precisa preparar antes do início da implantação.",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeLabel: "420 KB",
  },
  {
    id: "2",
    title: "Planilha de mapeamento de processos",
    description: "Modelo para mapear seus processos atuais antes da migração.",
    fileUrl: "#",
    fileType: "XLSX",
    fileSizeLabel: "180 KB",
  },
  {
    id: "3",
    title: "Guia de boas práticas fiscais",
    description: "Resumo das principais obrigações fiscais por segmento.",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeLabel: "610 KB",
  },
  {
    id: "4",
    title: "Modelo de treinamento de equipe",
    description: "Roteiro sugerido para treinar novos usuários do sistema.",
    fileUrl: "#",
    fileType: "DOCX",
    fileSizeLabel: "95 KB",
  },
];
