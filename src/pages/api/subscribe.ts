import type { APIRoute } from 'astro';
import { subscribeEmail } from '../../lib/beehiiv';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any).runtime?.env;
    const apiKey = env?.BEEHIIV_API_KEY ?? import.meta.env.BEEHIIV_API_KEY;
    const pubId  = env?.BEEHIIV_PUB_ID  ?? import.meta.env.BEEHIIV_PUB_ID;

    console.log('Beehiiv configured:', !!apiKey, '| PubID set:', !!pubId);

    const body = await request.json();
    const { email, source: rawSource, magnet, tags: incomingTags } = body;
    const source = (rawSource || 'web').toString();

    console.log('1. Form submitted:', email);

    if (!email || !email.includes('@') || email.length < 5) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address' }), { status: 400 });
    }

    // Determine tags based on source/magnet
    const tags = ['newsletter_funnel'];

    // Merge any segment tags sent from the page (e.g. remote_hustler, lead_builder, freedom_seeker, founder)
    if (Array.isArray(incomingTags)) {
      incomingTags.forEach((t: string) => { if (t && !tags.includes(t)) tags.push(t); });
    }
    if (magnet) tags.push(String(magnet));

    // Normalize source for utm_medium and classification
    let normalizedSource = 'web';
    if (source === 'newsletter' || source === 'email') normalizedSource = 'newsletter';

    // Add human-friendly classification tags
    if (normalizedSource === 'web') tags.push('cold');
    if (normalizedSource === 'newsletter') tags.push('warm');

    // Derive pillar tag from magnet or source where possible
    const srcLower = source.toLowerCase();
    const magLower = (magnet || '').toString().toLowerCase();
    if (magLower.includes('remote') || srcLower.includes('remote')) tags.push('pillar_remote-income');
    else if (magLower.includes('lead') || srcLower.includes('lead')) tags.push('pillar_lead-generation');
    else if (magLower.includes('geo') || srcLower.includes('arbitrage')) tags.push('pillar_geo-arbitrage');

    console.log('2. API call fired to beehiiv');

    const result = await subscribeEmail(email, { apiKey, pubId }, {
      tags,
      utm_source: 'expatbuildr',
      utm_medium: normalizedSource || 'web',
      utm_campaign: magnet || 'general'
    });

    console.log('3. Beehiiv result:', JSON.stringify(result));

    if (!result.success) {
      console.error('4. Beehiiv subscription failed:', result.error);
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 });
    }

    // Determine redirect URL
    // Cold traffic goes to friction page
    // Warm traffic (already subscriber clicking from email) goes to direct download
    const magnetSlug = magnet || 'remote-jobs-pack';
    let redirectUrl = `/downloads/${magnetSlug}?ref=newsletter`;

    if (normalizedSource === 'web') {
      redirectUrl = `/newsletter/thank-you?ref=newsletter&magnet=${magnetSlug}`;
    }

    console.log('5. Redirecting to:', redirectUrl);

    return new Response(JSON.stringify({
      success: true,
      redirect_url: redirectUrl
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), { status: 400 });
  }
};
