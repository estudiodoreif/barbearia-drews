export type Product = {
  name: string;
  price: number;
  /**
   * `false` desliga o tratamento P&B só neste produto.
   *
   * Existe por causa da camiseta: é a única peça fotografada **numa pessoa**, e
   * em escala de cinza o modelo lia como item esgotado, não como produto. É uma
   * exceção consciente a DESIGN.md §3 — registrada lá.
   */
  grayscale?: boolean;
  /** Mockup do produto — vira o fundo do card. */
  image: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Produtos da Loja (BUILD_PROMPT §12).
 *
 * ⚠️ **A DREWS não vende produtos hoje.** A aba "Produtos" da agenda pública no
 * AppBarber retorna "Nenhum produto encontrado" e não há menção a loja no
 * Instagram. Esta seção existe como **proposta comercial ao cliente**: mostra
 * como ficaria uma linha própria de vestuário.
 *
 * O que mudou desta rodada: os mockups agora são **reais**, com o wordmark
 * DREWS aplicado nas peças (curadoria em `SITE/Fotos/Produtos/`). Antes eram
 * ilustrações SVG que desenhei por falta de imagem. Só os **preços** seguem
 * provisórios — são âncoras plausíveis de mercado, não a tabela da barbearia.
 *
 * Caíram os 5 cosméticos (pomada, pó, óleo, balm, shampoo): não têm mockup e
 * eram a parte mais especulativa da proposta. Sobram quatro peças, que é
 * exatamente a linha única de 4 colunas do layout.
 */
export const PRODUCTS: readonly Product[] = [
  {
    name: "Camiseta",
    price: 89.9, // PROVISÓRIO: confirmar com o cliente
    grayscale: false,
    image: "/images/produto/camiseta.jpg",
    alt: "Camiseta preta oversized com o wordmark DREWS no peito",
    width: 896,
    height: 1200,
  },
  {
    name: "Moletom",
    price: 189.9, // PROVISÓRIO: confirmar com o cliente
    image: "/images/produto/moletom.jpg",
    alt: "Moletom preto com capuz e o wordmark DREWS centralizado",
    width: 896,
    height: 1200,
  },
  {
    name: "Jaqueta",
    price: 289.9, // PROVISÓRIO: confirmar com o cliente
    image: "/images/produto/jaqueta.jpg",
    alt: "Jaqueta bomber preta com o wordmark DREWS no peito",
    width: 896,
    height: 1200,
  },
  {
    name: "Boné",
    price: 69.9, // PROVISÓRIO: confirmar com o cliente
    image: "/images/produto/bone.jpg",
    alt: "Boné preto com o wordmark DREWS bordado em branco",
    width: 896,
    height: 1200,
  },
];
