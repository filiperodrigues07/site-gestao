export type KBCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconKey: string;
};

export const kbCategories: KBCategory[] = [
  {
    id: "primeiros-passos",
    slug: "primeiros-passos",
    name: "Primeiros Passos",
    description: "Configuração inicial e onboarding do sistema.",
    iconKey: "Rocket",
  },
  {
    id: "financeiro",
    slug: "financeiro",
    name: "Financeiro",
    description: "Contas a pagar, a receber e conciliação bancária.",
    iconKey: "Banknote",
  },
  {
    id: "fiscal",
    slug: "fiscal",
    name: "Fiscal",
    description: "Emissão de notas fiscais e obrigações acessórias.",
    iconKey: "ShieldCheck",
  },
  {
    id: "estoque",
    slug: "estoque",
    name: "Estoque",
    description: "Movimentações, inventário e controle de produtos.",
    iconKey: "Package",
  },
  {
    id: "vendas",
    slug: "vendas",
    name: "Vendas",
    description: "PDV, pedidos e força de vendas externa.",
    iconKey: "ShoppingCart",
  },
  {
    id: "integracoes",
    slug: "integracoes",
    name: "Integrações",
    description: "Conecte o sistema a marketplaces e outras ferramentas.",
    iconKey: "Plug",
  },
];

export function getCategoryBySlug(slug: string) {
  return kbCategories.find((category) => category.slug === slug);
}
