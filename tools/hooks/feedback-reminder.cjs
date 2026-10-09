// UserPromptSubmit フック。発表者の発言が指摘・直しの指示らしいときに、教訓として記録するよう促す一言を足す
// 判定は語句だけの簡単なもの。外れても害はない（促すだけで、記録するかはエージェントが判断する）
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = JSON.parse(raw).prompt || ''; } catch { return; }
  const signals = /不自然|分からない|わからない|伝わらない|違う|ではなく|じゃなく|べき|してほしい|して欲しい|にして|直して|消して|統一感|混乱|無機質|小さい|読めない|意味がない/;
  if (!signals.test(prompt)) return;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: 'この発言には指摘・直しの指示が含まれるかもしれない。スライドを直したあと、ほかのデッキでも繰り返しそうな指摘なら /lesson で LESSONS.md に記録すること（このデッキだけの好みなら記録しない）。',
    },
  }));
});
