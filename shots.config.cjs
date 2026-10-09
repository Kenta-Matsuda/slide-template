// tools/shoot.cjs の設定。npm run shots で、ここに書いた画面を assets/web/ に撮る
// 書き方は tools/shoot.cjs の先頭のコメントを参照
module.exports = {
  viewport: { width: 1800, height: 900 },  // 吹き出しが右にはみ出すときは width を広げる
  bubbleWidth: 340,
  shots: [
    {
      // 見本：手元の assets/web/sample-page.html。実際のデッキでは url: 'https://…' を書く
      name: 'sample.png',
      file: 'assets/web/sample-page.html',
      clip: { selector: '.wrap', pad: 24 },
      annotate: [
        { selector: 'nav button', pick: 1, text: 'タブ：押すと表示が切り替わる' },
        { selector: '.search', text: '検索：キーワードで絞り込む' },
        { selector: '#list li', pick: 0, text: '1件：タイトルと説明' },
      ],
    },
  ],
};
