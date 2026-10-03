/* Real Chromium checks against the Jekyll artifact, driven by navigation.json. */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const nav = require('../navigation.json');
const coreTopicCount = (fs.readFileSync(path.resolve(__dirname, '../_data/core_topics.yml'), 'utf8').match(/^- title:/gm) || []).length;
const catalog = nav.groups.flatMap(group => group.pages).concat(nav.reference_pages || []);
const ordered = catalog.map(item => ({
  ...item,
  route: '/docs/' + path.basename(item.path, '.md') + '/'
}));
const sidebarTitles = nav.groups.flatMap(group => group.pages.map(item => item.title));

const siteRoot = path.resolve(__dirname, '../_site');
const evidence = path.resolve(__dirname, '../site-qa');
fs.mkdirSync(evidence, { recursive: true });

const base = '/algorithm-notes';
const server = spawn('python3', ['-c', `
from http.server import HTTPServer, SimpleHTTPRequestHandler
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=${JSON.stringify(siteRoot)}, **kwargs)
    def do_GET(self):
        if not self.path.startswith(${JSON.stringify(base + '/')}):
            self.send_error(404)
            return
        self.path = self.path[len(${JSON.stringify(base)}):]
        super().do_GET()
HTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
`], { stdio: 'ignore' });

const root = 'http://127.0.0.1:8765' + base;
const report = { checks: [], errors: [] };

(async () => {
  let browser;
  try {
    for (let retry = 0; retry < 100; retry++) {
      try { if ((await fetch(root + '/')).ok) break; } catch (_) {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
    page.on('pageerror', error => report.errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });

    async function open(url) {
      const response = await page.goto(root + url, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, url);
      await page.waitForFunction(
        () => [...document.querySelectorAll('.mermaid')].every(node => node.dataset.rendered === 'true'),
        { timeout: 30000 }
      );
      assert.equal(await page.locator('.render-error, .katex-error').count(), 0, url);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page overflow: ' + url);
    }

    await open('/');
    assert.equal(await page.locator('.knowledge-group').count(), nav.groups.length);
    assert.equal(await page.locator('.knowledge-topic').count(), coreTopicCount);
    assert.equal(await page.locator('.knowledge-overview a').count(), nav.groups.length);
    assert.deepEqual(await page.locator('.knowledge-group h3').allTextContents(), nav.groups.map(group => group.title));

    const brandLogo = page.locator('.navbar .brand__logo');
    assert.match(await brandLogo.getAttribute('src'), /logo-theme\.svg$/);
    const favicon = page.locator('link[rel="icon"]');
    assert.equal(await favicon.count(), 1);
    assert.match(await favicon.getAttribute('href'), /favicon-algorithm\.svg$/);

    const initialBackground = await brandLogo.evaluate(node => getComputedStyle(node).backgroundImage);
    await page.locator('#skinPicker > .navbar__icon-btn').click();
    await page.locator('[data-skin-set="violet"]').click();
    assert.equal(await page.locator('html').getAttribute('data-skin'), 'violet');
    assert.notEqual(await brandLogo.evaluate(node => getComputedStyle(node).backgroundImage), initialBackground);
    await page.locator('#skinPicker > .navbar__icon-btn').click();
    await page.locator('[data-skin-set="aqua"]').click();

    const docsNav = page.locator('.navbar a').filter({ hasText: '文档' }).first();
    assert.equal(await docsNav.getAttribute('href'), base + '/docs/');
    const primaryGuide = page.locator('.knowledge-actions .btn--primary');
    assert.equal(await primaryGuide.getAttribute('href'), base + ordered[0].route);

    await page.screenshot({ animations: 'disabled', path: path.join(evidence, 'home-desktop-light.png'), fullPage: true });
    report.checks.push('home, brand assets, theme switching and canonical navigation');

    await page.locator('#modeToggle').click();
    assert.equal(await page.locator('html').getAttribute('data-mode'), 'dark');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-mode'), 'dark');
    await page.locator('#modeToggle').click();

    await page.keyboard.press('/');
    await page.locator('#searchInput').fill(ordered[0].title);
    await page.waitForFunction(() => document.querySelectorAll('.search-result').length > 0);
    await page.keyboard.press('Escape');
    report.checks.push('mode persistence and search');

    await open('/docs/');
    assert.match(await page.locator('h1').textContent(), /完整目录/);

    for (const item of ordered) {
      await open(item.route);
      const actualSidebar = (await page.locator('#sidebar .sidebar__nav .sidebar__link').allTextContents()).map(text => text.trim());
      assert.deepEqual(actualSidebar, sidebarTitles, item.path + ': sidebar order');
      assert.equal(await page.locator('#sidebar .sidebar__nav .sidebar__link.is-active').count(), 1, item.path);
      for (const link of await page.locator('.doc-pager a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))) {
        assert.ok(link && link.startsWith(base + '/docs/'), item.path + ': pager URL');
      }
    }
    report.checks.push(`all ${ordered.length} catalog pages: identical sidebar order, active state and pager URLs`);

    await page.setViewportSize({ width: 2560, height: 1440 });
    await open('/');
    assert.ok(await page.locator('.knowledge-home').evaluate(node => node.getBoundingClientRect().width >= 1470), 'wide homepage uses desktop space');
    await open(ordered[0].route);
    assert.ok(await page.locator('.page-shell').evaluate(node => node.getBoundingClientRect().width >= 1600), 'wide documentation shell');
    assert.ok(await page.locator('#sidebar .sidebar__link').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 14.5), 'wide sidebar type');
    assert.ok(await page.locator('.toc').evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 14.5), 'wide TOC type');
    report.checks.push('2560px layout');

    await page.setViewportSize({ width: 390, height: 844 });
    await open('/');
    await page.screenshot({ animations: 'disabled', path: path.join(evidence, 'home-mobile.png') });
    await page.locator('#sidebarToggle').click();
    assert.equal(await page.locator('#sidebarToggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#sidebarToggle').getAttribute('aria-expanded'), 'false');

    await open(ordered[0].route);
    if (await page.locator('.mobile-toc').count()) {
      await page.locator('.mobile-toc summary').click();
      const target = await page.locator('.mobile-toc a').first().getAttribute('href');
      await page.locator('.mobile-toc a').first().click();
      await page.waitForFunction(hash => decodeURIComponent(location.hash) === decodeURIComponent(hash), target);
      assert.equal(await page.locator('.mobile-toc').getAttribute('open'), null);
    }

    await page.locator('#sidebarToggle').click();
    const lastGroup = nav.groups[nav.groups.length - 1];
    const groupToggle = page.locator('#sidebar .sidebar__group-title').filter({ hasText: lastGroup.title });
    if (await groupToggle.getAttribute('aria-expanded') === 'false') await groupToggle.click();
    const last = ordered[ordered.length - 1];
    await page.locator(`#sidebar .sidebar__nav a[href="${base}${last.route}"]`).click();
    await page.waitForURL('**' + last.route);
    assert.equal(await page.locator('#sidebarToggle').getAttribute('aria-expanded'), 'false');
    report.checks.push('mobile drawer and TOC');

    assert.deepEqual(report.errors, [], 'Browser console errors');
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    report.errors.push(String(error.stack || error));
    throw error;
  } finally {
    fs.writeFileSync(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
