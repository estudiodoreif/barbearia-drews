import styles from "./SectionLabel.module.css";

type SectionLabelProps = {
  /** Nome da seção, ex. "Serviços". Vai para caixa alta via CSS. */
  children: string;
  /** Número da seção. Formatado com zero à esquerda: 2 → "02". */
  index?: number;
};

/**
 * Eyebrow de seção: `01 [ SOBRE ]`.
 *
 * O numeral dá o ritmo editorial de DESIGN.md §6 e os colchetes vêm de
 * `.label-bracketed` — ambos são decoração, então ficam fora do fluxo de
 * leitura: um leitor de tela anunciaria "zero um abre colchete Sobre fecha
 * colchete" sem o `aria-hidden` no numeral e sem os colchetes em pseudo.
 */
export function SectionLabel({ children, index }: SectionLabelProps) {
  return (
    <span className={`label ${styles.label}`}>
      {index !== undefined && (
        <span className={styles.index} aria-hidden="true">
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span className="label-bracketed">{children}</span>
    </span>
  );
}
