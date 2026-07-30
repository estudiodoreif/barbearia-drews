"use client";

import { type ElementType, type ReactNode, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_GSAP } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import styles from "./TextReveal.module.css";

type TextRevealProps = {
  /**
   * Uma entrada por linha. As quebras são manuais e não automáticas de
   * propósito: para mascarar linha por linha é preciso saber onde cada uma
   * começa, e medir isso do texto renderizado (à la SplitText) custa um
   * reflow por resize e quebra quando a fonte carrega depois.
   *
   * Linhas que não são texto puro precisam de `key` — o React valida keys no
   * array literal, no momento em que ele é construído (no chamador), e não
   * dentro deste componente. Use `<Fragment key="…">` em vez de `<>…</>`.
   */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  /** Dispara ao entrar na viewport (padrão) ou imediatamente. */
  trigger?: "scroll" | "immediate";
  /** Só usado com `trigger: "immediate"` — espera o preloader, por exemplo. */
  play?: boolean;
  delay?: number;
};

/**
 * Revelação de título linha por linha, com máscara.
 *
 * É o gesto de entrada dos títulos, e existe separado do `<Reveal>` porque os
 * dois resolvem coisas diferentes: `Reveal` faz o fade-up genérico de blocos e
 * listas; este trata tipografia grande, onde um fade uniforme achata o impacto
 * e a subida mascarada é o que dá peso editorial.
 */
export function TextReveal({
  lines,
  as: Tag = "div",
  className,
  trigger = "scroll",
  play = true,
  delay = 0,
}: TextRevealProps) {
  const root = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const inners = root.current?.querySelectorAll(`.${styles.lineInner}`);
      if (!inners?.length) return;

      if (prefersReducedMotion) {
        gsap.set(inners, { yPercent: 0 });
        return;
      }

      if (trigger === "immediate" && !play) {
        // Mantém escondido até o sinal chegar (fim do preloader).
        gsap.set(inners, { yPercent: 110 });
        return;
      }

      gsap.fromTo(
        inners,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: EASE_GSAP.out,
          stagger: 0.09,
          delay,
          ...(trigger === "scroll"
            ? {
                scrollTrigger: {
                  trigger: root.current,
                  start: "top 88%",
                  once: true,
                },
              }
            : null),
        },
      );
    },
    { scope: root, dependencies: [prefersReducedMotion, play, trigger, delay] },
  );

  const Element = Tag as "div";

  return (
    <Element ref={root} className={`${styles.reveal} ${className ?? ""}`.trim()}>
      {lines.map((line, i) => (
        <span key={i} className={styles.line}>
          <span className={styles.lineInner}>{line}</span>
        </span>
      ))}
    </Element>
  );
}
