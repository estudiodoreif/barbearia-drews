import { PHOTOS, type Photo } from "./photos";

export type Service = {
  name: string;
  /** Duração em minutos. */
  duration: number;
  /** Preço em reais. */
  price: number;
  /** Thumbnail do crossfade no hover — foto da curadoria, vertical. */
  photo: Photo;
};

/**
 * Tabela de serviços da barbearia.
 *
 * Nome, preço e duração vêm da agenda pública da própria DREWS no AppBarber
 * (`sites.appbarber.com.br/barbeariadrews-4nxn`, consultada em 30/07/2026) —
 * é a mesma tabela que o cliente vê ao agendar, então não há divergência
 * possível entre o site e o balcão.
 *
 * São **três** serviços, não quatro: "Sobrancelha" estava aqui como suposição
 * do wireframe e não existe na tabela real.
 */
export const SERVICES: readonly Service[] = [
  {
    name: "Cabelo",
    duration: 40,
    price: 40,
    photo: PHOTOS.fadeRetrato,
  },
  {
    name: "Barba",
    duration: 30,
    price: 35,
    photo: PHOTOS.barbaTesoura,
  },
  {
    name: "Cabelo e Barba",
    duration: 60,
    price: 65,
    photo: PHOTOS.barbaNavalhaRetrato,
  },
];

/**
 * Barbeiros. Os dois aparecem na seleção de profissional do AppBarber e estão
 * marcados na bio do Instagram (@drewskkk e @adri4n_thebarber).
 */
export type Barber = {
  name: string;
  handle: string;
  url: string;
};

export const BARBERS: readonly Barber[] = [
  {
    name: "Drews",
    handle: "@drewskkk",
    url: "https://www.instagram.com/drewskkk/",
  },
  {
    name: "Adrian",
    handle: "@adri4n_thebarber",
    url: "https://www.instagram.com/adri4n_thebarber/",
  },
];
