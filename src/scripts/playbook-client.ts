// src/scripts/playbook-client.ts
// All interactivity for /playbook. Content is server-rendered by Astro, so the
// page still reads fine without JavaScript. This script adds the calculator,
// saved checklists, country tabs, filters and tracking.
//
// Events sent (Plausible custom events and/or PostHog):
//   page_view {country, source, entry}
//   scroll_25 / scroll_50 / scroll_75 / scroll_100
//   time_30s / time_60s / time_120s / time_300s   (visible time only)
//   country_selected {country}      waitlist_click {country}
//   calculator_used {field}         (first change per field)
//   checklist_item_checked {list, item}
//   offer_view {position}           (offer card scrolled into view)
//   tool_preview_view {tool}
//   cta_click {position}            checkout_click {position}
//   pdf_download

export {};

declare global {
  interface Window {
    plausible?: (name: string, opts?: { props?: Record<string, unknown> }) => void;
    posthog?: { capture: (name: string, props?: Record<string, unknown>) => void };
    __events?: { name: string; props: Record<string, unknown>; t: number }[];
  }
}

type Props = Record<string, unknown>;

const cfgEl = document.getElementById('pb-config');
const DATA = cfgEl ? JSON.parse(cfgEl.textContent || '{}') : {};
const CONFIG = DATA.CONFIG || { RATE: 61 };
const CITIES = DATA.CITIES || {};
const CMP_SC: number = DATA.CMP_SC || 3055;

/* ---------- tracking ---------- */
const fired: Record<string, boolean> = {};
function track(name: string, props: Props = {}) {
  try {
    if (window.plausible) window.plausible(name, { props });
    if (window.posthog && window.posthog.capture) window.posthog.capture(name, props);
  } catch (e) {
    /* analytics must never break the page */
  }
  (window.__events = window.__events || []).push({ name, props, t: Date.now() });
}
function once(name: string, props: Props = {}) {
  const k = name + JSON.stringify(props);
  if (fired[k]) return;
  fired[k] = true;
  track(name, props);
}

/* ---------- storage (private to this browser) ---------- */
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    /* ignore */
  }
}

/* ---------- formatting ---------- */
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const money2 = (n: number) => (n >= 1e6 ? '$' + (n / 1e6).toFixed(2).replace(/0$/, '') + 'M' : money(n));
const fvOf = (monthly: number) => {
  const r = 0.07 / 12;
  return monthly * ((Math.pow(1 + r, 240) - 1) / r);
};
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;

const qs = new URLSearchParams(location.search);
const source = qs.get('utm_source') || qs.get('ref') || 'direct';
let currentCountry = 'philippines';

/* ---------- calculator ---------- */
(function calculator() {
  const spend = $<HTMLInputElement>('spend');
  const city = $<HTMLSelectElement>('city');
  const rate = $<HTMLInputElement>('rate');
  if (!spend || !city || !rate) return;
  const used: Record<string, boolean> = {};
  const mark = (field: string) => {
    if (!used[field]) {
      used[field] = true;
      once('calculator_used', { field });
    }
  };
  function run() {
    const sp = +spend!.value;
    const c = CITIES[city!.value];
    const rt = +rate!.value || CONFIG.RATE;
    const cost = (c.lo + c.hi) / 2;
    const keep = Math.max(sp - cost, 0);
    $('spendOut')!.textContent = money(sp);
    $('costOut')!.textContent = money(cost);
    $('costPeso')!.textContent = 'about ' + (Math.round((cost * rt) / 100) * 100).toLocaleString('en-US') + ' pesos';
    $('keepOut')!.textContent = keep > 0 ? money(keep) : '$0';
    $('fvOut')!.textContent = keep > 0 ? money2(fvOf(keep)) : '$0';
    const rangeTxt =
      c.lo === c.hi
        ? 'my actual monthly spend'
        : 'the midpoint of the ' + c.name + ' range (' + money(c.lo) + ' to ' + money(c.hi) + ')';
    $('calcNote')!.textContent = 'Cost uses ' + rangeTxt + '. It leaves out visas, flights and taxes. Your numbers will differ.';
  }
  spend.value = String(Math.min(Math.max(CMP_SC, 1000), 8000));
  rate.value = String(CONFIG.RATE);
  spend.addEventListener('input', () => { mark('spend'); run(); });
  city.addEventListener('change', () => { mark('city'); run(); });
  rate.addEventListener('input', () => { mark('rate'); run(); });
  run();
})();

/* ---------- checklists ---------- */
(function checklists() {
  const checks: Record<string, number> = load('gan_ph_checks', {});
  document.querySelectorAll<HTMLElement>('.clwrap').forEach((wrap) => {
    const list = wrap.dataset.list || '';
    const total = Number(wrap.dataset.total || 0);
    const bar = wrap.querySelector<HTMLElement>('.bar i');
    const lbl = wrap.querySelector<HTMLElement>('.barlbl');
    const inputs = wrap.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    inputs.forEach((i) => { if (checks[i.dataset.id || '']) i.checked = true; });
    const update = () => {
      let n = 0;
      inputs.forEach((i) => { if (i.checked) n++; });
      if (bar) bar.style.width = (total ? (n / total) * 100 : 0) + '%';
      if (lbl) lbl.textContent = n + ' of ' + total + ' done';
    };
    wrap.addEventListener('change', (e) => {
      const i = e.target as HTMLInputElement;
      if (!i.dataset.id) return;
      if (i.checked) {
        checks[i.dataset.id] = 1;
        track('checklist_item_checked', { list, item: i.dataset.id });
      } else {
        delete checks[i.dataset.id];
      }
      save('gan_ph_checks', checks);
      update();
    });
    update();
  });

  // chapter 10 situation tabs
  const tabs = $('planTabs');
  if (tabs) {
    tabs.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('.chip');
      if (!b) return;
      const k = b.dataset.k;
      tabs.querySelectorAll<HTMLElement>('.chip').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      document.querySelectorAll<HTMLElement>('.clwrap[data-list^="plan-"]').forEach((w) => {
        w.hidden = w.dataset.list !== 'plan-' + k;
      });
    });
  }
})();

