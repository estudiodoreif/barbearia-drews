"use client";

import { type ReactNode, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Liga o Lenis ao ScrollTrigger.
 *
 * Este é o ponto que mais dá errado ao combinar as duas libs. Por padrão cada
 * uma roda seu próprio requestAnimationFrame, e como o Lenis interpola a
 * posição do scroll, o ScrollTrigger lê uma posição defasada de um frame — os
 * triggers disparam no lugar errado e animações com `pin` tremem.
 *
 * A correção é fazer as duas compartilharem um único loop:
 *  1. `autoRaf: false` desliga o RAF interno do Lenis (feito no componente pai);
 *  2. o ticker do GSAP passa a chamar `lenis.raf()`;
 *  3. cada scroll do Lenis força um `ScrollTrigger.update()`;
 *  4. `lagSmoothing(0)` impede o GSAP de "pular" frames quando a aba engasga,
 *     o que dessincronizaria os dois.
 */
function ScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Wrapper em vez de passar ScrollTrigger.update direto: o Lenis chama o
    // callback com a instância, e ScrollTrigger.update(arg) leria isso como
    // o parâmetro `force`.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // gsap.ticker entrega o tempo em segundos; lenis.raf espera milissegundos.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // A altura da página muda quando fontes e imagens carregam; sem isso os
    // triggers ficam calibrados na altura errada.
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // volta ao padrão do GSAP
    };
  }, [lenis]);

  return null;
}

/**
 * Provider de scroll suave. Envolve a árvore inteira em app/layout.tsx.
 *
 * Com `prefers-reduced-motion`, mantemos o Lenis montado mas com a
 * interpolação desligada (`smoothWheel: false`): o scroll volta a ser o nativo
 * do browser e o ScrollTrigger continua recebendo updates. Desmontar o
 * provider remontaria a árvore inteira, o que é pior.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        // Ver ScrollTriggerBridge: o RAF é do GSAP, não do Lenis.
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: !prefersReducedMotion,
        // Toque: deixamos o scroll nativo do mobile, que é mais previsível e
        // não briga com o gesto de "voltar" do iOS.
        syncTouch: false,
        // Faz o Lenis interceptar links `#ancora` — é o que faz a nav do
        // header rolar suave sem código de scroll manual.
        anchors: true,
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
