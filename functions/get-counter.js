// In-memory cache — persists across requests on the same isolate
let _cachedCount = null;
let _cacheExpiry = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchBeehiivCount(apiKey, pubId) {
  let count = 0;
  let cursor = null;
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

export async function onRequestGet(context) {
  const { env } = context;
  const apiKey = env.BEEHIIV_API_KEY;
  const pubId = env.BEEHIIV_PUB_ID;

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
}
