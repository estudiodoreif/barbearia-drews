/**
 * Dados do negócio. Fonte de verdade: CONTENT.md.
 *
 * Tudo aqui é dado real, levantado em 30/07/2026 no perfil do Google Maps, no
 * Instagram @drewsbarbearia e no sistema de agendamento próprio da barbearia
 * (AppBarber). Nada é inventado — ver CONTENT.md para a fonte campo a campo.
 *
 * O andaime `Confirmed<T>`/`PendingValue` que existia aqui saiu junto com os
 * `[PENDENTE]`: com todo campo confirmado, ele só sobrava.
 */

/** Telefone confirmado (fachada da loja e Google Maps). Formato de exibição. */
export const PHONE_DISPLAY = "(47) 99110-6535";

/** Mesmo telefone em E.164 sem símbolos, como o wa.me exige. */
const PHONE_E164 = "5547991106535";

/** Formato internacional com `+`, exigido pelo `telephone` do schema.org. */
export const PHONE_INTL = `+${PHONE_E164}`;

/**
 * Mensagem pré-preenchida do WhatsApp. Encurta o caminho até o agendamento:
 * o cliente não precisa pensar no que escrever.
 */
const WHATSAPP_MESSAGE = "Olá! Gostaria de agendar um horário na DREWS.";

export const WHATSAPP_URL = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export const TEL_URL = `tel:+${PHONE_E164}`;

/**
 * Canal de agendamento **real**: a barbearia usa AppBarber, com agenda por
 * barbeiro e horário.
 *
 * Antes isto apontava para o WhatsApp porque o sistema ainda não era conhecido
 * — mandar para o WhatsApp quem já podia escolher o horário sozinho só criava
 * trabalho manual para a barbearia. O WhatsApp segue como canal de contato
 * (dúvida, orçamento), não de agenda. A bio do Instagram confirma que também
 * há atendimento por ordem de chegada.
 */
export const BOOKING_URL = "https://sites.appbarber.com.br/barbeariadrews-4nxn";

export const INSTAGRAM_URL = "https://www.instagram.com/drewsbarbearia/";
export const FACEBOOK_URL = "https://www.facebook.com/drewsbarbearia/";

/** Coordenadas do ponto no Google Maps — usadas no embed e no JSON-LD. */
export const GEO = { lat: -26.488047, lng: -49.0397873 } as const;

/** Link de rota (abre o app de mapas no celular). */
export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(
    "Barbearia Drews, R. José Theodoro Ribeiro, 3329, Jaraguá do Sul - SC",
  );

/**
 * Embed do mapa. Usa o modo `q=` do Google Maps, que não exige chave de API —
 * o Embed API oficial pediria uma key exposta no cliente para o mesmo
 * resultado visual.
 */
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${GEO.lat},${GEO.lng}&z=17&output=embed&hl=pt-BR`;

/** Avaliação pública no Google (30/07/2026). Não editar sem reconferir. */
export const RATING = { value: 4.9, count: 73 } as const;

export const SITE = {
  name: "DREWS",
  legalName: "Barbearia Drews",
  /** Frase exposta na vitrine — o elemento de marca mais autêntico que existe. */
  motto: "No caminho do sucesso, a humildade é a bússola que nos guia.",
  phone: PHONE_DISPLAY,
  street: "R. José Theodoro Ribeiro, 3329",
  neighborhood: "Ilha da Figueira",
  city: "Jaraguá do Sul",
  state: "SC",
  postalCode: "89258-468",
  /** Endereço numa linha, para metadata e JSON-LD. */
  addressLine:
    "R. José Theodoro Ribeiro, 3329 — Ilha da Figueira, Jaraguá do Sul — SC",
  /** Domínio ainda não contratado; atualizar quando o cliente confirmar. */
  url: "https://barbeariadrews.com.br",
} as const;

/**
 * Horário de funcionamento, dia a dia (Google Maps, 30/07/2026).
 *
 * `ranges` é array porque segunda e sábado fecham para almoço — modelar como
 * string única obrigaria a seção Localização a fazer parsing só para destacar
 * o dia de hoje.
 *
 * `weekday` segue `Date.getDay()` (0 = domingo), o que permite marcar o dia
 * atual sem tabela de conversão. A ordem do array é a de leitura (segunda
 * primeiro), não a numérica.
 */
export type OpeningHours = {
  weekday: number;
  label: string;
  /** Vazio = fechado. */
  ranges: readonly string[];
};

export const OPENING_HOURS: readonly OpeningHours[] = [
  { weekday: 1, label: "Segunda", ranges: ["09:00–12:00", "13:00–20:00"] },
  { weekday: 2, label: "Terça", ranges: ["09:00–20:00"] },
  { weekday: 3, label: "Quarta", ranges: ["09:00–20:00"] },
  { weekday: 4, label: "Quinta", ranges: ["09:00–20:00"] },
  { weekday: 5, label: "Sexta", ranges: ["07:00–21:00"] },
  { weekday: 6, label: "Sábado", ranges: ["07:00–12:00", "13:30–19:00"] },
  { weekday: 0, label: "Domingo", ranges: [] },
];

/** Resumo de uma linha, para o rodapé e a metadata. */
export const OPENING_HOURS_SUMMARY =
  "Seg a sex 09h–20h · Sáb 07h–19h · Dom fechado";

/** Comodidades listadas no perfil do Google e no AppBarber. */
export const AMENITIES = [
  "Wi-Fi",
  "Estacionamento",
  "Acessibilidade",
  "Atende crianças",
] as const;

export const SOCIALS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "Facebook", href: FACEBOOK_URL },
];

/**
 * Navegação. Os `href` são âncoras da one-page; o Lenis intercepta e rola
 * suave (ver options.anchors em SmoothScroll).
 *
 * São exatamente **seis** itens porque a navbar os divide em 3 à esquerda e 3
 * à direita do logo centralizado. Ao adicionar ou remover um item, manter o
 * total par — senão os dois lados desequilibram e o logo sai do centro.
 * (No mobile a navbar vira logo + hambúrguer, e os seis vão para o drawer,
 * onde a paridade não importa.)
 *
 * "Início" não está aqui: o logo no centro já leva ao topo. E `#contato`
 * aponta para o rodapé, que absorveu a seção de contato.
 */
export const NAV_ITEMS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Galeria", href: "#galeria" },
  { label: "Serviços", href: "#servicos" },
  { label: "Loja", href: "#loja" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
] as const;
