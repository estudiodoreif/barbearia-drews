/**
 * Inventário da curadoria fotográfica.
 *
 * Fonte: `SITE/Fotos/`, curadoria do cliente. Todas já chegam em P&B de alto
 * contraste sobre fundo claro — não precisam do tratamento que a classe
 * `.photo` aplicava aos placeholders de banco, mas continuam passando por ela
 * para garantir a regra estrita de DESIGN.md §3 se alguma foto colorida entrar
 * no futuro.
 *
 * **O fundo quase branco é característica de projeto, não coincidência.** Em
 * seções `[data-theme="light"]` (`--color-bg-alt`, #fafaf8) ele dissolve na
 * página, o que permite exibir a foto sem moldura e deixar só o sujeito
 * flutuando. É disso que a seção Sobre depende — ao trocar qualquer foto de
 * lá, manter uma de fundo claro.
 *
 * Um único ponto de verdade: nenhuma seção deve escrever `/images/foto/...`
 * à mão, senão renomear um arquivo vira caça ao string solto.
 */

export type Photo = {
  src: string;
  /** Descrição para leitor de tela. Vazio = decorativa (o consumidor marca aria-hidden). */
  alt: string;
  width: number;
  height: number;
};

const W = { wide: { width: 1376, height: 768 }, box: { width: 1200, height: 896 } };
const P = { width: 896, height: 1200 };

export const PHOTOS = {
  // ---- Horizontais ----
  maosEnquadrando: {
    src: "/images/foto/maos-enquadrando.jpg",
    alt: "Barbeiro segurando pente e tesoura sobre a cabeça de um cliente com desenho raspado",
    ...W.wide,
  },
  maquinaOrelha: {
    src: "/images/foto/maquina-orelha.jpg",
    alt: "Máquina fazendo o degradê rente à orelha, com fios saltando",
    ...W.wide,
  },
  tesouraPente: {
    src: "/images/foto/tesoura-pente.jpg",
    alt: "Mãos do barbeiro com tesoura e pente sobre o cabelo do cliente",
    ...W.wide,
  },
  tesouraPente2: {
    src: "/images/foto/tesoura-pente-2.jpg",
    alt: "Tesoura e pente em ação durante o corte",
    ...W.wide,
  },
  nucaMaquina: {
    src: "/images/foto/nuca-maquina.jpg",
    alt: "Acabamento da nuca com máquina",
    ...W.wide,
  },
  nucaMaquina2: {
    src: "/images/foto/nuca-maquina-2.jpg",
    alt: "Detalhe do degradê na nuca",
    ...W.wide,
  },
  navalhaBarba: {
    src: "/images/foto/navalha-barba.jpg",
    alt: "Cliente de olhos fechados durante o contorno da barba na navalha",
    ...W.wide,
  },
  oleoBarba: {
    src: "/images/foto/oleo-barba.jpg",
    alt: "Barbeiro aplicando óleo na barba de um cliente",
    ...W.wide,
  },
  navalhaContorno: {
    src: "/images/foto/navalha-contorno.jpg",
    alt: "Navalha traçando o contorno do cabelo acima da orelha",
    ...W.wide,
  },
  dreadlocks: {
    src: "/images/foto/dreadlocks.jpg",
    alt: "Barbeiro aparando dreadlocks com tesoura",
    ...W.wide,
  },
  navalhaMaoWide: {
    src: "/images/foto/navalha-mao-wide.jpg",
    alt: "Mão tatuada segurando uma navalha aberta",
    ...W.wide,
  },
  navalhaMao: {
    src: "/images/foto/navalha-mao.jpg",
    alt: "Mão com anéis segurando uma navalha, lâmina refletindo a luz",
    ...W.box,
  },
  navalhaMao2: {
    src: "/images/foto/navalha-mao-2.jpg",
    alt: "Navalha aberta na mão do barbeiro",
    ...W.box,
  },

  // ---- Verticais ----
  espelhoReflexo: {
    src: "/images/foto/espelho-reflexo.jpg",
    alt: "Cliente refletido no espelho redondo enquanto o barbeiro trabalha o corte",
    ...P,
  },
  espelhoReflexo2: {
    src: "/images/foto/espelho-reflexo-2.jpg",
    alt: "Reflexo do atendimento no espelho da barbearia",
    ...P,
  },
  espelhoMao: {
    src: "/images/foto/espelho-mao.jpg",
    alt: "Barbeiro mostrando o resultado do corte no espelho de mão",
    ...P,
  },
  barbaTesoura: {
    src: "/images/foto/barba-tesoura.jpg",
    alt: "Barbeiro aparando a barba com pente e tesoura",
    ...P,
  },
  texturaBarba: {
    src: "/images/foto/textura-barba.jpg",
    alt: "Macro da textura de uma barba",
    ...P,
  },
  maquinaBase: {
    src: "/images/foto/maquina-base.jpg",
    alt: "Máquina de corte na base de carga, sob um facho de luz",
    ...P,
  },
  clienteRisada: {
    src: "/images/foto/cliente-risada.jpg",
    alt: "Cliente rindo na cadeira enquanto a capa é ajustada",
    ...P,
  },
  clienteRisada2: {
    src: "/images/foto/cliente-risada-2.jpg",
    alt: "Cliente sorrindo durante o atendimento",
    ...P,
  },
  retratoHightop: {
    src: "/images/foto/retrato-hightop.jpg",
    alt: "Retrato de perfil de um cliente com corte high-top",
    ...P,
  },
  retratoHightop2: {
    src: "/images/foto/retrato-hightop-2.jpg",
    alt: "Retrato de cliente com corte high-top finalizado",
    ...P,
  },
  fadeRetrato: {
    src: "/images/foto/fade-retrato.jpg",
    alt: "Degradê finalizado, visto de trás",
    ...P,
  },
  barbaNavalhaRetrato: {
    src: "/images/foto/barba-navalha-retrato.jpg",
    alt: "Contorno da barba sendo feito na navalha",
    ...P,
  },
  maosEnquadrandoRetrato: {
    src: "/images/foto/maos-enquadrando-retrato.jpg",
    alt: "Mãos do barbeiro enquadrando a cabeça do cliente",
    ...P,
  },
  orelhaFadeRetrato: {
    src: "/images/foto/orelha-fade-retrato.jpg",
    alt: "Detalhe do degradê ao redor da orelha",
    ...P,
  },
  navalhaRetrato: {
    src: "/images/foto/navalha-retrato.jpg",
    alt: "Navalha em uso durante o acabamento",
    ...P,
  },
  contornoRetrato: {
    src: "/images/foto/contorno-retrato.jpg",
    alt: "Acabamento do contorno com navalha",
    ...P,
  },
} as const satisfies Record<string, Photo>;

