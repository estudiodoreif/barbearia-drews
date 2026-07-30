import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { PRODUCTS } from "@/content/products";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_URL } from "@/lib/site";

import styles from "./Store.module.css";

/**
 * Loja: uma linha de quatro peças, cada card com o mockup do produto ao fundo.
 *
 * O card mudou duas vezes. Era foto de banco em `cover` (produto de outra
 * marca sangrando até a borda, com cara de estoque); virou SVG desenhado dentro
 * de uma caixa cinza; agora é o **mockup real** com o wordmark DREWS ocupando
 * o card inteiro como fundo, e toda a informação por cima dele.
 *
 * A legenda funciona sem scrim porque os mockups são pretos sobre fundo
 * branco, mas o gradiente da base entra assim mesmo — é o seguro para quando
 * uma peça escura chegar perto do rodapé do card.
 *
 * ⚠️ Os preços seguem PROVISÓRIOS: a DREWS não vende produtos hoje e esta
 * seção é proposta comercial ao cliente. Ver `content/products.ts`.
 */
export function Store() {
  return (
    <section id="loja" className="section" data-theme="light">
      <div className="container">
        <div className="section-head">
          <SectionLabel index={5}>Loja</SectionLabel>
          {/* Uma linha só. No mobile o CSS permite a quebra natural. */}
          <TextReveal
            as="h2"
            className={`display-md bleed ${styles.title}`}
            lines={["Vista a casa"]}
          />
        </div>

        <Reveal className={styles.grid} stagger={0.06}>
          {PRODUCTS.map((product) => (
            <article
              key={product.image}
              className={styles.card}
              data-cursor="Ver"
            >
              <Image
                // `photo` é o que força o P&B; a camiseta opta por sair dele.
                className={`${product.grayscale === false ? "" : "photo"} ${styles.image}`}
                src={product.image}
                alt={product.alt}
                width={product.width}
                height={product.height}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />

              <div className={styles.info}>
                <span className={styles.foot}>
                  <span className={styles.name}>{product.name}</span>
                  <span className={styles.price}>
                    {formatPrice(product.price)}
                  </span>
                </span>
              </div>
            </article>
          ))}
        </Reveal>

        {/*
          Um CTA para a seção, não um por card: a Loja é vitrine informativa,
          e oito botões "Consultar" idênticos empilhados diziam a mesma coisa
          oito vezes.
        */}
        <div className={styles.footer}>
          <span className="label label-bracketed">Disponível na barbearia</span>
          <a
            href={WHATSAPP_URL}
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar disponibilidade <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
