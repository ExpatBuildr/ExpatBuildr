import { promises as fs } from 'fs';
import path from 'path';

const INDEXNOW_KEY = "eb8248d2036248cc8da2a80695123d9b";
const HOST = "expatbuildr.com";

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
        const urlList = await getAllPosts();
        urlList.push(`https://${HOST}/`);
        urlList.push(`https://${HOST}/blog/`);

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
