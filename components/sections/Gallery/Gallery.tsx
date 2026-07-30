"use client";

import Image from "next/image";
import { useRef } from "react";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { GALLERY_PHOTOS } from "@/content/photos";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import styles from "./Gallery.module.css";

/**
 * Legendas da trilha, na ordem de `GALLERY_PHOTOS`.
 *
 * Ficam aqui e não em `photos.ts` porque são específicas desta seção — a mesma
 * foto aparece no rastro do Hero sem legenda nenhuma.
 */
const CAPTIONS = [
  "Espelho",
  "Enquadramento",
  "Retrato",
  "Contorno",
  "Cadeira",
  "Barba",
  "Navalha",
  "Dreads",
  "Degradê",
  "Nuca",
  "Reflexo",
];

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

          // A distância é lida por função, não valor fixo: as fotos ainda podem
          // estar carregando quando o trigger é criado, e `invalidateOnRefresh`
          // faz o GSAP recalcular quando a largura real muda.
          const distance = () => el.scrollWidth - window.innerWidth;

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
              className="display-md bleed"
              lines={["O trabalho,", "de perto"]}
            />
          </div>
        </div>

        <div ref={track} className={styles.track} data-cursor="Arrastar">
          {GALLERY_PHOTOS.map((photo, i) => (
            <figure key={photo.src} className={styles.item}>
              <div className={styles.frame}>
                <Image
                  className="photo"
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 768px) 38vw, 68vw"
                />
              </div>

              <figcaption className={styles.caption}>
                <span className="index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="label">{CAPTIONS[i]}</span>
              </figcaption>
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
