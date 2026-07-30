"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import styles from "./Marquee.module.css";

type MarqueeProps = {
  text: string;
  /** Segundos para uma cópia do texto atravessar. Maior = mais lento. */
  duration?: number;
  size?: "md" | "lg";
};

/** Quantas cópias renderizar para a trilha cobrir telas largas sem lacuna. */
const COPIES = 4;

/**
 * Texto correndo em loop infinito.
 *
 * O loop é feito animando a trilha em `-100 / COPIES` por cento e repetindo:
 * como as cópias são idênticas, ao deslocar exatamente a largura de uma cópia
 * o quadro final é pixel a pixel igual ao inicial, e o `repeat: -1` não tem
 * emenda visível. Animar até `-100%` mostraria o vazio no fim da trilha.
 *
 * Em `prefers-reduced-motion` o texto fica parado — continua legível, só não
 * se move.
 */
export function Marquee({ text, duration = 24, size = "md" }: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !track.current) return;

      gsap.to(track.current, {
        xPercent: -100 / COPIES,
        duration,
        ease: "none",
        repeat: -1,
      });
    },
    { dependencies: [prefersReducedMotion, duration] },
  );

  return (
    <div className={`${styles.marquee} ${styles[`size-${size}`]}`}>
      {/* O texto é decorativo/repetido: anunciá-lo 4 vezes seria ruído para
          leitor de tela. Onde a frase importa como conteúdo (Sobre), ela é
          renderizada em <blockquote> de verdade. */}
      <div ref={track} className={styles.track} aria-hidden="true">
        {Array.from({ length: COPIES }, (_, i) => (
          <span key={i} className={styles.item}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
