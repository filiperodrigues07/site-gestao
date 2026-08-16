export const ADMIN_SECTIONS = [
  { key: "artigos", label: "Artigos" },
  { key: "downloads", label: "Downloads" },
  { key: "categorias", label: "Categorias" },
  { key: "faq", label: "FAQ" },
  { key: "videos", label: "Vídeos" },
  { key: "promocoes", label: "Promoções" },
  { key: "novidades", label: "Novidades" },
  { key: "instagram", label: "Instagram" },
  { key: "portal-clientes", label: "Clientes" },
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number]["key"];

type PermissionCheckable = {
  isAdmin: boolean;
  permissions: string[];
};

export function hasPermission(user: PermissionCheckable, section: AdminSection): boolean {
  return user.isAdmin || user.permissions.includes(section);
}
