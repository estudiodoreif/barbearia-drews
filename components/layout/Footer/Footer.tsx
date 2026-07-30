import { Fragment } from "react";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import {
  BOOKING_URL,
  OPENING_HOURS_SUMMARY,
  PHONE_DISPLAY,
  SITE,
  SOCIALS,
  TEL_URL,
  WHATSAPP_URL,
} from "@/lib/site";

import styles from "./Footer.module.css";

/**
 * Rodapé. Absorveu a antiga seção Contato — o `id="contato"` está aqui, e é
 * para onde a navbar aponta.
 *
 * Enxugado na revisão de UI. Saíram três coisas que o inchavam:
 *  - o **wordmark gótico gigante** cortado na base: era a maior mancha da
 *    página inteira e puramente decorativa;
 *  - o **marquee** com a frase da vitrine, que já corre no Hero — a mesma
 *    animação duas vezes na mesma página;
 *  - o **sitemap de quatro colunas com réguas verticais**, que num one-page
 *    só repetia a navbar.
 *
 * Sobrou o que o rodapé de um negócio local precisa ter: a chamada para
 * agendar, o telefone, onde fica e quando abre.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className={styles.footer}>
      <div className="container">
        <div className={styles.cta}>
          <SectionLabel>Contato</SectionLabel>

          <a
            href={BOOKING_URL}
            className={`${styles.ctaLink} bleed`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TextReveal
              lines={[
                "Agende",
                // `Fragment` com key, e não `<>…</>`: o React valida keys no
                // array literal aqui, antes de o TextReveal receber a prop.
                <Fragment key="linha-2">
                  seu horário <span className={styles.arrow}>→</span>
                </Fragment>,
              ]}
            />
          </a>

          <div className={styles.ctaMeta}>
            <span className={styles.phoneBlock}>
              <span className="label label-bracketed">Telefone</span>
              <a href={TEL_URL} className={styles.phone}>
                {PHONE_DISPLAY}
              </a>
            </span>

            <span className={styles.whatsBlock}>
              <span className="label label-bracketed">WhatsApp</span>
              <a
                href={WHATSAPP_URL}
                className={styles.whatsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar agora <span aria-hidden="true">→</span>
              </a>
            </span>
          </div>
        </div>

        {/* Endereço, horário e redes numa faixa só, sem réguas verticais */}
        <div className={styles.info}>
          <address className={styles.address}>
            {SITE.street}
            <br />
            {SITE.neighborhood} · {SITE.city}/{SITE.state}
          </address>

          <span className={styles.hours}>{OPENING_HOURS_SUMMARY}</span>

          <span className={styles.socials}>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className={styles.social}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            ))}
          </span>
        </div>

        <div className={`label ${styles.bottom}`}>
          <span>
            © {year} {SITE.legalName}
          </span>
          <span>Estúdio do Reif</span>
        </div>
      </div>
    </footer>
  );
}
