import type { NextConfig } from "next";

/**
 * Sem opções de `images`.
 *
 * Havia aqui um bloco liberando SVG no otimizador (`dangerouslyAllowSVG` + CSP
 * + `contentDispositionType`), necessário enquanto os produtos da Loja eram
 * vetores desenhados neste repositório. Com os mockups fotográficos, nenhum
 * SVG passa mais pelo `<Image>` — e manter a permissão ligada sem uso só
 * deixaria uma porta aberta de graça.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
