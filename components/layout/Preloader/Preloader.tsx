"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

import { gsap } from "@/lib/gsap";
import { EASE_GSAP } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PRELOADER_PHOTOS } from "@/content/photos";

import { useIntro } from "./IntroContext";
import styles from "./Preloader.module.css";

/**
 * Espera o que realmente importa antes de abrir: o `load` da janela e as
 * fontes. O timeout de segurança existe porque um `load` que nunca dispara
 * (imagem lenta, rede ruim) deixaria o visitante preso numa tela preta —
 * melhor abrir sem estar 100% pronto do que travar.
 */
function whenReady(timeoutMs = 4000): Promise<void> {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true }),
        );

  const fonts = document.fonts
    ? document.fonts.ready.then(() => undefined)
    : Promise.resolve();

  const safety = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));

  return Promise.race([
    Promise.all([loaded, fonts]).then(() => undefined),
    safety,
  ]);
}

/**
 * Piso de tempo da intro, em ms.
 *
 * O site carrega rápido demais para o próprio bem: o `whenReady()` resolvia
 * quase instantaneamente e a cortina subia antes de a entrada ser percebida.
 * Este piso garante que a sequência exista mesmo com cache quente.
 *
 * Somado ao fecho (0,35s de contador + 0,3s de fade + 0,9s de cortina), dá
 * ~3,3s de entrada.
 */
const MINIMUM_MS = 1800;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const [finished, setFinished] = useState(false);
  const { markDone } = useIntro();
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  // `useEffect` em vez de `useGSAP` porque a sequência tem um `await` no meio
  // (esperar o load real). O `gsap.context` criado à mão dá o mesmo cleanup e
  // continua coletando as animações criadas depois do await, via `ctx.add`.
  useEffect(() => {
    const ctx = gsap.context(() => {}, root);
    let cancelled = false;

    const finish = () => {
      setFinished(true);
      markDone();
      lenis?.start();
    };

    /*
     * A intro roda em **toda** visita.
     *
     * Havia aqui um `sessionStorage` que a pulava por completo depois da
     * primeira carga na mesma aba. Era a causa real de "o preloader malemal
     * aparece" — não a velocidade do site: numa navegação normal (recarregar,
     * voltar) ele simplesmente não existia. Aumentar a duração sem remover
     * isto não teria efeito nenhum.
     */

    // Trava o scroll enquanto a cortina está fechada.
    lenis?.stop();

    if (prefersReducedMotion) {
      ctx.add(() => {
        gsap.to(root.current, {
          autoAlpha: 0,
          duration: 0.25,
          onComplete: finish,
        });
      });
      return () => {
        cancelled = true;
        ctx.revert();
      };
    }

    const progress = { value: 0 };
    const renderCounter = () => {
      if (counter.current) {
        counter.current.textContent = `${Math.round(progress.value)}`;
      }
    };

    const startedAt = Date.now();

    const run = async () => {
      // Fase 1 — sobe até 90 enquanto a página carrega de verdade. Não vai a
      // 100 aqui: os últimos 10 pertencem ao momento em que ficou pronto,
      // senão o contador mente.
      await new Promise<void>((resolve) => {
        ctx.add(() => {
          const tl = gsap.timeline({ onComplete: resolve });

          tl.to(progress, {
            value: 90,
            duration: MINIMUM_MS / 1000,
            ease: "power1.out",
            onUpdate: renderCounter,
          }).to(
            bar.current,
            { scaleX: 0.9, duration: MINIMUM_MS / 1000, ease: "power1.out" },
            0,
          );

          // Tira de imagens passando. Um passo por quadro, em loop: o
          // `repeat: -1` mantém a tira viva mesmo se o load demorar.
          const frames = gsap.utils.toArray<HTMLElement>(`.${styles.frame}`);
          const strip = gsap.timeline({ repeat: -1 });
          frames.forEach((frame, i) => {
            strip
              .set(frames, { autoAlpha: 0 }, i * 0.14)
              .set(frame, { autoAlpha: 1 }, i * 0.14);
          });
        });
      });

      if (cancelled) return;

      /*
       * Espera o carregamento real **e** o piso de tempo, o que vier por
       * último. Com cache quente o `whenReady()` resolve na hora e é o piso
       * que segura; numa rede ruim é o inverso. `Promise.all` cobre os dois
       * casos sem `if`.
       */
      await Promise.all([
        whenReady(),
        wait(Math.max(0, MINIMUM_MS - (Date.now() - startedAt))),
      ]);
      if (cancelled) return;

      // Fase 2 — fecha o contador e sobe a cortina.
      ctx.add(() => {
        gsap
          .timeline({ onComplete: finish })
          .to(progress, {
            value: 100,
            duration: 0.35,
            ease: "none",
            onUpdate: renderCounter,
          })
          .to(bar.current, { scaleX: 1, duration: 0.35, ease: "none" }, 0)
          .to([`.${styles.footer}`, `.${styles.track}`], {
            autoAlpha: 0,
            duration: 0.3,
          })
          // A cortina sai para cima, revelando o Hero. O `onComplete` avisa o
          // IntroContext, e a entrada do Hero dispara em seguida — a leitura é
          // de um movimento só.
          .to(root.current, {
            yPercent: -100,
            duration: 0.9,
            ease: EASE_GSAP.inOut,
          }, "-=0.1");
      });
    };

    void run();

    return () => {
      cancelled = true;
      ctx.revert();
    };
    // `lenis` entra nas deps porque a instância só existe depois do primeiro
    // render do provider; sem ela o stop/start seria no-op.
  }, [lenis, markDone, prefersReducedMotion]);

  return (
    <div
      ref={root}
      className={styles.preloader}
      data-state={finished ? "done" : "running"}
      // A intro é decorativa: quem usa leitor de tela não deve ficar preso
      // ouvindo um contador de porcentagem.
      aria-hidden="true"
    >
      <span className={styles.track}>
        <span ref={bar} className={styles.bar} />
      </span>

      <div className={styles.footer}>
        <div className={styles.strip}>
          {PRELOADER_PHOTOS.map((photo) => (
            <span key={photo.src} className={styles.frame}>
              <Image
                className="photo"
                src={photo.src}
                alt=""
                width={photo.width}
                height={photo.height}
                sizes="200px"
                priority
              />
            </span>
          ))}
        </div>

        <span className={styles.counter}>
          {/*
            O `%` mora **fora** do nó que o GSAP atualiza. O `onUpdate` da
            contagem reescreve o `textContent` do `.value` a cada frame — um
            sufixo colocado dentro dele seria apagado no primeiro quadro.
          */}
          <span className={styles.readout}>
            <span ref={counter} className={styles.value}>
              0
            </span>
            <span className={styles.percent} aria-hidden="true">
              %
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
