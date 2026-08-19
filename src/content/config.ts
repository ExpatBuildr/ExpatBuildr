import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    canonicalUrl: z.string().url().optional(),
    pillarId: z.enum([
      'remote-income',
      'lead-generation',
      'geo-arbitrage',
      'time-arbitrage',
      'ai-arbitrage',
      'health-arbitrage',
      'market-arbitrage',
      'relocation-stay'
    ]).optional(),
    category: z.string(),
    tags: z.array(z.enum([
      'AI Arbitrage', 'AI Content', 'AI Tools', 'Async Business', 'Async Work',
      'Automation', 'B2B Sales', 'CRM', 'Career Growth', 'Cold Outreach',
      'Cost of Living', 'Currency Strategy', 'Delegation', 'Digital Nomad',
      'Expat Banking', 'Expat Founder', 'Expat Healthcare', 'Expat Taxes',
      'Expat Visas', 'Founder Wellness', 'Geo-Arbitrage', 'Health Arbitrage',
      'Investing Abroad', 'Lead Generation', 'Market Arbitrage', 'Medical Tourism',
      'Philippines', 'Prompt Engineering', 'Relocation', 'Remote Income', 'Remote Jobs',
      'Salary Negotiation', 'Sales Pipeline', 'Southeast Asia', 'Thailand', 'Time Arbitrage',
      'Virtual Assistants',
    ])),
    draft: z.boolean().default(true),
    gated: z.boolean().default(true),
    noindex: z.boolean().default(false),
    archived: z.boolean().default(false),
    // Explicit flag (not inferred) marking whether this post has a YouTube
    // embed in its body. Gates VideoObject JSON-LD rendering — see
    // VIDEO-LIBRARY.md for the embed pattern and the registry of which
    // videos live in which articles.
    hasVideoEmbed: z.boolean().default(false),
    author: z.literal('ExpatBuildr'),
    ogImage: z.string().optional(),
    // Optional display helpers used across posts
    heroImage: z.string().optional(),
    imagePrompt: z.string().optional(),
    // SEO intent mapping for clusters
    primaryKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).optional(),
    searchIntent: z.enum(['informational', 'transactional', 'problem-solving', 'institutional']).optional(),
  }),
});

export const collections = { blog };
