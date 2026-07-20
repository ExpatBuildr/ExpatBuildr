# Bing Webmaster Guidelines — Reference & Compliance Audit

**Purpose:** Permanent reference doc (unlike `SEO-STRATEGY-TODO.md`, this one doesn't get deleted — it's the standing rulebook to check new work against). Governs eligibility for Bing indexing/ranking, Copilot grounding, and citations.

**Last audited:** 2026-07-20, against the live ExpatBuildr codebase.

---

## 1. SEO Fundamentals Still Apply to Grounding and AI Experiences
Framing principle, no specific action — crawl efficiency, indexing accuracy, URL consolidation, content clarity, and authority signals support both traditional ranking and AI/grounding eligibility.

## 2. Make URLs Easy to Discover (IndexNow, sitemaps, crawlable internal links, external links)
- ✅ **IndexNow** — working correctly as of 2026-07-20 (see IndexNow root-cause fix history). Bulk submission runs on every deploy.
- ✅ **XML sitemaps** — `sitemap-index.xml`, referenced from `robots.txt`.
- ✅ **Crawlable internal links** — standard `<a href>` throughout; blog route uses `prerender = true` (SSG, not client-rendered).
- ⏳ **External links** — off-site backlink building is a content/outreach effort, tracked in `SEO-STRATEGY-TODO.md` Priority 4, not a code fix.

