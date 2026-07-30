"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import styles from "./Cursor.module.css";

/**
 * Rótulo que o anel exibe sobre certas áreas. Um elemento entra no mapa pelo
 * atributo `data-cursor` no HTML — assim a seção declara o próprio rótulo e
 * este componente não precisa conhecer seletor de nenhuma delas.
 */
type CursorState = "default" | "link" | "label";

/**
 * Cursor personalizado: um ponto que gruda no mouse e um anel que chega
 * atrasado.
 *
 * O descompasso entre os dois é o efeito — um cursor de peça única fica ou
 * grudado (e some a leitura de peso) ou lerdo (e atrapalha a mira). Feito com
 * `gsap.quickTo`, que existe exatamente para atualizar a mesma propriedade em
 * alta frequência sem instanciar um tween por evento de mouse.
 *
 * **Segurança antes de estética:** `cursor: none` é aplicado ao documento por
 * este componente, em efeito, e removido no cleanup. Se ele não montar (JS
 * quebrado, navegador antigo, toque), o cursor nativo continua lá. A regra
 * nunca vai para o CSS global justamente por isso — uma página sem cursor
 * nenhum é uma página inutilizável.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");

  /*
   * `useMediaQuery` é `useSyncExternalStore` por baixo, e é seguro decidir
   * markup por ele: React usa o snapshot de servidor (`false`) durante a
   * hidratação e só então re-renderiza com o valor real do cliente. Ou seja,
   * servidor e primeira passada do cliente concordam em "não renderiza", e o
   * cursor entra num render seguinte — sem mismatch e sem precisar de um flag
   * `mounted` guardado em estado.
   */
  const finePointer = useMediaQuery("(pointer: fine)");
  const prefersReducedMotion = usePrefersReducedMotion();

  const active = finePointer;

  /* Esconde o cursor nativo só enquanto este componente está vivo e ativo. */
  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add(styles.hideNative);
    return () => document.documentElement.classList.remove(styles.hideNative);
  }, [active]);

  useGSAP(
    () => {
      if (!active || !dot.current || !ring.current) return;

      // O ponto acompanha praticamente sem atraso; o anel arrasta. Em
      // `prefers-reduced-motion` os dois andam juntos — o efeito perde a
      // inércia mas o cursor continua existindo, que é o que importa.
      const lag = prefersReducedMotion ? 0.01 : 0.42;

      const dotX = gsap.quickTo(dot.current, "x", { duration: 0.06, ease: "none" });
      const dotY = gsap.quickTo(dot.current, "y", { duration: 0.06, ease: "none" });
      const ringX = gsap.quickTo(ring.current, "x", { duration: lag, ease: "power3.out" });
      const ringY = gsap.quickTo(ring.current, "y", { duration: lag, ease: "power3.out" });

      let visible = false;

      const onMove = (event: PointerEvent) => {
        if (!visible) {
          visible = true;
          gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
          // Posiciona sem animar na primeira leitura: senão o cursor "voa"
          // do canto superior esquerdo até o mouse.
          gsap.set([dot.current, ring.current], {
            x: event.clientX,
            y: event.clientY,
          });
        }

        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);

        // O estado vem do elemento sob o ponteiro. `closest` sobe a árvore,
        // então um <span> dentro de um <a> também conta como link.
        const target = event.target as Element | null;
        const labelled = target?.closest?.<HTMLElement>("[data-cursor]");

        if (labelled) {
          setState("label");
          setLabel(labelled.dataset.cursor ?? "");
          return;
        }

        setState(
          target?.closest?.('a, button, [role="button"]') ? "link" : "default",
        );
      };

      const onLeave = () => {
        visible = false;
        gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
      };

      const onDown = () => ring.current?.setAttribute("data-pressed", "true");
      const onUp = () => ring.current?.removeAttribute("data-pressed");

      window.addEventListener("pointermove", onMove);
      // `documentElement` e não `document`: `pointerleave` não borbulha e
      // precisa de um Element real para disparar ao sair da janela.
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
      };
    },
    { dependencies: [active, prefersReducedMotion] },
  );

  if (!active) return null;

  return (
    <div className={styles.cursor} data-state={state} aria-hidden="true">
      <div ref={dot} className={styles.dot} />
      <div ref={ring} className={styles.ring}>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
