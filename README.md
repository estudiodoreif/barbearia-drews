# Barbearia DREWS — site

Site institucional de página única da **Barbearia Drews**, em Jaraguá do Sul/SC.

Desenvolvido pelo [Estúdio do Reif](https://instagram.com/estudiodoreif).

---

## Stack

- **Next.js 16** (App Router) + TypeScript, build com Turbopack
- **CSS Modules** por componente, sobre tokens globais em `app/styles/tokens.css`
- **GSAP + ScrollTrigger** (`@gsap/react`) — motor de animação único, registrado em `lib/gsap.ts`
- **Lenis** para scroll suave, com uma ponte manual para o ScrollTrigger em
  `components/layout/SmoothScroll/` — ler o comentário desse arquivo antes de mexer em
  qualquer `pin`/`scrub`
- **Barlow Condensed** (display) + **Inter** (corpo), via `next/font/google`

## Comandos

```bash
npm install
npm run dev        # ambiente local em http://localhost:3000
npm run build      # build de produção
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Estrutura

```
app/            # App Router: layout.tsx, page.tsx, styles/
components/
  layout/       # Navbar (+ MenuDrawer), Footer, Preloader, SmoothScroll
  sections/     # Hero (+ ImageTrail), VideoReveal, About, Gallery,
                #   Services, Store, Location
  ui/           # Button, Reveal, TextReveal, Marquee, SectionLabel, Cursor
content/        # dados do negócio e inventário de mídia
lib/            # site.ts (dados + config), gsap.ts, motion.ts, format.ts
hooks/          # usePrefersReducedMotion, useMediaQuery, useParallax, useHeroVideoScroll
public/         # imagens, vídeos e logo prontos para o browser
```

## Onde mexer em quê

| Quero mudar | Arquivo |
|---|---|
| Endereço, horário, telefone, redes, link de agendamento | `lib/site.ts` |
| Tabela de serviços e preços | `content/services.ts` |
| Produtos da Loja | `content/products.ts` |
| Qual foto aparece onde | `content/photos.ts` |
| Cor, espaço, tipo, duração de animação | `app/styles/tokens.css` |

Nenhum componente deve escrever cor, medida ou caminho de imagem à mão — tudo vem dos tokens ou
dos módulos de `content/`.

## Convenções que não são óbvias

- **Dados de negócio são reais e têm fonte registrada** em `../CONTENT.md`, com data. Ao mexer,
  reconferir na fonte; não estimar.
- **GSAP é para scroll** (pin, scrub, reveals). Estado binário — menu aberto/fechado, hover,
  item ativo — é `transition` CSS. Animar a mesma propriedade nos dois já quebrou o drawer da
  navbar e o cursor.
- **As fotos da seção Sobre não têm moldura** de propósito: o fundo claro do arquivo dissolve no
  fundo da seção. Trocar por foto de fundo escuro derruba a composição.
- **`cursor: none` é aplicado por JS**, nunca em CSS global — se o componente `Cursor` não montar,
  o cursor nativo precisa continuar existindo.

## Antes de publicar

Ver o checklist em `../CONTENT.md`. Em aberto: os preços da Loja (a seção é proposta comercial,
a barbearia não vende produtos hoje) e o domínio definitivo, que hoje está chutado em
`SITE.url` e alimenta o `metadataBase` e o JSON-LD.
