import { defineMiddleware } from "astro:middleware";

const GHOST_LIST = [
  // Old blog pillars (12→3 migration — all discontinued content)
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
  '/briefing-v1',
  // Non-blog stale paths (from Google index)
  '/jobs',
  '/cdn-cgi'
];

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname.replace(/\/$/, ""); // Normalize by removing trailing slash

  // 1. Redirect /systems to /automation (301 Moved Permanently)
  if (pathname === '/systems') {
    return context.redirect('/automation', 301);
  }

  // 2. 410 Gone for GHOST_LIST paths
  // Using some() to check if the current pathname starts with any ghost path
  if (GHOST_LIST.some(ghost => pathname.startsWith(ghost))) {
    return new Response(null, { 
      status: 410, 
      statusText: 'Gone' 
    });
  }

  // 3. Pass through for all other traffic
  return next();
});
