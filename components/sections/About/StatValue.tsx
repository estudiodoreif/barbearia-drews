"use client";

import { useRef } from "react";

import type { Stat } from "@/content/stats";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Formata no padrão pt-BR: a nota do Google é `4,9`, com vírgula, não `4.9`.
 * Sem `decimals` o valor sai inteiro (o total de avaliações).
 */
function format(value: number, stat: Stat) {
  const decimals = stat.decimals ?? 0;
  return `${stat.prefix ?? ""}${value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Big number com contagem animada ao entrar na viewport.
 *
 * O caminho de `[PENDENTE]` saiu daqui junto com o `PendingValue`: os dois
 * números agora são dados reais do perfil no Google, então sempre há o que
 * contar.
 */
export function StatValue({ stat }: { stat: Stat }) {
  const el = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !el.current) return;

      const counter = { value: 0 };

      gsap.to(counter, {
        value: stat.value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (el.current) {
            el.current.textContent = format(counter.value, stat);
          }
        },
        scrollTrigger: { trigger: el.current, start: "top 85%", once: true },
      });
    },
    { dependencies: [prefersReducedMotion, stat] },
  );

  // O valor final já vem no HTML do servidor: se o JS falhar ou o
  // ScrollTrigger não calibrar, o número certo aparece do mesmo jeito.
  return <span ref={el}>{format(stat.value, stat)}</span>;
}
