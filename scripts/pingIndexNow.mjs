import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 2nd key rotation (2026-07-21). The previous key (72d1028...) got a clean
// 200/202 on a 1-URL trust-building submission on 2026-07-20, then 403'd with
// UserForbiddedToAccessSite the instant we jumped to the full ~116-URL bulk
// list on the very next deploy -- same key/host/keyLocation, nothing else
// changed. Bing Webmaster Tools' IndexNow dashboard subsequently stopped
// recognizing that key as verified at all (flashed a submission-history view,
// then reverted to "Get Started" / offered a new key), so whatever this was,
// it wasn't recoverable by retrying -- hence the fresh key below.
// DO NOT repeat the mistake: hold SINGLE_URL_TRUST_BUILD = true across several
// REAL, separately-timed deploys (actual days apart, not the next deploy in
// the same session) before flipping it. Only after multiple deploys come back
// clean should BULK_BATCH_SIZE be introduced, and even then ramp it in small
// steps (e.g. 5 -> 15 -> 30 -> all) with real time between each increase
// rather than jumping straight to everything again.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "d258eca3033e4c45b4f1fda88efbad3d";
const HOST = "expatbuildr.com";
const SINGLE_URL_TRUST_BUILD = true;
const BULK_BATCH_SIZE = 25;

async function getAllPosts() {
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    const posts = [];

    async function walk(dir) {
        const entries = await fs.readdir(dir);
        for (const entry of entries) {
            const fullPath = path.join(dir, entry);
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory()) {
                await walk(fullPath);
            } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
                const relativePath = path.relative(blogDir, fullPath);
                const slug = relativePath.replace(/\.mdx?$/, '').replace(/\\/g, '/');
                const { data } = matter(await fs.readFile(fullPath, 'utf-8'));
                const recency = new Date(data.updatedDate || data.pubDate || 0).getTime();
                posts.push({ url: `https://${HOST}/blog/${slug}`, recency });
            }
        }
    }

    await walk(blogDir);
    // Most recently published/updated first, so a capped batch always covers
    // whatever's newest instead of an arbitrary filesystem-walk order.
    posts.sort((a, b) => b.recency - a.recency);
    return posts.map(p => p.url);
}

async function ping() {
    console.log('🚀 IndexNow Automation: Syncing content to search engines...');

    try {
        let urlList;

        if (SINGLE_URL_TRUST_BUILD) {
            // Use a genuinely unindexed URL, not the homepage/contact/newsletter —
            // those are already indexed by Bing independent of IndexNow, so
            // submitting them would not prove the new key actually works.
            urlList = [`https://${HOST}/blog/ai-arbitrage/ai-chief-of-staff-for-your-business`];
            console.log('🔑 Trust-building submission: sending ONLY one unindexed article while the new key verifies.');
        } else {
            const allPosts = await getAllPosts();
            const capped = allPosts.slice(0, BULK_BATCH_SIZE);
            urlList = [`https://${HOST}/`, `https://${HOST}/blog/`, ...capped];
            if (allPosts.length > capped.length) {
                console.log(`ℹ️  Ramping submission size while this key builds trust: sending the ${capped.length} most recent posts out of ${allPosts.length} total this deploy.`);
            }
        }

        console.log(`Found ${urlList.length} unique nodes to index.`);

        const payload = {
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
            urlList: urlList.slice(0, 10000)
        };

        // Bing IndexNow
        try {
            const res = await fetch('https://www.bing.com/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(payload)
            });
            if (res.ok || res.status === 202) {
                console.log('✅ IndexNow Success: Content propagated to Bing, Yandex, and Seznam.');
            } else {
                const body = await res.text();
                console.warn(`⚠️  IndexNow: Bing responded ${res.status} — ${body}`);
            }
        } catch (err) {
            console.warn('⚠️  IndexNow: Bing ping failed (non-blocking):', err.message);
        }

        // IndexNow.org (broadcasts to multiple engines)
        try {
            const res2 = await fetch('https://api.indexnow.org/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(payload)
            });
            if (res2.ok || res2.status === 202) {
                console.log('✅ IndexNow.org: Submission accepted.');
            } else {
                const body2 = await res2.text();
                console.warn(`⚠️  IndexNow.org responded ${res2.status} — ${body2}`);
            }
        } catch (err2) {
            console.warn('⚠️  IndexNow.org ping failed (non-blocking):', err2.message);
        }

    } catch (err) {
        console.warn('⚠️  IndexNow Automation Error (non-blocking):', err.message);
    }
}

ping();
