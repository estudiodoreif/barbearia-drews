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
        /*
         * **Sem tween.** O pin sozinho já produz o efeito.
         *
         * Havia aqui um `fromTo("#video-reveal", { yPercent: 100 }, ...)` que
         * empurrava o vídeo uma tela inteira para baixo e o trazia de volta com
         * o scroll. Funcionava enquanto o Hero ocupava 100svh — mas com o Hero
         * a 80svh (referencia_09), o vídeo deveria aparecer logo abaixo dele em
         * repouso, e o `yPercent: 100` deixava um vazio no lugar.
         *
         * Com `pinSpacing: false`, a seção seguinte sobe naturalmente por cima
         * da seção pinada, que é exatamente a cobertura desejada. O tween era
         * redundante e brigava com a nova altura.
         */
        gsap.timeline({
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
      },
    );

    return () => mm.revert();
  }, []);
}
