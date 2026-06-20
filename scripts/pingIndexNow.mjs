import { promises as fs } from 'fs';
import path from 'path';

const INDEXNOW_KEY = "339882e4b460f2a1d41095797bf60c40";
const HOST = "expatbuildr.com";
const INDEXNOW_API = "https://www.bing.com/indexnow";

async function getPillarFolders() {
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    const folders = await fs.readdir(blogDir);
    return folders;
}

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
            urlList: urlList
        };

        const response = await fetch(INDEXNOW_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ IndexNow Success: Content propagated to Bing, Yandex, and Seznam.');
        } else {
            console.error(`❌ IndexNow Failed: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.error('❌ IndexNow Automation Error:', err.message);
    }
}

ping();
