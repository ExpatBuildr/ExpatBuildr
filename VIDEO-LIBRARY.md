# YouTube Video Library — Blog Embed Matching

**Purpose:** Registry of the user's YouTube videos, kept here so that whenever a blog article is created or refreshed, Claude can check this list for a topical match and embed (or suggest) the video automatically instead of the human having to remember what's on the channel.

**Status:** Living document. When the user shares a new video (title + link), add it below in "Unmatched / needs review" and check it against every pillar for a fit. When a new blog article is written, check it against every unmatched video below before publishing. When a video gets embedded in an article, move it to "Matched & embedded" with the article path.

**Embed pattern** (established in `src/content/blog/remote-income/phone-stolen-abroad-founder-security-setup.md`): place the embed high in the article — right after the opening paragraph(s), well before the 65% hard-gate cutoff (`GatedContent.astro`) so it's visible to every reader regardless of gating.

```html
<div class="video-embed">
  <iframe
    width="100%"
    height="480"
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="Video title as it appears on YouTube"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>
```

Keep the embed's `title` attribute matching the actual YouTube video title — it does not need to match the article's `title` frontmatter, and often shouldn't (see the phone-security article: video title and article title are deliberately different, article title is written for SEO/search intent, video title is whatever performs on YouTube).

---

## Matched & embedded

| Video | URL | Article |
|---|---|---|
| Your Phone Is the Only Key to Your Business... | https://youtu.be/5QWfgyUpjOw | `remote-income/phone-stolen-abroad-founder-security-setup.md` |
| I worked through a Philippines typhoon with no power | https://youtu.be/sSSDPww5gzY | `geo-arbitrage/typhoon-power-outage-philippines-remote-work.md` (standalone — see "Standalone articles" below) |

## Matched, not yet embedded (pending confirmation to execute)

| Video | URL | Best-fit article | Fit strength | Notes |
|---|---|---|---|---|
| He moved to the Philippines and lost it all | https://youtu.be/Hy6BUDClae8 | `geo-arbitrage/problems-with-being-a-digital-nomad.md` | Strong | Near-identical cautionary-tale premise |
| I lost $21,000 moving to the Philippines | https://youtu.be/zkQ9C-kUMts | `geo-arbitrage/how-to-move-to-southeast-asia-remote-worker-checklist.md` | Strong | Article description literally says "...and the mistakes most people make on the way" |
| 4 reasons expats go broke in the Philippines | https://youtu.be/eliDZqvuTd4 | `geo-arbitrage/how-to-calculate-your-expat-runway-by-founder-type.md` | Strong | Runway is the going-broke metric |
| I moved to Thailand without enough money | https://youtu.be/jbsVpoeBKA8 | `geo-arbitrage/cost-of-living-philippines-thailand-vietnam.md` | Strong | Direct cost-of-living mismatch theme |
| How founders stay in Thailand long term | https://youtu.be/TnMoYdY5_dA | `geo-arbitrage/thailand-ltr-visa-remote-worker.md` | Strong | Video is literally about the mechanism the article explains |
| Why $3,500/month feels like enough in the Philippines | https://youtu.be/_yNRlNyWC6E | `geo-arbitrage/austin-vs-manila-cost-of-living.md` | Strong | Philippines-specific cost/budget sufficiency |
| Why I chose the Philippines over Thailand | https://youtu.be/r6MRc1DR15Q | `geo-arbitrage/chiang-mai-vs-cebu-remote-work-base.md` | Strong | Direct country-comparison theme (city-level article, same decision) |
| I left everything for Cebu, Philippines — here's what happened | https://youtu.be/nRuXPh2MR0A | `geo-arbitrage/complete-guide-living-working-cebu-city.md` | Strong | Cebu-specific relocation narrative → Cebu guide |

## Unmatched / needs review

*(none currently)*

## Standalone articles (not part of a pillar cluster — built specifically to give a video a home)

Pattern: file lives in the topically-closest pillar folder for URL purposes, but frontmatter omits `pillarId` entirely so it's excluded from pillar hub listings, category pages, and pillar post counts. `gated: false`. Closing CTA links to `https://www.youtube.com/@ExpatBuildr` instead of the usual pillar/newsletter CTA. See the embed pattern and rules above.

| Video | URL | Status | Article |
|---|---|---|---|
| I worked through a Philippines typhoon with no power | https://youtu.be/sSSDPww5gzY | ✅ Published | `geo-arbitrage/typhoon-power-outage-philippines-remote-work.md` |
| You can't live abroad long term without building a brand | https://youtu.be/IDMZ1OLMGDM | ✅ Published | `remote-income/why-you-need-a-personal-brand-living-abroad.md` |
| Should you learn the language before moving to the Philippines (covers Tagalog *and* Bisaya/Cebuano) | https://youtu.be/253K3sGGgTE | Queued | — |
| How I Turn Blog Traffic into Targeted Newsletter Subs for Galaxy Arbitrage | *(link not yet provided)* | Queued — need URL | — |
| I Built an AI Bot That Finds Memecoins Before Crypto Twitter | *(link not yet provided)* | Queued — need URL | — |

## Held — off-channel or no fit

| Video | Note |
|---|---|
| How I Turn Blog Traffic into Targeted Newsletter Subs for Galaxy Arbitrage | Named a different brand (Galaxy Arbitrage). Topically closest to `lead-generation/seo-authority-loop-lead-generation.md`, but embedding a video that names a different project on ExpatBuildr risks reading as off-brand/confusing. Not in the confirmed 11-video channel list sent 2026-08-05 — confirm this is still meant for ExpatBuildr before acting on it. |
| I Built an AI Bot That Finds Memecoins Before Crypto Twitter | No genuine topical fit on the site. Closest is `market-arbitrage/crypto-borderless-business.md` (payments infra, not trading) — tonally mismatched. Not in the confirmed 11-video channel list sent 2026-08-05. Hold rather than force a placement. |

---

## Matching rules for future videos

1. Title-match first: does the video's topic map cleanly onto an existing article's `primaryKeyword`, `title`, or `description`?
2. Prefer specificity: a video about a specific city/country/number should go to the article with that same specificity, not a generic pillar-hub page.
3. One video per article. Don't stack multiple videos on the same page — the goal is also to spread `updatedDate` freshness signals across more pages, not concentrate them.
4. Never force a placement below "Moderate" fit without flagging it — a wrong-topic embed reads as filler and undermines trust in the article.
5. Branding check: if a video's title names a different property/brand (e.g. Galaxy Arbitrage, GAN), do not embed it into ExpatBuildr content without explicit confirmation — flag it instead.
6. When embedding, always set `updatedDate` on the article (this is a substantive edit) and follow the same review-then-apply flow as any other article change.
