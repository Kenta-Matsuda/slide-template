// slides.md を自動で確かめる。教訓（LESSONS.md）のうち機械で確かめられるものを rules/check-rules.json に足していく
// 使い方: node tools/check.cjs [slides.md]
// 確かめること
//   - 構造: 各トラックの最初の扉（dark eye）の問いが目次（Tracklist）の行と同じか / 各スライドに発表者ノートがあるか / ノートの秒数の合計
//   - 言い回し: rules/check-rules.json の patterns（正規表現）
// error が1件でもあれば終了コード 1 で終わる。warn は表示だけ
const fs = require('fs');
const path = require('path');

const file = path.resolve(process.argv[2] || 'slides.md');
const rules = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'rules', 'check-rules.json'), 'utf8'));
const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

// front matter を除いてスライドに分ける
const body = src.replace(/^---\n[\s\S]*?\n---\n/, '');
const slides = body.split(/\n---\n/).map((t, i) => ({ no: i + 1, text: t }));
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, '').replace(/[？?。.]$/, '');
const out = [];
const add = (level, no, id, msg) => out.push({ level, no, id, msg });

// 目次の行
const toc = slides.find((s) => /### Tracklist/.test(s.text));
const tocRows = toc ? [...toc.text.matchAll(/<span class="n">(\d+)<\/span><span>([\s\S]*?)<\/span><\/div>/g)].map((m) => ({ n: m[1], t: strip(m[2]) })) : [];

let seconds = 0;
const seenDoor = new Set(); // トラックの最初の扉だけを目次と比べる（途中の扉は比べない）
for (const s of slides) {
  const cls = (s.text.match(/<!-- _class: ([^-]*?) -->/) || [])[1] || '';
  const notes = [...s.text.matchAll(/<!--\s*\n?([\s\S]*?)-->/g)].map((m) => m[1]).filter((t) => !/^\s*_/.test(t));
  const note = notes.join('\n');

  // ノート
  if (!/【ノート】/.test(note)) add('warn', s.no, 'NOTE', '発表者ノート（【ノート】）がない');
  const sec = note.match(/【ノート】\s*(\d+)\s*秒/);
  if (sec) seconds += Number(sec[1]);

  // 扉の問いと目次
  if (/\bdark\b/.test(cls) && /\beye\b/.test(cls) && tocRows.length) {
    const n = (s.text.match(/<div class="num">(\d+)<\/div>/) || [])[1];
    const big = (s.text.match(/<div class="big">([\s\S]*?)<\/div>/) || [])[1];
    const row = tocRows.find((r) => r.n === n);
    const first = n && !seenDoor.has(n);
    if (n) seenDoor.add(n);
    if (first && row && big) {
      const q = strip(big);
      if (!row.t.endsWith(q) && !row.t.includes(q)) add('error', s.no, 'DOOR', `扉の問い「${q}」が目次の行「${row.t}」と違う。同じ文にする`);
    }
  }

  // 言い回し（ノートは除く。見出しは heading、それ以外は body）
  const visible = s.text.replace(/<!--[\s\S]*?-->/g, '');
  for (const p of rules.patterns) {
    const re = new RegExp(p.regex, 'm');
    const target = p.where === 'heading' ? visible.split('\n').filter((l) => l.startsWith('## ')).join('\n') : visible;
    const m = target.match(re);
    if (m) add(p.level || 'error', s.no, p.id, `${p.message}（「${m[0]}」）`);
  }
}

if (seconds && rules.targetSeconds) {
  const diff = seconds - rules.targetSeconds;
  const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  console.log(`ノートの秒数の合計 ${mmss(seconds)}（目標 ${mmss(rules.targetSeconds)}）`);
  if (Math.abs(diff) > 30) add('warn', '-', 'TIME', `持ち時間から ${diff > 0 ? '+' : ''}${diff} 秒ずれている`);
}
for (const o of out) console.log(`${o.level === 'error' ? 'ERROR' : 'warn '} slide ${o.no} [${o.id}] ${o.msg}`);
const errors = out.filter((o) => o.level === 'error').length;
console.log(`${errors} error, ${out.length - errors} warn`);
process.exitCode = errors ? 1 : 0;
