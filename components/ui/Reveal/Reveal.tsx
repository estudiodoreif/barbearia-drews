"use client";

import { type ReactNode, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { DURATION, EASE_GSAP } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Elementos que o Reveal pode renderizar. Lista fechada em vez de
 * `ElementType`: com o tipo aberto, o TS não consegue resolver quais props o
 * elemento aceita e colapsa `children`/`ref` para `never`.
 */
type RevealTag = "div" | "section" | "article" | "figure" | "ul" | "ol";

type RevealProps = {
  children: ReactNode;
  /** Elemento renderizado. Use o semanticamente correto, não uma div sempre. */
  as?: RevealTag;
  className?: string;
  /** Atraso em segundos, para escalonar irmãos manualmente. */
  delay?: number;
  /**
   * Escalona os filhos diretos em vez de animar o wrapper inteiro.
   * Útil em listas (serviços, galeria).
   */
  stagger?: number;
};

/**
 * O reveal de scroll padrão do site: fade-in + slide-up leve (DESIGN.md §10).
 *
 * É o único lugar que deveria criar ScrollTriggers de entrada — se cada seção
 * escrever o seu, os tempos divergem e o ritmo da página se perde.
 *
 * Detalhe importante: o estado inicial é aplicado por GSAP (`gsap.set`), não por
 * CSS. Se fosse CSS, o conteúdo ficaria invisível caso o JS falhasse ou o
 * ScrollTrigger não calibrasse — aqui o pior caso é aparecer sem animação.
 */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  stagger,
}: RevealProps) {
  // Todos os elementos de RevealTag aceitam className e ref para um
  // HTMLElement; o cast só existe para o TS escolher uma assinatura concreta.
  const Tag = as as "div";
  const container = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const targets =
        stagger !== undefined
          ? Array.from(container.current?.children ?? [])
          : container.current;

      if (!targets || (Array.isArray(targets) && targets.length === 0)) return;

      gsap.from(targets, {
        opacity: 0,
        y: 24,
        duration: DURATION.base,
        ease: EASE_GSAP.out,
        delay,
        stagger,
        scrollTrigger: {
          trigger: container.current,
          // Dispara quando o topo do elemento cruza 85% da viewport: já visível,
          // mas ainda com espaço para a animação acontecer antes da leitura.
          start: "top 85%",
          once: true,
        },
      });
    },
    // Reexecuta se a preferência de movimento mudar em tempo real.
    { scope: container, dependencies: [prefersReducedMotion] },
  );

  return (
    <Tag ref={container} className={className}>
      {children}
    </Tag>
  );
}
