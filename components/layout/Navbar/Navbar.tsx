"use client";

import Image from "next/image";
import { useState } from "react";

import { LOGO } from "@/content/media";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { useScrollDirection } from "@/hooks/useScrollDirection";

import { MenuDrawer } from "./MenuDrawer";
import styles from "./Navbar.module.css";

/**
 * Navbar: logo ao centro, três links de cada lado, sem CTA.
 *
 * **Fixa, com reveal por direção de scroll.** Antes ela ficava no fluxo e saía
 * com a página, o que deixava a navegação inacessível depois da primeira
 * dobra num site de sete seções. Agora: some ao descer, volta ao subir.
 *
 * Ela fica visível quando qualquer uma destas for verdade:
 *  - o último gesto significativo foi para cima;
 *  - o scroll está na faixa inicial da página;
 *  - o menu mobile está aberto — daí o estado morar aqui e não dentro do
 *    `MenuDrawer`: com a barra escondida, o painel abriria sem o botão de
 *    fechar.
 *
 * O deslocamento é `transform` com `transition` CSS, não GSAP: estado binário
 * é CSS neste projeto (ver CLAUDE.md — a regra nasceu do bug em que os dois
 * disputavam a mesma propriedade e o drawer travava fora da tela).
 *
 * Layout por breakpoint:
 *  - **≥768px:** `links | logo | links`, com o logo no centro óptico.
 *  - **<768px:** `logo | hambúrguer`, e os seis links vão para o drawer.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { up, atTop } = useScrollDirection();

  const half = NAV_ITEMS.length / 2;
  const left = NAV_ITEMS.slice(0, half);
  const right = NAV_ITEMS.slice(half);

  const visible = up || atTop || menuOpen;

  return (
    <header
      className={styles.navbar}
      data-visible={visible}
      data-at-top={atTop}
    >
      <nav
        className={`container ${styles.inner}`}
        aria-label="Navegação principal"
      >
        <div className={`${styles.group} ${styles.groupLeft}`}>
          {left.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#inicio"
          className={styles.logo}
          aria-label={`${SITE.name} — início`}
        >
          <Image
            src={LOGO.light}
            alt={SITE.name}
            width={LOGO.width}
            height={LOGO.height}
            priority
          />
        </a>

        <div className={`${styles.group} ${styles.groupRight}`}>
          {right.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </div>

        <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} />
      </nav>
    </header>
  );
}
