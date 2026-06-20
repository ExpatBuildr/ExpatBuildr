import type { APIRoute } from 'astro';

let _cachedCount: number | null = null;
let _cacheExpiry = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchBeehiivCount(apiKey: string, pubId: string): Promise<number> {
  let count = 0;
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const url = new URL(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`);
    url.searchParams.set('status', 'active');
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) break;

    const data = await res.json();
    count += (data.data || []).length;
    hasMore = data.has_more || false;
    cursor = data.next_cursor || null;
  }

  return count;
}

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;
  const apiKey = env?.BEEHIIV_API_KEY ?? import.meta.env.BEEHIIV_API_KEY;
  const pubId = env?.BEEHIIV_PUB_ID ?? import.meta.env.BEEHIIV_PUB_ID;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const now = Date.now();

    if (_cachedCount !== null && now < _cacheExpiry) {
      return new Response(JSON.stringify({ count: _cachedCount }), { headers: corsHeaders });
    }

    if (!apiKey || !pubId) {
      return new Response(JSON.stringify({ count: _cachedCount ?? 0 }), { headers: corsHeaders });
    }

    const count = await fetchBeehiivCount(apiKey, pubId);
    _cachedCount = count;
    _cacheExpiry = now + CACHE_TTL_MS;

    return new Response(JSON.stringify({ count }), { headers: corsHeaders });
  } catch {
    return new Response(JSON.stringify({ count: _cachedCount ?? 0 }), { headers: corsHeaders });
  }
};
