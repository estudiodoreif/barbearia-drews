"use client";

import Image from "next/image";
import { useRef } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { PHOTOS } from "@/content/photos";
import { STATS } from "@/content/stats";
import { BARBERS } from "@/content/services";
import { SITE } from "@/lib/site";
import { useParallax } from "@/hooks/useParallax";

import { StatValue } from "./StatValue";
import styles from "./About.module.css";

/**
 * Sobre.
 *
 * Reconstruída sobre uma característica da curadoria: **todas as fotos têm
 * fundo quase branco**, o mesmo `--color-bg-alt` (#fafaf8) desta seção. Isso
 * permite exibi-las **sem moldura nenhuma** — sem caixa, sem borda, sem
 * `background-color`, sem `aspect-ratio` recortando. O fundo da foto dissolve
 * na página e sobra o sujeito flutuando no papel.
 *
 * É o oposto da versão anterior, que era duas colunas empatadas dentro de
 * retângulos cinza — o arranjo mais previsível possível e o ponto mais fraco
 * da página.
 *
 * A composição agora trabalha em contratempo: a citação abre a seção em tipo
 * grande, a primeira foto sobe acima da linha do texto, a segunda invade a
 * calha entre as colunas, e as duas derivam em velocidades diferentes no
 * scroll. Sem moldura, é a **deriva desigual** que separa as camadas — não
 * sombra, não borda.
 */
export function About() {
  const principal = useRef<HTMLDivElement>(null);
  const secundaria = useRef<HTMLDivElement>(null);

  // Intensidades diferentes e de sinais opostos: é o descolamento entre as
  // duas que cria profundidade quando não há moldura marcando os planos.
  useParallax(principal, 16);
  useParallax(secundaria, -10);

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

        {/* 1 — Abertura em citação. A frase da vitrine é a copy mais autêntica
            da marca; aqui ela abre a seção em vez de ficar espremida numa
            coluna lateral. */}
        <figure className={styles.opening}>
          <blockquote className={styles.quote}>{SITE.motto}</blockquote>
          <figcaption className={`label ${styles.openingCaption}`}>
            Frase na vitrine da barbearia
          </figcaption>
        </figure>

        {/* 2 — Faixa de contratempo: imagem e texto se encaixam em vez de se
            enfileirar. */}
        <div className={styles.interlock}>
          <Reveal className={styles.mediaMain}>
            <div ref={principal} className={styles.drift}>
              <Image
                className="photo"
                src={PHOTOS.espelhoReflexo.src}
                alt={PHOTOS.espelhoReflexo.alt}
                width={PHOTOS.espelhoReflexo.width}
                height={PHOTOS.espelhoReflexo.height}
                sizes="(min-width: 768px) 42vw, 100vw"
              />
            </div>
          </Reveal>

          <Reveal className={styles.text}>
            <p className="body measure">
              Na DREWS, cada corte começa antes da tesoura: é entender a
              estrutura, o gesto certo, o tempo de cada cliente. Aprendemos, dia
              após dia, que o caminho do sucesso não pula etapas — ele se
              constrói com trabalho bem feito e humildade para sempre aprender
              mais.
            </p>

            <div className={styles.mediaAside}>
              <div ref={secundaria} className={styles.drift}>
                <Image
                  className="photo"
                  src={PHOTOS.clienteRisada.src}
                  alt={PHOTOS.clienteRisada.alt}
                  width={PHOTOS.clienteRisada.width}
                  height={PHOTOS.clienteRisada.height}
                  sizes="(min-width: 768px) 26vw, 60vw"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* 3 — Banda de números e barbeiros, largura total, com réguas. */}
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

      {/* 4 — Fecho em still life. Sangra pela borda direita: é clima, não
          informação, e o corte reforça isso. */}
      <div className={styles.closing} aria-hidden="true">
        <Image
          className="photo"
          src={PHOTOS.maquinaBase.src}
          alt=""
          width={PHOTOS.maquinaBase.width}
          height={PHOTOS.maquinaBase.height}
          sizes="(min-width: 768px) 22vw, 44vw"
        />
      </div>
    </section>
  );
}
