/* Verify DocSteer brand assets in a real Chromium browser. */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert/strict');

const siteRoot = path.resolve(__dirname, '../_site');
const baseurl = process.env.BASEURL;
const expectedLogo = process.env.EXPECTED_LOGO;
const expectedFavicon = process.env.EXPECTED_FAVICON;
const expectedGroups = Number(process.env.EXPECTED_GROUPS || 0);
const expectedTopics = Number(process.env.EXPECTED_TOPICS || 0);

if (!baseurl || !expectedLogo || !expectedFavicon) {
  throw new Error('BASEURL, EXPECTED_LOGO and EXPECTED_FAVICON are required');
}

const server = spawn('python3', ['-c', `
from http.server import HTTPServer, SimpleHTTPRequestHandler
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=${JSON.stringify(siteRoot)}, **kwargs)
    def do_GET(self):
        if not self.path.startswith(${JSON.stringify(baseurl + '/')}):
            self.send_error(404)
            return
        self.path = self.path[len(${JSON.stringify(baseurl)}):]
        super().do_GET()
HTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
`], { stdio: 'ignore' });

const root = 'http://127.0.0.1:8765' + baseurl;

(async () => {
  let browser;
  try {
    for (let retry = 0; retry < 100; retry++) {
      try {
        const response = await fetch(root + '/');
        if (response.ok) break;
      } catch (_) {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
    const response = await page.goto(root + '/', { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);

    assert.equal(await page.locator('.knowledge-home').count(), 1, 'knowledge map homepage exists');
    if (expectedGroups) assert.equal(await page.locator('.knowledge-group').count(), expectedGroups, 'knowledge group count');
    if (expectedTopics) assert.equal(await page.locator('.knowledge-topic').count(), expectedTopics, 'core topic count');
    assert.equal(await page.locator('.knowledge-groups').evaluate(node => getComputedStyle(node).display), 'grid');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'desktop page overflow');

    const brandLogo = page.locator('.navbar .brand__logo');
    assert.equal(await brandLogo.count(), 1, 'navbar brand logo exists');
    assert.match(await brandLogo.getAttribute('src'), new RegExp(expectedLogo.replace('.', '\\.') + '$'));

    const favicon = page.locator('link[rel="icon"]');
    assert.equal(await favicon.count(), 1, 'favicon link exists');
    assert.match(await favicon.getAttribute('href'), new RegExp(expectedFavicon.replace('.', '\\.') + '$'));

    const initialBackground = await brandLogo.evaluate(node => getComputedStyle(node).backgroundImage);
    assert.notEqual(initialBackground, 'none', 'brand logo has theme gradient');

    await page.locator('#skinPicker > .navbar__icon-btn').click();
    await page.locator('[data-skin-set="violet"]').click();
    assert.equal(await page.locator('html').getAttribute('data-skin'), 'violet');

    const violetBackground = await brandLogo.evaluate(node => getComputedStyle(node).backgroundImage);
    assert.notEqual(violetBackground, initialBackground, 'brand logo follows active skin');

    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto(root + '/', { waitUntil: 'networkidle' });
    assert.ok(await page.locator('.knowledge-home').evaluate(node => node.getBoundingClientRect().width >= 1470), 'wide homepage uses desktop space');
    assert.ok(await page.locator('html').evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 16.9), 'wide desktop root type scale');
    const docResponse = await page.goto(root + "/docs/introduction/", { waitUntil: 'networkidle' });
    assert.equal(docResponse.status(), 200);
    assert.ok(await page.locator('.page-shell').evaluate(node => node.getBoundingClientRect().width >= 1600), 'wide documentation shell');
    assert.ok(await page.locator('#sidebar .sidebar__link').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 14.5), 'wide sidebar type is readable');
    assert.ok(await page.locator('.toc').evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 14.5), 'wide TOC type is readable');

    async function sidebarSnapshot(pathname) {
      await page.goto(root + pathname, { waitUntil: 'networkidle' });
      return await page.locator('#sidebar .sidebar__link').evaluateAll(nodes => nodes.map(node => ({
        text: node.textContent.trim().replace(/\\s+/g, ' '),
        href: node.getAttribute('href'),
        active: node.classList.contains('active') || node.getAttribute('aria-current') === 'page',
        top: Math.round(node.getBoundingClientRect().top),
        cssOrder: getComputedStyle(node).order
      })));
    }

    const introSidebar = await sidebarSnapshot('/docs/introduction/');
    const patternSidebar = await sidebarSnapshot('/docs/pattern-guide/');
    console.log('INTRO_SIDEBAR=' + JSON.stringify(introSidebar));
    console.log('PATTERN_SIDEBAR=' + JSON.stringify(patternSidebar));

    async function assertPager(pathname, expectedPrev, expectedNext) {
      const pagerResponse = await page.goto(root + pathname, { waitUntil: 'networkidle' });
      assert.equal(pagerResponse.status(), 200, pathname + ' loads');

      const prev = page.locator('.doc-pager__prev');
      const next = page.locator('.doc-pager__next');

      if (expectedPrev) {
        assert.equal(await prev.count(), 1, pathname + ' has Previous');
        assert.equal((await prev.locator('.doc-pager__title').textContent()).trim(), expectedPrev.title);
        assert.ok((await prev.getAttribute('href')).endsWith(expectedPrev.href), pathname + ' Previous href');
      } else {
        assert.equal(await prev.count(), 0, pathname + ' has no Previous');
      }

      if (expectedNext) {
        assert.equal(await next.count(), 1, pathname + ' has Next');
        assert.equal((await next.locator('.doc-pager__title').textContent()).trim(), expectedNext.title);
        assert.ok((await next.getAttribute('href')).endsWith(expectedNext.href), pathname + ' Next href');
      } else {
        assert.equal(await next.count(), 0, pathname + ' has no Next');
      }
    }

    await assertPager('/docs/pattern-guide/', null, {
      title: '阅读说明',
      href: '/docs/introduction/'
    });
    await assertPager('/docs/introduction/', {
      title: '题型识别与解题套路',
      href: '/docs/pattern-guide/'
    }, {
      title: '面试冲刺路线',
      href: '/docs/interview-sprint/'
    });
    await assertPager('/docs/interview-sprint/', {
      title: '阅读说明',
      href: '/docs/introduction/'
    }, {
      title: '算法面试速查表',
      href: '/docs/cheat-sheet/'
    });
    await assertPager('/docs/cheat-sheet/', {
      title: '面试冲刺路线',
      href: '/docs/interview-sprint/'
    }, {
      title: '01 数组与双指针',
      href: '/docs/01-array-two-pointers/'
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(root + '/', { waitUntil: 'networkidle' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'mobile page overflow');

    console.log(JSON.stringify({
      ok: true,
      logo: await brandLogo.getAttribute('src'),
      favicon: await favicon.getAttribute('href'),
      skin: 'aqua -> violet'
    }));
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
