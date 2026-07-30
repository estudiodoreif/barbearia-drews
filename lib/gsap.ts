"use client";

/**
 * Único ponto de registro de plugins do GSAP no projeto.
 *
 * Registrar o mesmo plugin em vários módulos é inofensivo mas mascara de onde
 * vem cada dependência. Todo componente animado importa gsap daqui:
 *
 *   import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
 *
 * `useGSAP` (de @gsap/react) é preferível a useEffect: ele faz o revert
 * automático das animações no cleanup, o que é o que evita animação duplicada
 * no duplo-mount do React em dev/StrictMode.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };
