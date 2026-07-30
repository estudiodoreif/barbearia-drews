"use client";

import Image from "next/image";
import { type RefObject, useRef } from "react";

import { TRAIL_PHOTOS } from "@/content/photos";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import styles from "./ImageTrail.module.css";

/**
 * Distância que o cursor precisa percorrer para soltar o próximo quadro.
 *
 * Limiar por **distância** e não por tempo: assim o rastro acompanha o gesto —
 * mouse rápido solta muitas imagens, mouse parado não solta nenhuma. Com
 * intervalo de tempo, um cursor imóvel continuaria empilhando quadros no mesmo
 * ponto.
 */
const STEP = 92;

/**
 * Rastro de fotos que segue o cursor no Hero.
 *
 * As imagens ficam todas montadas desde o início (`TRAIL_PHOTOS.length` nós) e
 * são recicladas por um índice circular. Criar e destruir `<img>` a cada
 * movimento causaria layout thrash e um flash em cada foto que ainda não está
 * no cache.
 *
 * Fica atrás do bloco tipográfico do Hero (ver o z-index em Hero.module.css) —
 * o rastro é atmosfera, a headline continua sendo o que se lê.
 */
export function ImageTrail({
  scope,
  enabled,
}: {
  /** Área que captura o movimento — a própria `<section>` do Hero. */
  scope: RefObject<HTMLElement | null>;
  /** Falso enquanto o preloader não terminou. */
  enabled: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  // `(pointer: fine)` e não largura de tela: o que importa é existir um cursor
  // que se move continuamente. Num tablet largo com dedo, o rastro dispararia
  // durante o scroll e viraria ruído.
  const finePointer = useMediaQuery("(pointer: fine)");

  const active = enabled && finePointer && !prefersReducedMotion;

  useGSAP(
    () => {
      if (!active || !scope.current || !root.current) return;

      const items = gsap.utils.toArray<HTMLElement>(`.${styles.item}`);
      if (!items.length) return;

      const area = scope.current;
      let index = 0;
      let lastX = 0;
      let lastY = 0;
      let primed = false;

      const show = (x: number, y: number) => {
        const el = items[index % items.length];
        index += 1;

        // `overwrite` mata a animação de saída ainda em curso neste nó — sem
        // isso, um quadro reciclado antes de sumir ficaria com duas timelines
        // brigando pela mesma opacidade.
        gsap.killTweensOf(el);

        gsap.set(el, {
          left: x,
          top: y,
          xPercent: -50,
          yPercent: -50,
          // O topo da pilha é sempre o quadro mais novo.
          zIndex: index,
          opacity: 0,
          scale: 0.86,
        });

        gsap
          .timeline()
          .to(el, { opacity: 1, scale: 1, duration: 0.36, ease: "power3.out" })
          .to(
            el,
            { opacity: 0, scale: 1.04, duration: 0.7, ease: "power2.inOut" },
            "+=0.18",
          );
      };

      const onMove = (event: PointerEvent) => {
        const rect = area.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // O primeiro evento só calibra a origem: medir distância a partir de
        // (0,0) dispararia um quadro assim que o mouse entrasse na seção,
        // mesmo sem movimento real.
        if (!primed) {
          primed = true;
          lastX = x;
          lastY = y;
          return;
        }

        if (Math.hypot(x - lastX, y - lastY) < STEP) return;

        lastX = x;
        lastY = y;
        show(x, y);
      };

      const onLeave = () => {
        primed = false;
      };

      area.addEventListener("pointermove", onMove);
      area.addEventListener("pointerleave", onLeave);

      return () => {
        area.removeEventListener("pointermove", onMove);
        area.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root, dependencies: [active] },
  );

  /*
   * Não renderiza nada onde o efeito não roda — nem os `<img>`, que no mobile
   * seriam download puro sem uso.
   *
   * `useMediaQuery` devolve `false` no servidor e avisa para não trocar markup
   * com base nele, sob pena de mismatch de hidratação. Aqui é seguro porque
   * `enabled` (o `done` do IntroContext) também começa `false` nos dois lados:
   * na hidratação o retorno é `null` em ambos, e só depois que o preloader
   * termina — muito depois — o componente passa a renderizar. Se um dia isto
   * for montado com `enabled` já `true`, o gate precisa virar um flag de
   * "montado" em vez de retorno condicional.
   */
  if (!active) return null;

  return (
    <div ref={root} className={styles.trail} aria-hidden="true">
      {TRAIL_PHOTOS.map((photo, i) => (
        <span key={photo.src} className={styles.item}>
          <Image
            className="photo"
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes="320px"
            // As primeiras aparecem nos primeiros centímetros de movimento; as
            // outras têm tempo de chegar sozinhas.
            priority={i < 4}
          />
        </span>
      ))}
    </div>
  );
}
