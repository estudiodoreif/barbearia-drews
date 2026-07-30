"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";

/**
 * Distância mínima, em pixels, antes de trocar a direção.
 *
 * Sem isso, o micro-tremor de um trackpad (ou o bounce do Lenis ao parar) faz
 * a barra piscar entre esconder e aparecer. 8px é o suficiente para exigir um
 * gesto de verdade.
 */
const THRESHOLD = 8;

/** Acima disso o topo deixa de ser "topo" e a barra volta a poder sumir. */
const TOP_ZONE = 80;

export type ScrollState = {
  /** `true` quando o último gesto significativo foi para cima. */
  up: boolean;
  /** `true` enquanto o scroll está na faixa inicial da página. */
  atTop: boolean;
};

/**
 * Direção do scroll, para a navbar que some ao descer e volta ao subir.
 *
 * Lê do **Lenis**, não do `window.scrollY`. O Lenis interpola a posição e é ele
 * quem manda no scroll deste site (ver `components/layout/SmoothScroll/`); o
 * valor nativo chega defasado de um ou mais frames, e a barra reagiria com
 * atraso visível ao gesto.
 *
 * `useSyncExternalStore` porque é exatamente isto: um valor que vive fora do
 * React e muda por evento. O snapshot de servidor devolve o estado de topo, que
 * é como a página sempre começa — sem mismatch de hidratação.
 */
export function useScrollDirection(): ScrollState {
  // Guardado em ref e não em estado: o valor é reescrito a cada evento de
  // scroll e não deve, por si, provocar render — quem decide isso é o
  // `useSyncExternalStore` comparando o snapshot.
  const state = useRef<ScrollState>({ up: true, atTop: true });
  const lastY = useRef(0);

  const lenis = useLenis();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!lenis) return () => {};

      const onScroll = ({ scroll }: { scroll: number }) => {
        const y = Math.max(0, scroll);
        const atTop = y < TOP_ZONE;
        const delta = y - lastY.current;

        let up = state.current.up;
        if (Math.abs(delta) >= THRESHOLD) {
          up = delta < 0;
          lastY.current = y;
        }

        if (up === state.current.up && atTop === state.current.atTop) return;

        // Objeto novo a cada mudança real: `useSyncExternalStore` compara por
        // identidade, então mutar o anterior passaria despercebido.
        state.current = { up, atTop };
        onStoreChange();
      };

      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    },
    [lenis],
  );

  return useSyncExternalStore(
    subscribe,
    () => state.current,
    () => state.current,
  );
}
