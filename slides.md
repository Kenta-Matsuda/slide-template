---
marp: true
theme: talk2026
paginate: true
size: 16:9
header: '<div class="prog"><i></i><i></i><i></i></div>'
---

<!--
このファイルは部品の見本です。新しいデッキを作るときは、必要なスライドだけ残して書き換えてください。
- header の <i> の数 = トラックの数（最大10）
- 各スライドの _class に t1〜t10 を付けると、上部のバーと「TRACK 0N」が切り替わる
-->

<!-- _class: cover -->
<!-- _header: '' -->
<!-- _paginate: false -->

<div class="rec">REC</div>

# タイトルは<br><span class="o">ここに</span>大きく<br><span class="hot">3</span>行で<span class="dot">.</span>

<div class="meta"><span>@your-id</span><span>MADE WITH <b>CLAUDE CODE</b></span></div>

<!--
【ノート】表紙。h1 の中で .o（白抜き）・.hot（差し色）・.dot（末尾の記号）が使える。
-->

---

<!-- _header: '' -->

### Tracklist

<div class="tracks">
<div class="row main"><span class="n">01</span><span>トラックの扉は問いかけで始める？</span></div>
<div class="row main"><span class="n">02</span><span>AとBどっちが速い？</span></div>
<div class="row"><span class="n">03</span><span>米国の事例は日本でも使える？</span></div>
</div>

<!--
【ノート】目次。持ち時間の配分はここのノートに書いておく。各トラックの扉の問いは、ここの行と同じ文にする（npm run check で確かめる）。
-->

---

<!-- _class: t1 dark eye -->

<div class="num">01</div>

### Subtitle In English

<div class="big">トラックの扉は<br><span class="o">問いかけで始める？</span></div>

<div class="cols" style="align-items:center">
<div class="prompt">&gt; 入力中のプロンプト<span class="caret"></span></div>
<div class="blank">?</div>
</div>

<!--
【ノート】扉（dark eye）。.num が右下に巨大な番号として出る。
-->

---

<!-- _class: t1 -->

<div class="num">01</div>

<div class="big">結論を大きく言う。<br><span class="hot">差し色で強調する。</span></div>

<div class="rules">
<div class="r hl"><span class="k">見出し</span><span>.r.hl は見出しが差し色になる</span></div>
<div class="r"><span class="k">見出し</span><span>説明は1行に収める</span></div>
<div class="r"><span class="k">見出し</span><span>3行くらいがちょうどいい</span></div>
</div>

<p class="quote">「引用文はここに」<span>── 発言者</span></p>

---

<!-- _class: t1 dense -->

<div class="num">01</div>

## 詳細スライドの見出しは1文で言い切る

<p class="lead">見出し直下の要約（.lead）。<em>em は差し色</em>になる。</p>

<div class="cols">
<div>

<p><b>左の列</b></p>

- 箇条書きのマーカーは差し色
- <b>太字</b>は 900 ウェイト
- `code` は枠付き

</div>
<div>

<p><b>右の列</b></p>

- .cols は 1:1、.cols-73 / .cols-37 で比率を変える
- 本文の文字サイズは 18px 以上にそろえる

<p class="note">.note は小さい灰色の注記</p>

</div>
</div>

<p class="link">出典：<a href="https://marpit.marp.app/">https://marpit.marp.app/</a></p>

<div class="gloss"><b>用語</b>：聞き慣れない言葉の補足は .gloss で下にまとめる</div>

---

<!-- _class: t1 dense -->

<div class="num">01</div>

## 数字タイルと番号つきの理由

<div class="stats">
<div class="s"><div class="v hot">669<small>行</small></div><div class="k">強調したい数字<br>補足は2行まで</div></div>
<div class="s"><div class="v">15<small>件</small></div><div class="k">ラベル</div></div>
<div class="s"><div class="v">7<small>本</small></div><div class="k">ラベル</div></div>
<div class="s"><div class="v">19<small>件</small></div><div class="k">ラベル</div></div>
</div>

