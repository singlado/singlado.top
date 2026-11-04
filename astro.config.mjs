import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Singlado marketing site — static output for GitHub Pages on the apex domain.
export default defineConfig({
  site: 'https://singlado.top',
  integrations: [tailwind()],
  build: { format: 'directory' },
});
