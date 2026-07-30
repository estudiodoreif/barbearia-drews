"use client";

import { useEffect, useState } from "react";

const FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

/**
 * Relógio ao vivo no fuso da barbearia (BUILD_PROMPT §7).
 *
 * Começa em `null` e só preenche no efeito: renderizar a hora no servidor
 * garantiria mismatch de hidratação, porque o servidor e o navegador nunca
 * marcam o mesmo minuto. O placeholder tem a mesma largura do valor final
 * (tabular-nums no CSS) para não empurrar o layout ao trocar.
 */
export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(FORMATTER.format(new Date()));
    tick();

    // Alinha o primeiro tick com a virada do minuto, em vez de contar 60s a
    // partir do mount — senão o relógio fica até 59s atrasado.
    const msToNextMinute = 60_000 - (Date.now() % 60_000);
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <span>
      Santa Catarina{" "}
      <time suppressHydrationWarning>{time ?? "--:--"}</time>
    </span>
  );
}