<div class="reasons">
<div class="rs key"><b class="t"><i>01</i>一番言いたい理由</b>.rs.key は上の線が差し色になる</div>
<div class="rs"><b class="t"><i>02</i>理由の見出し</b>説明は2行くらいまで</div>
<div class="rs"><b class="t"><i>03</i>理由の見出し</b>2列で並ぶ</div>
<div class="rs"><b class="t"><i>04</i>理由の見出し</b>4つか6つがきれいに並ぶ</div>
</div>

---

<!-- _class: t2 dark eye -->

<div class="num">02</div>

### Versus

<div class="big">AとB<br><span class="o">どっちが速い？</span></div>

<div class="race">
<div class="rr"><span class="nm">Tool A</span><span class="lane"></span><span class="t">?</span></div>
<div class="rr"><span class="nm">Tool B</span><span class="lane"></span><span class="t">?</span></div>
</div>

<p class="caption">同じ条件でスタート</p>

---

<!-- _class: t2 dense -->

<div class="num">02</div>

## 横棒グラフと BEFORE / AFTER

<div class="cols" style="grid-template-columns: 1fr 1.25fr; align-items:center">
<div class="ba">
<div class="bx"><span class="k">BEFORE</span><span class="v">0<small>件</small></span><span class="d">変える前の説明</span></div>
<div class="bx hot"><span class="k">AFTER</span><span class="v">100<small>件</small></span><span class="d">変えた後の説明</span></div>
</div>
<div>

<p class="caption">グラフのタイトル（.caption）</p>

<div class="hbars">
<div class="hb n"><span class="nm">灰色（.hb.n）</span><span class="track"><span class="bar" style="width:2%;display:block"></span></span><span class="val">0</span></div>
<div class="hb"><span class="nm">通常</span><span class="track"><span class="bar" style="width:51%;display:block"></span></span><span class="val">51</span></div>
<div class="hb"><span class="nm">通常</span><span class="track"><span class="bar" style="width:48%;display:block"></span></span><span class="val">48</span></div>
<div class="hb q"><span class="nm">強調（.hb.q）</span><span class="track"><span class="bar" style="width:100%;display:block"></span></span><span class="val">100</span></div>
</div>

</div>
</div>

<div class="race light small">
<div class="rr"><span class="nm">Tool A</span><span class="bar" style="width:100%"></span><span class="t">2<small>時間</small></span></div>
<div class="rr hot"><span class="nm">Tool B</span><span class="bar" style="width:25%"></span><span class="t">30<small>分</small></span></div>
</div>

---

<!-- _class: t2 dense -->

<div class="num">02</div>

## 表は Markdown のまま書ける

| 項目 | 何が困るか | どうしたか |
|---|---|---|
| 1列目は太字 | 説明 | <span class="hot">.hot で差し色</span> |
| 行の線は細く | 説明 | 対応 |
| 見出し行は等幅 | 説明 | 対応 |

<div class="flow"><span class="lbl">従来</span><span class="b">入力</span><span class="a">→</span><span class="b">処理A</span><span class="a">→</span><span class="b">処理B</span><span class="a">→</span><span class="b">出力</span></div>
<div class="flow"><span class="lbl">今回</span><span class="b">入力</span><span class="a">→</span><span class="b hot">1つにまとめた処理</span><span class="a">→</span><span class="b">出力</span></div>

---

<!-- _class: t2 dense -->

<div class="num">02</div>

## 手順・押した一言の流れ

<div class="steps">
<div class="st"><span class="n">1</span><b>手順の見出し</b><span>説明</span></div>
<div class="st"><span class="n">2</span><b>手順の見出し</b><span>説明</span></div>
<div class="st hot"><span class="n">3</span><b>強調する手順</b><span>.st.hot で差し色</span></div>
</div>

<div class="push" style="margin-top:24px">
<div class="p"><span class="q">「人が言った一言」</span><span class="r">それでどう変わったか</span></div>
<div class="p"><span class="q">「次の一言」</span><span class="r">それでどう変わったか</span></div>
</div>

---

<!-- _class: t3 dark -->

<div class="num">03</div>

## チャットのやり取り

<div class="chat">
<div class="msg me"><span class="who">ME</span>自分の発言は右・差し色</div>
<div class="msg ai"><span class="who">AI</span>AIの発言は左・黒地</div>
</div>

