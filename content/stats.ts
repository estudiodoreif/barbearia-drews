import { RATING } from "@/lib/site";

/**
 * "Big numbers" da seção Sobre (BUILD_PROMPT §9).
 *
 * Os dois números anteriores — anos de ofício e clientes atendidos — eram
 * PENDING porque são exatamente o tipo de dado que soa inofensivo inventar e
 * que, publicado errado, o cliente é quem tem que desmentir no balcão. Foram
 * trocados por dados **verificáveis**: a nota e o volume de avaliações do
 * perfil da barbearia no Google (30/07/2026).
 *
 * Ganho de lado: qualquer visitante pode conferir os dois números na hora, o
 * que é prova social de verdade — coisa que "+10 anos de ofício" nunca é.
 */
export type Stat = {
  value: number;
  /** Sufixo colado no número, ex. "+" em "+12". */
  prefix?: string;
  /** Casas decimais na exibição. A nota é 4,9; o total de avaliações é 73. */
  decimals?: number;
  label: string;
};

export const STATS: readonly Stat[] = [
  { value: RATING.value, decimals: 1, label: "de avaliação no Google" },
  { value: RATING.count, label: "avaliações de clientes" },
];
