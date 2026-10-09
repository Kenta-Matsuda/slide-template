// assets/diagrams/*.html の #fig を PNG（2倍）に書き出す。出力は assets/diagrams/<名前>.png
// body に data-transparent="1" を付けると背景を透明にする（黒地のスライドに重ねるイラスト向け）
// 使い方: node tools/render-diagrams.cjs <chrome のパス> [名前 ...]
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const [, , browserPath, ...names] = process.argv;
const dir = path.resolve(__dirname, '..', 'assets', 'diagrams');
const files = names.length ? names.map((n) => n + '.html') : fs.readdirSync(dir).filter((f) => f.endsWith('.html'));

(async () => {
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
  for (const f of files) {
    await page.goto('file:///' + path.join(dir, f).replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 10000 });
    const fig = await page.$('#fig');
    const out = path.join(dir, f.replace(/\.html$/, '.png'));
    const transparent = await page.evaluate(() => document.body.dataset.transparent === '1');
    await fig.screenshot({ path: out, omitBackground: transparent });
    console.log('wrote', path.relative(process.cwd(), out));
  }
  await browser.close();
})();
