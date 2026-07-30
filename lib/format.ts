/**
 * Formatadores compartilhados.
 *
 * `formatPrice` nasceu dentro de Services.tsx; foi extraído quando a Loja
 * passou a precisar do mesmo formato — duas implementações de preço divergem
 * na primeira vez que alguém muda a moeda ou as casas decimais.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatPrice = (value: number) => BRL.format(value);

export const formatDuration = (minutes: number) => `${minutes} min`;
