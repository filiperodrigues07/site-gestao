export type KBArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  categorySlug: string;
  tags: string[];
  updatedAt: string; // ISO date
};

export const kbArticles: KBArticle[] = [
  {
    id: "1",
    slug: "como-configurar-sua-conta",
    title: "Como configurar sua conta pela primeira vez",
    excerpt:
      "Um guia passo a passo para configurar empresa, usuários e permissões logo após a implantação.",
    categorySlug: "primeiros-passos",
    tags: ["onboarding", "configuração"],
    updatedAt: "2026-06-10",
    content: `## Visão geral

Após a implantação, o primeiro passo é configurar os dados cadastrais da empresa e os usuários que terão acesso ao sistema.

### 1. Dados da empresa

Acesse **Configurações > Empresa** e preencha razão social, CNPJ, endereço e regime tributário.

### 2. Usuários e permissões

Em **Configurações > Usuários**, cadastre cada colaborador e defina o perfil de acesso adequado (administrador, financeiro, vendas, etc).

### 3. Parametrização fiscal

Configure a série de nota fiscal, certificado digital e ambiente de emissão (homologação ou produção) antes de iniciar as vendas.

> Dica: mantenha o certificado digital sempre atualizado para evitar interrupções na emissão de notas fiscais.`,
  },
  {
    id: "2",
    slug: "emitir-nota-fiscal-eletronica",
    title: "Como emitir uma nota fiscal eletrônica (NF-e)",
    excerpt: "Passo a passo completo para emissão de NF-e a partir de um pedido de venda.",
    categorySlug: "fiscal",
    tags: ["nfe", "fiscal", "vendas"],
    updatedAt: "2026-05-22",
    content: `## Emitindo uma NF-e

1. Acesse o pedido de venda finalizado.
2. Clique em **Emitir Nota Fiscal**.
3. Confira os dados do destinatário e dos itens.
4. Clique em **Transmitir** para enviar à SEFAZ.

### Problemas comuns

- **Certificado expirado**: renove o certificado digital em Configurações > Fiscal.
- **Rejeição da SEFAZ**: verifique o código de erro retornado e ajuste o cadastro do item ou cliente.`,
  },
  {
    id: "3",
    slug: "conciliacao-bancaria-automatica",
    title: "Configurando a conciliação bancária automática",
    excerpt: "Aprenda a importar extratos e conciliar lançamentos automaticamente.",
    categorySlug: "financeiro",
    tags: ["financeiro", "conciliação", "banco"],
    updatedAt: "2026-04-15",
    content: `## Conciliação automática

A conciliação bancária permite comparar os lançamentos do sistema com o extrato do banco automaticamente.

### Passos

1. Acesse **Financeiro > Conciliação Bancária**.
2. Importe o arquivo OFX fornecido pelo seu banco.
3. O sistema sugere o pareamento automático entre lançamentos e extrato.
4. Confirme ou ajuste manualmente os itens não conciliados.`,
  },
  {
    id: "4",
    slug: "inventario-de-estoque",
    title: "Como realizar um inventário de estoque",
    excerpt: "Procedimento recomendado para contagem e ajuste de estoque sem parar a operação.",
    categorySlug: "estoque",
    tags: ["estoque", "inventário"],
    updatedAt: "2026-03-30",
    content: `## Inventário de estoque

Recomendamos realizar o inventário fora do horário de pico de vendas.

1. Gere a lista de contagem em **Estoque > Inventário > Nova Contagem**.
2. Realize a contagem física por setor ou depósito.
3. Lance as quantidades contadas no sistema.
4. Finalize o inventário para gerar os ajustes automáticos de estoque.`,
  },
  {
    id: "5",
    slug: "integrar-marketplace",
    title: "Integrando sua loja virtual a um marketplace",
    excerpt: "Como conectar seu catálogo e estoque a marketplaces populares.",
    categorySlug: "integracoes",
    tags: ["e-commerce", "marketplace", "integração"],
    updatedAt: "2026-02-18",
    content: `## Integração com marketplaces

1. Acesse **Integrações > Marketplaces**.
2. Selecione o marketplace desejado e informe as credenciais de API.
3. Mapeie as categorias do seu catálogo para as categorias do marketplace.
4. Ative a sincronização automática de estoque e preços.`,
  },
  {
    id: "6",
    slug: "abrir-chamado-suporte",
    title: "Como abrir um chamado de suporte técnico",
    excerpt: "Canais disponíveis e o que informar para agilizar o atendimento.",
    categorySlug: "primeiros-passos",
    tags: ["suporte", "atendimento"],
    updatedAt: "2026-01-20",
    content: `## Abrindo um chamado

Você pode abrir um chamado pelo portal do cliente, WhatsApp ou telefone.

### Informações que agilizam o atendimento

- Nome da empresa e usuário logado
- Módulo e tela onde ocorreu o problema
- Print ou vídeo curto do comportamento observado
- Passos para reproduzir o problema`,
  },
];

export function getArticleBySlug(slug: string) {
  return kbArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string) {
  return kbArticles.filter((article) => article.categorySlug === categorySlug);
}
