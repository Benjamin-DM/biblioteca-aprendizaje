import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import { rehypeAccesible } from './src/lib/rehype-accesible.mjs';
import { remarkObsidian } from './src/lib/remark-obsidian.mjs';

// GitHub Pages sirve el sitio bajo el nombre del repo.
const base = '/biblioteca-aprendizaje';

export default defineConfig({
  site: 'https://benjamin-dm.github.io',
  base,
  integrations: [react()],
  // CSP como <meta>: GitHub Pages no deja configurar headers. Astro calcula los hashes de sus scripts y estilos inline,
  // así que cualquier script que no sea propio del build queda bloqueado.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      // Anchos de las barras de progreso (style="width:…"). Solo atributos: <style> y <link> siguen restringidos.
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
      // Pagefind compila su motor de búsqueda a WebAssembly.
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
    },
  },
  vite: { plugins: [tailwindcss()] },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    processor: unified({
      remarkPlugins: [[remarkObsidian, { base, raiz: 'src/content' }]],
      rehypePlugins: [rehypeAccesible],
    }),
  },
});
