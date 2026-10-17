// slides.html を開き、スライドからはみ出した要素・下の余白に食い込んだ要素を書き出す
// 使い方: node tools/check-overflow.cjs slides.html <chrome のパス>
// - error: スライドの外（1280×720 の外）に出ている。PPTX では切れて見えない
// - warn : 下の余白（section の padding-bottom）に食い込んでいる。ページ番号や出典と重なりやすい
// 右下の巨大な番号（.num）とヘッダーは、わざとはみ出させているので除く
// 画像で見る確認（npm run images）の代わりではない。見落としやすい数 px のはみ出しを拾うためのもの
const path = require('path');
const puppeteer = require('puppeteer-core');

const [, , htmlPath = 'slides.html', browserPath] = process.argv;

(async () => {
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('file:///' + path.resolve(htmlPath).replace(/\\/g, '/'));
  await page.evaluate(() => document.fonts.ready);
  const found = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('svg[data-marpit-svg]').forEach((svg, i) => {
      const section = svg.querySelector('section');
      const vb = svg.viewBox.baseVal;
      const sr = section.getBoundingClientRect();
      const sx = sr.width / vb.width;
      const padBottom = parseFloat(getComputedStyle(section).paddingBottom) || 0;
      const reported = [];
      for (const el of section.querySelectorAll('*')) {
        if (el.closest('.num, header')) continue;
        if (reported.some((p) => p.contains(el))) continue; // 外側の要素を報告したら中は見ない
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const bottom = (r.bottom - sr.top) / sx;
        const right = (r.right - sr.left) / sx;
        const left = (r.left - sr.left) / sx;
        let level = '';
        if (bottom > vb.height + 1 || right > vb.width + 1 || left < -1) level = 'error';
        else if (bottom > vb.height - padBottom + 4) level = 'warn';
        if (!level) continue;
        reported.push(el);
        const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '';
        out.push({
          level,
          slide: i + 1,
          el: el.tagName.toLowerCase() + cls,
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30),
          bottom: Math.round(bottom),
          right: Math.round(right),
        });
      }
    });
    return out;
  });
  await browser.close();
  for (const f of found) {
    console.log(`${f.level === 'error' ? 'ERROR' : 'warn '} slide ${f.slide} ${f.el}「${f.text}」 下端 ${f.bottom}px / 右端 ${f.right}px`);
  }
  const errors = found.filter((f) => f.level === 'error').length;
  console.log(`${errors} error, ${found.length - errors} warn`);
  process.exitCode = errors ? 1 : 0;
})();
