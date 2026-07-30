/**
 * Tokens de motion espelhando DESIGN.md §10, em JS.
 *
 * Existe para que GSAP e Motion usem exatamente os mesmos tempos e curvas que
 * o CSS em app/styles/tokens.css — se as durações divergirem entre as libs, o
 * site parece feito por duas pessoas diferentes.
 */

export const DURATION = {
  instant: 0.12,
  fast: 0.24,
  base: 0.6,
  slow: 1,
} as const;

/** Mesmas curvas de tokens.css, no formato de array que GSAP/Motion aceitam. */
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.76, 0, 0.24, 1],
} as const;

/** Equivalente em string para o GSAP (`ease: EASE_GSAP.out`). */
export const EASE_GSAP = {
  out: "power3.out",
  inOut: "power2.inOut",
} as const;

/**
 * Reveal padrão de entrada — o "fade-in / slide-up leve" que DESIGN.md §10
 * define como o vocabulário de motion do site. Para uso com Motion
 * (`motion/react`) em componentes; o equivalente por scroll é feito em GSAP.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
} as const;

/** Escalona os filhos de um container em sequência. */
export const stagger = (amount = 0.08) =>
  ({
    hidden: {},
    visible: {
      transition: { staggerChildren: amount },
    },
  }) as const;
