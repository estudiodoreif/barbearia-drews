"use client";

import { useMediaQuery } from "./useMediaQuery";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `true` quando o usuário pediu menos movimento no sistema.
 *
 * Com quatro bibliotecas de animação no projeto (GSAP, Motion, Lenis, Three),
 * esta é a chave única que desliga todas — cada componente animado deve
 * consultá-la. O CSS tem sua própria rede de segurança em app/styles/reset.css,
 * mas ela não alcança animação feita em JS.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(QUERY);
}
