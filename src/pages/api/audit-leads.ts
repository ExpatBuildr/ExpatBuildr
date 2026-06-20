import type { APIRoute } from 'astro';

const NOTION_DATABASE_ID = '9f80a15d-4c9c-4e8c-9799-786ec71254b0';
const NOTION_API_VERSION = '2022-06-28';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const notionKey = env?.NOTION_API_KEY ?? import.meta.env.NOTION_API_KEY;

  if (!notionKey) {
    return new Response(JSON.stringify({ error: 'Notion not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name = '', email = '', website = '', source = 'leaks-page', submitted_at } = body;

    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_API_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Email: { email },
          Website: { url: website },
          Source: { select: { name: source } },
          Date: { date: { start: submitted_at || new Date().toISOString() } },
          Status: { select: { name: 'New' } },
        },
      }),
    });

    if (!notionRes.ok) {
      const errText = await notionRes.text();
      console.error('Notion error:', notionRes.status, errText);
      return new Response(JSON.stringify({ error: 'Notion write failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('audit-leads error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
