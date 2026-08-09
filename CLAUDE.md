# ExpatBuildr — Claude Rules

This file defines standing rules specific to this repo. See `~/.claude/CLAUDE.md` for workspace-wide rules, including the reminder about the pending draft batch release schedule.

---

## Video Embed Matching

See `VIDEO-LIBRARY.md` — the registry of the user's YouTube videos and their blog article matches.

- **When writing or refreshing any blog article:** check `VIDEO-LIBRARY.md` for a topically-matching video before finishing. If one fits (Strong or Moderate), embed it or suggest it — don't skip this silently.
- **When the user shares a new video (title + link):** add it to `VIDEO-LIBRARY.md` under "Unmatched / needs review," then check it against the full blog for a fit, same as any other article-matching pass.
- Follow the matching rules and embed pattern documented at the bottom of `VIDEO-LIBRARY.md` — specificity over generality, one video per article, never force a sub-"Moderate" fit without flagging it, and flag any video whose title names a different brand/property before embedding it here.
- This is a permanent reference doc — do not delete it as the "current batch" gets embedded; keep adding to it as the channel grows.

---

## Article Publishing Cadence (Backdating Rule)

Every new article must slot into the publishing calendar at a natural 2–3 day cadence, alternating 2/3 articles per date. Never assign two articles the same date unless adjacent dates already make it look natural, and never more than 3 on the same date.

1. Find the last published (`draft: false`) article's `pubDate` that is on or before today's actual date — not a future-queued draft.
2. Continue the cadence forward from there.
3. New articles do not interact with the pending draft batch tracked in `~/.claude/CLAUDE.md` — they get the next open slot after all currently-scheduled dates (published or draft) are accounted for.

---

## Article Standards Checklist (source of truth: Notion "ExpatBuildr Content Strategy & Rules" and "ExpatBuildr Article Writing Guide")

These are the live rules confirmed in Notion. Apply them when writing a **new** article. For the ongoing freshness-refresh pass over the ~120 existing articles, the current scope is **factual/staleness corrections only** (dated claims, pricing, rebrands, tool/plan changes, dead links) — the broader items below (interlinking completeness, proprietary IP terms, thesis framing, em dashes, word count) are not being retrofitted onto old articles unless asked for as a separate pass.

**Author field:** `author: "ExpatBuildr"` is correct and intentional — it's the byline/handle, not a literal name field. Do not change it. (Resolved 2026-08-09 — Notion's "Tony Long II" reference describes who the handle belongs to, not a required frontmatter value.)

**The 5 interlinking rules — every article needs all 5:**
1. Pillar hub link somewhere in the body (`/blog/{pillar}`)
2. At least one related-article link within the same pillar
3. One contextual funnel link before the 40% mark (service intent → `/founders/offer`; automation/AI/time-arbitrage → `/automation-systems/automate`; digital products → `/shop`; newsletter/awareness/health/market-arbitrage → `/newsletter`)
4. Exact newsletter CTA line before the References section: `[Weekly intel for remote workers and founders](/newsletter)`
5. Pillar money-page link once in the body (`/{pillar}-links`, e.g. `/remote-income-links`)

**Banned on the blog (newsletter/products only — never publish these terms on expatbuildr.com/blog):**
- The Expat Wealth Flywheel
- The 7 Arbitrage Framework
- The Founder Arbitrage Score
- The Freedom Stack
- Stacked arbitrage combination plays (any content combining multiple pillars as a named play)
- Any framework with a proprietary name

**Core thesis framing (updated 2026-07-19) — applies to new content and any article getting a substantive rewrite:**
> Leave America, build a business abroad, and come back wealthier than when you left, or stay abroad happily ever after.

Both outcomes are legitimate, not a primary path + fallback. Avoid "someday you'll go home" framing — a meaningful share of the audience has no intention of returning, and treating that as temporary or lesser alienates the most engaged readers.

**Mechanical rules for new articles:**
- Zero em dashes (—) in body text — hard rule, rewrite instead
- No year in the title (breaks the 5-year-test: would this still read fine in 2031?)
- 1,600–2,400 words (never shorter than 1,600, never padded past 2,400)
- Frontmatter: exact schema from the Notion guide, no non-standard fields
- No tool-specific step-by-step configuration — principle + outcome only; implementation detail belongs in the newsletter
- 3–5 AISEO named entities (specific real tools/companies/places), 4–6 secondary keywords, one data table/list/comparison block minimum
- References section with 3–5 real sources at the end

Full detail lives in the two Notion pages above — read them directly for anything not summarized here (article structure template, cluster progression logic, audience description, SEO/AISEO specifics).
