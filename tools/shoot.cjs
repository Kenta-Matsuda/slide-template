// Web ページの画面を撮り、注目してほしい場所に番号つきの枠と吹き出しを付けて PNG に書き出す
// 使い方: node tools/shoot.cjs <chrome のパス> [設定ファイル（既定: shots.config.cjs）] [撮る名前 ...]
//
// 設定ファイルの例は shots.config.cjs。1枚ごとに次を書く。
//   name      出力ファイル名（assets/web/ に書き出す）
//   url       開くページ。手元のファイルなら file に設定ファイルからの相対パスを書く
//   before    撮る前の操作。{ click: 'セレクタ' } / { wait: ミリ秒 } / { eval: (page) => {...} } の配列
//   hide      隠す要素のセレクタ（Cookie の帯など）
//   clip      撮る範囲。{ from: 'セレクタ', to: 'セレクタ', pad: 余白 } または { selector: 'セレクタ', pad: 余白 }
//   annotate  [{ selector, text, pick?, h?, w? }]。selector に合う要素に枠を付け、右の余白に吹き出しを並べる
//             pick: 同じセレクタに複数合うときの番号 / textIncludes: その文字を含む要素を選ぶ
//             h, w: 枠の高さ・幅を指定する（複数の要素をまとめて囲むとき）
// 吹き出しは本文の右の余白に、上から順に重ならないように並べる。撮る範囲は吹き出しが収まるように右と下へ広げる。
const path = require('path');
const puppeteer = require('puppeteer-core');

const [, , browserPath, configArg, ...only] = process.argv;
const configPath = path.resolve(configArg && configArg.endsWith('.cjs') ? configArg : 'shots.config.cjs');
const names = configArg && !configArg.endsWith('.cjs') ? [configArg, ...only] : only;
const config = require(configPath);
const OUT = path.resolve(path.dirname(configPath), config.out || 'assets/web');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ページの中で動かす：枠と吹き出しを描く
function installAnnotator(opt) {
  const st = document.createElement('style');
  st.textContent = `
    .ann-box { position: absolute; border: 4px solid ${opt.color}; border-radius: 6px; z-index: 99998; pointer-events: none; }
    .ann-bub { position: absolute; z-index: 99999; background: ${opt.color}; color: #fff; font: 700 24px/1.4 ${opt.font};
      padding: 8px 14px 8px 10px; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,.25); display: flex; gap: 10px; align-items: flex-start; }
    .ann-bub b { flex: none; display: inline-flex; width: 30px; height: 30px; border-radius: 50%; background: #fff; color: ${opt.color};
      align-items: center; justify-content: center; font: 800 18px/1 monospace; }
    .ann-dot { position: absolute; z-index: 99999; width: 34px; height: 34px; border-radius: 50%; background: ${opt.color}; color: #fff;
      display: flex; align-items: center; justify-content: center; font: 800 19px/1 monospace; }
  `;
  document.head.appendChild(st);
  window.__annBottom = -1e9;
  window.__annRight = 0;
  window.__ann = (a, n, gutterX) => {
    let els = [...document.querySelectorAll(a.selector)];
    if (a.textIncludes) els = els.filter((e) => e.innerText.includes(a.textIncludes));
    const el = els[a.pick || 0];
    if (!el) throw new Error('見つからない: ' + a.selector);
    const r = el.getBoundingClientRect(), sx = scrollX, sy = scrollY, pad = 6;
    const box = { x: r.left + sx - pad, y: r.top + sy - pad, w: (a.w ?? r.width) + pad * 2, h: (a.h ?? r.height) + pad * 2 };
    const b = document.createElement('div'); b.className = 'ann-box';
    Object.assign(b.style, { left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px' });
    document.body.appendChild(b);
    const d = document.createElement('div'); d.className = 'ann-dot'; d.textContent = n;
    Object.assign(d.style, { left: box.x - 17 + 'px', top: box.y - 17 + 'px' });
    document.body.appendChild(d);
    if (!a.text) return;
    const q = document.createElement('div'); q.className = 'ann-bub';
    q.innerHTML = `<b>${n}</b><span>${a.text}</span>`;
    q.style.width = window.__annWidth + 'px';
    document.body.appendChild(q);
    const y = Math.max(box.y, window.__annBottom + 14);
    Object.assign(q.style, { left: gutterX + 'px', top: y + 'px' });
    const qr = q.getBoundingClientRect();
    window.__annBottom = y + qr.height;
    window.__annRight = Math.max(window.__annRight, gutterX + qr.width);
  };
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
  const page = await browser.newPage();
  const vp = config.viewport || { width: 1680, height: 900 };
  await page.setViewport({ ...vp, deviceScaleFactor: config.scale || 2 });
  const opt = { color: config.color || '#ff4d00', font: config.font || '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif' };
  const bubbleWidth = config.bubbleWidth || 340;

  for (const s of config.shots) {
    if (names.length && !names.includes(s.name)) continue;
    const url = s.file ? 'file:///' + path.resolve(path.dirname(configPath), s.file).replace(/\\/g, '/') : s.url;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await sleep(s.waitMs ?? 800);
    if (s.hide) await page.addStyleTag({ content: `${[].concat(s.hide).join(',')}{display:none!important}` });
    for (const step of s.before || []) {
      if (step.click) await page.click(step.click);
      if (step.eval) await step.eval(page);
      await sleep(step.wait ?? 500);
    }
    await page.evaluate(installAnnotator, opt);
    await page.evaluate((w) => { window.__annWidth = w; }, bubbleWidth);

    // 撮る範囲の上下を決める
    const c = s.clip || { selector: 'body' };
    const rect = await page.evaluate((c) => {
      const box = (sel) => { const e = document.querySelector(sel); if (!e) throw new Error('見つからない: ' + sel); const r = e.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY }; };
      const a = box(c.from || c.selector), z = c.to ? box(c.to) : a;
      return { x: Math.min(a.x, z.x), y: a.y, r: Math.max(a.r, z.r), b: z.b };
    }, c);
    const pad = c.pad ?? 24;
    const gutterX = rect.r + 28;
    for (const [i, a] of (s.annotate || []).entries()) {
      await page.evaluate((a, n, g) => window.__ann(a, n, g), a, i + 1, gutterX);
    }
    const ext = await page.evaluate(() => ({ b: window.__annBottom, r: window.__annRight }));
    if (ext.r > vp.width) console.warn(`注意: ${s.name} の吹き出しが画面の幅（${vp.width}px）からはみ出す。viewport.width を ${Math.ceil(ext.r + 40)} 以上にする`);
    const x = Math.max(0, rect.x - pad), y = Math.max(0, rect.y - pad);
    const right = Math.max(rect.r + pad, ext.r + 24);
    const bottom = Math.max(c.height ? rect.y + c.height : rect.b + pad, ext.b + 24);
    await page.screenshot({ path: path.join(OUT, s.name), clip: { x, y, width: right - x, height: bottom - y }, captureBeyondViewport: true });
    console.log('wrote', path.relative(process.cwd(), path.join(OUT, s.name)));
  }
  await browser.close();
})();
