import type { APIRoute } from 'astro';

// "Consulting Leads" database in the ExpatBuildr Notion workspace, created for
// the /consulting page's two-step booking flow (step 1: email only, mandatory;
// step 2: this endpoint — name + qualifying answers, all optional).
// TODO: this database must be shared with whatever Notion integration powers
// NOTION_API_KEY (the same one src/pages/api/audit-leads.ts already uses) —
// open the database in Notion, "···" menu -> Connections -> add that
// integration. Until that's done, calls here will fail with a 500 even though
// NOTION_API_KEY itself is already configured and working for audit-leads.
const NOTION_DATABASE_ID = '344bc734-227a-4662-aa4f-a5cf4783bc49';
const NOTION_API_VERSION = '2022-06-28';

const TIMELINE_OPTIONS = new Set(['0-3 months', '3-6 months', '6-12 months', 'Just exploring']);
const BUDGET_OPTIONS = new Set(['Under $1.5k/mo', '$1.5k-3k/mo', '$3k-5k/mo', '$5k+/mo', 'Not sure yet']);
const COUNTRY_OPTIONS = new Set(['Philippines', 'Thailand', 'Vietnam', 'Other Southeast Asia', 'Not sure yet']);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const { email = '', name = '', timeline = '', budget = '', country = '', notes = '' } = body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const properties: Record<string, any> = {
      // Name is the title property — Notion requires a non-empty title, so fall
      // back to the email when the (optional) name field was left blank.
      Name: { title: [{ text: { content: (name || email).toString().slice(0, 200) } }] },
      Email: { email },
      Source: { select: { name: 'consulting-page' } },
      Status: { select: { name: 'New' } },
      'Submitted At': { date: { start: new Date().toISOString() } },
    };

    if (TIMELINE_OPTIONS.has(timeline)) properties.Timeline = { select: { name: timeline } };
    if (BUDGET_OPTIONS.has(budget)) properties.Budget = { select: { name: budget } };
    if (COUNTRY_OPTIONS.has(country)) properties['Country Interest'] = { select: { name: country } };
    if (notes && typeof notes === 'string') {
      properties.Notes = { rich_text: [{ text: { content: notes.slice(0, 2000) } }] };
    }

    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_API_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties,
      }),
    });

    if (!notionRes.ok) {
      const errText = await notionRes.text();
      console.error('Notion error (consulting-lead):', notionRes.status, errText);
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
    console.error('consulting-lead error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
