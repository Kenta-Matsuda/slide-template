// Stop フック。エージェントが作業を終える前に slides.md を tools/check.cjs で確かめ、error があれば直すよう差し戻す
// - slides.md が前回の確認から変わっていないときは何もしない（.claude/.last-check に更新時刻を残す）
// - 差し戻した直後の停止（stop_hook_active）は止めない。無限に差し戻さないため
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  let input = {};
  try { input = JSON.parse(raw); } catch {}
  if (input.stop_hook_active) return;

  const root = path.resolve(__dirname, '..', '..');
  const slides = path.join(root, 'slides.md');
  const stamp = path.join(root, '.claude', '.last-check');
  if (!fs.existsSync(slides)) return;
  const mtime = String(fs.statSync(slides).mtimeMs);
  if (fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === mtime) return;

  let out = '', failed = false;
  try {
    out = execFileSync(process.execPath, [path.join(root, 'tools', 'check.cjs'), slides], { encoding: 'utf8' });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');
    failed = true;
  }
  fs.writeFileSync(stamp, mtime);
  if (!failed) return;
  const errors = out.split('\n').filter((l) => l.startsWith('ERROR')).join('\n');
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `npm run check で LESSONS.md 由来のルール違反が見つかった。直してから終えること（誤検出なら rules/check-rules.json を直し、その旨を発表者に伝える）。\n${errors}`,
  }));
});
