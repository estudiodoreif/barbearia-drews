"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type IntroValue = {
  /** `true` quando o preloader terminou de sair (ou nunca precisou rodar). */
  done: boolean;
  markDone: () => void;
};

const IntroContext = createContext<IntroValue>({
  done: true,
  markDone: () => {},
});

/**
 * Liga o fim do preloader ao início da animação do Hero.
 *
 * O Hero não pode animar por `ScrollTrigger` — ele já está visível no topo da
 * página, sem scroll envolvido. Ele precisa esperar exatamente o momento em que
 * os painéis do preloader saem, para a sequência ler como um movimento só em
 * vez de duas animações concorrentes. Este contexto é esse sinal.
 *
 * O default é `done: true` para que qualquer componente usado fora do provider
 * (ou numa página futura sem preloader) anime normalmente em vez de ficar
 * invisível para sempre.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);

  const markDone = useCallback(() => setDone(true), []);

  const value = useMemo(() => ({ done, markDone }), [done, markDone]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
