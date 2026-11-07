import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import { rehypeChecklist } from './src/lib/rehype-checklist.mjs';
import { remarkObsidian } from './src/lib/remark-obsidian.mjs';

// GitHub Pages sirve el sitio bajo el nombre del repo.
const base = '/biblioteca-aprendizaje';

export default defineConfig({
  base,
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    processor: unified({
      remarkPlugins: [[remarkObsidian, { base, raiz: 'src/content' }]],
      rehypePlugins: [rehypeChecklist],
    }),
  },
});
