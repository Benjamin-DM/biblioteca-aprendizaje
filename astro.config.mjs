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
  vite: { plugins: [tailwindcss()] },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    processor: unified({
      remarkPlugins: [[remarkObsidian, { base, raiz: 'src/content' }]],
      rehypePlugins: [rehypeAccesible],
    }),
  },
});
