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
      'market-arbitrage'
    ]).optional(),
    category: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(true),
    gated: z.boolean().default(true),
    noindex: z.boolean().default(false),
    archived: z.boolean().default(false),
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
