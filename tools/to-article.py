"""slides.md を、スライド 1 枚 ＋ その枚の発表者ノートを並べた記事（Qiita CLI の形式）に書き出す。

使い方: python -X utf8 tools/to-article.py [記事のファイル名] [--image-base URL]   （既定: article）
  - 先に npm run images で preview/ に PNG を書き出しておく。
  - public/<名前>.md と public/images/slide.NNN.png を作る。ignorePublish: true なので、Qiita CLI で誤って投稿されない。
  - ノートの「【ノート】N秒」と、括弧だけの行（演出の指示・付録の断り書き）は落とす。
  - 各枚のリンクは、その枚の下に「参考」として並べる。リンクを持つ表は行ごとの箇条書きにする。
  - 画像は Qiita CLI ではアップロードできない。公開して投稿するときは、どちらかにする。
    a) public/images/ の PNG を GitHub Pages のリポジトリ（登壇資料の置き場など）に push し、配信されたのを確かめてから
       --image-base https://<user>.github.io/<repo>/<path> を付けて書き出し直す（画像の URL がそこに向く）
    b) https://qiita.com/settings/image_upload で上げて、パスを手で置き換える
  - 投稿は、ignorePublish を false にしてから npx qiita publish <名前>。
"""
import html, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
base = None
if '--image-base' in args:
    i = args.index('--image-base')
    base = args[i + 1].rstrip('/')
    del args[i:i + 2]
name = args[0] if args else 'article'
src = open(os.path.join(ROOT, 'slides.md'), encoding='utf-8').read().replace('\r\n', '\n')
parts = src.split('\n---\n')[1:]  # 先頭は Marp の設定
os.makedirs(os.path.join(ROOT, 'public', 'images'), exist_ok=True)

def text(s):
    return html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'<br\s*/?>', '', s))).strip()

title = ''
out = []
for i, p in enumerate(parts):
    n = i + 1
    img = f'slide.{n:03d}.png'
    png = os.path.join(ROOT, 'preview', img)
    if not os.path.exists(png):
        sys.exit(f'{png} がない。先に npm run images を実行する')
    shutil.copy(png, os.path.join(ROOT, 'public', 'images', img))
    if not title:
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', p, re.S) or re.search(r'^# (.+)$', p, re.M)
        if h1:
            title = text(h1.group(1)).rstrip('.')
    # トラックの扉（dark eye）に見出しを付ける
    if re.search(r'_class:[^>]*\bdark\b[^>]*\beye\b', p):
        big = re.search(r'<div class="big">(.*?)</div>', p, re.S)
        num = re.search(r'<div class="num">(.*?)</div>', p)
        if big:
            label = f'TRACK {num.group(1)} ' if num and num.group(1).isdigit() else ('付録 ' if 'appendix' in p else '')
            out.append(f'## {label}{text(big.group(1))}\n')
    out.append(f'![スライド {n}]({base or './images'}/{img})\n')
    note = re.search(r'【ノート】\d+秒\n(.*?)\n-->', p, re.S)
    if note:
        lines = [l.strip() for l in note.group(1).split('\n')]
        lines = [l for l in lines if l and not (l.startswith('（') and l.endswith('）'))]
        out.append('\n\n'.join(lines) + '\n')
    body = p.split('<!--\n【ノート】')[0]
    rows = re.findall(r'^\| ([^|]+) \| (.*<a href.*) \|$', body, re.M)
    if rows:
        for k, v in rows:
            ls = [f'[{text(t)}]({h})' for h, t in re.findall(r'<a href="([^"]+)">(.*?)</a>', v)]
            out.append(f'- {k.strip()}：' + ' ／ '.join(ls))
        out.append('')
    else:
        ls = [f'[{text(t)}]({h})' for h, t in re.findall(r'<a href="([^"]+)">(.*?)</a>', body)]
        if ls:
            out.append('参考：' + ' ／ '.join(ls) + '\n')
    out.append('')

fm = f'''---
title: {title or name}
tags:
  - ''
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: true
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---
'''
dst = os.path.join(ROOT, 'public', f'{name}.md')
if os.path.exists(dst) and re.search(r'^id: (?!null)', open(dst, encoding='utf-8').read(), re.M):
    sys.exit(f'{dst} は投稿済み（id あり）。上書きすると Qiita との対応が切れるので、別の名前で書き出す')
open(dst, 'w', encoding='utf-8').write(fm + '\n'.join(out))
print(f'wrote {dst}（{len(parts)} 枚）')
