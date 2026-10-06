// slides.html を開き、各スライド内のリンク <a href> の位置をスライド比率 (0〜1) で書き出す
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const [, , htmlPath, outPath, browserPath] = process.argv;

(async () => {
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('file:///' + path.resolve(htmlPath).replace(/\\/g, '/'));
  const links = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('svg[data-marpit-svg]').forEach((svg, i) => {
      const section = svg.querySelector('section');
      const vb = svg.viewBox.baseVal;
      const sr = section.getBoundingClientRect();
      const sx = sr.width / vb.width;
      section.querySelectorAll('a[href]').forEach((a) => {
        for (const r of a.getClientRects()) {
          out.push({
            slide: i + 1,
            href: a.href,
            x: (r.left - sr.left) / sx / vb.width,
            y: (r.top - sr.top) / sx / vb.height,
            w: r.width / sx / vb.width,
            h: r.height / sx / vb.height,
          });
        }
      });
    });
    return out;
  });
  await browser.close();
  fs.writeFileSync(outPath, JSON.stringify(links, null, 2));
  console.log(`${links.length} link(s) measured`);
})();
