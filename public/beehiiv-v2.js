/**
 * GalaxyBuilt — Beehiiv Proxy Utility
 * Client-side subscription handler. 
 * Routes requests through /api/subscribe to avoid CORS and protect API keys.
 */

/**
 * Subscribe an email to Beehiiv with page-specific segmentation.
 *
 * @param {Object} opts
 * @param {string} opts.email
 * @param {string[]} opts.tags
 * @param {string} opts.utm_medium
 * @param {string} opts.utm_campaign
 * @returns {Promise<boolean>}
 */
async function subscribeToBeehiiv({ email, tags, utm_medium, utm_campaign }) {
  const utm_source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        tags: tags || ['general_lead'],
        utm_source,
        utm_medium: utm_medium || 'website',
        utm_campaign: utm_campaign || 'galaxybuilt_main'
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('🚀 GalaxyBuilt: Beehiiv subscription success:', email);
      sessionStorage.setItem('gb_email', email);
      
      // Fire Unified Tracking Engine if available
      if (window.trackLead) {
        window.trackLead({ label: utm_campaign || 'Beehiiv Signup', value: 0 });
      }
      
      return true;
    }

    if (result.error === "already_subscribed") {
      return "already_subscribed";
    }

    console.error('❌ GalaxyBuilt: Beehiiv subscription failed:', result.error || 'Unknown error');
    if (result.debug) console.log('🔍 Debug Info:', result.debug);
    return false;

  } catch (err) {
    console.error('❌ GalaxyBuilt: Beehiiv proxy error:', err);
    return false;
  }
}

/**
 * Validate email format before API call.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

window.subscribeToBeehiiv = subscribeToBeehiiv;
window.isValidEmail = isValidEmail;
