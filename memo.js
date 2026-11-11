/* ======================= 当日シート — FabCafe Tokyo 1F event-night sheet for part-time staff =======================
   window.FC_MEMO = {get, set, open, close, renderSheet, onChange, plainText}
   Content is the approved notes (baito-notes-ja.md); this file only changes the format. */
(() => {
'use strict';
const MAP = window.FC_MAP || null;
const FLOOR = (MAP && MAP.floor && MAP.floor()) || '1F';
const KEY = FLOOR === '1F' ? 'fabcafe-1f-map:memo:v1' : 'fabcafe-1f-map:' + FLOOR + ':memo:v1';
const MAPNAME = FLOOR + 'マップ';
const NORMAL = (MAP && MAP.normalJp && MAP.normalJp()) || '通常営業';
const TRASH_DEF = '';
const DEF = {eventName:'', date:'', staff:'', staffContact:'', tMeet:'', tPrep:'', tOpen:'', tEnd:'21:30', tLeave:'22:30',
  guests:'', drink:'', keep:'', dishes:'', trash:TRASH_DEF, trashWhen:'', lights:'', lock:'', lostFound:'', extra:''};
const KEYS = Object.keys(DEF);
const DRINK = {
  one:  {lab:'ワンドリンク', how:'ワンドリンク：ドリンクチケットを受け取る', sub:'チケットはなくさないように保管。終わったら枚数を数えて担当社員に伝える。追加のドリンクはカウンターで有料。'},
  order:{lab:'都度注文', how:'都度注文：お客さんにレジで注文と支払いをしてもらう', sub:''},
  free: {lab:'飲み放題', how:'飲み放題：ドリンク担当が自由に出す', sub:''},
  '':   {lab:'未定'}
};
const TEL = '03-6416-9190';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const toast = s => { if (MAP && MAP.toast) MAP.toast(s); };

/* ---------- state + storage ---------- */
function clean(o){
  const r = Object.assign({}, DEF);
  if (o && typeof o === 'object') KEYS.forEach(k => { if (o[k] != null && typeof o[k] !== 'object') r[k] = String(o[k]).slice(0, 600); });
  if (!(r.drink in DRINK)) r.drink = '';
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
function normTime(s){
  let v = String(s || '').replace(/[０-９：]/g, c => c === '：' ? ':' : String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).trim();
  let m = /^(\d{1,2})(\d{2})$/.exec(v); if (m) v = m[1] + ':' + m[2];
  m = /^(\d{1,2})[:.時](\d{2})分?$/.exec(v); if (m && +m[1] < 30 && +m[2] < 60) v = m[1].padStart(2, '0') + ':' + m[2];
  return v;
}
const guestsTxt = g => /^\s*\d+\s*$/.test(g) ? g.trim() + '名' : g.trim();
const timeCell = v => has(v) ? `<span class="num">${esc(v.trim())}</span>` : '<span class="blank"><i></i><b>:</b><i></i></span>';
const leaveTxt = () => has(memo.tLeave) ? memo.tLeave.trim() : '退勤時刻';

/* ---------- the sheet (one A4 page) ---------- */
function sheetHTML(m){
  const d = DRINK[m.drink] ? m.drink : '';
  const drink = d
    ? `<p class="how">${esc(DRINK[d].how)}</p>${DRINK[d].sub ? `<p>${esc(DRINK[d].sub)}</p>` : ''}`
    : `<span class="k">ドリンクの出し方（どれかに○）</span><ul>
        <li><b>ワンドリンク</b>：チケットを受け取って保管。終わったら枚数を担当社員に。追加はカウンターで有料</li>
        <li><b>都度注文</b>：お客さんにレジで注文と支払いをしてもらう</li>
        <li><b>飲み放題</b>：ドリンク担当が自由に出す</li></ul>`;
  const times = [['集合・打刻', m.tMeet], ['準備', m.tPrep], ['開場', m.tOpen], ['終了 → 片付け', m.tEnd], ['退勤・打刻', m.tLeave]];
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
<section class="ms-times" aria-label="時間">
  <ol>${times.map(([k, v], i) => `<li${i === 4 ? ' class="go"' : ''}><span class="k">${k}</span><span class="v">${timeCell(v)}</span></li>`).join('')}</ol>
  <p class="note"><b>${esc(leaveTxt())}を過ぎそうなとき</b>は、気づいた時点で担当社員に伝えてください。残業は、社員から頼まれたときだけです。</p>
</section>
<section class="ms-role" aria-label="今日の担当">
  <div class="ms-job"><span class="k">今日のあなたの担当</span><b>ドリンクとフードの提供</b></div>
  <div class="ms-drink">${d ? '<span class="k">ドリンクの出し方</span>' : ''}${drink}</div>
  <div class="ms-facts">
    <div><span class="k">人数</span><span class="v">${has(m.guests) ? `<span class="c1">${esc(guestsTxt(m.guests))}</span>` : ln()}</span></div>
    <div><span class="k">動かさないもの</span><span class="v">${val(m.keep, 'c2')}</span></div>
  </div>
</section>
<section class="ms-cols">
  <div class="ms-col"><h3><span class="n">1</span>準備${has(m.tPrep) ? `<small class="num">${esc(m.tPrep.trim())}〜</small>` : ''}</h3>
    <ol>
      <li>机や椅子を動かす前に、今の配置を<span class="em">スマホで撮る</span>（片付けで元に戻すときに使う）</li>
      <li>机と椅子を、別紙の<span class="em">「${MAPNAME}」</span>のとおりに並べる</li>
      <li>他の階から椅子や机を借りたら、<span class="em">マスキングテープで印</span>をつける</li>
      <li>ドリンクとフードの数と種類を、カフェスタッフともう一度確認する</li>
    </ol></div>
  <div class="ms-col"><h3><span class="n">2</span>イベント中${has(m.tOpen) ? `<small class="num">${esc(m.tOpen.trim())}〜</small>` : ''}</h3>
    <ol>
      <li>一般のお客さんが来たら、入口で<span class="em">「本日は貸切です」</span>と伝える</li>
      <li>ゴミ箱がいっぱいでないか、ときどき見る。ウォーターサーバーが空になったら補充</li>
      <li>厨房と FabCafe の備品は許可制。使いたいと言われたら担当社員へ</li>
    </ol>
    <ul><li>受付・設営の力仕事・マイクやスライドの操作など、<span class="em">カフェ以外の仕事</span>を頼まれたら担当社員に相談</li></ul></div>
  <div class="ms-col"><h3><span class="n">3</span>片付け${has(m.tEnd) ? `<small class="num">${esc(m.tEnd.trim())}〜</small>` : ''}</h3>
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

/* ---------- plain text (LINE / Slack) ---------- */
function plainText(){
  const m = memo, o = v => has(v) ? v.trim() : '（未定）', d = DRINK[m.drink] ? m.drink : '';
  const L = [];
  L.push(`【イベント当日シート】${o(m.eventName)}`);
  L.push(`日付：${has(m.date) ? fmtDate(m.date) : '（未定）'}　当日担当社員：${o(m.staff)}${has(m.staffContact) ? '（' + m.staffContact.trim() + '）' : ''}`);
  L.push('', '■ 時間');
  L.push(`${o(m.tMeet)}　集合・打刻`, `${o(m.tPrep)}〜　準備`, `${o(m.tOpen)}　開場`, `${o(m.tEnd)}　イベント終了 → 片付け`, `${o(m.tLeave)}　退勤（ジョブカンで打刻）`);
  L.push(`※${leaveTxt()}を過ぎそうなときは、気づいた時点で担当社員に。残業は社員から頼まれたときだけ。`);
  L.push('', '■ 今日の担当：ドリンクとフードの提供');
  if (d) L.push(`ドリンク：${DRINK[d].how}${DRINK[d].sub ? '。' + DRINK[d].sub : ''}`);
  else L.push('ドリンクの出し方：ワンドリンク（チケットを保管→枚数を担当社員に。追加はカウンターで有料）／都度注文（レジで注文と支払い）／飲み放題（ドリンク担当が自由に出す）のどれか');
  L.push(`人数：${has(m.guests) ? guestsTxt(m.guests) : '（未定）'}`, `動かさないもの：${o(m.keep)}`);
  L.push('', '■ 準備', '1. 動かす前に、今の配置をスマホで撮る', `2. 机と椅子は「${MAPNAME}」のとおりに並べる`, '3. 他の階から借りた椅子・机にはマスキングテープで印', '4. ドリンクとフードの数と種類をカフェスタッフと再確認');
  L.push('', '■ イベント中', '1. 一般のお客さんには入口で「本日は貸切です」', '2. ゴミ箱をときどき確認。ウォーターサーバーが空なら補充', '3. 厨房と FabCafe の備品は許可制。使いたいと言われたら担当社員へ', '・カフェ以外の仕事（受付・設営の力仕事・マイクやスライド操作）を頼まれたら担当社員に相談');
  L.push('', `■ 片付け（${o(m.tEnd)}〜）`, `①ゴミ出し ②テーブル拭き ③レイアウトを元に戻す（${MAPNAME}「${NORMAL}」と準備の写真を見て）`, '・借りた椅子と机は、テープの印を見て元の階へ', '・残った飲み物と食べ物は、キッチン・バー側で片付け', `・食器とグラスの洗い物：${o(m.dishes)}`);
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
const FORM = [
  ['イベント', 'Event', [
    ['eventName', 'イベント名', 'Event name', '', {max:80}],
    ['date', '日付', 'Date', 'w3', {type:'date'}],
    ['guests', '人数', 'Guests', 'w3', {ph:'例：40', help:'mapSeats'}],
    ['staff', '当日担当社員', 'Staff in charge', 'w3', {max:30}],
    ['staffContact', '連絡先', 'Phone / Slack', 'w3', {max:40, ph:'例：090-…'}]
  ]],
  ['時間', 'Times', [
    ['tMeet', '集合・打刻', 'Meet', 'w2', {time:1}],
    ['tPrep', '準備', 'Set-up', 'w2', {time:1}],
    ['tOpen', '開場', 'Doors', 'w2', {time:1}],
    ['tEnd', '終了・片付け', 'End', 'w3', {time:1}],
    ['tLeave', '退勤', 'Leave', 'w3', {time:1, hint:'撤収の終わりの時間は利用ルールに合わせる'}]
  ]],
  ['当日のやり方', 'On the night', [
    ['drink', 'ドリンクの出し方', 'Drinks', '', {seg:1}],
    ['keep', '動かさないもの', "Don't move", '', {max:80, ph:'例：奥の展示台、レジ横の棚', help:'mapNotes'}]
  ]],
  ['片付け・戸締り', 'Close-up', [
    ['dishes', '食器とグラスの洗い物', 'Dishes', '', {max:80, hint:'手順が決まっていなければ空欄のまま（手書きの線になります）'}],
    ['trash', 'ゴミ置き場', 'Trash: where', '', {max:80, hint:'暗証番号は書かない'}],
    ['trashWhen', 'ゴミをいつ出すか', 'Trash: when', '', {max:60, ph:'例：夜のうちに出す／翌朝まで置く', hint:'夜に出してよいかは担当社員に確認'}],
    ['lights', '消灯・空調・機材の担当', 'Lights / AC', 'w3', {max:30}],
    ['lock', '施錠・鍵の返却の担当', 'Lock-up', 'w3', {max:30, hint:'鍵の返却先を確認'}],
    ['lostFound', '忘れ物を見つけたら', 'Lost & found', '', {max:60, ph:'例：レジ下の箱に入れて担当社員に'}],
    ['extra', 'メモ（自由記入）', 'Free note — printed only when filled', '', {area:1, max:240, hint:'休憩：6時間以上のシフトなら必須'}]
  ]]
];
let built = false;
function buildForm(){
  const f = $('#memo-form'); if (!f) return;
  f.innerHTML = FORM.map(([jp, en, rows]) => `<fieldset><legend>${jp}<small>${en}</small></legend>${rows.map(([k, lab, hint, w, o]) => {
    const id = 'mf-' + k;
    const lbl = `<small>${esc(hint)}</small>`;
    let ctl;
    if (o.seg) ctl = `<div class="memo-seg" role="group" aria-labelledby="${id}-l">${['one', 'order', 'free', ''].map(v => `<button type="button" data-drink="${v}" aria-pressed="false">${DRINK[v].lab}</button>`).join('')}</div>`;
    else if (o.area) ctl = `<textarea id="${id}" data-k="${k}" maxlength="${o.max || 240}" rows="3"></textarea>`;
    else ctl = `<input id="${id}" data-k="${k}" type="${o.type || 'text'}"${o.time ? ' class="time" inputmode="numeric" placeholder="--:--" maxlength="8"' : ''}${o.max ? ` maxlength="${o.max}"` : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}>`;
    const head = o.seg ? `<span class="lab" id="${id}-l">${lab}${lbl}</span>` : `<label for="${id}">${lab}${lbl}</label>`;
    return `<div class="mf ${w}">${head}${ctl}${o.help ? `<p class="help" data-help="${o.help}"></p>` : ''}${o.hint ? `<p class="hint">${esc(o.hint)}</p>` : ''}</div>`;
  }).join('')}</fieldset>`).join('');
  f.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.k; if (!k) return;
    memo[k] = e.target.value; changed(true);
  });
  f.addEventListener('change', e => {
    const n = e.target; if (!n.classList || !n.classList.contains('time')) return;
    const v = normTime(n.value); if (v !== n.value){ n.value = v; memo[n.dataset.k] = v; changed(true); }
  });
  $$('.memo-seg button', f).forEach(b => b.addEventListener('click', () => { memo.drink = b.dataset.drink; changed(false); }));
  built = true;
}
function fillForm(){
  if (!built) return;
  $$('#memo-form [data-k]').forEach(n => { if (n.value !== memo[n.dataset.k]) n.value = memo[n.dataset.k]; });
  $$('#memo-form .memo-seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.drink === memo.drink)));
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
  get: () => Object.assign({}, memo),
  set: o => { memo = clean(o); changed(false); },
  open, close, fmtDate,
  renderSheet,
  onChange: fn => { if (typeof fn === 'function') listeners.push(fn); },
  plainText
};
wire();
if (location.hash === '#memo') show();
})();
