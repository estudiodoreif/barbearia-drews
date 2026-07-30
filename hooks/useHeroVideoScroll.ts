"use client";

import { useEffect } from "react";

import { gsap } from "@/lib/gsap";

/**
 * Orquestra a transição Hero → VideoReveal: o Hero fica pinado enquanto o
 * vídeo sobe por cima dele.
 *
 * Vive num hook único, e não dentro de cada seção, porque a animação depende
 * dos dois elementos ao mesmo tempo (`#inicio` e `#video-reveal`). Dividir em
 * dois componentes daria dois ScrollTriggers com cálculos de `end`
 * independentes, que saem de sincronia na primeira mudança de altura.
 *
 * Só funciona bem porque o `SmoothScroll` já colocou Lenis e ScrollTrigger no
 * mesmo RAF — sem essa ponte, um `pin` com `scrub` treme visivelmente.
 */
export function useHeroVideoScroll() {
  useEffect(() => {
    // `gsap.matchMedia` em vez de checar `window.innerWidth` na mão: ele mata e
    // recria os triggers sozinho ao cruzar o breakpoint (ou ao girar o
    // aparelho), o que um `if` simples não faz.
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        // No mobile e com movimento reduzido não há pin: pinar uma seção com
        // vídeo full-bleed é caro em aparelho fraco, e o resultado sem pin
        // (scroll normal, vídeo entrando de baixo) continua legível.
        //
        // Um ScrollTrigger só, com o pin e o scrub juntos — não dois.
        // Com dois triggers separados apontando para `#inicio`, o segundo mede
        // um elemento que o primeiro já está pinando (e portanto transformando
        // e envolvendo num pin-spacer): as duas faixas de scroll divergem e o
        // vídeo para em ~85% do caminho, sem nunca cobrir o Hero.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#inicio",
            start: "top top",
            end: "+=100%",
            pin: true,
            // Sem espaçamento extra: o VideoReveal precisa cobrir o Hero, não
            // ser empurrado para depois dele.
            pinSpacing: false,
            // Levemente suavizado em vez de scrub puro — mais estável quando
            // o frame atrasa.
            scrub: 0.5,
            // `+=100%` é relativo à viewport: sem isto, girar o aparelho ou
            // redimensionar deixaria a faixa calibrada na altura antiga.
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          "#video-reveal",
          { yPercent: 100 },
          { yPercent: 0, ease: "none" },
        );
      },
    );

    return () => mm.revert();
  }, []);
}
