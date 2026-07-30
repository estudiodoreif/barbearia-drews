"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { SERVICES } from "@/content/services";
import { gsap, useGSAP } from "@/lib/gsap";
import { DURATION } from "@/lib/motion";
import { formatDuration, formatPrice } from "@/lib/format";
import { BOOKING_URL } from "@/lib/site";

import styles from "./Services.module.css";

/**
 * Serviços. Referência: Referências/referencia_04.jpg.
 *
 * Preço e duração são os da agenda pública da barbearia no AppBarber — a mesma
 * tabela que o cliente vê ao agendar (ver `content/services.ts`).
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // Crossfade entre as thumbnails empilhadas. `gsap.to` em vez de transição
      // CSS porque as duas pontas (a que sai e a que entra) precisam ser
      // comandadas no mesmo frame para não haver piscada.
      gsap.to(`.${styles.thumbImage}`, {
        opacity: (i: number) => (i === active ? 1 : 0),
        duration: DURATION.fast,
        ease: "none",
        overwrite: "auto",
      });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section id="servicos" ref={root} className="section">
      <div className="container">
        <div className="section-head">
          <SectionLabel index={4}>Serviços</SectionLabel>
          <TextReveal
            as="h2"
            className="display-md bleed"
            lines={["Do primeiro corte", "ao acabamento"]}
          />
        </div>

        <div className={styles.row}>
          {/*
            A coluna do rótulo virou coluna de introdução. O statement de três
            linhas em `display-md` que ficava aqui em cima era o texto mais
            solto da página: uma manchete do tamanho de um título, sem função,
            entre o título de verdade e a tabela. Agora é texto de apoio,
            colado na tabela que ele apresenta.
          */}
          <div className={styles.intro}>
            <span className="label label-bracketed">Tabela</span>
            <p className={styles.introText}>
              Cada serviço é uma etapa do mesmo cuidado. Agende on-line ou
              chegue e espere a vez.
            </p>
            <a
              href={BOOKING_URL}
              className={styles.introCta}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar <span aria-hidden="true">→</span>
            </a>
          </div>

          <ul className={styles.list}>
            {SERVICES.map((service, i) => (
              <li key={service.name}>
                <button
                  type="button"
                  className={styles.item}
                  data-active={i === active}
                  // Hover no desktop, foco no teclado e clique no toque — os
                  // três caminhos levam ao mesmo estado.
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.itemName}>
                    <span className="index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.name}>{service.name}</span>
                  </span>
                  <span className={styles.meta}>
                    <span className={styles.duration}>
                      {formatDuration(service.duration)}
                    </span>
                    <span className={styles.price}>
                      {formatPrice(service.price)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.thumb} aria-hidden="true">
            {SERVICES.map((service) => (
              <span key={service.name} className={styles.thumbImage}>
                <Image
                  className="photo"
                  src={service.photo.src}
                  alt=""
                  width={service.photo.width}
                  height={service.photo.height}
                  sizes="20rem"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
