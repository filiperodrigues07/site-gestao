const ANOS_PASSADO = 3;
const ANOS_FUTURO = 1;

// Intervalo amplo o bastante para pegar qualquer título em aberto, sem
// precisar que o cliente escolha um período — a API do CH exige um range.
export function getReceberRange(): [Date, Date] {
  const now = new Date();
  const inicio = new Date(now);
  inicio.setFullYear(now.getFullYear() - ANOS_PASSADO);
  const fim = new Date(now);
  fim.setFullYear(now.getFullYear() + ANOS_FUTURO);
  return [inicio, fim];
}
