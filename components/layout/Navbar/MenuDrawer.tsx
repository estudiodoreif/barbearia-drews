"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

import {
  BOOKING_URL,
  NAV_ITEMS,
  PHONE_DISPLAY,
  TEL_URL,
  WHATSAPP_URL,
} from "@/lib/site";

import styles from "./MenuDrawer.module.css";

/**
 * Menu mobile em drawer lateral.
 *
 * No mobile os seis links da navbar não cabem numa linha: quebravam numa
 * segunda linha centralizada sob o logo e liam como texto solto. Aqui eles
 * saem do fluxo e vão para um painel que desliza da direita.
 *
 * Só existe abaixo de 768px — o CSS esconde o botão no desktop, onde a navbar
 * horizontal continua igual. Por isso não há `useMediaQuery` aqui: quem decide
 * é o CSS, e duplicar o breakpoint em JS criaria duas fontes de verdade.
 */
export function MenuDrawer() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  const close = useCallback(() => setOpen(false), []);

  /*
   * Trava o scroll pelo Lenis, não por `overflow: hidden` no body.
   *
   * O Lenis controla a posição do scroll por transform; um `overflow: hidden`
   * no body não o impede de continuar rolando por trás do painel. `stop()` é
   * o único jeito que funciona com a ponte do SmoothScroll.
   */
  useEffect(() => {
    if (!lenis) return;

    if (open) lenis.stop();
    else lenis.start();

    return () => lenis.start();
  }, [lenis, open]);

  /* Esc fecha e o foco volta para o botão — senão o foco fica órfão no <body>. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        toggle.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel.current) return;

      // Prende o Tab dentro do painel: sem isto o foco sai para a página
      // atrás, que está visualmente coberta.
      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  /* Move o foco para dentro do painel assim que ele abre. */
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a[href], button")?.focus();
  }, [open]);

  /*
   * O deslize do painel e o fade do overlay são CSS (`transition` acionada por
   * `data-open`), não GSAP.
   *
   * A primeira versão animava com `useGSAP`, e o painel simplesmente não
   * entrava: o tween de abertura não vencia o transform que o tween de
   * fechamento havia deixado inline, e o painel ficava travado em
   * `translateX(100%)`. Um drawer é um estado binário — não precisa de
   * timeline, scrub nem ScrollTrigger, que é para o que o GSAP existe neste
   * projeto. Em CSS o estado é declarativo e `prefers-reduced-motion` é uma
   * media query, sem hook.
   */

  return (
    <>
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="menu-drawer"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {/* Duas barras, não três: o traço miúdo do referencia_01, coerente
            com o resto da navbar, que é toda tipografia fina. */}
        <span className={styles.bar} aria-hidden="true" />
        <span className={styles.bar} aria-hidden="true" />
      </button>

      <div
        className={styles.overlay}
        data-open={open}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panel}
        id="menu-drawer"
        className={styles.panel}
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        // `inert` tira o painel fechado da ordem de tabulação e do leitor de
        // tela sem depender de `display: none`, que mataria a animação.
        inert={!open}
      >
        <div className={styles.panelHead}>
          <span className="label label-bracketed">Menu</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => {
              close();
              toggle.current?.focus();
            }}
            aria-label="Fechar menu"
          >
            Fechar
          </button>
        </div>

        <nav className={styles.links} aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.link}
              onClick={close}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.panelFoot}>
          <a href={TEL_URL} className={styles.phone} onClick={close}>
            {PHONE_DISPLAY}
          </a>

          <div className={styles.actions}>
            <a
              href={BOOKING_URL}
              className={styles.booking}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              Agendar <span aria-hidden="true">→</span>
            </a>
            <a
              href={WHATSAPP_URL}
              className={styles.whats}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