/* ---------- pitfall filter ---------- */
(function pitfalls() {
  const chips = $('pitChips');
  if (!chips) return;
  chips.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.chip');
    if (!b) return;
    const cat = b.dataset.c;
    chips.querySelectorAll<HTMLElement>('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll<HTMLElement>('#pitList details.pit').forEach((d) => {
      d.hidden = !(cat === 'All' || d.dataset.cat === cat);
    });
  });
})();

/* ---------- offers, PDF link, previews ---------- */
document.querySelectorAll<HTMLAnchorElement>('.kit-link').forEach((a) => {
  a.addEventListener('click', () => {
    const pos = a.dataset.pos;
    track('cta_click', { position: pos });
    track('checkout_click', { position: pos });
  });
});
$('pdfLink')?.addEventListener('click', () => track('pdf_download'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        if (el.dataset.offer) once('offer_view', { position: el.dataset.offer });
        if (el.dataset.tool) once('tool_preview_view', { tool: el.dataset.tool });
        io.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-offer],[data-tool]').forEach((el) => io.observe(el));
}

/* ---------- contents: scroll spy ---------- */
(function toc() {
  const secs = Array.from(document.querySelectorAll<HTMLElement>('section.ch'));
  if (!secs.length) return;
  document.querySelectorAll<HTMLElement>('#mtocList a').forEach((a) =>
    a.addEventListener('click', () => {
      const d = document.querySelector<HTMLDetailsElement>('details.mtoc');
      if (d) d.open = false;
    })
  );
  const spy = () => {
    let cur = secs[0].id;
    const y = window.scrollY + 140;
    secs.forEach((s) => { if (s.offsetTop <= y) cur = s.id; });
    document.querySelectorAll<HTMLElement>('#toc a').forEach((a) => a.classList.toggle('on', a.dataset.id === cur));
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
})();

/* ---------- scroll depth, time on page, progress bar ---------- */
(function depthAndTime() {
  const bar = $('progress');
  let ticking = false;
  const marks = [25, 50, 75, 100];
  function depth() {
    ticking = false;
    const ph = $('panel-ph');
    if (!ph || ph.hidden) return;
    const doc = document.documentElement;
    const total = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const pct = Math.min((window.scrollY / total) * 100, 100);
    if (bar) bar.style.width = pct + '%';
    marks.forEach((m) => { if (pct >= m - (m === 100 ? 2 : 0)) once('scroll_' + m, { country: currentCountry }); });
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(depth); }
  }, { passive: true });

  let secs = 0;
  const goals = [30, 60, 120, 300];
  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    secs++;
    if (goals.indexOf(secs) > -1) once('time_' + secs + 's');
  }, 1000);
})();

/* ---------- country tabs ---------- */
(function countries() {
  const tabs = $('countryTabs');
  const ph = $('panel-ph');
  const soon = $('panel-soon');
  const title = $('soonTitle');
  const msg = $('soonmsg');
  const btn = $<HTMLButtonElement>('soonBtn');
  if (!tabs || !ph || !soon || !title || !msg || !btn) return;
  const label = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);
  const done = (c: string) => 'Counted. When the ' + label(c) + ' playbook is ready, it goes out in the newsletter.';

  function pick(c: string, silent = false) {
    currentCountry = c;
    tabs!.querySelectorAll<HTMLElement>('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.country === c)));
    if (c === 'philippines') {
      ph!.hidden = false;
      soon!.hidden = true;
    } else {
      ph!.hidden = true;
      soon!.hidden = false;
      title!.textContent = label(c) + ' is next in line';
      const voted = load<Record<string, number>>('gan_ph_votes', {});
      msg!.textContent = voted[c] ? done(c) : '';
      btn!.hidden = !!voted[c];
      window.scrollTo(0, 0);
    }
    try { sessionStorage.setItem('gan_country', c); } catch (e) { /* ignore */ }
    if (!silent) track('country_selected', { country: c });
  }
  tabs.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('.tab');
    if (t && t.dataset.country) pick(t.dataset.country);
  });
  $('backPH')?.addEventListener('click', () => pick('philippines'));
  btn.addEventListener('click', () => {
    const voted = load<Record<string, number>>('gan_ph_votes', {});
    voted[currentCountry] = 1;
    save('gan_ph_votes', voted);
    track('waitlist_click', { country: currentCountry });
    msg!.textContent = done(currentCountry);
    btn!.hidden = true;
  });

  let saved: string | null = null;
  try { saved = sessionStorage.getItem('gan_country'); } catch (e) { /* ignore */ }
  if (saved && saved !== 'philippines' && tabs.querySelector('[data-country="' + saved + '"]')) pick(saved, true);
  track('page_view', { country: currentCountry, source, entry: qs.get('ref') || 'link' });
})();

/* ---------- theme toggle (same persistence as the rest of the site: a
   `dark` class on <html> + localStorage('theme')) ---------- */
$('pbThemeToggle')?.addEventListener('click', () => {
  const el = document.documentElement;
  el.classList.toggle('dark');
  localStorage.setItem('theme', el.classList.contains('dark') ? 'dark' : 'light');
});