/**
 * As 12 do rastro do Hero.
 *
 * Escolhidas por serem as mais **gráficas** — mão, ferramenta, macro, silhueta
 * forte. Em ~260px de largura e meio segundo de vida, um retrato inteiro não
 * se lê; uma mão com navalha, sim.
 */
export const TRAIL_PHOTOS: readonly Photo[] = [
  PHOTOS.navalhaMao,
  PHOTOS.maosEnquadrando,
  PHOTOS.tesouraPente,
  PHOTOS.maquinaOrelha,
  PHOTOS.texturaBarba,
  PHOTOS.maquinaBase,
  PHOTOS.nucaMaquina,
  PHOTOS.navalhaContorno,
  PHOTOS.navalhaMao2,
  PHOTOS.dreadlocks,
  PHOTOS.tesouraPente2,
  PHOTOS.navalhaBarba,
];

/** Os 6 quadros que passam na tira do preloader. */
export const PRELOADER_PHOTOS: readonly Photo[] = [
  PHOTOS.espelhoReflexo,
  PHOTOS.maosEnquadrando,
  PHOTOS.navalhaMao,
  PHOTOS.clienteRisada,
  PHOTOS.maquinaBase,
  PHOTOS.retratoHightop,
];

/** Trilha da Galeria. Alterna retrato e paisagem para o ritmo horizontal. */
export const GALLERY_PHOTOS: readonly Photo[] = [
  PHOTOS.espelhoMao,
  PHOTOS.maosEnquadrando,
  PHOTOS.retratoHightop,
  PHOTOS.navalhaContorno,
  PHOTOS.clienteRisada2,
  PHOTOS.oleoBarba,
  PHOTOS.barbaNavalhaRetrato,
  PHOTOS.dreadlocks,
  PHOTOS.orelhaFadeRetrato,
  PHOTOS.nucaMaquina2,
  PHOTOS.espelhoReflexo2,
];
