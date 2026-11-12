/* ======================= 当日シート — FabCafe Tokyo event-night sheet for part-time staff =======================
   window.FC_MEMO = {get, set, open, close, renderSheet, onChange, plainText}
   Content is the approved notes (baito-notes-ja.md); this file only changes the format.
   v2: the 5 time cells became a flexible timeline (add/remove/reorder/rename/note/highlight, max 8 rows),
   with quick-add chips, 3 templates, two optional compact shifts, and a staffing-hint selector.
   Old saved memos (flat tMeet/tPrep/tOpen/tEnd/tLeave) migrate to rows automatically — see clean(). */
(() => {
'use strict';
const MAP = window.FC_MAP || null;
const FLOOR = (MAP && MAP.floor && MAP.floor()) || '1F';
const KEY = FLOOR === '1F' ? 'fabcafe-1f-map:memo:v1' : 'fabcafe-1f-map:' + FLOOR + ':memo:v1';
const MAPNAME = FLOOR + 'マップ';
const NORMAL = (MAP && MAP.normalJp && MAP.normalJp()) || '通常営業';
const TRASH_DEF = '';
const ROWS_MAX = 8;
const TEL = '03-6416-9190';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const toast = s => { if (MAP && MAP.toast) MAP.toast(s); };

const DRINK = {
  one:  {lab:'ワンドリンク', how:'ワンドリンク：ドリンクチケットを受け取る', sub:'チケットはなくさないように保管。終わったら枚数を数えて担当社員に伝える。追加のドリンクはカウンターで有料。'},
  order:{lab:'都度注文', how:'都度注文：お客さんにレジで注文と支払いをしてもらう', sub:''},
  free: {lab:'飲み放題', how:'飲み放題：ドリンク担当が自由に出す', sub:''},
  '':   {lab:'未定'}
};
// staffing hint (house rules) — internal only, never printed on the paper sheet
const STAFFMODE = {
  '':       {lab:'未定', hint:''},
  full3:    {lab:'フル/半面＋ドリンクあり', hint:'目安 3名：ドリンク担当・イベント／AV担当・レギュラーのバリスタ'},
  client1:  {lab:'お客様がドリンク・設営', hint:'目安 1名＋社員が立ち会い'}
};
const STAFFMODE_KEYS = Object.keys(STAFFMODE);
// quick-add chips for the timeline
const CHIPS = [
  ['受付開始', 'Reception start'], ['乾杯', 'Toast'], ['休憩', 'Break'], ['ゲスト到着', 'Guest arrival'],
  ['ラストオーダー', 'Last order'], ['撤収開始', 'Teardown start'], ['搬入', 'Load-in'], ['搬出', 'Load-out'], ['打ち合わせ', 'Briefing']
];
// default timeline (also what "初期値に戻す" restores, and what old flat memos migrate onto)
const TIMES_DEFAULT = [
  {id:'meet',  label:'集合・打刻',     sub:'Meet',   note:'', time:'',      highlight:false},
  {id:'prep',  label:'準備',          sub:'Set-up', note:'', time:'',      highlight:false},
  {id:'open',  label:'開場',          sub:'Doors',  note:'', time:'',      highlight:false},
  {id:'end',   label:'終了 → 片付け', sub:'End',    note:'', time:'21:30', highlight:false},
  {id:'leave', label:'退勤・打刻',    sub:'Leave',  note:'', time:'22:30', highlight:true}
];
const LEGACY_TIME_KEY = {meet:'tMeet', prep:'tPrep', open:'tOpen', end:'tEnd', leave:'tLeave'};
// 3 templates that fill the whole timeline (ids kept so legacy tOpen/tEnd/tLeave lookups keep working)
const TEMPLATES = {
  night:    {lab:'夜イベント', en:'Night event', hi:'leave', rows:[
    ['meet', '集合・打刻', 'Meet', ''], ['prep', '準備', 'Set-up', ''], ['open', '開場', 'Doors', ''],
    ['toast', '乾杯', 'Toast', ''], ['lastorder', 'ラストオーダー', 'Last order', ''],
    ['end', '終了 → 片付け', 'End', '21:30'], ['leave', '退勤・打刻', 'Leave', '22:30']
  ]},
  workshop: {lab:'昼ワークショップ', en:'Day workshop', hi:'leave', rows:[
    ['meet', '集合・打刻', 'Meet', ''], ['prep', '準備', 'Set-up', ''], ['reception', '受付開始', 'Reception', ''],
    ['open', '開始', 'Start', ''], ['break', '休憩', 'Break', ''],
    ['end', '終了 → 片付け', 'End', ''], ['leave', '退勤・打刻', 'Leave', '']
  ]},
  morning:  {lab:'朝会', en:'Morning meeting', hi:'leave', rows:[
    ['meet', '集合・打刻', 'Meet', ''], ['prep', '準備', 'Set-up', ''], ['open', '開始', 'Start', ''],
    ['end', '終了 → 片付け', 'End', ''], ['leave', '退勤・打刻', 'Leave', '']
  ]}
};

/* ---------- state + storage ---------- */
const SCALAR_DEF = {eventName:'', date:'', staff:'', staffContact:'', staffMode:'',
  guests:'', drink:'', keep:'', dishes:'', trash:TRASH_DEF, trashWhen:'', lights:'', lock:'', lostFound:'', extra:''};
const SCALAR_KEYS = Object.keys(SCALAR_DEF);
let rowSeq = 0;
const newRowId = () => 'r' + (Date.now().toString(36)) + (++rowSeq).toString(36);
function cleanRow(r, usedIds){
  r = (r && typeof r === 'object') ? r : {};
  let id = typeof r.id === 'string' && r.id ? r.id.slice(0, 24) : newRowId();
  while (usedIds.has(id)) id = newRowId();
  usedIds.add(id);
  return {
    id,
    label: String(r.label == null ? '' : r.label).slice(0, 24),
    sub: String(r.sub == null ? '' : r.sub).slice(0, 24),
    note: String(r.note == null ? '' : r.note).slice(0, 40),
    time: String(r.time == null ? '' : r.time).slice(0, 24),
    highlight: !!r.highlight
  };
}
function cleanRows(arr){
  const usedIds = new Set();
  let rows = Array.isArray(arr) && arr.length ? arr.slice(0, ROWS_MAX).map(r => cleanRow(r, usedIds)) : [];
  if (!rows.length) rows = TIMES_DEFAULT.map(r => cleanRow(Object.assign({}, r), usedIds));
  const hi = rows.filter(r => r.highlight);
  if (hi.length !== 1){ rows.forEach(r => { r.highlight = false; }); rows[rows.length - 1].highlight = true; }
  return rows;
}
function cleanShift(s){
  s = (s && typeof s === 'object') ? s : {};
  return {name: String(s.name == null ? '' : s.name).slice(0, 24), people: String(s.people == null ? '' : s.people).slice(0, 12),
    tMeet: String(s.tMeet == null ? '' : s.tMeet).slice(0, 16), tLeave: String(s.tLeave == null ? '' : s.tLeave).slice(0, 16)};
}
function clean(o){
  const r = Object.assign({}, SCALAR_DEF);
  if (o && typeof o === 'object') SCALAR_KEYS.forEach(k => { if (o[k] != null && typeof o[k] !== 'object') r[k] = String(o[k]).slice(0, 600); });
  if (!(r.drink in DRINK)) r.drink = '';
  if (STAFFMODE_KEYS.indexOf(r.staffMode) === -1) r.staffMode = '';
  const isLegacyFlat = o && typeof o === 'object' && o.rows == null && (o.tMeet != null || o.tPrep != null || o.tOpen != null || o.tEnd != null || o.tLeave != null);
  if (isLegacyFlat){
    r.rows = cleanRows(TIMES_DEFAULT.map(d => Object.assign({}, d, {time: String((o[LEGACY_TIME_KEY[d.id]] != null ? o[LEGACY_TIME_KEY[d.id]] : d.time) || '')})));
  } else {
    r.rows = cleanRows(o && o.rows);
  }
  const shiftsIn = o && Array.isArray(o.shifts) ? o.shifts : [o && o.shiftA, o && o.shiftB];
  r.shifts = [cleanShift(shiftsIn[0]), cleanShift(shiftsIn[1])];
  return r;
}
function readStore(){ try { const o = JSON.parse(localStorage.getItem(KEY)); if (o && o.byLayout && typeof o.byLayout === 'object') return o; } catch(e){} return {byLayout:{}}; }
function writeStore(){ try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e){} }
const store = readStore();
const cur0 = MAP ? MAP.getLayout() : {id:'draft', name:''};
let layoutId = cur0.id || 'draft', layoutName = cur0.name || '';
let memo = clean(store.byLayout[layoutId]);
let saveTimer = 0;
const listeners = [];
function flush(){ if (!saveTimer) return; clearTimeout(saveTimer); saveTimer = 0; store.byLayout[layoutId] = Object.assign({}, memo); writeStore(); }
function changed(fromForm){
  clearTimeout(saveTimer); saveTimer = setTimeout(flush, 350);
  if (!fromForm) fillForm();
  renderPreview();
  const snap = Object.assign({}, memo);
  listeners.forEach(fn => { try { fn(snap); } catch(e){ console.error(e); } });
}
window.addEventListener('pagehide', flush);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

/* ---------- row / shift / staffMode mutators ---------- */
function rowIndex(id){ return memo.rows.findIndex(r => r.id === id); }
function addRow(row){
  if (memo.rows.length >= ROWS_MAX){ toast('これ以上は追加できません（最大8行）'); return; }
  memo.rows.push(cleanRow(row, new Set(memo.rows.map(r => r.id))));
  changed(false);
}
function addChip(jp, en){ addRow({label: jp, sub: en || '', note: '', time: '', highlight: false}); }
function addBlankRow(){ addRow({label: '新しい項目', sub: 'New step', note: '', time: '', highlight: false}); }
function removeRow(id){
  if (memo.rows.length <= 1) return;
  const i = rowIndex(id); if (i < 0) return;
  const wasHi = memo.rows[i].highlight;
  memo.rows.splice(i, 1);
  if (wasHi) memo.rows[memo.rows.length - 1].highlight = true;
  changed(false);
}
function moveRow(id, dir){
  const i = rowIndex(id); if (i < 0) return;
  const j = i + dir; if (j < 0 || j >= memo.rows.length) return;
  const tmp = memo.rows[i]; memo.rows[i] = memo.rows[j]; memo.rows[j] = tmp;
  changed(false);
}
function setHighlight(id){
  if (rowIndex(id) < 0) return;
  memo.rows.forEach(r => { r.highlight = (r.id === id); });
  changed(false);
}
function setRowField(id, field, value){
  const r = memo.rows.find(x => x.id === id); if (!r) return;
  const max = field === 'note' ? 40 : 24;
  r[field] = String(value == null ? '' : value).slice(0, max);
  changed(true);
}
function applyTemplate(key){
  const t = TEMPLATES[key]; if (!t) return;
  const usedIds = new Set();
  memo.rows = t.rows.map(([id, label, sub, time]) => cleanRow({id, label, sub, note:'', time, highlight: id === t.hi}, usedIds));
  changed(false);
  toast(`テンプレート「${t.lab}」を入れました`);
}
function setShift(idx, field, value){
  const s = memo.shifts[idx]; if (!s) return;
  const max = field === 'name' ? 24 : field === 'people' ? 12 : 16;
  s[field] = String(value == null ? '' : value).slice(0, max);
  changed(true);
}

/* ---------- formatting helpers ---------- */
const has = v => !!String(v || '').trim();
const ln = (cls) => `<span class="ln${cls ? ' ' + cls : ''}"></span>`;
const val = (v, cls, lineCls) => has(v) ? `<span class="${cls || 'c2'}">${esc(v.trim())}</span>` : ln(lineCls);
const WD = '日月火水木金土';
function fmtDate(s){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
  if (!m) return String(s || '').trim();
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return `${+m[1]}年${+m[2]}月${+m[3]}日（${WD[d.getDay()]}）`;
}
function normTimeToken(v){
  let m = /^(\d{1,2})(\d{2})$/.exec(v); if (m) v = m[1] + ':' + m[2];
  m = /^(\d{1,2})[:.時](\d{2})分?$/.exec(v); if (m && +m[1] < 30 && +m[2] < 60) v = m[1].padStart(2, '0') + ':' + m[2];
  return v;
}
const RANGE_SPLIT = /\s*[-–—~〜]\s*/;
function normTime(s){
  let v = String(s || '').replace(/[０-９：]/g, c => c === '：' ? ':' : String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).trim();
  if (!v) return '';
  if (/^[-–—~〜ー]+$/.test(v)) return '〜'; // a bare dash/tilde = "ongoing / see handwriting", kept as-is
  const parts = v.split(RANGE_SPLIT);
  if (parts.length === 2 && parts[0] && parts[1]) return normTimeToken(parts[0]) + '–' + normTimeToken(parts[1]);
  return normTimeToken(v);
}
const guestsTxt = g => /^\s*\d+\s*$/.test(g) ? g.trim() + '名' : g.trim();
const timeCell = v => has(v) ? `<span class="num">${esc(v.trim())}</span>` : '<span class="blank"><i></i><b>:</b><i></i></span>';
function rowTime(m, id){ const r = m.rows.find(x => x.id === id); return r && has(r.time) ? r.time.trim() : ''; }
function leaveTxt(){
  const hi = memo.rows.find(r => r.highlight) || memo.rows[memo.rows.length - 1] || {};
  if (has(hi.time)) return hi.time.trim();
  return has(hi.label) ? hi.label.trim() : '退勤時刻';
}

/* ---------- the sheet (one A4 page) ---------- */
function rowsHTML(m){
  const rows = m.rows, n = rows.length, two = n > 5;
  const cols = two ? 4 : Math.max(1, n);
  const items = rows.map(r => `<li${r.highlight ? ' class="go"' : ''}><span class="k">${esc(r.label.trim() || '（無題）')}</span><span class="v">${timeCell(r.time)}</span>${has(r.note) ? `<span class="rn">${esc(r.note.trim())}</span>` : ''}</li>`).join('');
  return `<section class="ms-times${two ? ' two-row' : ''}" aria-label="時間">
  <ol style="--cols:${cols}">${items}</ol>
  <p class="note"><b>${esc(leaveTxt())}を過ぎそうなとき</b>は、気づいた時点で担当社員に伝えてください。残業は、社員から頼まれたときだけです。</p>
</section>`;
}
function shiftsHTML(m){
  const labels = ['シフトA', 'シフトB'], parts = [];
  m.shifts.forEach((s, i) => {
    if (!(has(s.name) || has(s.people) || has(s.tMeet) || has(s.tLeave))) return;
    parts.push(`<div class="sh"><b class="tag">${labels[i]}</b>${has(s.name) ? `<span class="nm">${esc(s.name.trim())}</span>` : ''}${has(s.people) ? `<span>${esc(guestsTxt(s.people))}</span>` : ''}${has(s.tMeet) ? `<span>集合<b class="tm"> ${esc(s.tMeet.trim())}</b></span>` : ''}${has(s.tLeave) ? `<span>退勤<b class="tm"> ${esc(s.tLeave.trim())}</b></span>` : ''}</div>`);
  });
  return parts.length ? `<section class="ms-shifts" aria-label="シフト">${parts.join('')}</section>` : '';
}
function sheetHTML(m){
  const d = DRINK[m.drink] ? m.drink : '';
  const drink = d
    ? `<p class="how">${esc(DRINK[d].how)}</p>${DRINK[d].sub ? `<p>${esc(DRINK[d].sub)}</p>` : ''}`
    : `<span class="k">ドリンクの出し方（どれかに○）</span><ul>
        <li><b>ワンドリンク</b>：チケットを受け取って保管。終わったら枚数を担当社員に。追加はカウンターで有料</li>
        <li><b>都度注文</b>：お客さんにレジで注文と支払いをしてもらう</li>
        <li><b>飲み放題</b>：ドリンク担当が自由に出す</li></ul>`;
  const map = has(layoutName) ? `別紙：${MAPNAME}「${esc(layoutName)}」` : '別紙：' + MAPNAME;
  const ticket = d === 'one' ? '<li>ドリンクチケットの枚数を担当社員に伝えた</li>'
    : d === '' ? '<li>ドリンクチケットの枚数を伝えた<small>ワンドリンクの日だけ</small></li>' : '';
  return `
<header class="ms-head">
  <div class="ms-top"><span class="ms-tag">FabCafe</span><span class="ms-kind">イベント当日シート<small>Tokyo ${FLOOR}・アルバイト用</small></span><span class="ms-map c2">${map}</span></div>
  <h1 class="ms-title">${has(m.eventName) ? `<span class="c2">${esc(m.eventName.trim())}</span>` : ln()}</h1>
  <p class="ms-meta">
    <span><span class="k">日付</span>${has(m.date) ? `<b class="c1">${esc(fmtDate(m.date))}</b>` : ln()}</span>
    <span><span class="k">当日担当社員</span>${val(m.staff, 'c1')}${has(m.staffContact) ? `<span class="c1">（${esc(m.staffContact.trim())}）</span>` : ''}</span>
  </p>
</header>
${rowsHTML(m)}
${shiftsHTML(m)}
<section class="ms-role" aria-label="今日の担当">
  <div class="ms-job"><span class="k">今日のあなたの担当</span><b>ドリンクとフードの提供</b></div>
  <div class="ms-drink">${d ? '<span class="k">ドリンクの出し方</span>' : ''}${drink}</div>
  <div class="ms-facts">
    <div><span class="k">人数</span><span class="v">${has(m.guests) ? `<span class="c1">${esc(guestsTxt(m.guests))}</span>` : ln()}</span></div>
    <div><span class="k">動かさないもの</span><span class="v">${val(m.keep, 'c2')}</span></div>
  </div>
</section>
<section class="ms-cols">
  <div class="ms-col"><h3><span class="n">1</span>準備${rowTime(m, 'prep') ? `<small class="num">${esc(rowTime(m, 'prep'))}〜</small>` : ''}</h3>
    <ol>
      <li>机や椅子を動かす前に、今の配置を<span class="em">スマホで撮る</span>（片付けで元に戻すときに使う）</li>
      <li>机と椅子を、別紙の<span class="em">「${MAPNAME}」</span>のとおりに並べる</li>
      <li>他の階から椅子や机を借りたら、<span class="em">マスキングテープで印</span>をつける</li>
      <li>ドリンクとフードの数と種類を、カフェスタッフともう一度確認する</li>
    </ol></div>
  <div class="ms-col"><h3><span class="n">2</span>イベント中${rowTime(m, 'open') ? `<small class="num">${esc(rowTime(m, 'open'))}〜</small>` : ''}</h3>
    <ol>
      <li>一般のお客さんが来たら、入口で<span class="em">「本日は貸切です」</span>と伝える</li>
      <li>ゴミ箱がいっぱいでないか、ときどき見る。ウォーターサーバーが空になったら補充</li>
      <li>厨房と FabCafe の備品は許可制。使いたいと言われたら担当社員へ</li>
    </ol>
    <ul><li>受付・設営の力仕事・マイクやスライドの操作など、<span class="em">カフェ以外の仕事</span>を頼まれたら担当社員に相談</li></ul></div>
  <div class="ms-col"><h3><span class="n">3</span>片付け${rowTime(m, 'end') ? `<small class="num">${esc(rowTime(m, 'end'))}〜</small>` : ''}</h3>
    <ol class="order">
      <li><span class="em">ゴミ出し</span>（下の「ゴミ」を見る）</li>
      <li><span class="em">テーブル拭き</span></li>
      <li><span class="em">レイアウトを元に戻す</span>：${MAPNAME}<span class="em">「${NORMAL}」</span>のページと、準備で撮った写真を見て</li>
    </ol>
    <ul>
      <li>借りた椅子と机は、テープの印を見て元の階に返す</li>
      <li>残った飲み物と食べ物は、キッチン・バー側で片付ける</li>
      <li>食器とグラスの洗い物：${val(m.dishes, 'c2')}</li>
    </ul></div>
</section>
<section class="ms-low">
  <div class="ms-box ms-trash"><h3>ゴミ</h3>
    <dl>
      <dt>分け方</dt><dd>可燃・生ゴミ／不燃／カン・ビン・PET／段ボール（つぶしてひもで縛る）</dd>
      <dt>場所</dt><dd>${has(m.trash) ? `<b class="c2">${esc(m.trash.trim())}</b>` : ln()}<br>開け方は担当社員に聞く</dd>
      <dt>いつ出す</dt><dd>${val(m.trashWhen, 'c2')}</dd>
    </dl>
    <ul><li class="no">他のテナントのゴミ置き場には、絶対に捨てない</li><li class="ask">分け方がわからないもの（傘、電球など）は、捨てずに担当社員に渡す</li></ul>
  </div>
  <div class="ms-box ms-check"><h3>帰る前チェック</h3>
    <ul>
      <li>テーブルを拭いた</li>
      <li>「${NORMAL}」の配置に戻した</li>
      <li>借りた椅子・机を返した</li>
      <li>ゴミを分けて、決められた場所に出した</li>
      ${ticket}
      <li>忘れ物がないか見て回った<small>見つけたら：${val(m.lostFound, 'c1')}</small></li>
      <li>店内に人が残っていないか確認した</li>
      <li>消灯・空調・機材の電源<small>担当：${val(m.lights, 'c1')}</small></li>
      <li>施錠と鍵の返却<small>担当：${val(m.lock, 'c1')}</small></li>
      <li><b>ジョブカンで退勤を打刻した</b></li>
    </ul>
  </div>
</section>
${has(m.extra) ? `<section class="ms-extra"><span class="k">メモ</span><p class="c3">${esc(m.extra.trim())}</p></section>` : ''}
<footer class="ms-help"><h3>困ったとき</h3>
  <dl>
    <dt>相談</dt><dd>まずは当日担当社員（${has(m.staff) ? esc(m.staff.trim()) : ln('s')}${has(m.staffContact) ? '・' + esc(m.staffContact.trim()) : ''}）に。　お店の電話 <b class="num tel">${TEL}</b></dd>
    <dt>地震</dt><dd>まず身を守り、揺れが止まるまで動かない。エレベーターは使わず、非常階段で1Fに集まる。帰ってよいかは社員の指示を待つ</dd>
    <dt>禁煙</dt><dd>建物の中はすべて禁煙</dd>
    <dt>打刻</dt><dd>失敗したら備考欄に書く。忘れたら理由を書いて修正申請する</dd>
  </dl>
</footer>`;
}
function renderSheet(container){
  const a = document.createElement('article');
  a.className = 'memo-sheet'; a.lang = 'ja';
  a.setAttribute('aria-label', 'イベント当日シート');
  a.innerHTML = sheetHTML(memo);
  if (container) container.appendChild(a);
  return a;
}

/* ---------- plain text (LINE / Slack) — includes everything, incl. internal hints ---------- */
function plainText(){
  const m = memo, o = v => has(v) ? v.trim() : '（未定）', d = DRINK[m.drink] ? m.drink : '';
  const L = [];
  L.push(`【イベント当日シート】${o(m.eventName)}`);
  L.push(`日付：${has(m.date) ? fmtDate(m.date) : '（未定）'}　当日担当社員：${o(m.staff)}${has(m.staffContact) ? '（' + m.staffContact.trim() + '）' : ''}`);
  L.push('', '■ 時間');
  m.rows.forEach(r => L.push(`${has(r.time) ? r.time.trim() : '（未定）'}　${r.label.trim() || '（無題）'}${r.highlight ? '【退勤の目安】' : ''}${has(r.note) ? '　[' + r.note.trim() + ']' : ''}`));
  L.push(`※${leaveTxt()}を過ぎそうなときは、気づいた時点で担当社員に。残業は社員から頼まれたときだけ。`);
  const shiftLines = [];
  m.shifts.forEach((s, i) => {
    if (!(has(s.name) || has(s.people) || has(s.tMeet) || has(s.tLeave))) return;
    shiftLines.push(`${['シフトA', 'シフトB'][i]}：${o(s.name)}${has(s.people) ? '　' + guestsTxt(s.people) : ''}　集合 ${has(s.tMeet) ? s.tMeet.trim() : '（未定）'} → 退勤 ${has(s.tLeave) ? s.tLeave.trim() : '（未定）'}`);
  });
  if (shiftLines.length){ L.push('', '■ シフト'); shiftLines.forEach(x => L.push(x)); }
  L.push('', '■ 今日の担当：ドリンクとフードの提供');
  if (STAFFMODE[m.staffMode] && STAFFMODE[m.staffMode].lab && m.staffMode) L.push(`体制の目安：${STAFFMODE[m.staffMode].lab}（${STAFFMODE[m.staffMode].hint}）※社内メモ`);
  if (d) L.push(`ドリンク：${DRINK[d].how}${DRINK[d].sub ? '。' + DRINK[d].sub : ''}`);
  else L.push('ドリンクの出し方：ワンドリンク（チケットを保管→枚数を担当社員に。追加はカウンターで有料）／都度注文（レジで注文と支払い）／飲み放題（ドリンク担当が自由に出す）のどれか');
  L.push(`人数：${has(m.guests) ? guestsTxt(m.guests) : '（未定）'}`, `動かさないもの：${o(m.keep)}`);
  L.push('', '■ 準備', '1. 動かす前に、今の配置をスマホで撮る', `2. 机と椅子は「${MAPNAME}」のとおりに並べる`, '3. 他の階から借りた椅子・机にはマスキングテープで印', '4. ドリンクとフードの数と種類をカフェスタッフと再確認');
  L.push('', '■ イベント中', '1. 一般のお客さんには入口で「本日は貸切です」', '2. ゴミ箱をときどき確認。ウォーターサーバーが空なら補充', '3. 厨房と FabCafe の備品は許可制。使いたいと言われたら担当社員へ', '・カフェ以外の仕事（受付・設営の力仕事・マイクやスライド操作）を頼まれたら担当社員に相談');
  L.push('', `■ 片付け${rowTime(m, 'end') ? '（' + rowTime(m, 'end') + '〜）' : ''}`, `①ゴミ出し ②テーブル拭き ③レイアウトを元に戻す（${MAPNAME}「${NORMAL}」と準備の写真を見て）`, '・借りた椅子と机は、テープの印を見て元の階へ', '・残った飲み物と食べ物は、キッチン・バー側で片付け', `・食器とグラスの洗い物：${o(m.dishes)}`);
  L.push('', '■ ゴミ', '分け方：可燃・生ゴミ／不燃／カン・ビン・PET／段ボール（つぶしてひもで縛る）', `場所：${o(m.trash)}（開け方は担当社員に）`, `いつ出す：${o(m.trashWhen)}`, '×他のテナントのゴミ置き場には絶対に捨てない', '?分け方がわからないもの（傘、電球など）は捨てずに担当社員へ');
  L.push('', '■ 帰る前チェック', '□テーブルを拭いた', `□「${NORMAL}」の配置に戻した`, '□借りた椅子・机を返した', '□ゴミを分けて、決められた場所に出した');
  if (d === 'one') L.push('□ドリンクチケットの枚数を担当社員に伝えた'); else if (!d) L.push('□ドリンクチケットの枚数を伝えた（ワンドリンクの日だけ）');
  L.push(`□忘れ物がないか見て回った（見つけたら：${o(m.lostFound)}）`, '□店内に人が残っていないか確認した', `□消灯・空調・機材の電源（担当：${o(m.lights)}）`, `□施錠と鍵の返却（担当：${o(m.lock)}）`, '□ジョブカンで退勤を打刻した');
  if (has(m.extra)) L.push('', '■ メモ', m.extra.trim());
  L.push('', '■ 困ったとき', `まずは当日担当社員（${o(m.staff)}${has(m.staffContact) ? '・' + m.staffContact.trim() : ''}）に相談。お店の電話：${TEL}`, '地震：まず身を守り、揺れが止まるまで動かない。エレベーターは使わず非常階段で1Fへ。帰ってよいかは社員の指示を待つ', '建物の中はすべて禁煙', '打刻に失敗したら備考欄に。忘れたら理由を書いて修正申請');
  return L.join('\n');
}

/* ---------- form (event owner fills it in on screen) ---------- */
// [key, label, en hint, width class, opts]
const FORM_EVENT = ['イベント', 'Event', [
  ['eventName', 'イベント名', 'Event name', '', {max:80}],
  ['date', '日付', 'Date', 'w3', {type:'date'}],
  ['guests', '人数', 'Guests', 'w3', {ph:'例：40', help:'mapSeats'}],
  ['staff', '当日担当社員', 'Staff in charge', 'w3', {max:30}],
  ['staffContact', '連絡先', 'Phone / Slack', 'w3', {max:40, ph:'例：090-…'}]
]];
const FORM_CLOSE = ['片付け・戸締り', 'Close-up', [
  ['dishes', '食器とグラスの洗い物', 'Dishes', '', {max:80, hint:'手順が決まっていなければ空欄のまま（手書きの線になります）'}],
  ['trash', 'ゴミ置き場', 'Trash: where', '', {max:80, hint:'暗証番号は書かない'}],
  ['trashWhen', 'ゴミをいつ出すか', 'Trash: when', '', {max:60, ph:'例：夜のうちに出す／翌朝まで置く', hint:'夜に出してよいかは担当社員に確認'}],
  ['lights', '消灯・空調・機材の担当', 'Lights / AC', 'w3', {max:30}],
  ['lock', '施錠・鍵の返却の担当', 'Lock-up', 'w3', {max:30, hint:'鍵の返却先を確認'}],
  ['lostFound', '忘れ物を見つけたら', 'Lost & found', '', {max:60, ph:'例：レジ下の箱に入れて担当社員に'}],
  ['extra', 'メモ（自由記入）', 'Free note — printed only when filled', '', {area:1, max:240, hint:'休憩：6時間以上のシフトなら必須'}]
]];
function renderFieldset([jp, en, rows]){
  return `<fieldset><legend>${jp}<small>${en}</small></legend>${rows.map(([k, lab, hint, w, o]) => {
    const id = 'mf-' + k;
    const lbl = `<small>${esc(hint)}</small>`;
    const ctl = o.area ? `<textarea id="${id}" data-k="${k}" maxlength="${o.max || 240}" rows="3"></textarea>`
      : `<input id="${id}" data-k="${k}" type="${o.type || 'text'}"${o.max ? ` maxlength="${o.max}"` : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}>`;
    return `<div class="mf ${w}"><label for="${id}">${lab}${lbl}</label>${ctl}${o.help ? `<p class="help" data-help="${o.help}"></p>` : ''}${o.hint ? `<p class="hint">${esc(o.hint)}</p>` : ''}</div>`;
  }).join('')}</fieldset>`;
}
function renderNightFieldset(){
  return `<fieldset><legend>当日のやり方<small>On the night</small></legend>
  <div class="mf"><span class="lab" id="mf-drink-l">ドリンクの出し方<small>Drinks</small></span>
    <div class="memo-seg" data-seg="drink" role="group" aria-labelledby="mf-drink-l">${['one', 'order', 'free', ''].map(v => `<button type="button" data-v="${v}" aria-pressed="false">${DRINK[v].lab}</button>`).join('')}</div></div>
  <div class="mf"><span class="lab" id="mf-staffmode-l">スタッフ体制の目安<small>Staffing — internal hint</small></span>
    <div class="memo-seg segn3" data-seg="staffMode" role="group" aria-labelledby="mf-staffmode-l">${STAFFMODE_KEYS.map(v => `<button type="button" data-v="${v}" aria-pressed="false">${STAFFMODE[v].lab}</button>`).join('')}</div>
    <p class="hint">${esc('house rules：フル/半面＋ドリンクあり→3名（ドリンク・イベント/AV・レギュラー）／お客様がドリンク・設営→1名＋社員立ち会い')}</p></div>
  <div class="mf"><label for="mf-keep">動かさないもの<small>Don't move</small></label><input id="mf-keep" data-k="keep" maxlength="80" placeholder="例：奥の展示台、レジ横の棚"><p class="help" data-help="mapNotes"></p></div>
</fieldset>`;
}
function renderRow(r, i, total){
  return `<div class="mf-row" data-row-id="${esc(r.id)}">
    <div class="mf-row-top">
      <span class="mf-row-ord"><button type="button" data-act="up"${i === 0 ? ' disabled' : ''} aria-label="上へ移動">▲</button><button type="button" data-act="down"${i === total - 1 ? ' disabled' : ''} aria-label="下へ移動">▼</button></span>
      <input class="mf-row-label" data-field="label" value="${esc(r.label)}" maxlength="24" placeholder="項目名">
      <button type="button" class="mf-row-del" data-act="del" aria-label="この行を削除"${total <= 1 ? ' disabled' : ''}>✕</button>
    </div>
    <div class="mf-row-bot">
      <input class="mf-row-time" data-field="time" value="${esc(r.time)}" maxlength="24" placeholder="--:--">
      <input class="mf-row-note" data-field="note" value="${esc(r.note)}" maxlength="40" placeholder="担当・メモ">
      <label class="mf-row-hi"><input type="radio" name="mf-hi" data-act="hi"${r.highlight ? ' checked' : ''}><span>退勤</span></label>
    </div>
  </div>`;
}
function renderRowsInner(){ return memo.rows.map((r, i) => renderRow(r, i, memo.rows.length)).join(''); }
function renderTimelineFieldset(){
  return `<fieldset class="mf-timeline"><legend>時間（タイムライン）<small>Timeline — add, remove, reorder, up to 8 rows</small></legend>
    <div class="mf-rows" id="mf-rows">${renderRowsInner()}</div>
    <div class="mf-rows-add"><button type="button" class="btn" id="mf-row-add"${memo.rows.length >= ROWS_MAX ? ' disabled' : ''}>＋ 行を追加<small>Add row</small></button></div>
    <div class="mf-chips" role="group" aria-label="よく使う項目を追加">${CHIPS.map(([jp, en]) => `<button type="button" class="mf-chip" data-chip-jp="${esc(jp)}" data-chip-en="${esc(en)}">${esc(jp)}</button>`).join('')}</div>
    <div class="mf-templates"><span class="lab">テンプレートで入れ替え<small>Replace with a template</small></span>${Object.keys(TEMPLATES).map(k => `<button type="button" class="btn" data-template="${k}">${esc(TEMPLATES[k].lab)}<small>${esc(TEMPLATES[k].en)}</small></button>`).join('')}</div>
    <p class="hint">時刻は空欄可（印刷すると手書き用の線になります）。「18:00-18:30」「〜」のような書き方もそのまま入ります。「退勤」のラジオを選んだ行が、印刷で赤いセルになります。</p>
  </fieldset>`;
}
function renderShiftsFieldset(){
  const labels = ['シフトA', 'シフトB'];
  return `<fieldset class="mf-shifts-fs"><legend>シフト（任意）<small>Shifts — optional, leave blank to skip</small></legend>
    <div class="mf-shifts">${memo.shifts.map((s, i) => `
      <div class="mf-shift" data-shift="${i}">
        <span class="mf-shift-lab">${labels[i]}</span>
        <div class="mf-shift-grid">
          <input data-sf="name" value="${esc(s.name)}" maxlength="24" placeholder="名前">
          <input data-sf="people" value="${esc(s.people)}" maxlength="12" placeholder="人数">
          <input data-sf="tMeet" value="${esc(s.tMeet)}" maxlength="16" placeholder="集合 --:--">
          <input data-sf="tLeave" value="${esc(s.tLeave)}" maxlength="16" placeholder="退勤 --:--">
        </div>
      </div>`).join('')}</div>
  </fieldset>`;
}
let built = false;
function buildForm(){
  const f = $('#memo-form'); if (!f) return;
  f.innerHTML = renderFieldset(FORM_EVENT) + renderTimelineFieldset() + renderNightFieldset() + renderShiftsFieldset() + renderFieldset(FORM_CLOSE);
  f.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.k; if (!k) return;
    memo[k] = e.target.value; changed(true);
  });
  $$('.memo-seg[data-seg] button', f).forEach(b => b.addEventListener('click', () => {
    const grp = b.closest('.memo-seg').dataset.seg;
    if (grp === 'drink') memo.drink = b.dataset.v;
    else if (grp === 'staffMode') memo.staffMode = b.dataset.v;
    changed(false);
  }));
  const rowsBox = $('#mf-rows', f);
  if (rowsBox){
    rowsBox.addEventListener('click', e => {
      const btn = e.target.closest('button[data-act]'); if (!btn) return;
      const rowEl = btn.closest('.mf-row'); if (!rowEl) return;
      const id = rowEl.dataset.rowId;
      if (btn.dataset.act === 'up') moveRow(id, -1);
      else if (btn.dataset.act === 'down') moveRow(id, 1);
      else if (btn.dataset.act === 'del') removeRow(id);
    });
    rowsBox.addEventListener('input', e => {
      const field = e.target.dataset.field; if (!field) return;
      const rowEl = e.target.closest('.mf-row'); if (!rowEl) return;
      setRowField(rowEl.dataset.rowId, field, e.target.value);
    });
    rowsBox.addEventListener('change', e => {
      const rowEl = e.target.closest('.mf-row'); if (!rowEl) return;
      const id = rowEl.dataset.rowId;
      if (e.target.type === 'radio' && e.target.dataset.act === 'hi'){ setHighlight(id); return; }
      if (e.target.dataset.field === 'time'){
        const v = normTime(e.target.value);
        if (v !== e.target.value) e.target.value = v;
        setRowField(id, 'time', v);
      }
    });
  }
  const addBtn = $('#mf-row-add', f); if (addBtn) addBtn.addEventListener('click', addBlankRow);
  $$('.mf-chip', f).forEach(b => b.addEventListener('click', () => addChip(b.dataset.chipJp, b.dataset.chipEn)));
  $$('[data-template]', f).forEach(b => b.addEventListener('click', () => applyTemplate(b.dataset.template)));
  $$('.mf-shift', f).forEach(block => {
    const idx = +block.dataset.shift;
    $$('input', block).forEach(inp => {
      inp.addEventListener('input', () => setShift(idx, inp.dataset.sf, inp.value));
      inp.addEventListener('change', () => {
        if (inp.dataset.sf === 'tMeet' || inp.dataset.sf === 'tLeave'){
          const v = normTime(inp.value); if (v !== inp.value){ inp.value = v; setShift(idx, inp.dataset.sf, v); }
        }
      });
    });
  });
  built = true;
}
function fillForm(){
  if (!built) return;
  $$('#memo-form [data-k]').forEach(n => { if (n.value !== memo[n.dataset.k]) n.value = memo[n.dataset.k]; });
  $$('#memo-form .memo-seg[data-seg="drink"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === memo.drink)));
  $$('#memo-form .memo-seg[data-seg="staffMode"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === memo.staffMode)));
  const rowsBox = $('#mf-rows');
  if (rowsBox){
    rowsBox.innerHTML = renderRowsInner();
    const addBtn = $('#mf-row-add'); if (addBtn) addBtn.disabled = memo.rows.length >= ROWS_MAX;
  }
  $$('#memo-form .mf-shift').forEach(block => {
    const idx = +block.dataset.shift, s = memo.shifts[idx]; if (!s) return;
    $$('input', block).forEach(inp => { const v = s[inp.dataset.sf] || ''; if (inp.value !== v) inp.value = v; });
  });
}
function fillHelp(){
  if (!MAP) return;
  let st = {}, notes = [];
  try { st = MAP.stats() || {}; notes = (MAP.annotations() || []).map(a => a.label).filter(Boolean); } catch(e){}
  const h1 = $('#memo-form [data-help="mapSeats"]'), h2 = $('#memo-form [data-help="mapNotes"]');
  if (h1) h1.textContent = st.seats != null ? `${MAPNAME}：席 ${st.seats}・立ち ${st.standing || 0} 名まで` : '';
  if (h2) h2.textContent = notes.length ? 'マップのメモ：' + notes.slice(0, 4).join('、') : '';
}

/* ---------- live preview ---------- */
const A4W = 793.7, A4H = 1122.5; // 210 × 297 mm in CSS px
function renderPreview(){
  const box = $('#memo-scaler'); if (!box || $('#memo').hidden) return;
  box.textContent = '';
  renderSheet(box);
  fit();
}
function fit(){
  const box = $('#memo-scaler'), pv = $('#memo-prev'); if (!box || !pv) return;
  const w = Math.max(240, (pv.clientWidth || 600) - 32);
  const s = Math.min(1, w / A4W);
  box.style.width = (A4W * s) + 'px'; box.style.height = (A4H * s) + 'px';
  const sh = box.firstElementChild; if (sh) sh.style.transform = `scale(${s})`;
}

/* ---------- overlay open / close ---------- */
let pushed = false, lastFocus = null;
function show(){
  const o = $('#memo'); if (!o || !o.hidden) return;
  if (!built) buildForm();
  lastFocus = document.activeElement;
  o.hidden = false; document.body.classList.add('memo-open');
  fillForm(); fillHelp(); renderPreview(); setConfirm(false);
  setTimeout(() => { const n = $('#mf-eventName'); if (n && !memo.eventName) n.focus(); else { const b = $('#memo-back'); b && b.focus(); } }, 0);
}
function hide(){
  const o = $('#memo'); if (!o || o.hidden) return;
  flush();
  o.hidden = true; document.body.classList.remove('memo-open', 'memo-solo-print');
  $('#memo-copybox') && ($('#memo-copybox').hidden = true);
  if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch(e){}
}
function open(){
  show();
  if (location.hash !== '#memo'){ try { history.pushState(null, '', '#memo'); pushed = true; } catch(e){ pushed = false; } }
}
function close(){
  hide();
  if (location.hash === '#memo'){
    if (pushed){ pushed = false; try { history.back(); return; } catch(e){} }
    try { history.replaceState(null, '', location.pathname + location.search); } catch(e){}
  }
}
const onHash = () => { if (location.hash === '#memo') show(); else { pushed = false; hide(); } };
window.addEventListener('hashchange', onHash);
window.addEventListener('popstate', onHash);

function setConfirm(on){
  const c = $('#memo-confirm'), r = $('#memo-reset'); if (!c || !r) return;
  c.hidden = !on; r.hidden = on;
  if (on) setTimeout(() => { const n = $('#memo-reset-no'); n && n.focus(); }, 0);
}
function doPrint(){
  flush();
  if (window.FC_PRINT && typeof window.FC_PRINT.open === 'function'){ window.FC_PRINT.open(); return; }
  // no print module: print just this sheet, one A4 page, no margins
  document.body.classList.add('memo-solo-print');
  const st = document.createElement('style'); st.id = 'memo-solo-page';
  st.textContent = '@page{size:A4 portrait;margin:0}';
  document.head.appendChild(st);
  const done = () => { document.body.classList.remove('memo-solo-print'); st.remove(); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  const box = $('#memo-scaler'); if (box && box.firstElementChild) box.firstElementChild.style.transform = 'none';
  try { window.print(); } finally { setTimeout(() => { done(); fit(); }, 0); }
}
function copyText(){
  const s = plainText();
  const fallback = () => {
    const ta = document.createElement('textarea'); ta.value = s; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta); ta.select(); let ok = false;
    try { ok = document.execCommand && document.execCommand('copy'); } catch(e){ ok = false; }
    ta.remove();
    if (ok){ toast('テキストをコピーしました'); return; }
    const box = $('#memo-copybox'), t = $('#memo-copy-text'); if (!box || !t) return;
    t.value = s; box.hidden = false; setTimeout(() => { t.focus(); t.select(); }, 0);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(() => toast('テキストをコピーしました'), fallback);
  else fallback();
}

function wire(){
  const b = $('#btn-memo'); if (b) b.addEventListener('click', open);
  const on = (id, fn) => { const n = $(id); if (n) n.addEventListener('click', fn); };
  on('#memo-back', close);
  on('#memo-print', doPrint);
  on('#memo-copy', copyText);
  on('#memo-reset', () => setConfirm(true));
  on('#memo-reset-no', () => setConfirm(false));
  on('#memo-reset-yes', () => { memo = clean({}); setConfirm(false); changed(false); toast('初期値に戻しました'); });
  on('#memo-copy-close', () => { $('#memo-copybox').hidden = true; });
  $$('.memo-tabs button').forEach(t => t.addEventListener('click', () => {
    $('#memo-body').dataset.tab = t.dataset.tab;
    $$('.memo-tabs button').forEach(x => x.setAttribute('aria-selected', String(x === t)));
    if (t.dataset.tab === 'prev') fit();
  }));
  // while open, keys belong to the sheet (the map's shortcuts must not move furniture underneath)
  window.addEventListener('keydown', e => {
    const o = $('#memo'); if (!o || o.hidden) return;
    const pd = document.getElementById('pd'); if (pd && !pd.hidden) return; // print dialog on top owns the keys
    e.stopPropagation();
    if (e.key !== 'Escape') return;
    e.preventDefault();
    if (!$('#memo-copybox').hidden){ $('#memo-copybox').hidden = true; return; }
    if (!$('#memo-confirm').hidden){ setConfirm(false); return; }
    close();
  }, true);
  if (window.ResizeObserver){ const pv = $('#memo-prev'); if (pv) new ResizeObserver(() => { if (!$('#memo').hidden) fit(); }).observe(pv); }
  else window.addEventListener('resize', fit);
}

/* ---------- follow the map: one memo per layout ---------- */
if (MAP && MAP.onChange) MAP.onChange(info => {
  if (!info) return;
  layoutName = info.name || '';
  const id = info.id || 'draft';
  if (id !== layoutId){
    flush();
    if (store.byLayout[id]) memo = clean(store.byLayout[id]);
    else { store.byLayout[id] = Object.assign({}, memo); writeStore(); } // e.g. draft saved as a new layout keeps its memo
    layoutId = id;
    changed(false); flush();
    return;
  }
  if (!$('#memo').hidden){ fillHelp(); renderPreview(); }
});

window.FC_MEMO = {
  get: () => {
    const snap = Object.assign({}, memo);
    snap.rows = memo.rows.map(r => Object.assign({}, r));
    snap.shifts = memo.shifts.map(s => Object.assign({}, s));
    // legacy convenience fields for older consumers (e.g. print.js) that read the old flat shape
    const byId = id => { const r = memo.rows.find(x => x.id === id); return r ? r.time : ''; };
    snap.tMeet = byId('meet'); snap.tPrep = byId('prep'); snap.tOpen = byId('open'); snap.tEnd = byId('end');
    const hi = memo.rows.find(r => r.highlight);
    snap.tLeave = hi ? hi.time : '';
    return snap;
  },
  set: o => { memo = clean(o); changed(false); },
  open, close, fmtDate,
  renderSheet,
  onChange: fn => { if (typeof fn === 'function') listeners.push(fn); },
  plainText
};
wire();
if (location.hash === '#memo') show();
})();
