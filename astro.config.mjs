// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

const GHOST_LIST = [
  '/blog/saas-ecosystems',
  '/blog/arbitrage-engine',
  '/blog/pkm',
  '/blog/lead-engines',
  '/blog/content-pipelines',
  '/blog/ai-automation',
  '/blog/seo-leverage',
  '/blog/revops-scaling',
  '/blog/grant-wisdom',
  '/blog/seo-laundering',
  '/blog/cold-outreach',
  '/blog/antigravity-workflows',
  '/blog/ai-orchestration',
  '/blog/autonomous-leads',
  '/blog/digital-assets',
  '/blog/cyber-bug-bounty',
  '/blog/remote-sniper',
  '/blog/archive',
  '/briefing-v1',
  '/internal/',
  '/jobs',
  '/cdn-cgi',
  '/expats-thankyou',
  '/expats-download',
  '/leaks-thankyou',
  '/newsletter/thank-you',
  '/newsletter/downloads',
];

// Mirrors robots.txt's Disallow rules — these paths must never appear in the
// sitemap, or Google flags them as "Blocked by robots.txt" / picks a different
// canonical since it can't crawl the page to read its own canonical tag.
const ROBOTS_DISALLOWED_SUFFIXES = ['/unlock', '/thank-you', '/success'];
const ROBOTS_DISALLOWED_EXACT = [
  '/founders/payment-received',
  '/geo-arbitrage/confirmed',
  '/nfs/turbo',
  '/lead-gen/edge',
];

const INDEXED_TAG_SLUGS = new Set([
  'career-advancement-remote',
  'philippines-vs-thailand-vs-vietnam',
  'southeast-asia-cost-of-living-2026',
  'topic-authority',
  'remote-hiring-process',
  'work-from-home-negotiation',
  'outbound',
  'data-monetization',
  'indie-hacking',
  'lead-list-building',
  'outreach',
]);

// https://astro.build/config
export default defineConfig({
  site: 'https://expatbuildr.com',
  output: 'server',
  // STANDARD: trailingSlash: 'never' enforces clean URLs without trailing slashes
  // - 'never': /page/ → /page (single 301 redirect, Google-safe, modern standard)
  // - Sitemap, canonicals, and all internal links use no-trailing-slash format
  // - See: scripts/validateSEOConfig.mjs for pre-deployment SEO validation
  trailingSlash: 'never',
  // build.format: 'file' outputs prerendered routes as slug.html instead of
  // slug/index.html — without this, Cloudflare's static server treats the
  // slug as a directory and 308-redirects to add the trailing slash back,
  // which breaks link-preview crawlers (Facebook/Twitter/etc. don't follow redirects)
  build: {
    format: 'file',
  },
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        if (GHOST_LIST.some(ghost => page.includes(ghost))) return false;
        const pathname = new URL(page).pathname.replace(/\/$/, '');
        if (ROBOTS_DISALLOWED_SUFFIXES.some(s => pathname.endsWith(s))) return false;
        if (ROBOTS_DISALLOWED_EXACT.includes(pathname)) return false;
        const tagMatch = page.match(/\/blog\/tag\/([^/]+)$/);
        if (tagMatch) return INDEXED_TAG_SLUGS.has(tagMatch[1]);
        return true;
      }
    })
  ],
  redirects: {
    '/blog/remote-income/best-remote-job-boards-actually-worth-using-2026': '/blog/remote-income/best-remote-job-boards-worth-using',
    '/blog/remote-income/best-remote-job-boards-worth-using-2026': '/blog/remote-income/best-remote-job-boards-worth-using',
    '/free': '/founders/free',
    '/unlock': '/founders/unlock',
    '/x': '/ai-business/claude',
    '/x/thank-you': '/ai-business/thank-you',
    '/help-founders': '/founders/strategy',
    '/geo-arbitrage-playbook': '/geo-arbitrage/advantage',
    '/lead-generation-systems': '/lead-gen/edge',
    '/remote-income': '/remote-income/sniper',
    '/turbo': '/nfs/turbo',
    '/vault': '/ai-business/claude',
    '/leads': '/lead-gen/edge',
    '/arbjobs': '/geo-arbitrage/arbjobs',
    '/automation': '/automation-systems/automation',
    '/job': '/geo-arbitrage/job',
    '/build-with-galaxy/build': '/build-with-expatbuildr',
  }
});
