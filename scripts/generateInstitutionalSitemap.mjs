import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const HOST = 'expatbuildr.com';
const DIST_DIR = './dist';
const BLOG_SRC = './src/content/blog';
const XSL_PATH = '/sitemap-style.xsl';

// Configuration for Priorities
const CONFIG = {
    hubs: { priority: '1.0', changefreq: 'weekly' },
    services: { priority: '1.0', changefreq: 'weekly' },
    briefings: { priority: '0.7', changefreq: 'monthly' },
    core: { priority: '0.8', changefreq: 'weekly' }
};

const date = new Date().toISOString();

function createUrlNode(url, config) {
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
}

function createSitemap(urls, config) {
    const nodes = urls.map(url => createUrlNode(url, config)).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${XSL_PATH}"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${nodes}
</urlset>`;
}

function extractUrlsFromXml(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const urls = [];
    const regex = /<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
        urls.push(match[1].trim());
    }
    return urls;
}

const SKIP_PREFIXES = [
    '/internal/',
    '/api/',
    '/cdn-cgi/',
    '/404',

];

const SKIP_SUFFIXES = [
    '/unlock',
    '/thank-you',
    '/success',
];

function shouldSkip(pathname) {
    return SKIP_PREFIXES.some(p => pathname.startsWith(p))
        || SKIP_SUFFIXES.some(s => pathname.endsWith(s));
}

async function run() {
    console.log('🚀 Engineering Institutional Sitemap Architecture...');

    const silos = {
        hubs: [],
        services: [],
        briefings: [],
        core: []
    };

    // Recursive walk through blog content
    async function walk(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                // Skip the archive folder — all content there is retired/draft
                if (path.basename(fullPath) === 'archive') continue;
                await walk(fullPath);
            } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const { data } = matter(content);

                if (data.draft) continue;
                if (data.archived) continue;
                if (data.noindex) continue;

                const relativePath = path.relative(BLOG_SRC, fullPath);
                const slug = relativePath.replace(/\.mdx?$/, '').replace(/\\/g, '/');
                const url = `https://${HOST}/blog/${slug}`;

                if (data.category === 'Pillar Hub') {
                    silos.hubs.push(url);
                } else if (data.category === 'Service') {
                    silos.services.push(url);
                } else {
                    silos.briefings.push(url);
                }
            }
        }
    }

    // Parse the Astro-generated sitemap for all landing pages
    const astroSitemapPath = path.join(DIST_DIR, 'sitemap-0.xml');
    const astroUrls = [];
    if (fs.existsSync(astroSitemapPath)) {
        const allUrls = extractUrlsFromXml(astroSitemapPath);
        for (const url of allUrls) {
            const pathname = new URL(url).pathname;
            if (shouldSkip(pathname)) continue;
            astroUrls.push(url);
            // Only include non-blog pages in core; blog pages go in their silos
            if (!pathname.startsWith('/blog/') && pathname !== '/blog') {
                silos.core.push(url);
            }
        }
    }

    await walk(BLOG_SRC);

    // Ensure dist exists
    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);

    // Write Silos
    const generatedFiles = [];
    for (const [key, urls] of Object.entries(silos)) {
        if (urls.length === 0) continue;
        const fileName = `sitemap-${key}.xml`;
        const content = createSitemap(urls, CONFIG[key]);
        fs.writeFileSync(path.join(DIST_DIR, fileName), content);
        generatedFiles.push(fileName);
        console.log(`✅ Generated: ${fileName} (${urls.length} nodes)`);
    }

    // Include the Astro-generated sitemap in the index too
    if (fs.existsSync(astroSitemapPath)) {
        generatedFiles.push('sitemap-0.xml');
    }

    // Write Index
    const indexFileName = 'sitemap-index.xml';
    const indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${XSL_PATH}"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedFiles.map(f => `  <sitemap>
    <loc>https://${HOST}/${f}</loc>
    <lastmod>${date}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
    
    fs.writeFileSync(path.join(DIST_DIR, indexFileName), indexContent);
    console.log(`🏆 Mastersheet Complete: ${indexFileName}`);

    // Ping IndexNow with all URLs from all sources only in production/CI
    if (process.env.CI || process.env.NODE_ENV === 'production' || process.env.CF_PAGES) {
        const allUrls = [
            ...Object.values(silos).flat(),
            ...astroUrls
        ];
        await pingIndexNow(allUrls);
    } else {
        console.log('⏭️  Skipping IndexNow ping for local development build.');
    }
}

async function pingIndexNow(urls) {
    if (urls.length === 0) return;

    const INDEX_NOW_KEY = '339882e4b460f2a1d41095797bf60c40';
    const host = 'expatbuildr.com';
    const payload = {
        host,
        key: INDEX_NOW_KEY,
        keyLocation: `https://${host}/${INDEX_NOW_KEY}.txt`,
        urlList: urls.slice(0, 10000)
    };

    // Submit to Bing IndexNow
    console.log(`🚀 IndexNow: Submitting ${urls.length} URLs to Bing...`);
    try {
        const res = await fetch('https://www.bing.com/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload)
        });
        if (res.ok || res.status === 202) {
            console.log('✅ IndexNow: Bing accepted the submission.');
        } else {
            const body = await res.text();
            console.warn(`⚠️  IndexNow: Bing responded ${res.status} — ${body}`);
        }
    } catch (err) {
        console.warn('⚠️  IndexNow: Bing ping failed (non-blocking):', err.message);
    }

    // Submit to IndexNow.org (broadcasts to Yandex + Seznam + others)
    console.log(`🚀 IndexNow: Submitting ${urls.length} URLs to IndexNow.org...`);
    try {
        const res2 = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload)
        });
        if (res2.ok || res2.status === 202) {
            console.log('✅ IndexNow: IndexNow.org accepted the submission.');
        } else {
            const body2 = await res2.text();
            console.warn(`⚠️  IndexNow: IndexNow.org responded ${res2.status} — ${body2}`);
        }
    } catch (err2) {
        console.warn('⚠️  IndexNow: IndexNow.org ping failed (non-blocking):', err2.message);
    }
}

run().catch(console.error);
