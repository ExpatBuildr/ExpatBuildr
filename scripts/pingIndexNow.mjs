import { promises as fs } from 'fs';
import path from 'path';

// This key was generated directly from Bing Webmaster Tools' IndexNow flow for
// expatbuildr.com specifically -- the previous key was copied over from
// galaxybuilt.dev during the site migration and was never actually valid for
// this domain (it belonged to galaxybuilt.dev's verified property), which is
// why every submission 403'd with UserForbiddedToAccessSite regardless of how
// many times it was rotated.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "72d10283634c4727b9ef3150e229da0c";
const HOST = "expatbuildr.com";
// TEMP: new key just issued by Bing Webmaster Tools — submit only the homepage
// until Bing verifies this key, then switch back to the full bulk urlList below.
const SINGLE_URL_TRUST_BUILD = true;

async function getAllPosts() {
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    const urls = [];

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
                urls.push(`https://${HOST}/blog/${slug}`);
            }
        }
    }

    await walk(blogDir);
    return urls;
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
            urlList = await getAllPosts();
            urlList.push(`https://${HOST}/`);
            urlList.push(`https://${HOST}/blog/`);
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
