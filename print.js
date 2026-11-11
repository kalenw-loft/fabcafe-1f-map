/* ======================= Print composer — window.FC_PRINT ======================= */
(function(){
'use strict';
const MAP = window.FC_MAP;
if (!MAP) return;
const $ = s => document.querySelector(s);
const root = $('#print-root'), dlg = $('#pd');
if (!root || !dlg) return;
const FLOOR = (MAP.floor && MAP.floor()) || '1F', NORMAL = (MAP.normalJp && MAP.normalJp()) || '通常営業', SRC = (MAP.sourceNote && MAP.sourceNote()) || '';

const T = {
  en:{title:'Print', sub:'Pick the pages to print. Every page is A4 portrait.', map:'Floor plan', memo:'Staff sheet', restore:'Teardown: normal cafe layout',
    edit:'Edit', on:'PRINT', off:'SKIP', copies:'Print one per staff member — set the number of copies in the print dialog.',
    pdf:'To save a PDF, choose “Save as PDF” as the destination.', go:'Print', cancel:'Cancel', close:'Close',
    goPdf:'Save PDF to print', pdfDl:'Saves one A4 PDF with every page. Open it and print at 100%.', making:'Making PDF…', saved:'PDF saved', failed:'Could not make the PDF',
    pages:n => n === 1 ? '1 page' : n + ' pages', none:'Pick at least one page', warn:n => (n === 1 ? '1 overlap' : n + ' overlaps') + ' on the plan — you can still print.',
    memoEmpty:'Not filled in yet', isCafe:'Already the cafe layout', cafe:'通常営業 Cafe'},
  jp:{title:'印刷', sub:'印刷するページを選んでください。すべてA4縦です。', map:'配置図', memo:'当日シート', restore:'片付け用：通常営業の配置',
    edit:'編集', on:'印刷', off:'なし', copies:'バイトの人数分 印刷しましょう（部数は印刷画面で指定）',
    pdf:'PDFで保存するときは送信先で「PDFに保存」', go:'印刷する', cancel:'キャンセル', close:'閉じる',
    goPdf:'印刷用PDFを保存', pdfDl:'全ページを1つのA4 PDFにまとめて保存します。開いて「実際のサイズ」で印刷してください。', making:'PDFを作成中…', saved:'PDFを保存しました', failed:'PDFを作成できませんでした',
    pages:n => n + 'ページ', none:'ページを1つ以上選んでください', warn:n => '重なり ' + n + 'か所 — このまま印刷もできます',
    memoEmpty:'未入力', isCafe:'いまの配置が通常営業です', cafe:'通常営業 Cafe'}
};
const ALT = {map:['配置図', 'Floor plan'], memo:['当日シート', 'Staff sheet'], restore:['片付け用：通常営業の配置', 'Teardown: normal cafe layout']};
const lang = () => MAP.lang() === 'jp' ? 'jp' : 'en';
const t = (k, ...a) => { const v = T[lang()][k]; return typeof v === 'function' ? v(...a) : v; };
const hasMemo = () => !!(window.FC_MEMO && typeof window.FC_MEMO.renderSheet === 'function');
const memoData = () => { try { return hasMemo() && typeof FC_MEMO.get === 'function' ? FC_MEMO.get() || {} : {}; } catch(e){ return {}; } };
const ORDER = ['map', 'memo', 'restore'];

function el(tag, cls, txt){ const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
function bi(tag, cls, jp, en){ const n = el(tag, cls, jp); if (en) n.appendChild(el('small', null, en)); return n; }
const pad = n => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };

/* ---------- Is the current layout the normal cafe layout? ---------- */
const sig = items => (items || []).map(i => [i.type, Math.round(+i.x), Math.round(+i.y), ((Math.round(+i.rot || 0) % 360) + 360) % 360].join(':')).sort().join('|');
function isCafe(){
  const L = MAP.getLayout();
  if (/通常営業/.test(L.name || '')) return true;
  try { return sig(L.items) === sig(MAP.presetItems('cafe')); } catch(e){ return false; }
}
function defaults(){ return ORDER.filter(k => k === 'map' || (k === 'memo' && hasMemo()) || (k === 'restore' && !isCafe())); }

/* ---------- Inline SVG: unique ids + style scoped to .pp-svg (so it never restyles the live editor plan) ---------- */
let seq = 0;
function inlineSVG(str, label){
  let svg = null;
  try {
    const doc = new DOMParser().parseFromString(str, 'image/svg+xml');
    if (doc.documentElement && doc.documentElement.nodeName.toLowerCase() === 'svg' && !doc.querySelector('parsererror')) svg = document.importNode(doc.documentElement, true);
  } catch(e){}
  if (!svg){ const d = el('div'); d.innerHTML = str; svg = d.querySelector('svg'); if (!svg) return el('div'); }
  const uid = 'pp' + (++seq) + '-', ids = [];
  svg.removeAttribute('id');
  svg.querySelectorAll('[id]').forEach(n => { ids.push(n.id); n.id = uid + n.id; });
  const fix = s => ids.reduce((s, id) => s.split('url(#' + id + ')').join('url(#' + uid + id + ')'), s);
  svg.querySelectorAll('*').forEach(n => {
    for (const a of Array.from(n.attributes)){
      if (a.value.indexOf('url(#') > -1) n.setAttribute(a.name, fix(a.value));
      else if ((a.localName === 'href') && a.value[0] === '#' && ids.includes(a.value.slice(1))) n.setAttributeNS(a.namespaceURI, a.name, '#' + uid + a.value.slice(1));
    }
  });
  svg.querySelectorAll('style').forEach(st => {
    st.textContent = fix(st.textContent).replace(/([^{}]+)\{/g, (m, s) => s.split(',').map(x => 'svg.pp-svg ' + x.trim()).join(',') + '{');
  });
  svg.setAttribute('class', 'pp-svg');
  svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', label || 'FabCafe Tokyo ' + FLOOR);
  return svg;
}

/* ---------- Pages ---------- */
function frame(kind, kindEn, n, total){
  const p = el('section', 'print-page pp-' + kind.key);
  const head = el('header', 'pp-head'), brand = el('div', 'pp-brand');
  brand.append(el('span', 'pp-tag', 'FabCafe'), bi('span', 'pp-kind', kind.jp, kindEn));
  head.appendChild(brand); p.appendChild(head);
  const foot = el('footer', 'pp-foot');
  foot.append(el('span', null, 'FabCafe Tokyo ' + FLOOR + ' · ' + SRC + ' · 印刷 ' + today()), el('span', null, total > 1 ? n + ' / ' + total : ''));
  return {p, head, foot};
}
function legend(){
  const seen = new Set(), ul = el('ul', 'pp-legend');
  (MAP.annotations() || []).forEach(a => {
    const k = a.type + '|' + a.label + '|' + a.color; if (!a.label || seen.has(k)) return; seen.add(k);
    const li = el('li'), sw = el('span', 'pp-sw' + (a.type === 'note' ? ' note' : ''));
    if (a.type === 'zone' && a.color) sw.style.background = a.color;
    li.append(sw, el('span', null, a.label)); ul.appendChild(li);
  });
  return ul.children.length ? ul : null;
}
function stat(v, jp, en, cls){ const d = el('div', 'pp-stat' + (cls ? ' ' + cls : '')); d.append(el('b', null, String(v)), bi('span', null, jp, en)); return d; }

const PAGES = {
  map(n, total){
    const L = MAP.getLayout(), s = MAP.stats() || {}, m = memoData();
    const {p, head, foot} = frame({key:'map', jp:'配置図'}, 'Floor plan', n, total);
    head.appendChild(el('h1', 'pp-title', m.eventName || L.name));
    if (m.eventName && L.name && L.name !== m.eventName) head.appendChild(el('p', 'pp-sub', L.name));
    const meta = el('p', 'pp-meta');
    const add = (k, v) => { if (!v) return; const sp = el('span'); if (k) sp.appendChild(el('b', null, k)); sp.appendChild(document.createTextNode(v)); meta.appendChild(sp); };
    add('', m.date && window.FC_MEMO.fmtDate ? window.FC_MEMO.fmtDate(m.date) : m.date);
    if (m.tOpen) add('開場–終了', m.tOpen + (m.tEnd ? '–' + m.tEnd : ''));
    add('人数', m.guests);
    add('担当社員', m.staff);
    if (meta.children.length) head.appendChild(meta);
    const st = el('div', 'pp-stats');
    st.append(stat(s.seats || 0, '席', 'seats'), stat(s.tables || 0, 'テーブル', 'tables'), stat(s.standing || 0, '立ち見目安', 'standing'));
    if (s.clashes > 0) st.appendChild(stat(s.clashes, '重なり', 'overlaps — check', 'warn'));
    const plan = el('div', 'pp-plan'); plan.appendChild(inlineSVG(MAP.svg(), L.name));
    p.append(st, plan);
    const lg = legend(); if (lg) p.appendChild(lg);
    p.appendChild(foot);
    return p;
  },
  memo(n, total){
    if (!hasMemo()) return null;
    const p = el('section', 'print-page pp-memo'), box = el('div', 'pp-memo-box');
    p.appendChild(box);
    try { const r = FC_MEMO.renderSheet(box); if (r && r.nodeType && !box.contains(r)) box.appendChild(r); }
    catch(e){ console.error(e); return null; }
    return p;
  },
  restore(n, total){
    const {p, head, foot} = frame({key:'restore', jp:'片付け'}, 'Teardown', n, total);
    head.append(el('h1', 'pp-title', '片付け：' + NORMAL + 'に戻す'), el('p', 'pp-sub', FLOOR === '1F' ? 'Reset to the normal cafe layout' : 'Reset to the usual layout'));
    const ol = el('ol', 'pp-steps');
    [['借りた椅子・机はテープの印を見て元の階へ', 'Borrowed chairs/tables go back to their floor — check the tape marks'],
     ['準備のときに撮った写真と見比べる', 'Compare with the photo taken during setup'],
     ['終わったら担当社員に声をかける', 'Tell the staff member in charge when you are done']].forEach(([jp, en]) => ol.appendChild(bi('li', null, jp, en)));
    const plan = el('div', 'pp-plan'); plan.appendChild(inlineSVG(MAP.svg(MAP.presetItems('cafe'), NORMAL), NORMAL));
    p.append(ol, plan, foot);
    return p;
  }
};

function norm(pages){ const want = Array.isArray(pages) ? pages : defaults(); return ORDER.filter(k => want.includes(k) && (k !== 'memo' || hasMemo())); }
function build(pages){
  const keys = norm(pages), out = [];
  keys.forEach((k, i) => { try { const pg = PAGES[k](i + 1, keys.length); if (pg){ pg.dataset.page = k; out.push(pg); } } catch(e){ console.error(e); } });
  return out;
}
function compose(pages){
  root.textContent = '';
  build(pages).forEach(pg => root.appendChild(pg));
  return root.children.length;
}

/* ---------- Printing ---------- */
let composing = false, doneTimer = 0;
function finish(){ composing = false; clearTimeout(doneTimer); document.body.classList.remove('fc-printing'); window.removeEventListener('afterprint', finish); }
function print(pages){
  if (!compose(pages)){ MAP.toast(t('none')); return; }
  if (!dlg.hidden) close(true);
  composing = true; document.body.classList.add('fc-printing');
  window.addEventListener('afterprint', finish);
  try { window.print(); } catch(e){ console.error(e); }
  clearTimeout(doneTimer); doneTimer = setTimeout(finish, 1500);
}
/* ---------- PDF (the artifact frame blocks window.print, so pages are rasterized and saved) ---------- */
let dl = null;
(window.__dlP || Promise.resolve(null)).then(d => { dl = d || null; if (!dlg.hidden) renderChrome(); });
const H2C = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
let h2cP = null;
function loadH2C(){
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  return h2cP || (h2cP = new Promise((res, rej) => {
    const sc = document.createElement('script'); sc.src = H2C;
    sc.onload = () => window.html2canvas ? res(window.html2canvas) : rej(new Error('html2canvas'));
    sc.onerror = () => { h2cP = null; rej(new Error('html2canvas')); };
    document.head.appendChild(sc);
  }));
}
// one A4-portrait page per JPEG
function pdfFrom(jpgs){
  const enc = new TextEncoder(), parts = [], xref = []; let off = 0;
  const add = d => { const b = typeof d === 'string' ? enc.encode(d) : d; parts.push(b); off += b.length; };
  const obj = (n, body) => { xref[n] = off; add(n + ' 0 obj\n'); body(); add('\nendobj\n'); };
  const PW = 595.28, PH = 841.89, N = jpgs.length;
  add('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj(1, () => add('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => add('<< /Type /Pages /Kids [' + jpgs.map((_, i) => (3 + 3 * i) + ' 0 R').join(' ') + '] /Count ' + N + ' >>'));
  jpgs.forEach((j, i) => {
    const p = 3 + 3 * i, c = 'q ' + PW + ' 0 0 ' + PH + ' 0 0 cm /Im0 Do Q';
    obj(p, () => add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /XObject << /Im0 ' + (p + 1) + ' 0 R >> >> /Contents ' + (p + 2) + ' 0 R >>'));
    obj(p + 1, () => { add('<< /Type /XObject /Subtype /Image /Width ' + j.w + ' /Height ' + j.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + j.data.length + ' >>\nstream\n'); add(j.data); add('\nendstream'); });
    obj(p + 2, () => add('<< /Length ' + c.length + ' >>\nstream\n' + c + '\nendstream'));
  });
  const n = 3 + 3 * N, xo = off; let x = 'xref\n0 ' + n + '\n0000000000 65535 f \n';
  for (let i = 1; i < n; i++) x += String(xref[i]).padStart(10, '0') + ' 00000 n \n';
  add(x + 'trailer\n<< /Size ' + n + ' /Root 1 0 R >>\nstartxref\n' + xo + '\n%%EOF\n');
  return new Blob(parts, {type:'application/pdf'});
}
let saving = false;
async function savePDF(pages){
  if (saving) return;
  if (!compose(pages)){ MAP.toast(t('none')); return; }
  saving = true;
  const go = $('#pd-go'), lbl = go.lastElementChild; go.disabled = true; lbl.textContent = t('making');
  root.classList.add('pp-render');
  try {
    const h2c = await loadH2C();
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const jpgs = [], W = root.offsetWidth, H = root.offsetHeight;
    for (const pg of Array.from(root.children)){
      const c = await h2c(pg, {scale:2480 / pg.offsetWidth, backgroundColor:'#ffffff', logging:false, useCORS:true, scrollX:0, scrollY:0, windowWidth:Math.max(innerWidth, W), windowHeight:Math.max(innerHeight, H)});
      const b = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9));
      jpgs.push({data:new Uint8Array(await b.arrayBuffer()), w:c.width, h:c.height});
    }
    const L = MAP.getLayout(), m = memoData();
    const name = (String(m.eventName || L.name || 'layout').trim().replace(/[\\/:*?"<>|]+/g, ' ').slice(0, 60)) || 'layout';
    await dl.save({filename:'FabCafe ' + FLOOR + ' - ' + name + '.pdf', data:pdfFrom(jpgs)});
    close(true); MAP.toast(t('saved'));
  } catch(e){
    if (!(e && e.code === 'declined')){ console.error(e); MAP.toast(t('failed')); }
  } finally {
    root.classList.remove('pp-render'); saving = false;
    lbl.textContent = t(dl ? 'goPdf' : 'go'); sync();
  }
}
// plain Cmd+P / browser menu: still print proper pages (the dialog's picks if it is open)
window.addEventListener('beforeprint', () => { if (!composing) compose(dlg.hidden ? defaults() : ORDER.filter(k => picks[k])); });

/* ---------- Dialog ---------- */
let picks = {}, lastFocus = null;
const CHECK = '<svg class="i" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>';
function renderCards(){
  const box = $('#pd-pages'), L = MAP.getLayout(), m = memoData(), cafe = isCafe(), jp = lang() === 'jp';
  box.textContent = '';
  const keys = ORDER.filter(k => k !== 'memo' || hasMemo());
  const det = {map:L.name, memo:m.eventName || t('memoEmpty'), restore:cafe ? t('isCafe') : t('cafe')};
  keys.forEach(k => {
    const card = el('div', 'pd-page'), tog = el('button', 'pd-tog');
    tog.type = 'button';
    const flag = el('span', 'pd-flag'); flag.innerHTML = CHECK; flag.appendChild(el('span'));
    const th = el('div', 'pd-thumb'); th.setAttribute('aria-hidden', 'true');
    const pg = build([k])[0]; if (pg) th.appendChild(pg);
    const tx = el('span', 'pd-txt'), [a, b] = jp ? ALT[k] : [ALT[k][1], ALT[k][0]];
    tx.append(el('b', null, a), el('small', null, b), el('span', 'pd-det', det[k]));
    tog.append(th, tx);
    tog.addEventListener('click', () => { picks[k] = !picks[k]; sync(); });
    card.dataset.k = k; card.append(flag, tog);
    if (k === 'memo' && typeof FC_MEMO.open === 'function'){
      const ed = el('button', 'btn pd-edit', t('edit')); ed.type = 'button';
      ed.addEventListener('click', () => { close(true); FC_MEMO.open(); });
      card.appendChild(ed);
    }
    box.appendChild(card);
  });
  sync();
}
// toggles only flip state; thumbnails are rebuilt on open / layout change, not on every click
function sync(){
  const cards = Array.from($('#pd-pages').children);
  cards.forEach(c => { const on = !!picks[c.dataset.k]; c.classList.toggle('on', on); c.querySelector('.pd-tog').setAttribute('aria-pressed', String(on)); c.querySelector('.pd-flag').lastChild.textContent = on ? t('on') : t('off'); });
  const n = cards.filter(c => picks[c.dataset.k]).length;
  $('#pd-count').textContent = n ? t('pages', n) : t('none');
  $('#pd-go').disabled = !n;
}
function renderChrome(){
  $('#pd-title').textContent = t('title'); $('#pd-sub').textContent = t('sub');
  $('#pd-copies').textContent = t('copies'); $('#pd-pdf').textContent = t(dl ? 'pdfDl' : 'pdf');
  $('#pd-cancel').textContent = t('cancel'); if (!saving) $('#pd-go').lastElementChild.textContent = t(dl ? 'goPdf' : 'go');
  $('#pd-x').setAttribute('aria-label', t('close')); $('#pd-x').title = t('close');
  const c = +(MAP.stats() || {}).clashes || 0, w = $('#pd-warn');
  w.hidden = !c; w.lastElementChild.textContent = c ? t('warn', c) : '';
}
function open(opts){
  const want = opts && Array.isArray(opts.pages) ? opts.pages : defaults();
  picks = {}; ORDER.forEach(k => { picks[k] = want.includes(k); });
  if (!dlg.hidden){ renderChrome(); renderCards(); return; }
  lastFocus = document.activeElement;
  renderChrome(); renderCards();
  dlg.hidden = false;
  setTimeout(() => { const f = $('#pd-go'); (f.disabled ? $('#pd-cancel') : f).focus(); }, 0);
}
function close(silent){
  if (dlg.hidden) return;
  dlg.hidden = true; $('#pd-pages').textContent = '';
  if (!silent && lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch(e){}
}
const focusables = () => Array.from(dlg.querySelectorAll('button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(n => !n.closest('[hidden]') && !n.closest('.pd-thumb'));
// window capture: keys never reach the editor while the dialog is open, even when focus fell back to <body>
window.addEventListener('keydown', e => {
  if (dlg.hidden) return;
  e.stopPropagation();
  if (e.key === 'Escape'){ e.preventDefault(); close(); return; }
  if (e.key === 'Tab'){
    const f = focusables(); if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0){ e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === -1 || i === f.length - 1)){ e.preventDefault(); f[0].focus(); }
  }
}, true);
// focus that escapes the dialog (e.g. click on backdrop then Tab) is pulled back in
document.addEventListener('focusin', e => { if (!dlg.hidden && !dlg.contains(e.target)){ const f = focusables(); f.length && f[0].focus(); } });
dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
$('#pd-x').addEventListener('click', () => close());
$('#pd-cancel').addEventListener('click', () => close());
$('#pd-go').addEventListener('click', () => { const pg = ORDER.filter(k => picks[k]); dl ? savePDF(pg) : print(pg); });
const btn = $('#btn-print'); if (btn) btn.addEventListener('click', () => open());
MAP.onChange(() => { if (!dlg.hidden){ renderChrome(); renderCards(); } });

window.FC_PRINT = {open, close:() => close(), compose, print, savePDF, pdfFrom, defaults};
})();