## 3. Use Sitemaps to Signal Importance and Freshness (canonical URLs only, reflect current structure, remove deleted/redirected URLs promptly, lastmod)
- ✅ **Canonical URLs only** — fixed 2026-07-20 (hub articles' non-canonical `/hub` slugs excluded; duplicate `sitemap-0.xml` listing removed).
- ✅ **Reflects current structure** — sitemap generator walks live content + Astro's route list on every build.
- ⚠️ **lastmod accuracy** — blog posts (`briefings`/`services` silos) use real `updatedDate`/`pubDate` from frontmatter — accurate. **Gap:** `core` silo entries (static non-blog pages, pillar overviews, tag/category pages) all get today's build date as `lastmod`, on every single deploy, regardless of whether that specific page's content changed. Not fixed — would need a git-mtime-per-file lookup or similar, and the guideline says "where applicable," so this is a known minor gap, not an active bug.

## 4. Notify Bing Quickly When URLs Change (prefer streaming over batch)
- ✅ **IndexNow notification exists and works.**
- ⚠️ **Batch vs streaming** — current setup submits the full URL list once per deploy (batch), not per-individual-change (streaming). Given the site's publishing cadence (2-3 articles every few days, not a high-velocity CMS), batch-per-deploy is the practical fit for a static-site-generator architecture — true streaming would need per-publish webhooks, which doesn't map cleanly onto a git-based content workflow. Documented as an accepted tradeoff, not a gap to fix.

## 5. Use Links to Establish Structure and Authority (standard `<a href>`, relevant anchor text/alt attributes)
- ✅ Standard `<a href>` links throughout, no JS-only navigation.
- ✅ Alt text fixed 2026-07-20 (Meta Pixel tracking images).
- ⏳ Anchor text is mostly descriptive; not exhaustively audited article-by-article.

## 6. Consolidate Duplicate URLs
- ✅ Canonical tags fixed (the `.html` bug, `og:url` mismatch).
- ✅ Sitemap duplication fixed (`sitemap-0.xml` was double-listing ~110 posts).
- ✅ `trailingSlash: 'never'` enforced site-wide with real 308 redirects.

## 7. Handle URL Moves with Proper Redirects (301 permanent, 302 only <2 days, redirects not canonical tags)
- ✅ Verified live: `astro.config.mjs` redirects return `301`. Trailing-slash redirects return `308` (also a permanent-redirect status, spec-compliant).
- ✅ Real redirects used for moved content (e.g. `best-remote-job-boards` slug rename), not just a canonical tag left on an orphaned URL.

## 8. Allow Efficient Crawling and Rendering
- ✅ Blog content is prerendered (SSG), not hidden behind client-side rendering.
- ✅ Gated content (`GatedContent.astro`) blurs via CSS but keeps full HTML in the DOM — crawlable.
- ✅ `robots.txt` does not block Bingbot.
- ⚠️ Tag taxonomy sprawl (502 tags across 114 posts, only 21 indexed) is a mild crawl-efficiency concern — already tracked as a content-strategy item in `SEO-STRATEGY-TODO.md`, not re-duplicated here.

## 9. Remove URLs Cleanly When Content Is Deleted (404, Bing Content Removal tools, IndexNow update)
- ✅ Sitemap generator already excludes `archived: true` / `draft: true` / `noindex: true` content correctly.
- ⚠️ **Gap:** `pingIndexNow.mjs` has no mechanism to explicitly notify IndexNow when a URL is removed — it only submits the current live URL list. No known deleted articles right now, so not an active bug, but **process note for the future**: if/when an article is actually deleted or unpublished, manually submit that specific URL to IndexNow (or extend the script to diff against the previous sitemap and submit removed URLs).

## 10. Use robots.txt and Meta Directives Correctly (robots.txt ≠ indexing control; noindex for exclusion)
- ✅ Verified: all 11 funnel pages matching `/thank-you`, `/success`, `/unlock` patterns have their own explicit `noindex` directive (either via `Layout`'s `noindex` prop or a raw `<meta name="robots">` tag) — not relying on the `robots.txt` block alone. Some pages use both mechanisms together, which is safe/redundant, not contradictory.
- ✅ No `NOARCHIVE`/`NOCACHE`/`NOSNIPPET` directives found anywhere in the codebase — nothing is inadvertently limiting Copilot grounding/citation depth.

## 11. Create Content That Is Clear, Focused, and Useful
Editorial/content-quality judgment, not code-auditable in bulk. General direction already covered in `SEO-STRATEGY-TODO.md` (cornerstone article depth, direct-answer openings for AI citation).

## 12. Optimize Images and Video for Understanding (descriptive file names, alt text, captions/transcripts)
- ✅ Alt text fixed for tracking pixels; content images (`heroImage`) render with `alt={post.data.title}`.
- ⚠️ **Gap:** hero images are generic, pillar-level stock photos reused across dozens of articles each (e.g. `/images/geo-arbitrage.jpg` shared site-wide) rather than descriptively-named, unique-per-article images. This is a content/asset production gap, not a quick code fix — noted for future asset work, not actioned here.
- No video content on the site currently — not applicable.

## 13. Structure Content Clearly Using HTML (title/meta description, heading hierarchy, semantic HTML)
- ✅ Title length issue fixed 2026-07-20 (brand suffix no longer eats the budget on blog posts).
- ✅ Meta description length fixed where genuinely broken (homepage too long, `contact.astro` too short).
- ⏳ Heading hierarchy (H1-H6 logical nesting) not exhaustively audited across all 114 articles.

## 14. Use Structured Data Accurately
- ✅ `BlogPosting` + `BreadcrumbList` JSON-LD present on every blog post, reflects actual visible content (title, description, dates, author).
- Not yet added: `FAQPage` schema — already tracked in `SEO-STRATEGY-TODO.md` Priority 2.

## 15. Ensure Content Can Be Verified Independently
Editorial judgment — facts/definitions explicit, not implied. Not code-auditable in bulk.

## 16. Define Entities Clearly and Consistently
- ✅ Consistent naming observed in spot checks (Tony Long II / ExpatBuildr used consistently, not ambiguous aliases).

## 17. Focus Each URL on a Single Topic
Editorial judgment per article. Site's pillar/category structure already enforces topical focus at the information-architecture level.

## 18. Surface Key Information Early
Directly ties to the "direct-answer opening" recommendation already in `SEO-STRATEGY-TODO.md` Priority 2 (AI citation).

## 19. Keep Content Accurate and Up to Date
- ⚠️ Ties directly to the existing `updatedDate` gap already tracked in `SEO-STRATEGY-TODO.md` Priority 1 (0 of 114 posts have ever set it).

## 20. Preserve URL Stability Over Time
- ✅ When URLs have changed (slug renames), real redirects were put in place rather than leaving the old URL dead.

## 21. Manage Crawl Efficiency and Reduce Crawl Waste
- ✅ Sitemap duplication eliminated 2026-07-20.
- ⚠️ Tag sprawl (502 tags) is the main remaining crawl-waste-adjacent item — tracked in `SEO-STRATEGY-TODO.md`.

## 22. Crawl Efficiency, Visibility, and Measuring Beyond Clicks
Monitoring practice, not a code item — worth remembering when reviewing Search Console/Bing Webmaster Tools/Ahrefs reports going forward: track impressions and indexing status, not just clicks.

---

## Summary of fixes made specifically from this audit (2026-07-20)
Everything else above was already-compliant or a pre-existing tracked item in `SEO-STRATEGY-TODO.md`; nothing new needed fixing beyond what that audit pass already covers as of this writing. This doc exists to check *future* work against, not just to log a one-time pass.
