"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query reativa em JS, para decidir em código o que o CSS não resolve
 * (ex.: não animar quando o usuário pediu menos movimento, escalar valores de
 * GSAP por breakpoint).
 *
 * Implementado com `useSyncExternalStore` e não com useState+useEffect: uma
 * media query é literalmente um "external store", e ler o valor inicial dentro
 * de um efeito provoca um render em cascata — o que o lint do React Compiler
 * corretamente reclama.
 *
 * No servidor não há como saber a resposta, então `getServerSnapshot` devolve
 * `false`. Consumidores devem tratar isso como "ligue a animação e desligue se
 * virar true", não como troca de markup, para não causar mismatch de hidratação.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Breakpoints alinhados aos media queries de app/styles/tokens.css. */
export const BREAKPOINT = {
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
} as const;
