// Sessão da área do cliente é totalmente separada da sessão do admin: cookie
// próprio, tabela própria (portalClients). Reaproveita createSessionToken/
// verifySessionToken de ./session (já genéricos por `sub`), sem duplicar
// a assinatura/verificação do JWT.
export const PORTAL_SESSION_COOKIE = "gestao_portal_session";
