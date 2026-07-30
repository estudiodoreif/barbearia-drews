"use client";

import { useSyncExternalStore } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import {
  AMENITIES,
  DIRECTIONS_URL,
  MAP_EMBED_URL,
  OPENING_HOURS,
  PHONE_DISPLAY,
  SITE,
  TEL_URL,
} from "@/lib/site";

import styles from "./Location.module.css";

/*
 * O dia da semana vem do relógio do visitante, não do servidor: o build roda em
 * UTC e marcaria o dia errado para quem acessa à noite no horário de Brasília.
 *
 * `useSyncExternalStore` em vez de `useState` + `useEffect` porque é
 * exatamente o caso que ele resolve — ler um valor que existe fora do React e
 * difere entre servidor e cliente, sem provocar render em cascata. O snapshot
 * de servidor é `null`, então o HTML sai sem realce nenhum e a hidratação o
 * acrescenta. Pior caso: a tabela aparece sem destaque, nunca com o destaque no
 * dia errado.
 *
 * `subscribe` devolve um no-op: o dia não muda durante uma visita, e um
 * listener de meia-noite não paga o próprio custo.
 */
const subscribeNoop = () => () => {};
const getWeekday = () => new Date().getDay();
const getServerWeekday = () => null;

/**
 * Localização e horário.
 *
 * Endereço, horários e coordenadas são reais (Google Maps, 30/07/2026), então
 * a moldura de mapa vazia que existia aqui deu lugar ao mapa de verdade — era
 * o retângulo tracejado de 420px que mais denunciava wireframe na página.
 */
export function Location() {
  const today = useSyncExternalStore(
    subscribeNoop,
    getWeekday,
    getServerWeekday,
  );

  return (
    <section id="localizacao" className="section" data-theme="light">
      <div className="container">
        <div className="section-head">
          <SectionLabel index={6}>Onde estamos</SectionLabel>
          <TextReveal
            as="h2"
            className="display-md bleed"
            lines={["Passe na", "barbearia"]}
          />
        </div>

        <div className={styles.layout}>
          <Reveal className={styles.details} stagger={0.07}>
            <div className={styles.block}>
              <span className="label label-bracketed">Endereço</span>
              <address className={styles.address}>
                {SITE.street}
                <br />
                {SITE.neighborhood}
                <br />
                {SITE.city} — {SITE.state}
              </address>
              <a
                href={DIRECTIONS_URL}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Como chegar <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className={styles.block}>
              <span className="label label-bracketed">Telefone</span>
              <a href={TEL_URL} className={styles.phone}>
                {PHONE_DISPLAY}
              </a>
            </div>

            <div className={styles.block}>
              <span className="label label-bracketed">Comodidades</span>
              <span className={styles.amenities}>{AMENITIES.join(" · ")}</span>
            </div>
          </Reveal>

          <div className={styles.hours}>
            <span className={`label label-bracketed ${styles.hoursTitle}`}>
              Horário
            </span>

            <dl className={styles.hoursList}>
              {OPENING_HOURS.map((day) => (
                <div
                  key={day.weekday}
                  className={styles.day}
                  data-today={today === day.weekday}
                >
                  <dt className={styles.dayLabel}>{day.label}</dt>
                  <dd className={styles.dayValue}>
                    {day.ranges.length ? (
                      day.ranges.join(" · ")
                    ) : (
                      <span className={styles.closed}>Fechado</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={styles.map}>
          <iframe
            src={MAP_EMBED_URL}
            title={`Mapa com a localização da ${SITE.legalName}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
