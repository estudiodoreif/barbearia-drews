export type Review = {
  /** Nome como aparece publicamente no perfil do Google. */
  author: string;
  /** Texto da avaliação. */
  text: string;
  /** Quando foi publicada, como o Google exibe. */
  when: string;
};

/**
 * Avaliações reais do perfil da barbearia no Google Maps.
 *
 * Colhidas em 30/07/2026 do perfil que também alimenta `RATING` em `lib/site.ts`
 * (4,9 de 73 avaliações). Das 8 que têm texto, estas três foram escolhidas por
 * cobrirem argumentos diferentes em vez de repetirem o mesmo elogio:
 *
 *  - **Lucas Sestrem** — recorrência. Um cliente de quatro anos é o sinal mais
 *    forte que existe para barbearia; vale mais que qualquer adjetivo.
 *  - **Maiqui Jeremias** — cobertura. Cita atendimento, ambiente e corte numa
 *    frase só.
 *  - **Heitor Borgmann** — humanidade. É a única que conta uma história em vez
 *    de dar nota, e por isso a que fica na memória.
 *
 * Ficaram de fora: "O cara é fera!" e "Top meu esposo chega lindo" (curtas
 * demais para sustentar um box), "Cliente profissional, super indico" (redação
 * confusa) e "não existe melhor na cidade" (soa a claim publicitário, não a
 * depoimento).
 *
 * **As palavras são as do autor.** Só foram normalizadas maiúscula inicial e
 * pontuação — os originais têm vírgula sem espaço e frases em caixa baixa.
 * Reescrever o conteúdo de um depoimento de cliente descaracterizaria a prova
 * social, que é justamente o ponto.
 *
 * Ao adicionar uma avaliação nova, colher do perfil e registrar aqui — não
 * escrever depoimento.
 */
export const REVIEWS: readonly Review[] = [
  {
    author: "Lucas Sestrem",
    text: "Corto a 4 anos no mesmo local, qualidade e procedência.",
    when: "há 9 meses",
  },
  {
    author: "Maiqui Jeremias",
    text: "Atendimento excelente, ambiente bonito e corte top!! Recomendo.",
    when: "há 7 meses",
  },
  {
    author: "Heitor Borgmann",
    text: "Muito boa a experiência, me deixou pronto pra conhecer os pais da minha namorada. Sou grato a Barbearia Drews.",
    when: "há 9 meses",
  },
];
