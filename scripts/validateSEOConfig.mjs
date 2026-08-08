#!/usr/bin/env node
/**
 * Pre-deployment SEO Configuration Validator
 * Catches URL/sitemap/redirect misconfigurations before they reach production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const CHECKS = {
  pass: [],
  fail: [],
  warn: []
};

// ═══════════════════════════════════════════════════════════════
// CHECK 1: Astro Config Validation
// ═══════════════════════════════════════════════════════════════
function checkAstroConfig() {
  console.log('\n📋 CHECK 1: Astro Configuration...');

  try {
    const configPath = path.join(PROJECT_ROOT, 'astro.config.mjs');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Parse trailingSlash setting
    const trailingSlashMatch = configContent.match(/trailingSlash:\s*['"]([^'"]+)['"]/);
    const trailingSlash = trailingSlashMatch ? trailingSlashMatch[1] : null;

    if (!trailingSlash) {
      CHECKS.fail.push('❌ Could not parse trailingSlash setting from astro.config.mjs');
      return;
    }

    // Valid values: 'always', 'never', 'ignore'
    if (!['always', 'never', 'ignore'].includes(trailingSlash)) {
      CHECKS.fail.push(`❌ Invalid trailingSlash value: "${trailingSlash}" (must be "always", "never", or "ignore")`);
      return;
    }

    if (trailingSlash === 'never') {
      CHECKS.pass.push(`✓ trailingSlash is set to "never" (modern standard — clean URLs, single 301 for trailing slash variants)`);
    } else if (trailingSlash === 'ignore') {
      CHECKS.pass.push(`✓ trailingSlash is set to "ignore" (accepts both formats without redirecting)`);
    } else if (trailingSlash === 'always') {
      CHECKS.warn.push(`⚠ trailingSlash is "always" - legacy format, consider switching to "never" for modern standard`);
    }

  } catch (error) {
    CHECKS.fail.push(`❌ Failed to read astro.config.mjs: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// CHECK 2: Sitemap URL Consistency
// ═══════════════════════════════════════════════════════════════
function checkSitemapURLs() {
  console.log('\n📋 CHECK 2: Sitemap URL Format Consistency...');

  const sitemapFiles = [
    'dist/sitemap-0.xml',
    'dist/sitemap-index.xml',
    'dist/sitemap-core.xml',
    'dist/sitemap-hubs.xml'
  ];

  let foundIssue = false;
  const urlFormats = {};

  sitemapFiles.forEach(file => {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(fullPath)) return;

    const content = fs.readFileSync(fullPath, 'utf8');
    const urls = content.match(/<loc>([^<]+)<\/loc>/g) || [];

    const hasTrailing = urls.filter(u => u.endsWith('/')).length;
    const noTrailing = urls.length - hasTrailing;

    urlFormats[file] = {
      total: urls.length,
      trailing: hasTrailing,
      noTrailing: noTrailing
    };

    // Warn if mixed formats
    if (hasTrailing > 0 && noTrailing > 0) {
      CHECKS.warn.push(`⚠ ${file} has MIXED URL formats (${hasTrailing} with slash, ${noTrailing} without)`);
      foundIssue = true;
    }
  });

  if (!foundIssue && Object.keys(urlFormats).length > 0) {
    CHECKS.pass.push(`✓ All sitemaps use consistent URL format (no mixed trailing slashes)`);
  }
}

// ═══════════════════════════════════════════════════════════════
// CHECK 3: Robots.txt Points to Correct Sitemap
// ═══════════════════════════════════════════════════════════════
function checkRobotsTxt() {
  console.log('\n📋 CHECK 3: Robots.txt Sitemap Reference...');

  const robotsPath = path.join(PROJECT_ROOT, 'public/robots.txt');

  if (!fs.existsSync(robotsPath)) {
    CHECKS.warn.push('⚠ public/robots.txt not found (should be generated or included)');
    return;
  }

  const robotsContent = fs.readFileSync(robotsPath, 'utf8');

  if (!robotsContent.includes('Sitemap:')) {
    CHECKS.fail.push('❌ robots.txt missing Sitemap: directive');
    return;
  }

  const sitemapMatch = robotsContent.match(/Sitemap:\s*(.+)/);
  const sitemapUrl = sitemapMatch ? sitemapMatch[1].trim() : null;

  if (!sitemapUrl) {
    CHECKS.fail.push('❌ Could not parse Sitemap URL from robots.txt');
    return;
  }

  // Should point to sitemap-index.xml, not individual sitemaps
  if (sitemapUrl.includes('sitemap-index.xml')) {
    CHECKS.pass.push(`✓ robots.txt points to sitemap-index.xml`);
  } else if (sitemapUrl.includes('sitemap-0.xml')) {
    CHECKS.warn.push(`⚠ robots.txt points to sitemap-0.xml (should point to sitemap-index.xml for cleaner architecture)`);
  } else {
    CHECKS.warn.push(`⚠ robots.txt points to: ${sitemapUrl}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// CHECK 4: No Phantom Pages in Sitemap
// ═══════════════════════════════════════════════════════════════
function checkPhantomPages() {
  console.log('\n📋 CHECK 4: Phantom Pages Detection...');

  const knownPhantomPrefixes = [
    '/accident',
    '/internal',
    '/api/',
    '/cdn-cgi'
  ];

  const sitemapPath = path.join(PROJECT_ROOT, 'dist/sitemap-0.xml');
  if (!fs.existsSync(sitemapPath)) return;

  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urls = content.match(/<loc>([^<]+)<\/loc>/g) || [];

  let foundPhantom = false;
  knownPhantomPrefixes.forEach(prefix => {
    const phantomUrls = urls.filter(u => u.includes(prefix));
    if (phantomUrls.length > 0) {
      CHECKS.warn.push(`⚠ Found ${phantomUrls.length} URLs with prefix "${prefix}" in sitemap (should be filtered)`);
      foundPhantom = true;
    }
  });

  if (!foundPhantom) {
    CHECKS.pass.push(`✓ No phantom page prefixes detected in sitemap`);
  }
}

// ═══════════════════════════════════════════════════════════════
// CHECK 5: Config Comments & Documentation
// ═══════════════════════════════════════════════════════════════
function checkConfigDocumentation() {
  console.log('\n📋 CHECK 5: Configuration Documentation...');

  const configPath = path.join(PROJECT_ROOT, 'astro.config.mjs');
  const configContent = fs.readFileSync(configPath, 'utf8');

  if (configContent.includes('trailingSlash')) {
    // Check if there's a comment explaining the choice
    const lines = configContent.split('\n');
    const trailingSlashLine = lines.findIndex(l => l.includes('trailingSlash:'));

    if (trailingSlashLine > 0) {
      const nearbyLines = lines.slice(Math.max(0, trailingSlashLine - 3), trailingSlashLine).join('\n');
      if (nearbyLines.includes('//') || nearbyLines.includes('/*')) {
        CHECKS.pass.push(`✓ trailingSlash setting has documentation comment`);
      } else {
        CHECKS.warn.push(`⚠ trailingSlash setting lacks inline documentation (why was this value chosen?)`);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// CHECK 6: Canonical Tag Format Consistency
// ═══════════════════════════════════════════════════════════════
function checkCanonicalConsistency() {
  console.log('\n📋 CHECK 6: Canonical Tag Format Consistency...');

  const distPath = path.join(PROJECT_ROOT, 'dist');
  if (!fs.existsSync(distPath)) {
    CHECKS.warn.push('⚠ dist/ folder not found — skipping canonical check (run after build)');
    return;
  }

  // Determine expected format from config, not stale sitemap
  const configPath2 = path.join(PROJECT_ROOT, 'astro.config.mjs');
  const configContent2 = fs.readFileSync(configPath2, 'utf8');
  const tsMatch = configContent2.match(/trailingSlash:\s*['"]([^'"]+)['"]/);
  const tsConfig = tsMatch ? tsMatch[1] : 'ignore';

  // 'ignore' mode — both formats valid, skip strict check
  if (tsConfig === 'ignore') {
    CHECKS.pass.push('✓ Canonical check skipped — trailingSlash is "ignore" (both formats accepted)');
    return;
  }

  const sitemapUsesTrailing = tsConfig === 'always';

  // Scan built HTML files for canonical tags
  const htmlFiles = [];
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) scanDir(full);
      else if (entry.name.endsWith('.html')) htmlFiles.push(full);
    }
  }
  scanDir(distPath);

  let mismatches = 0;
  let checked = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/);
    if (!canonicalMatch) continue;

    const canonical = canonicalMatch[1];
    if (!canonical.startsWith('http')) continue;

    checked++;
    const canonicalHasTrailing = canonical.endsWith('/');

    if (sitemapUsesTrailing && !canonicalHasTrailing && !canonical.match(/\.[a-z]{2,4}$/i)) {
      mismatches++;
    } else if (!sitemapUsesTrailing && canonicalHasTrailing) {
      mismatches++;
    }
  }

  if (checked === 0) {
    CHECKS.warn.push('⚠ No canonical tags found in built HTML — verify canonicals are being rendered');
    return;
  }

  if (mismatches > 0) {
    CHECKS.fail.push(`❌ ${mismatches}/${checked} pages have canonical tags that don't match trailingSlash: "${tsConfig}" (expected ${sitemapUsesTrailing ? 'trailing slash' : 'no trailing slash'})`);
  } else {
    CHECKS.pass.push(`✓ All ${checked} canonical tags match trailingSlash: "${tsConfig}" format`);
  }
}

// ═══════════════════════════════════════════════════════════════
// CHECK 7: Blog Post canonicalUrl Matches Its Actual Route
// ═══════════════════════════════════════════════════════════════
// Added 2026-08-08 after discovering all 7 pillar hub.md articles declared
// canonicalUrl as a DIFFERENT page (the pillar overview), which told Google
// "don't index me, index that other URL instead" -- so the hub articles'
// actual unique content was never indexed. Every post's canonicalUrl must
// point at its own real URL (derived from its file path) unless it's
// explicitly listed in INTENTIONAL_CROSS_CANONICALS below with a comment
// explaining why. This is a hard failure, not a warning: a wrong canonical
// silently kills indexing with no visible symptom until you check Search
// Console weeks later.
function checkPostCanonicalMatchesRoute() {
  console.log('\n📋 CHECK 7: Blog Post canonicalUrl Matches Its Actual Route...');

  // Add an entry here only with a comment justifying why that specific post
  // should NOT self-canonicalize (e.g. genuine syndicated/duplicate content).
  const INTENTIONAL_CROSS_CANONICALS = {
    // 'pillar/slug': 'https://expatbuildr.com/actual-intended-canonical',
  };

  const blogRoot = path.join(PROJECT_ROOT, 'src/content/blog');
  if (!fs.existsSync(blogRoot)) {
    CHECKS.warn.push('⚠ src/content/blog not found — skipping canonicalUrl route check');
    return;
  }

  let checked = 0;
  let mismatches = 0;
  let missing = 0;

  for (const pillarDir of fs.readdirSync(blogRoot)) {
    const pillarPath = path.join(blogRoot, pillarDir);
    if (!fs.statSync(pillarPath).isDirectory()) continue;

    for (const file of fs.readdirSync(pillarPath)) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const key = `${pillarDir}/${slug}`;
      const expected = `https://expatbuildr.com/blog/${pillarDir}/${slug}`;
      const content = fs.readFileSync(path.join(pillarPath, file), 'utf8');
      const match = content.match(/^canonicalUrl:\s*"([^"]+)"/m);

      checked++;

      if (!match) {
        missing++;
        CHECKS.warn.push(`⚠ ${key} has no canonicalUrl set (expected: ${expected})`);
        continue;
      }

      const actual = match[1];
      const allowedOverride = INTENTIONAL_CROSS_CANONICALS[key];

      if (actual === expected || actual === allowedOverride) continue;

      mismatches++;
      CHECKS.fail.push(`❌ ${key}: canonicalUrl is "${actual}" but its real route is "${expected}" — this tells Google to index the OTHER page and silently kills indexing of this one`);
    }
  }

  if (mismatches === 0 && missing === 0) {
    CHECKS.pass.push(`✓ All ${checked} blog posts' canonicalUrl match their actual route`);
  } else if (mismatches === 0) {
    CHECKS.pass.push(`✓ No canonicalUrl mismatches found (${checked} posts checked, ${missing} missing canonicalUrl — see warnings)`);
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════
function main() {
  console.log('🔍 STARTING SEO PRE-DEPLOYMENT VALIDATION...\n');
  console.log('═'.repeat(60));

  checkAstroConfig();
  checkSitemapURLs();
  checkRobotsTxt();
  checkPhantomPages();
  checkConfigDocumentation();
  checkCanonicalConsistency();
  checkPostCanonicalMatchesRoute();

  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 VALIDATION RESULTS\n');

  if (CHECKS.pass.length > 0) {
    console.log('✅ PASSED:');
    CHECKS.pass.forEach(msg => console.log(`   ${msg}`));
  }

  if (CHECKS.warn.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    CHECKS.warn.forEach(msg => console.log(`   ${msg}`));
  }

  if (CHECKS.fail.length > 0) {
    console.log('\n❌ CRITICAL FAILURES:');
    CHECKS.fail.forEach(msg => console.log(`   ${msg}`));
    console.log('\n' + '═'.repeat(60));
    console.log('DEPLOYMENT BLOCKED: Fix failures above before deploying.\n');
    process.exit(1);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✓ SEO validation passed. Safe to deploy.\n');
  process.exit(0);
}

main();
