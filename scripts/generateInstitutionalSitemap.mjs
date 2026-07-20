import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const HOST = 'expatbuildr.com';
const DIST_DIR = './dist';
const BLOG_SRC = './src/content/blog';
const XSL_PATH = '/sitemap-style.xsl';

// Configuration for Priorities
const CONFIG = {
    services: { priority: '1.0', changefreq: 'weekly' },
    briefings: { priority: '0.7', changefreq: 'monthly' },
    core: { priority: '0.8', changefreq: 'weekly' }
};

const date = new Date().toISOString();

function toIsoDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
}

function createUrlNode(entry, config) {
    const url = typeof entry === 'string' ? entry : entry.url;
    const lastmod = (typeof entry === 'object' && entry.lastmod) || date;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
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

// Pages with noindex set but that don't match the suffix patterns above
const SKIP_EXACT = [
    '/founders/payment-received',
    '/geo-arbitrage/confirmed',
    '/nfs/turbo',
    '/lead-gen/edge',
];

function shouldSkip(pathname) {
    return SKIP_PREFIXES.some(p => pathname.startsWith(p))
        || SKIP_SUFFIXES.some(s => pathname.endsWith(s))
        || SKIP_EXACT.includes(pathname);
}

async function run() {
    console.log('🚀 Engineering Institutional Sitemap Architecture...');

    const silos = {
        services: [],
        briefings: [],
        core: []
    };

    // URLs already covered by silos.briefings/services below -- used to keep
    // the Astro-generated sitemap-0.xml from re-listing the same post twice
    // when we fold its non-post pages into core.
    const coveredUrls = new Set();

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

                // Pillar Hub articles declare their pillar overview page as
                // their own canonical (see NON_CANONICAL_BLOG_PAGES in
                // astro.config.mjs) -- that overview page is what belongs in
                // the sitemap, and it's already covered via the core silo
                // below (folded in from sitemap-0.xml), not this raw slug.
                if (data.category === 'Pillar Hub') continue;

                const relativePath = path.relative(BLOG_SRC, fullPath);
                const slug = relativePath.replace(/\.mdx?$/, '').replace(/\\/g, '/');
                const url = `https://${HOST}/blog/${slug}`;
                const lastmod = toIsoDate(data.updatedDate) || toIsoDate(data.pubDate) || date;
                const entry = { url, lastmod };

                coveredUrls.add(url);
                if (data.category === 'Service') {
                    silos.services.push(entry);
                } else {
                    silos.briefings.push(entry);
                }
            }
        }
    }

    await walk(BLOG_SRC);

    // Fold every remaining Astro-generated URL (pillar overviews, tag pages,
    // category-listing pages, and all non-blog pages) into core, skipping
    // only what's already covered above -- this replaces sitemap-0.xml
    // entirely instead of shipping it as a second, duplicate sitemap.
    const astroSitemapPath = path.join(DIST_DIR, 'sitemap-0.xml');
    if (fs.existsSync(astroSitemapPath)) {
        const allUrls = extractUrlsFromXml(astroSitemapPath);
        for (const url of allUrls) {
            const pathname = new URL(url).pathname;
            if (shouldSkip(pathname)) continue;
            if (coveredUrls.has(url)) continue;
            silos.core.push(url);
        }
    }

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

    // Note: sitemap-0.xml (Astro's own auto-generated sitemap) is deliberately
    // NOT included here -- every URL worth keeping from it has already been
    // folded into core above, and re-adding it would list ~110+ blog posts a
    // second time (this was flagged by Ahrefs as "page in multiple sitemaps").

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
}

run().catch(console.error);
