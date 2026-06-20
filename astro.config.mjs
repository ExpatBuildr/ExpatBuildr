// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

const GHOST_LIST = [
  '/expats-thankyou',
  '/expats-download',
  '/leaks-thankyou',
  '/newsletter/thank-you',
  '/newsletter/downloads',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://expatbuildr.com',
  output: 'server',
  // STANDARD: trailingSlash: 'never' enforces clean URLs without trailing slashes
  trailingSlash: 'never',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) => !GHOST_LIST.some(ghost => page.includes(ghost))
    })
  ],
});
