# /consulting — archived qualifying-questions step

Removed 2026-08-18 from `src/pages/consulting.astro`.

**Why:** the qualifying questions (name, timeline, budget, country, notes)
were a second gate between email capture and the Calendly widget — you had
to submit email, then submit this form, before the calendar even appeared.
Calendly now collects the equivalent context directly inside its own
booking form, so this step is redundant and was adding friction (and, per
the founder's report, contributing to Calendly appearing not to show up at
all). The booking flow is now: email capture → Calendly, directly.

Not deleted outright — saved here in case any of this context-gathering is
wanted back later, either on this page or built into the Calendly form's
own custom questions.

## Original markup

```astro
<!--
  TODO: this writes to the new "Consulting Leads" Notion database, which
  needs to be shared with whatever Notion integration powers
  NOTION_API_KEY (same one src/pages/api/audit-leads.ts already uses) —
  open the database in Notion, "···" menu -> Connections -> add it.
  Until that's done, /api/consulting-lead will fail quietly (see JS
  below — a failure here does not block booking, same as Beehiiv).
-->
<form id="consultingQualifyForm" class="qualify-form" hidden>
  <p class="qualify-intro">A little context before we talk — none of this is required.</p>
  <label class="qualify-row">
    Name <span class="optional-tag">optional</span>
    <input type="text" id="qualifyName" placeholder="Your name" autocomplete="name" />
  </label>
  <label class="qualify-row">
    When are you looking to move? <span class="optional-tag">optional</span>
    <select id="qualifyTimeline">
      <option value="">Prefer not to say</option>
      <option value="0-3 months">0–3 months</option>
      <option value="3-6 months">3–6 months</option>
      <option value="6-12 months">6–12 months</option>
      <option value="Just exploring">Just exploring</option>
    </select>
  </label>
  <label class="qualify-row">
    Rough monthly budget after moving? <span class="optional-tag">optional</span>
    <select id="qualifyBudget">
      <option value="">Prefer not to say</option>
      <option value="Under $1.5k/mo">Under $1.5k/mo</option>
      <option value="$1.5k-3k/mo">$1.5k–3k/mo</option>
      <option value="$3k-5k/mo">$3k–5k/mo</option>
      <option value="$5k+/mo">$5k+/mo</option>
      <option value="Not sure yet">Not sure yet</option>
    </select>
  </label>
  <label class="qualify-row">
    Which country are you most seriously considering? <span class="optional-tag">optional</span>
    <select id="qualifyCountry">
      <option value="">Prefer not to say</option>
      <option value="Philippines">Philippines</option>
      <option value="Thailand">Thailand</option>
      <option value="Vietnam">Vietnam</option>
      <option value="Other Southeast Asia">Other Southeast Asia</option>
      <option value="Not sure yet">Not sure yet</option>
    </select>
  </label>
  <label class="qualify-row">
    Anything specific you want to cover on the call? <span class="optional-tag">optional</span>
    <textarea id="qualifyNotes" rows="3" placeholder="Optional — helps me prep before we talk"></textarea>
  </label>
  <button type="submit" class="nav-cta">Continue to Booking →</button>
</form>
```

## Original JS handler

```js
// Step 2: name + qualifying answers (all optional) -> Notion, then Calendly
qualifyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = qualifyForm.dataset.email;
  const submitBtn = qualifyForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Loading...';

  const payload = {
    email,
    name: document.getElementById('qualifyName').value.trim(),
    timeline: document.getElementById('qualifyTimeline').value,
    budget: document.getElementById('qualifyBudget').value,
    country: document.getElementById('qualifyCountry').value,
    notes: document.getElementById('qualifyNotes').value.trim()
  };

  // Same principle as Beehiiv above: a Notion hiccup should never
  // block someone from getting to the calendar.
  try {
    await fetch('/api/consulting-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('consulting-lead capture failed:', err);
  }

  qualifyForm.hidden = true;
  calContainer.hidden = false;
  initCalendly(email);
});
```

## Related, not archived

- `src/pages/api/consulting-lead.ts` — the endpoint this form posted to.
  Left in place (not deleted), just no longer called from `/consulting`.
  Still had the pending TODO about the Notion integration not being
  connected yet, independent of this change.
- The original booking-flow comment block in `consulting.astro` described
  this as a "three-step booking" (email → qualify → Calendly). Updated in
  the live file to reflect the new two-step flow.
