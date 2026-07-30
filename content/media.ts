/**
 * Mídia em movimento e marca.
 *
 * Este arquivo era o inventário dos 3 vídeos da barbearia e dos posters
 * extraídos deles. Com a curadoria fotográfica, **os posters saíram da
 * interface** — inclusive o da fachada, que era a única imagem da loja de
 * verdade. Eram material autêntico, mas o tratamento (frame de vídeo de
 * celular) destoava da linguagem editorial do resto. Ver CONTENT.md.
 *
 * O que ficou: o vídeo do `VideoReveal` e o logo. O vídeo continua porque é a
 * única imagem em movimento do site, e nenhuma foto o substitui.
 *
 * As fotos estáticas vivem em `content/photos.ts`.
 */

export type VideoAsset = {
  src: string;
  poster: string;
  /** Descrição para `aria-label`/legenda — não é decorativo. */
  description: string;
  width: number;
  height: number;
};

export const VIDEOS = {
  /**
   * Atendimento: barbeiro trabalhando o cabelo do cliente. O mais "ofício" dos
   * três, e o protagonista do VideoReveal.
   *
   * Foi gravado com o celular deitado: o original (`drews-barba.mp4`, 720×1280)
   * tem a cena girada 90°, com o cliente aparecendo tombado. Reprocessado com
   * `ffmpeg -vf transpose=1` para 1280×720 — o que também resolve o problema
   * de usar um 9:16 em full-bleed no desktop, onde o crop descartaria quase
   * todo o quadro. Áudio removido (é vídeo mudo de fundo) e `+faststart` para
   * começar a tocar antes do download completo.
   *
   * `public/video/` guarda **só este arquivo**. Os outros três vídeos (fachada,
   * apresentação e o original vertical deste) saíram de lá: nada os
   * referenciava e eram ~7 MB servidos à toa. Os originais seguem em
   * `SITE/Vídeos:Imagens/`, que é a fonte bruta do projeto.
   */
  barba: {
    src: "/video/drews-barba-h.mp4",
    poster: "/images/poster-barba-h.jpg",
    description: "Barbeiro trabalhando o cabelo de um cliente na cadeira",
    width: 1280,
    height: 720,
  },
} as const satisfies Record<string, VideoAsset>;

export const LOGO = {
  /** Para fundos escuros — é a versão com os traços claros. */
  light: "/logo/drews-branca.png",
  /** Para fundos claros. */
  dark: "/logo/drews-preta.png",
  width: 838,
  height: 489,
} as const;
