export const ADMIN_PAGE_SIZE = 50;

export function parsePage(pageParam?: string): number {
  return Math.max(1, Number(pageParam) || 1);
}

// Preserva todos os filtros atuais (q, status, categoria etc.) na URL,
// só trocando a página — funciona pra qualquer tela sem precisar listar
// os parâmetros de filtro um por um.
export function buildAdminHref(
  pathname: string,
  currentParams: Record<string, string | undefined>,
  targetPage: number
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(currentParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (targetPage > 1) params.set("page", String(targetPage));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
