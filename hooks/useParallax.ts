"use client";

import { useEffect, type RefObject } from "react";

import { gsap } from "@/lib/gsap";

/**
 * Deriva vertical leve num elemento durante o scroll.
 *
 * O que dá a sensação de profundidade é a imagem andar num ritmo diferente do
 * texto ao lado. O elemento animado deve estar dentro de um container com
 * `overflow: hidden` e ser um pouco mais alto que ele (ver `.parallaxInner`
 * nos CSS das seções), senão a deriva revela a borda do container.
 *
 * Desligado abaixo de 768px e com `prefers-reduced-motion` — o `matchMedia` do
 * GSAP cria e destrói o trigger sozinho ao cruzar o breakpoint, o que um `if`
 * com `window.innerWidth` não faria ao girar o aparelho.
 */
export function useParallax(
  target: RefObject<HTMLElement | null>,
  /** Deslocamento total em % da altura do elemento. */
  amount = 12,
) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, [target, amount]);
}
