# SEO & AI-Discoverability Strategy — TODO

**Purpose:** Reference checklist for getting the 110+ `/blog` articles ranking on page 1 of Google and surfacing in AI answers (ChatGPT, Perplexity, Google AI Overviews, etc.). Born from a full site audit on 2026-07-19.

**Status:** Living document — keep updating as items are completed. **Do not delete until every item below is checked off and the strategy has been folded into normal build practice.** This is the reference for future builds, not a one-time task list.

**See also:** `BING-WEBMASTER-GUIDELINES.md` — a permanent (non-deletable) reference doc auditing this codebase against Bing's official webmaster/grounding guidelines. Check new work against it, not just against this file.

---

## Ahrefs Site Audit pass (2026-07-20)

Fixed from the first Ahrefs report:
- [x] `og:url` not matching canonical (35 pages) — consolidated into one `resolvedCanonicalUrl` in `Layout.astro`
- [x] Non-canonical page in sitemap (7) — hub articles' raw `/hub` slug excluded from Astro's sitemap via `NON_CANONICAL_BLOG_PAGES`
- [x] Page in multiple sitemaps (43) — `sitemap-0.xml` no longer double-shipped alongside the hand-built silos
- [x] Title too long (22, really ~96 once you count the site-wide brand suffix) — stopped appending `" | Expat Buildr"` to blog post titles; remaining long titles are intentional long-tail keyword targeting, left as-is per explicit direction
- [x] Meta description too short — `contact.astro` expanded from 46 to 138 chars (the other 3 short ones Ahrefs found are correctly noindex'd already)
- [x] Missing alt text (42 images) — added `alt=""` to the Meta Pixel noscript tracking images across 6 shared files
- [x] Page has links to redirect (partial) — fixed the 2 concretely found in `archive/index-galaxy.astro`; the reported 43 total couldn't be fully verified without Ahrefs' per-URL export, since not all of them matched known redirect-source paths in the current codebase
- [x] Ahrefs Analytics installed (`analytics.ahrefs.com/analytics.js`)

Still open, needs Ahrefs' per-page URL export to act on precisely (not derivable from code alone):
- [ ] Orphan pages (3) — need the specific URLs to know what's unlinked
- [ ] Page has only one dofollow incoming internal link (3 total)
- [ ] Redirect chain (1) — likely the `http://www` → `https://www` → `https://apex` two-hop chain, which is a Cloudflare-level redirect rule, not something in this repo
- [ ] External 3XX redirect (1) — need the specific external link
- [ ] Pages to submit to IndexNow (36) — should self-resolve now that bulk IndexNow submission works again; re-check after the next crawl

## Priority 1 — Technical fixes (quick wins, do these first)

- [x] **Fix IndexNow bulk submission.** ~~`scripts/pingIndexNow.mjs:8` has `SINGLE_URL_TRUST_BUILD = true`...~~ **Real root cause found and fixed 2026-07-20**: the key (`eb8248d2036248cc8da2a80695123d9b`) had been carried over verbatim from galaxybuilt.dev during the site migration and was never valid for expatbuildr.com — it belonged to galaxybuilt.dev's verified Bing Webmaster Tools property, which is why every past rotation still 403'd with `UserForbiddedToAccessSite`. Generated a fresh key directly from expatbuildr.com's own Bing Webmaster Tools IndexNow flow, hosted it, removed the old key file, and confirmed a real deploy returned success on both Bing and IndexNow.org. Flipped `SINGLE_URL_TRUST_BUILD` back to `false` — full bulk submission resumes on every deploy. Worth a final glance at the next 1-2 real deploy logs to confirm it's staying stable (isolated local retries showed some flakiness, likely rate-limiting from rapid repeat testing, not the key itself).
- [x] ~~Enable image optimization on Cloudflare~~ — **partially done, bigger than expected.** Added `imageService: 'compile'` to the `cloudflare()` adapter in `astro.config.mjs` (2026-07-19), which silences the sharp-at-runtime warning and is a necessary prerequisite. **But it has zero effect yet**: the codebase uses plain `<img src="/path.jpg">` everywhere and never imports `astro:assets`'s `<Image>`/`getImage()` — nothing is actually routed through Astro's image pipeline for it to optimize. Real fix is a template + content refactor:
  - [ ] Migrate hero/OG images (frontmatter `heroImage`/`ogImage`, `pillars.ts` images) from plain path strings to real imports Astro can process
  - [ ] Swap `<img>` for `<Image>`/`<Picture>` in `Layout.astro` and `[...path].astro` for hero/OG images at minimum
  - [ ] Re-measure LCP after this actually ships (Lighthouse/PageSpeed Insights) — the config change alone won't move the needle
- [ ] **Add `updatedDate` to time-sensitive articles.** 0 of 114 posts have ever set `updatedDate` in frontmatter. Start with anything with "2026" in the title/content (job boards, tools lists, salary data) — these will visibly rot without a freshness signal. Build a recurring quarterly pass to revisit and bump dates on evergreen cornerstone content.
- [ ] **Audit canonical tags site-wide for the `.html` bug pattern** (fixed in `Layout.astro` on 2026-07-19 for auto-generated category pages — confirm no other page types were affected, re-check Search Console's "Page with redirect" report in ~2-4 weeks to confirm the fix propagated).
- [ ] **Re-check Search Console weekly for a month** after these fixes to confirm: the `.html` canonical redirects clear, the `best-remote-job-boards` 404 clears, and no new issues appear.

## Priority 2 — AI discoverability (GEO — Generative Engine Optimization)

- [ ] **Create `public/llms.txt`.** The emerging convention (alongside robots.txt) for telling AI agents/crawlers what the site is and where the best content lives. Include: site purpose, links to pillar hub pages, and a short list of the strongest cornerstone articles per pillar.
- [ ] **Add FAQPage schema** to articles that have (or can have) a natural Q&A section — makes them eligible for Google AI Overviews and "People Also Ask," both major AI-citation surfaces now. Start with the top 10-15 target articles (see Priority 3 below).
- [ ] **Audit top target articles for "direct-answer" openings.** AI engines overwhelmingly cite content that states the answer in plain language near the top, before narrative build-up. Rewrite intros on money-keyword articles to lead with the answer, then expand.
- [ ] **Verify AI crawler access stays intact** on every robots.txt change going forward (GPTBot, Google-Extended, anthropic-ai, ClaudeBot, PerplexityBot, Applebot-Extended, cohere-ai are currently all explicitly allowed — don't accidentally regress this).
- [ ] **Consider adding an `Organization`/`Person` schema** on `/about` — reinforces E-E-A-T (the founder's real story is a strong authority signal, make sure it's machine-readable too).

## Priority 3 — Content strategy

- [ ] **Pick 10-15 "money" articles** (highest commercial/strategic value keywords across geo-arbitrage, lead-generation, remote-income) to become true cornerstone pieces:
  - [ ] Expand to 2,500+ words where currently under that (several "Deep Dive" pieces are 700-1,200 words — too thin to out-rank depth-heavy competitors)
  - [ ] Add FAQ schema (see above)
  - [ ] Tighten direct-answer opening (see above)
  - [ ] Add `updatedDate` and commit to revisiting quarterly
- [ ] **Consolidate the tag taxonomy.** 502 unique tags across only 114 posts — that's tag-per-post sprawl, not a real taxonomy (only 21 tags are indexed/allowlisted; the rest are correctly `noindex`'d so no duplicate-content harm, but it's near-zero internal-linking value). Target ~30-40 recurring tags that actually cluster multiple articles together.
- [ ] **Fix `RelatedPosts` to link by relevance, not randomly.** Currently picks 3 random same-pillar posts (`[...path].astro` sidebar logic). Switch to matching shared tags/keywords so internal links reinforce topical authority instead of being arbitrary.
- [ ] **Build 2-3 new cornerstone/pillar-defining articles per pillar** if any pillar's "Start Here" hub article is thin — this is what both Google and AI systems use to understand what the site is fundamentally about.
- [ ] **Set up a recurring content freshness cadence** (e.g. quarterly) to revisit and update the top-traffic articles — separate from the normal new-article publishing cadence already in place.

## Priority 4 — Backlinks (off-site, can't be automated from code)

- [ ] **Pull current backlink profile from Search Console's "Links" report** — establish the baseline before starting outreach.
- [ ] **Digital PR push using existing data content.** Cost-of-living comparisons, arbitrage calculators, and salary/purchasing-power breakdowns are exactly the kind of original-data content remote-work and finance journalists link to. Pitch existing articles (don't need new content) to niche newsletters and journalists covering remote work/digital nomad topics.
- [ ] **Set up HARO / Featured / Qwoted journalist-request monitoring** for "remote work," "digital nomad," "expat founder" queries. The founder's real story ($300K loss → rebuild) is a strong, repeatable hook for these responses.
- [ ] **Pitch guest posts / podcast appearances** on remote-work and indie-hacker platforms, linking back to specific cornerstone articles (not just the homepage) — pick the 10-15 money articles from Priority 3 as link targets.
- [ ] **Track backlink growth monthly** against the Search Console baseline to see what's working.

## Priority 5 — Ongoing maintenance (fold into normal practice once initial pass is done)

- [ ] Re-verify AI crawler allowlist and canonical tag correctness on every major routing/build config change.
- [ ] Keep IndexNow bulk submission on for every new/updated post going forward.
- [ ] Quarterly freshness pass on cornerstone content (`updatedDate` bump + fact-check any "2026"-dated claims).
- [ ] Revisit tag taxonomy discipline for every new article — don't let it sprawl back to one-off tags per post.
- [ ] Monthly Search Console health check (index coverage, redirects, canonical issues) as a standing habit, not just a one-time audit.

---

*Once every box above is checked and these practices are running as default behavior (not a special project), this file can be deleted — its job is done. Until then, keep it updated as the single source of truth for this effort.*
