/**
 * Beehiiv API Integration Library
 */

export async function subscribeEmail(email: string, credentials: { apiKey: string; pubId: string }, options: {
  tags?: string[],
  utm_source?: string,
  utm_medium?: string,
  utm_campaign?: string
} = {}) {
  const { apiKey, pubId } = credentials;
  if (!apiKey || !pubId) return { success: false, error: 'Configuration error' };

  const { tags = [], utm_source = 'direct', utm_medium = 'web', utm_campaign = 'newsletter_funnel' } = options;

  try {
    console.log(`BEEHIIV: Attempting subscription for ${email} in publication ${pubId}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source,
        utm_medium,
        utm_campaign,
        tags
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const rawText = await response.text();
    console.log('BEEHIIV_RESPONSE:', response.status, rawText);

    let data: any;
    try { data = JSON.parse(rawText); } catch { data = {}; }

    if (!response.ok) {
      console.error('BEEHIIV_API_ERROR:', JSON.stringify(data));
      return { success: false, error: data.errors?.[0]?.message || 'Subscription failed' };
    }

    console.log(`BEEHIIV: Subscription successful for ${email}`);
    return { 
      success: true, 
      subscriber_id: data.data?.id,
      status: data.data?.status 
    };
  } catch (error) {
    console.error('BEEHIIV_FETCH_ERROR:', error);
    return { success: false, error: 'Network error' };
  }
}
