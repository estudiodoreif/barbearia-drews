"use client";

import { VIDEOS } from "@/content/media";
import { useHeroVideoScroll } from "@/hooks/useHeroVideoScroll";

import styles from "./VideoReveal.module.css";

/**
 * Vídeo full-bleed que sobe por cima do Hero pinado.
 *
 * O hook de scroll é chamado daqui, e não no Hero, porque este componente
 * renderiza depois — quando o efeito roda, os dois elementos (`#inicio` e
 * `#video-reveal`) já existem no DOM.
 *
 * O vídeo é o `drews-barba-h.mp4`, a versão rotacionada para horizontal: o
 * original foi gravado com o celular deitado e, além de aparecer tombado, um
 * 9:16 em full-bleed no desktop perderia quase todo o quadro no crop.
 */
export function VideoReveal() {
  useHeroVideoScroll();

  const video = VIDEOS.barba;

  return (
    <section id="video-reveal" className={styles.videoReveal}>
      <video
        className={styles.video}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        autoPlay
        muted
        loop
        // Sem isto o iOS abre o vídeo em tela cheia e sequestra a página.
        playsInline
        // Decorativo: nenhuma informação depende dele.
        aria-hidden="true"
        tabIndex={-1}
      />
      <span className={styles.veil} aria-hidden="true" />
    </section>
  );
}
