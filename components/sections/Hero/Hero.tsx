"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { useIntro } from "@/components/layout/Preloader";
import { PHOTOS, type Photo } from "@/content/photos";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_GSAP } from "@/lib/motion";
import { BOOKING_URL } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { ImageTrail } from "./ImageTrail";
import styles from "./Hero.module.css";

/**
 * Chip de foto embutido na headline.
 *
 * A caixa é bem mais larga que alta (1.5em × 0.62em), então as fotos aqui são
 * as **horizontais** da curadoria — um retrato entraria recortado a ponto de
 * virar mancha.
 */
function Chip({ photo }: { photo: Photo }) {
  return (
    <span className={styles.chip}>
      <Image
        className="photo"
        src={photo.src}
        alt=""
        width={photo.width}
        height={photo.height}
        sizes="240px"
        priority
        aria-hidden="true"
      />
    </span>
  );
}

/**
 * Hero. Bloco tipográfico condensado ocupando a largura toda, com dois chips
 * de foto embutidos na headline.
 *
 * O `{SITE.motto}` (frase da vitrine) aparece aqui só no marquee, correndo. O
 * uso dele como citação com contexto é na seção Sobre — repetir como parágrafo
 * nos dois lugares gastaria a única copy autenticamente da marca.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      // Espera o preloader: a entrada do Hero é a continuação da cortina
      // subindo, não uma animação independente. Nada de ScrollTrigger aqui —
      // o Hero já está visível no topo, sem scroll envolvido.
      if (!done) return;

      const rest = root.current?.querySelectorAll("[data-hero-fade]");
      if (!rest?.length) return;

      if (prefersReducedMotion) {
        gsap.set(rest, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(rest, {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: EASE_GSAP.out,
        stagger: 0.08,
        delay: 0.45,
      });
    },
    { scope: root, dependencies: [done, prefersReducedMotion] },
  );

  return (
    <section id="inicio" ref={root} className={styles.hero}>
      {/* Atmosfera atrás da headline. Só existe com cursor fino, sem
          prefers-reduced-motion e depois que a cortina do preloader sobe. */}
      <ImageTrail scope={root} enabled={done} />

      <div className={`container ${styles.top}`}>
        <span data-hero-fade>
          <SectionLabel index={1}>Barbearia</SectionLabel>
        </span>
      </div>

      <div className={`container ${styles.center}`}>
        {/*
          Sem `display-xl` aqui, de propósito — ver Hero.module.css: a classe
          global e a do módulo têm a mesma especificidade, e quem vencia
          dependia da ordem no bundle.
        */}
        <TextReveal
          as="h1"
          className={`bleed ${styles.headline}`}
          trigger="immediate"
          play={done}
          delay={0.1}
          // `Fragment` com key, e não `<>…</>`: o React valida keys no array
          // literal aqui, antes de o TextReveal receber a prop.
          lines={[
            <Fragment key="linha-1">
              O corte <Chip photo={PHOTOS.maquinaOrelha} /> certo
            </Fragment>,
            <Fragment key="linha-2">
              no tempo <Chip photo={PHOTOS.navalhaMaoWide} /> certo
            </Fragment>,
          ]}
        />

        {/*
          CTA de volta ao hero. A rodada anterior o tinha removido junto com a
          linha de metadados, e o site ficou sem caminho para agendar acima da
          dobra — a navbar também não tem botão.

          `Button` variante `primary`: no contexto escuro do hero, ela já
          resolve para fundo `--ctx-text` (branco) com rótulo `--ctx-bg`
          (preto), que é exatamente o retângulo branco pedido. Sem CSS novo.
        */}
        <span data-hero-fade>
          <Button href={BOOKING_URL} variant="primary" className={styles.cta}>
            Agendar agora
          </Button>
        </span>
      </div>
    </section>
  );
}
