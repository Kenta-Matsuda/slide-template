# slide-template

Marp で発表資料（PPTX）を作るためのテンプレートです。テーマ `talk2026`（白黒＋差し色1色・巨大タイポ・「アルバムのトラック」構成）と、PPTX にリンクを付けるスクリプトが入っています。

元は「最近AIでやったこと10選」（2026-09-30）の資料で作ったデザインです。

## 使い方

1. このリポジトリをコピーして新しいリポジトリを作る（GitHub の「Use this template」、または clone して `.git` を消す）
2. 依存を入れる

   ```bash
   npm install
   python -m pip install python-pptx
   ```

3. `slides.md` を書き換える。今の `slides.md` は部品の見本なので、使う部品だけ残す
4. 書き出す

   ```bash
   npm run build    # slides.pptx と slides.html を書き出し、PPTX のリンクを押せるようにする
   npm run images   # preview/ に各スライドの PNG を書き出す（見た目の確認用）
   npm run watch    # 編集しながら slides.html を更新し続ける
   ```

Claude Code で作るときは `CLAUDE.md` に作り方のルールがあります。

## ファイル

| ファイル | 内容 |
|---|---|
| `theme.css` | テーマ `talk2026` |
| `slides.md` | 部品の見本（14枚） |
| `tools/measure-links.cjs` | `slides.html` のリンクの位置を測って `links.json` に書き出す |
| `tools/add-pptx-links.py` | PPTX のその位置に透明なリンク領域を重ねる |
| `assets/` | 画像を置く場所 |

Marp の PPTX は各スライドが画像になるため、そのままではリンクを押せません。`npm run build` の最後の `npm run links` がこれを補います。

## ブラウザ

Marp CLI は Chrome でスライドを描画します。`package.json` は `C:/Program Files/Google/Chrome/Application/chrome.exe` を前提にしています。別の場所にあるときは、`package.json` の `--browser-path` と `links` の引数を書き換えてください。

## 構成の決まりごと

- **トラック**：発表を「アルバムの曲」に見立て、TRACK 01〜10 に分ける。
  - front matter の `header` に並べる `<i></i>` の数がトラックの数（最大10）。
  - 各スライドの `_class` に `t1`〜`t10` を付けると、上部のバーと左上の「TRACK 0N」が切り替わる。
  - 右下の巨大な番号は `<div class="num">01</div>`。
- **バーの長さ**：既定は均等。持ち時間に比例させたいときは、`slides.md` の先頭に `<style>` を置いて上書きする。

  ```html
  <style>
  section header .prog i:nth-child(1) { flex: 3; }
  section header .prog i:nth-child(2) { flex: 2; }
  </style>
  ```

- **ヘッダーの文言**：トラック外のページの「LIVE」と右上の「MADE WITH CLAUDE CODE」は、`theme.css` の `--header-label` / `--header-sub` で変える。
- **色とフォント**：`theme.css` の `:root`（`--ink` 黒、`--bone` 生成り、`--grey`、`--line`、`--hot` 差し色）。

## スライドの種類（`_class`）

| クラス | 用途 |
|---|---|
| `cover` | 表紙・締め。`_header: ''` と `_paginate: false` を一緒に付ける。タイトルは3行がおさまりがいい |
| `tN dark eye` | トラックの扉（黒地）。`### 英語の小見出し` ＋ `.big` の問いかけ |
| `tN` | 結論のスライド。`.big` ＋ `.rules` など |
| `tN dense` | 詳細のスライド。本文が一段小さくなる。`## 見出し` は1文で言い切る |
| `tN dense why` | 観点ごとに行をまとめた表（観点の変わり目だけ線を引く） |
| `dark` | 黒地。他と組み合わせる |

## 部品

見た目は `slides.md` を書き出して確認してください。

| 部品 | 用途 |
|---|---|
| `.big` / `.mid` | 大きな文。中で `.o`（白抜き）・`.hot`（差し色）が使える |
| `.lead` | 見出し直下の要約。`<em>` が差し色 |
| `.cols`（`.cols-73` / `.cols-37`） | 2列 |
| `.rules` > `.r`（`.hl`） | 見出し＋説明の行。結論のまとめに |
| `.stats` > `.s` > `.v` / `.k` | 数字タイル（4つ） |
| `.reasons` > `.rs`（`.key`） | 番号つきの理由（2列） |
| `.steps` > `.st`（`.hot`） | 手順（3列） |
| `.push` > `.p` > `.q` / `.r` | 一言とその結果の流れ |
| `.flow` > `.b` / `.a` / `.lbl` | 小さなフロー図。`.bigflow` は扉用の大きな版 |
| `.hbars` > `.hb`（`.q` / `.n`） | 横棒グラフ。幅は `style="width:NN%"` |
| `.race`（`.light` / `.small`） | 時間比較のバー |
| `.ba` > `.bx`（`.hot`） | BEFORE / AFTER の数字 |
| `.chat` > `.msg.me` / `.msg.ai` | チャットのやり取り |
| `.code`（`.marked`）＋ `.syn` | コード窓と、番号つきの説明 |
| `.errs` > `.e` | 間違いのリスト |
| `.team` > `.role` | 人数つきの役割 |
| `.tline` | 上限のあるタイムライン |
| `.shots` / `img.shot` | 実画面を矢印でつなぐ |
| `.evo` / `.fan` | サムネイルを並べる・重ねる |
| `.toolrows` / `.race` / `.keys` / `.prompt` / `.blank` | 扉のイラスト用 |
| `.rkgrid` / `.tl` / `.ti` / `.uses` | 順位の表示とアイコン |
| `.quote` / `.link` / `.note` / `.caption` / `.gloss` | 引用・出典リンク・注記・小見出し・用語の補足 |
| `.beta` / `.pill` | 告知の帯・小さなタグ |
| `.media` | 動画などの置き場所 |
| `.fill`（`.fill-lg`） | 未記入の箇所（点線枠） |

## 発表者ノート

ディレクティブではない HTML コメントが発表者ノートになります。

```markdown
<!--
【ノート】30秒。ここで言うこと。
-->
```
