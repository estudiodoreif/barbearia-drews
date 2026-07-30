import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Services } from "@/components/sections/Services";
import { Store } from "@/components/sections/Store";
import { VideoReveal } from "@/components/sections/VideoReveal";

/**
 * Home one-page.
 *
 * A seção Contato deixou de existir: o CTA final, o telefone e as redes foram
 * absorvidos pelo rodapé, que virou o fecho da página. A âncora `#contato` da
 * navbar aponta para lá. Sem isso, o rodapé e uma seção de contato logo acima
 * dele repetiriam a mesma chamada duas vezes seguidas.
 *
 * As seções alternam contexto claro/escuro via `data-theme`, formando o ritmo
 * editorial de DESIGN.md §6.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <VideoReveal />
      <About />
      <Gallery />
      <Services />
      <Store />
      <Location />
    </>
  );
}