<div class="gloss"><b>注</b>：やり取りは要約・デフォルメしている</div>

---

<!-- _class: t3 dense -->

<div class="num">03</div>

## コードと番号つきの説明

<div class="cols" style="grid-template-columns: 1fr 1fr; align-items:start">
<div class="code marked"><span class="k">---</span><span class="mk">①</span>
theme: talk2026
<span class="k">---</span>
<span class="c">&lt;!-- コメントは灰色 --&gt;</span><span class="mk">②</span></div>
<div class="syn">
<div class="s"><span class="n">①</span><span><b>説明</b>　コードの番号と対応させる</span></div>
<div class="s"><span class="n">②</span><span><b>説明</b>　<code>.k</code> は差し色、<code>.c</code> は灰色</span></div>
</div>
</div>

<div class="errs" style="margin-top:24px">
<div class="e"><span class="x">間違いの種類</span><span class="d">何がどう違ったか</span></div>
<div class="e"><span class="x">間違いの種類</span><span class="d">何がどう違ったか</span></div>
</div>

<div class="beta"><span class="tag">BETA</span><span><b>告知の帯。</b>リンクを添えられる<br><a href="https://example.com/">https://example.com/</a></span></div>

---

<!-- _class: t3 dense -->

<div class="num">03</div>

## 未記入の箇所は点線枠で残す

<div class="cols">
<div class="media">DEMO VIDEO</div>
<div>

<p>本文中の空欄：<span class="fill">あとで書く</span></p>

<span class="fill fill-lg">ブロックの空欄（.fill.fill-lg）</span>

</div>
</div>

---

<!-- _class: t3 dense -->

<div class="num">03</div>

## 画面の説明は、キャプチャに枠と吹き出しを付けて1枚で見せる

<img class="frame" src="assets/web/sample.png">

<!--
【ノート】画面は npm run shots で撮る（設定は shots.config.cjs）。小さいキャプチャを何枚も並べず、1枚を大きく載せる。
-->

---

<!-- _class: t3 dense -->

<div class="num">03</div>

## 構成図は AWS の公式アイコンで HTML から書き出す

<img class="wide" src="assets/diagrams/sample-arch.png">

<div class="gloss"><b>作り方</b>：assets/diagrams/sample-arch.html を書き換えて npm run diagrams。アイコンは npm run icons -- AmazonBedrock で取る</div>

---

<!-- _class: t3 dense list -->

<div class="num">03</div>

## 一覧の表と、あとで扱う項目を指す吹き出し

<p class="navpills">比べ方：<span class="pill hot">① 同じものを作る</span><span class="pill">② 要素を応用する</span></p>

| # | タイトル | 種類 | Lv |
|---|---|---|---|
| 1 | <a href="https://marp.app/">一覧の1件目（押すとリンク先が開く）</a> | ブログ | L200 |
| 2 | <a href="https://marp.app/">一覧の2件目</a> | GitHub | L300 |
| <span class="hot">3</span> | <a href="https://marp.app/">あとで詳しく扱う項目</a> | ブログ | L300 |

<div class="callout-up">#3 は、このあと TRACK 04 で詳しく紹介します</div>

<p class="note"><span class="sw" style="background:var(--ink)"></span>凡例の色見本（.sw）は図の色に合わせる</p>

---

<!-- _class: t3 dark eye -->

<div class="num">03</div>

### Question Pair

<div class="big">米国の事例は<br><span class="o">日本でも使える？</span></div>

<div class="qpair">
<div class="c"><b>米国</b>事例で何をしているか</div>
<div class="a">→</div>
<div class="c q"><b>日本では？</b>同じことができるか</div>
</div>

---

<!-- _class: cover -->
<!-- _header: '' -->
<!-- _paginate: false -->

<div class="rec">END</div>

# 締めの<br><span class="o">問いかけ</span>も<br>3行で<span class="dot">?</span>

<div class="meta"><span>GitHub <b>your-id</b></span><span>この資料は <b>CLAUDE CODE</b> が作りました</span></div>
