import type { APIRoute } from 'astro';

// Standalone "VA Waitlist" list in Kit (formerly ConvertKit) — deliberately a
// separate account/list from the main newsletter (Beehiiv), since this is a
// supply-side candidate pool for the /earn page, not a subscriber list.
// TODO (not done yet):
// 1. Create a Kit account at kit.com if you don't have one.
// 2. In Kit, create these custom fields (Settings -> Custom Fields), using
//    these exact keys: city, skills, hours, english, internet_backup,
//    power_backup, computer, quiet_space, us_hours, readiness_score,
//    source, entry.
// 3. Get a V4 API Key: Kit account Settings -> Developer -> API Keys.
// 4. Add it to Cloudflare as env var KIT_API_KEY (encrypted), redeploy.
// Until that's done, this route returns a 500 and the /earn waitlist form
// shows "Something went wrong."
const KIT_API_BASE = 'https://api.kit.com/v4';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const kitKey = env?.KIT_API_KEY ?? import.meta.env.KIT_API_KEY;

  if (!kitKey) {
    return new Response(JSON.stringify({ error: 'Waitlist not configured yet' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const {
      first_name = '', email = '', city = '', skills = [], hours = '', english = '',
      internet_backup = false, power_backup = false, computer = false, quiet_space = false,
      us_hours = false, readiness_score = 0, source = 'earn_page', entry = '',
    } = body;

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!first_name || typeof first_name !== 'string') {
      return new Response(JSON.stringify({ error: 'Please enter your first name.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fields: Record<string, string> = {
      source: String(source).slice(0, 100),
      readiness_score: String(Number(readiness_score) || 0),
      internet_backup: internet_backup ? 'true' : 'false',
      power_backup: power_backup ? 'true' : 'false',
      computer: computer ? 'true' : 'false',
      quiet_space: quiet_space ? 'true' : 'false',
      us_hours: us_hours ? 'true' : 'false',
    };
    if (city && typeof city === 'string') fields.city = city.slice(0, 200);
    if (Array.isArray(skills) && skills.length) fields.skills = skills.map(String).slice(0, 20).join(', ');
    if (hours && typeof hours === 'string') fields.hours = hours;
    if (english && typeof english === 'string') fields.english = english;
    if (entry && typeof entry === 'string') fields.entry = entry.slice(0, 500);

    const kitRes = await fetch(`${KIT_API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'X-Kit-Api-Key': kitKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        first_name: first_name.toString().slice(0, 200),
        state: 'active',
        fields,
      }),
    });

    if (!kitRes.ok) {
      const errText = await kitRes.text();
      console.error('Kit error (va-waitlist):', kitRes.status, errText);
      return new Response(JSON.stringify({ error: 'Waitlist signup failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('va-waitlist error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
