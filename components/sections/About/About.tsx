"use client";

import Image from "next/image";
import { useRef } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { PHOTOS } from "@/content/photos";
import { STATS } from "@/content/stats";
import { BARBERS } from "@/content/services";
import { useParallax } from "@/hooks/useParallax";

import { StatValue } from "./StatValue";
import styles from "./About.module.css";

/**
 * Sobre — três tempos empilhados: título, foto de largura total, parágrafo,
 * banda de números.
 *
 * Terceira versão da seção. As duas anteriores tentaram composições em
 * camadas (foto subindo acima da linha do texto, foto menor invadindo a calha)
 * e as duas falharam pelo mesmo motivo: **imagem sobrepondo texto**. A cada
 * ajuste de `left`/`bottom` a colisão reaparecia em outra largura de tela,
 * porque a sobreposição dependia de porcentagens que mudam com o viewport.
 *
 * Aqui não há um único `position: absolute` — a seção é uma pilha vertical, e
 * a colisão deixa de ser possível por construção, não por calibragem. O ritmo
 * vem da alternância entre largura total (a foto sangra de borda a borda) e
 * coluna estreita (o parágrafo, centrado e curto), que é o compasso de revista.
 *
 * A foto segue sem moldura: fundo claro do arquivo dissolvendo no
 * `--color-bg-alt` da seção, sem caixa nem borda. Ver content/photos.ts.
 */
export function About() {
  const media = useRef<HTMLDivElement>(null);
  useParallax(media, 10);

  return (
    <section id="sobre" className={`section ${styles.about}`} data-theme="light">
      <div className="container">
        <div className="section-head">
          <SectionLabel index={2}>Sobre</SectionLabel>
          <TextReveal
            as="h2"
            className="display-md bleed"
            lines={["Uma barbearia que", "leva o corte a sério"]}
          />
        </div>
      </div>

      {/* Fora do `.container` de propósito: a foto vai de borda a borda da
          viewport, e é esse corte que dá a escala da seção. */}
      <Reveal className={styles.mediaFull}>
        <div ref={media} className={styles.drift}>
          <Image
            className="photo"
            src={PHOTOS.maosEnquadrando.src}
            alt={PHOTOS.maosEnquadrando.alt}
            width={PHOTOS.maosEnquadrando.width}
            height={PHOTOS.maosEnquadrando.height}
            sizes="100vw"
          />
        </div>
      </Reveal>

      <div className="container">
        <Reveal className={styles.textBlock}>
          <p className={`body ${styles.text}`}>
            Na DREWS, cada corte começa antes da tesoura: é entender a
            estrutura, o gesto certo, o tempo de cada cliente. Aprendemos, dia
            após dia, que o caminho do sucesso não pula etapas — ele se constrói
            com trabalho bem feito e humildade para sempre aprender mais.
          </p>
        </Reveal>

        <div className={styles.band}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.cell}>
              <span className={styles.statValue}>
                <StatValue stat={stat} />
              </span>
              <span className="label">{stat.label}</span>
            </div>
          ))}

          {BARBERS.map((barber) => (
            <div key={barber.handle} className={styles.cell}>
              <a
                href={barber.url}
                className={styles.barber}
                target="_blank"
                rel="noopener noreferrer"
              >
                {barber.name}
              </a>
              <span className="label">{barber.handle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
