// ノードの間に矢印を引く。wire('#a', '#b', {from:'r', to:'l', dash:false, hot:false, label:'…'})
// from / to は辺（l r t b）。座標は描画後に要素の位置から計算する。
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  function anchor(el, side, root) {
    const t = (el.dataset.self || (side === 'b' && el.classList.contains('node'))) ? el : (el.querySelector(':scope > img') || el);
    const r = t.getBoundingClientRect(), o = root.getBoundingClientRect();
    const x = r.left - o.left, y = r.top - o.top;
    return {
      l: [x - 4, y + r.height / 2], r: [x + r.width + 4, y + r.height / 2],
      t: [x + r.width / 2, y - 4], b: [x + r.width / 2, y + r.height + 4],
    }[side];
  }
  window.wire = function (a, b, o = {}) {
    const root = document.getElementById('fig'), svg = document.getElementById('wires');
    const A = anchor(document.querySelector(a), o.from || 'r', root);
    const B = anchor(document.querySelector(b), o.to || 'l', root);
    let pts = [A, B];
    if (o.elbow === 'h') pts = [A, [B[0], A[1]], B];
    if (o.elbow === 'v') pts = [A, [A[0], B[1]], B];
    if (o.elbow === 'hv') { const mx = (A[0] + B[0]) / 2; pts = [A, [mx, A[1]], [mx, B[1]], B]; }
    if (o.elbow === 'vh') { const my = (A[1] + B[1]) / 2; pts = [A, [A[0], my], [B[0], my], B]; }
    const color = o.hot ? '#ff4d00' : '#0c0c0c';
    const p = document.createElementNS(NS, 'polyline');
    p.setAttribute('points', pts.map(q => q.join(',')).join(' '));
    p.setAttribute('fill', 'none'); p.setAttribute('stroke', color); p.setAttribute('stroke-width', '2.5');
    if (o.dash) p.setAttribute('stroke-dasharray', '6 5');
    if (!o.noarrow) p.setAttribute('marker-end', o.hot ? 'url(#ah)' : 'url(#ak)');
    if (o.both) p.setAttribute('marker-start', o.hot ? 'url(#ahs)' : 'url(#aks)');
    svg.appendChild(p);
  };
  window.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('wires');
    svg.innerHTML = `<defs>
      <marker id="ak" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0c0c0c"/></marker>
      <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ff4d00"/></marker>
      <marker id="aks" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 0L0 5L10 10z" fill="#0c0c0c"/></marker>
      <marker id="ahs" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 0L0 5L10 10z" fill="#ff4d00"/></marker>
    </defs>`;
  });
})();
