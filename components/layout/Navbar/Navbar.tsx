import Image from "next/image";

import { LOGO } from "@/content/media";
import { NAV_ITEMS, SITE } from "@/lib/site";

import { MenuDrawer } from "./MenuDrawer";
import styles from "./Navbar.module.css";

/**
 * Navbar: logo ao centro, três links de cada lado, sem CTA.
 *
 * **Não é fixa** e sai com o scroll — por isso segue Server Component, sem
 * estado nem listener. O único pedaço interativo é o `MenuDrawer`, que é
 * client e só existe abaixo de 768px.
 *
 * Layout por breakpoint:
 *  - **≥768px:** `links | logo | links`, com o logo no centro óptico.
 *  - **<768px:** `logo | hambúrguer`. Os seis links saem da barra e vão para o
 *    drawer lateral — antes eles quebravam numa segunda linha centralizada sob
 *    o logo, que era o "texto solto" no topo da página.
 */
export function Navbar() {
  const half = NAV_ITEMS.length / 2;
  const left = NAV_ITEMS.slice(0, half);
  const right = NAV_ITEMS.slice(half);

  return (
    <header className={styles.navbar}>
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

        <MenuDrawer />
      </nav>
    </header>
  );
}
