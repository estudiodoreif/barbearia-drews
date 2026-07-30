"use client";

import { useEffect, useRef } from "react";

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

  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  /*
   * Dispara a reprodução quando a seção entra em cena.
   *
   * O `autoPlay` do atributo não bastava no mobile. Os atributos chegam certos
   * no HTML servido (`autoplay muted loop playsinline` — conferido no
   * prerender), mas no mobile esta seção nasce **fora da viewport**: navegador
   * móvel não inicia a reprodução de um vídeo que nunca apareceu, e como ele
   * nunca começa, também não retoma sozinho ao entrar. Daí ter que apertar play.
   *
   * O `muted` é reafirmado por propriedade porque a política de autoplay a lê
   * no instante do `play()` — reforçar aqui fecha a janela em que o React ainda
   * não a aplicou.
   *
   * `play()` devolve uma promise que **rejeita** quando o sistema recusa; iOS em
   * Modo de Baixo Consumo é o caso comum. Aí não há o que fazer: o pôster fica
   * no lugar, degradação aceitável para um elemento decorativo. O `catch` existe
   * para isso não virar erro não tratado no console.
   */
  useEffect(() => {
    const el = section.current;
    const media = video.current;
    if (!el || !media) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        media.muted = true;
        void media.play().catch(() => {});
      },
      // 10% já basta: quanto antes começar, menor a chance de alguém ver o
      // pôster parado.
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const asset = VIDEOS.barba;

  return (
    <section id="video-reveal" ref={section} className={styles.videoReveal}>
      <video
        ref={video}
        className={styles.video}
        src={asset.src}
        poster={asset.poster}
        width={asset.width}
        height={asset.height}
        autoPlay
        muted
        loop
        // Sem isto o iOS abre o vídeo em tela cheia e sequestra a página.
        playsInline
        // O primeiro frame chega antes de a seção subir; o resto vem em
        // streaming, sem custar banda de quem nunca rolar até aqui.
        preload="metadata"
        // Decorativo: nenhuma informação depende dele.
        aria-hidden="true"
        tabIndex={-1}
      />
      <span className={styles.veil} aria-hidden="true" />
    </section>
  );
}
