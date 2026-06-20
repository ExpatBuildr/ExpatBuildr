import type { APIRoute } from 'astro';

const PIXEL_ID = import.meta.env.META_PIXEL_ID || 'XXXXXXXXXXXXXXXXXX';
const ACCESS_TOKEN = import.meta.env.META_CAPI_TOKEN || 'YOUR_TOKEN_HERE';

async function hashSHA256(value: string) {
  const msgUint8 = new TextEncoder().encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { event_name, email, phone, client_ip, client_user_agent, fbc, fbp, value, currency } = body;

    const emailHash = email ? await hashSHA256(email) : undefined;
    const phoneHash = phone ? await hashSHA256(phone) : undefined;

    const eventData = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: request.headers.get("referer") ?? "https://expatbuildr.com",
          user_data: {
            ...(emailHash && { em: [emailHash] }),
            ...(phoneHash && { ph: [phoneHash] }),
            ...(client_ip && { client_ip_address: client_ip }),
            ...(client_user_agent && { client_user_agent }),
            ...(fbc && { fbc }),
            ...(fbp && { fbp }),
          },
          custom_data: {
            ...(value && { value }),
            ...(currency && { currency }),
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();
    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Meta CAPI error:", err);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
