import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { IntroProvider, Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { PHOTOS } from "@/content/photos";
import { SERVICES } from "@/content/services";
import {
  GEO,
  OPENING_HOURS,
  PHONE_INTL,
  RATING,
  SITE,
  SOCIALS,
} from "@/lib/site";

import "./globals.css";

/**
 * **Uma família só.** A Inter saiu do projeto: display e corpo passam a ser
 * Barlow Condensed, por decisão do cliente. O site fica mono-família.
 *
 * Barlow Condensed é família **estática** (não variável), então os pesos vêm
 * declarados um a um e cada um é um arquivo. Entrou o 500 junto com os três
 * que já existiam: com a condensada assumindo também rótulos e texto corrido,
 * o 400 puro fica fino demais em corpo pequeno. Pedir a faixa inteira 100–900
 * seriam nove downloads sem uso.
 *
 * As duas variáveis apontam para a mesma fonte de propósito: `--font-display`
 * e `--font-body` continuam descrevendo o **papel** de cada uma, e um dia
 * podem voltar a divergir sem tocar nos ~10 arquivos que as consomem.
 */
const condensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * SEO local: a barbearia vive de busca "barbearia perto de mim". Cidade e
 * bairro entram no título e na description porque são exatamente os termos que
 * a busca casa — antes ficavam de fora porque o endereço era `[PENDENTE]`.
 */
const TITLE = `Barbearia DREWS — ${SITE.city}/${SITE.state}`;
const DESCRIPTION = `Barbearia em ${SITE.neighborhood}, ${SITE.city}. Corte, barba e combo com agendamento on-line ou por ordem de chegada. ${SITE.street}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: "%s · DREWS",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: SITE.legalName,
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

/**
 * Dados estruturados do negócio.
 *
 * `BarberShop` é o tipo específico do schema.org (subtipo de `LocalBusiness`) e
 * é o que habilita o painel de conhecimento com endereço, horário e nota nos
 * resultados. Todos os campos abaixo são reais e conferem com o perfil do
 * Google — divergir dele é pior que não ter o schema.
 *
 * `openingHoursSpecification` precisa de HH:MM em 24h, então os intervalos são
 * derivados de OPENING_HOURS trocando o travessão pelo par abre/fecha.
 */
function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: SITE.legalName,
    description: DESCRIPTION,
    url: SITE.url,
    telephone: PHONE_INTL,
    priceRange: "$$",
    image: `${SITE.url}${PHOTOS.espelhoReflexo.src}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.street,
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      postalCode: SITE.postalCode,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: RATING.value,
      reviewCount: RATING.count,
    },
    sameAs: SOCIALS.map((social) => social.href),
    openingHoursSpecification: OPENING_HOURS.flatMap((day) =>
      day.ranges.map((range) => {
        const [opens, closes] = range.split("–");
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: DAY_SCHEMA[day.weekday],
          opens,
          closes,
        };
      }),
    ),
    makesOffer: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name },
      price: service.price,
      priceCurrency: "BRL",
    })),
  };
}

/** `Date.getDay()` → nome do dia no vocabulário do schema.org. */
const DAY_SCHEMA = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={condensed.variable}>
      <body>
        {/* Dados estruturados do negócio. O conteúdo é gerado no servidor a
            partir de lib/site.ts — não há entrada de usuário aqui, então o
            JSON não pode carregar script injetado. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessJsonLd()),
          }}
        />

        {/* Atalho de teclado — o site é one-page, então pular a navegação
            importa para quem usa teclado/leitor de tela. */}
        <a href="#inicio" className="sr-only">
          Ir para o conteúdo
        </a>

        {/* Fora do SmoothScroll: o cursor é `position: fixed` na viewport e
            não deve entrar na árvore que o Lenis transforma. */}
        <Cursor />

        <SmoothScroll>
          {/* IntroProvider envolve tudo porque o Hero (dentro de children)
              precisa saber quando o preloader terminou para animar a entrada. */}
          <IntroProvider>
            <Preloader />
            {/* A navbar não é fixa: fica no topo do documento e sai com o
                scroll, então mora aqui e não dentro do Hero. */}
            <Navbar />
            <main>{children}</main>
            <Footer />
          </IntroProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
