import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const email = (body.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }

  const firstName = (body.first_name ?? '').trim();

  const env = (locals as any).runtime?.env;
  const apiKey = env?.BEEHIIV_API_KEY ?? import.meta.env.BEEHIIV_API_KEY;
  const pubId = env?.BEEHIIV_PUB_ID ?? import.meta.env.BEEHIIV_PUB_ID;

  if (!apiKey || !pubId) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  let res: Response;
  try {
    res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'galaxyarbitrage.com',
          utm_medium: 'website',
          utm_campaign: 'homepage',
          ...(firstName && { custom_fields: [{ name: 'First Name', value: firstName }] }),
        }),
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Subscription service unreachable' }), { status: 502 });
  }

  const data = await res.json().catch(() => ({}));

  if (res.ok || res.status === 201) {
    const magnet = (body.magnet ?? '').trim() || null;
    const redirectUrl = magnet
      ? `/thank-you?magnet=${encodeURIComponent(magnet)}`
      : '/thank-you';
    return new Response(JSON.stringify({ ok: true, redirect_url: redirectUrl }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Subscription failed', detail: data }), { status: res.status });
};
