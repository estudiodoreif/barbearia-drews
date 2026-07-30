"use client";

import Image from "next/image";
import { useRef } from "react";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { GALLERY_PHOTOS } from "@/content/photos";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import styles from "./Gallery.module.css";

/*
 * As legendas numeradas sob cada foto saíram: nomeavam o óbvio ("BARBA" sob
 * uma foto de barba) e o filete de cada uma criava uma linha de base regular
 * que competia com a variação de formato da trilha.
 */

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // `matchMedia` cuida de criar e destruir os triggers ao cruzar o
      // breakpoint — no mobile a trilha é scroll nativo com snap, e pinar a
      // seção lá custa caro sem ganho.
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = track.current;
          if (!el) return;

          /*
           * A distância é lida por função, não valor fixo: as fotos ainda podem
           * estar carregando quando o trigger é criado, e `invalidateOnRefresh`
           * faz o GSAP recalcular quando a largura real muda.
           *
           * `documentElement.clientWidth` e não `window.innerWidth`: o segundo
           * inclui a barra de rolagem, então a trilha percorria alguns pixels a
           * mais do que a área visível e o último item parava meio cortado na
           * borda direita.
           */
          const distance = () =>
            el.scrollWidth - document.documentElement.clientWidth;

          gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        },
      );

      // As imagens mudam a largura da trilha ao carregar; sem este refresh o
      // fim do scroll fica calibrado numa largura menor que a real.
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.removeEventListener("load", onLoad);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section id="galeria" ref={root} className={`section ${styles.gallery}`}>
      {/* A palavra gigante "GALERIA" de fundo (`DisplayBackdrop`) saiu na
          revisão de UI: em contorno, atrás das legendas, ela não lia como
          camada de profundidade — lia como um título mal posicionado. */}
      <div className={styles.inner}>
        <div className="container">
          <div className={`section-head ${styles.head}`}>
            <SectionLabel index={3}>Galeria</SectionLabel>
            <TextReveal
              as="h2"
              className={`display-md bleed ${styles.title}`}
              lines={["O trabalho, de perto"]}
            />
          </div>
        </div>

        <div ref={track} className={styles.track} data-cursor="Arrastar">
          {GALLERY_PHOTOS.map((photo) => (
            <figure key={photo.src} className={styles.item}>
              <Image
                className="photo"
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 768px) 38vw, 68vw"
              />
            </figure>
          ))}
        </div>

        <span className={`label ${styles.hint}`}>
          Role para navegar <span aria-hidden="true">→</span>
        </span>
      </div>
    </section>
  );
}
