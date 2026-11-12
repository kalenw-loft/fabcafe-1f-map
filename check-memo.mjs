// Headless smoke test for the 当日シート timeline/shifts (no browser): JSDOM_FROM=<dir with jsdom>/x node check-memo.mjs
// Covers: legacy-flat migration (via set() and via localStorage on boot), add/remove/reorder/rename/note,
// highlight exclusivity, max-8 cap, quick-add chips, templates, shifts, staffMode (internal-only), time-range
// normalization, and plainText()/renderSheet() content — plus a check that print.js's legacy tOpen/tEnd/tLeave
// reads (via FC_MEMO.get()) still work and that FC_PRINT.open() composes a memo page without throwing.
import { createRequire } from 'module';
const require = createRequire(process.env.JSDOM_FROM || import.meta.url);
const { JSDOM, VirtualConsole } = require('jsdom');
import { readFileSync } from 'fs';
const html = readFileSync(new URL('./fabcafe-1f-map.html', import.meta.url), 'utf8');

async function boot(storage){
  const errors = [], vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e.message || e)));
  vc.on('error', e => errors.push(String(e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://example.test/',
    beforeParse(w){
      for (const [k, v] of Object.entries(storage || {})) w.localStorage.setItem(k, v);
      w.ResizeObserver = class { observe(){} disconnect(){} };
      w.matchMedia = q => ({ matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
      w.Element.prototype.getBoundingClientRect = function(){ return {x:0,y:0,left:0,top:0,width:1000,height:800,right:1000,bottom:800}; };
      w.print = () => { w.__printed = (w.__printed || 0) + 1; };
    } });
  await new Promise(r => setTimeout(r, 400));
  return { w: dom.window, d: dom.window.document, errors };
}
const fire = (n, w, type) => n.dispatchEvent(new w.Event(type, {bubbles:true}));
const setVal = (w, n, v) => { n.value = v; fire(n, w, 'input'); fire(n, w, 'change'); };
const click = (d, sel, root) => { const n = (root || d).querySelector(sel); if (!n) throw new Error('missing ' + sel); n.click(); return n; };
const openMemo = (w, d) => { click(d, '#btn-memo'); };

const report = {};
const failures = [];
let section = '';
const expect = (ok, what) => { if (!ok) failures.push(`${section}: ${what}`); return !!ok; };

try {
  section = 'fresh';
  const {w, d} = await boot();
  openMemo(w, d);
  const m = w.FC_MEMO.get();
  report.fresh = {n: m.rows.length, end: m.rows.find(r => r.id === 'end').time, leave: m.rows.find(r => r.id === 'leave').time,
    highlighted: m.rows.filter(r => r.highlight).map(r => r.id), tEnd: m.tEnd, tLeave: m.tLeave, shifts: m.shifts, staffMode: m.staffMode};
  expect(m.rows.length === 5, '5 default rows (集合/準備/開場/終了/退勤)');
  expect(m.rows.find(r => r.id === 'end').time === '21:30', 'default tEnd = 21:30');
  expect(m.rows.find(r => r.id === 'leave').time === '22:30', 'default tLeave = 22:30');
  expect(m.rows.filter(r => r.highlight).length === 1 && m.rows.find(r => r.highlight).id === 'leave', 'exactly one row highlighted, and it is 退勤');
  expect(m.tEnd === '21:30' && m.tLeave === '22:30', 'legacy get().tEnd/tLeave mirror the rows (print.js compat)');
  expect(m.shifts.length === 2 && m.shifts.every(s => !s.name && !s.people && !s.tMeet && !s.tLeave), 'shifts start empty (2 slots)');
  expect(m.staffMode === '', 'staffMode starts unset');
  const sheet = w.FC_MEMO.renderSheet();
  expect(!/ms-shifts/.test(sheet.outerHTML), 'empty shifts are not rendered on the printed sheet');
  expect(!/体制|house rules/.test(sheet.outerHTML), 'the staffing hint never appears on the printed sheet (internal only)');
} catch(e){ failures.push('fresh: threw: ' + e.message); }

try {
  section = 'migrate-set';
  const {w, d} = await boot();
  openMemo(w, d);
  w.FC_MEMO.set({eventName:'Legacy Party', tMeet:'17:00', tPrep:'17:30', tOpen:'18:00', tEnd:'20:00', tLeave:'20:30', guests:'12', drink:'free'});
  const m = w.FC_MEMO.get();
  report.migrateSet = {rows: m.rows.map(r => [r.id, r.time, r.highlight])};
  expect(m.rows.length === 5, 'old flat memo (set) migrates to exactly 5 rows');
  expect(m.rows.find(r => r.id === 'meet').time === '17:00', 'tMeet -> meet row');
  expect(m.rows.find(r => r.id === 'prep').time === '17:30', 'tPrep -> prep row');
  expect(m.rows.find(r => r.id === 'open').time === '18:00', 'tOpen -> open row');
  expect(m.rows.find(r => r.id === 'end').time === '20:00', 'tEnd -> end row');
  const leave = m.rows.find(r => r.id === 'leave');
  expect(leave.time === '20:30' && leave.highlight === true, 'tLeave -> leave row, and it is the highlighted one');
  expect(m.tEnd === '20:00' && m.tLeave === '20:30', 'legacy getters reflect the migrated rows');
} catch(e){ failures.push('migrate-set: threw: ' + e.message); }

try {
  section = 'migrate-load';
  const boot0 = await boot();
  const layoutId = (boot0.w.FC_MAP && boot0.w.FC_MAP.getLayout().id) || 'draft';
  const legacy = {eventName:'旧データ', tMeet:'16:00', tPrep:'16:30', tOpen:'17:00', tEnd:'19:00', tLeave:'19:30', guests:'8', drink:'one'};
  const storage = {'fabcafe-1f-map:memo:v1': JSON.stringify({byLayout: {[layoutId]: legacy}})};
  const {w, d} = await boot(storage);
  openMemo(w, d);
  const m = w.FC_MEMO.get();
  report.migrateLoad = {layoutId, rows: m.rows.map(r => [r.id, r.time])};
  expect(m.eventName === '旧データ', 'scalar fields carried over from an old localStorage save');
  expect(m.rows.find(r => r.id === 'prep').time === '16:30', 'tPrep -> prep row, loaded straight from localStorage');
  const leave = m.rows.find(r => r.id === 'leave');
  expect(leave.time === '19:30' && leave.highlight, 'tLeave -> leave row, loaded from localStorage, highlighted');
  // old layout code: a second, never-before-seen layout id reads back plain defaults (no crash)
  const m2raw = JSON.parse(w.localStorage.getItem('fabcafe-1f-map:memo:v1'));
  expect(m2raw && m2raw.byLayout && m2raw.byLayout[layoutId] && Array.isArray(m2raw.byLayout[layoutId].rows) === false
    , 'storage itself is untouched until first edit (still the raw legacy shape on disk)');
} catch(e){ failures.push('migrate-load: threw: ' + e.message); }

try {
  section = 'rows';
  const {w, d} = await boot();
  openMemo(w, d);
  // quick-add chip
  const chip = [...d.querySelectorAll('.mf-chip')].find(b => b.dataset.chipJp === '乾杯');
  expect(!!chip, '乾杯 quick-add chip is present');
  chip.click();
  let m = w.FC_MEMO.get();
  expect(m.rows.length === 6 && m.rows[5].label === '乾杯' && m.rows[5].sub === 'Toast', 'quick-add appended a 乾杯/Toast row at the end');
  // reorder up
  click(d, '.mf-row:last-child [data-act="up"]');
  m = w.FC_MEMO.get();
  expect(m.rows[4].label === '乾杯' && m.rows[5].label !== '乾杯', '▲ moved the new row up one slot');
  // rename + note + time on that row (now at index 4)
  let rowEl = [...d.querySelectorAll('.mf-row')][4];
  setVal(w, rowEl.querySelector('.mf-row-label'), '乾杯の合図');
  setVal(w, rowEl.querySelector('.mf-row-note'), '司会が合図');
  setVal(w, rowEl.querySelector('.mf-row-time'), '1830');
  m = w.FC_MEMO.get();
  const renamed = m.rows[4];
  expect(renamed.label === '乾杯の合図', 'row label edit (rename) is saved');
  expect(renamed.note === '司会が合図', 'row note (担当/メモ) is saved');
  expect(renamed.time === '18:30', 'bare "1830" is auto-normalized to 18:30 on change');
  // highlight toggle: mark this row as 退勤 instead of the actual leave row
  rowEl.querySelector('.mf-row-hi input').checked = true;
  fire(rowEl.querySelector('.mf-row-hi input'), w, 'change');
  m = w.FC_MEMO.get();
  expect(m.rows.filter(r => r.highlight).length === 1 && m.rows[4].highlight, 'highlight radio is exclusive and moved to the chosen row');
  expect(!m.rows.find(r => r.id === 'leave').highlight, 'the old 退勤 row lost the highlight');
  // blank row then remove it (net count unchanged)
  const before = w.FC_MEMO.get().rows.length;
  click(d, '#mf-row-add');
  expect(w.FC_MEMO.get().rows.length === before + 1, '+ 行を追加 adds a row');
  click(d, '.mf-row:last-child [data-act="del"]');
  expect(w.FC_MEMO.get().rows.length === before, '✕ removes it again');
  // fill to the max (8) and confirm the cap holds and the add button disables
  while (w.FC_MEMO.get().rows.length < 8) click(d, '#mf-row-add');
  m = w.FC_MEMO.get();
  expect(m.rows.length === 8, 'rows cap out at 8');
  expect(d.querySelector('#mf-row-add').disabled, '+ 行を追加 is disabled at the cap');
  click(d, '#mf-row-add'); // should be a no-op (button disabled; also guarded in code)
  expect(w.FC_MEMO.get().rows.length === 8, 'clicking past the cap stays at 8');
  // remove down to 1 and confirm the last row cannot be deleted
  while (w.FC_MEMO.get().rows.length > 1) click(d, '.mf-row:last-child [data-act="del"]');
  expect(w.FC_MEMO.get().rows.length === 1, 'can remove down to a single row');
  expect(d.querySelector('.mf-row [data-act="del"]').disabled, 'the last remaining row’s ✕ is disabled');
  expect(w.FC_MEMO.get().rows[0].highlight, 'the single remaining row stays the highlighted one');
} catch(e){ failures.push('rows: threw: ' + e.message); }

try {
  section = 'templates';
  const {w, d} = await boot();
  openMemo(w, d);
  for (const [key, expectIds, label] of [
    ['night', ['meet', 'prep', 'open', 'toast', 'lastorder', 'end', 'leave'], '夜イベント'],
    ['workshop', ['meet', 'prep', 'reception', 'open', 'break', 'end', 'leave'], '昼ワークショップ'],
    ['morning', ['meet', 'prep', 'open', 'end', 'leave'], '朝会']
  ]){
    click(d, `[data-template="${key}"]`);
    const m = w.FC_MEMO.get();
    expect(m.rows.map(r => r.id).join(',') === expectIds.join(','), `template ${label}: row ids = ${expectIds.join(',')}`);
    expect(m.rows.find(r => r.highlight).id === 'leave', `template ${label}: 退勤 row is highlighted`);
    expect(m.rows.length <= 8, `template ${label}: within the 8-row cap`);
  }
} catch(e){ failures.push('templates: threw: ' + e.message); }

try {
  section = 'shifts';
  const {w, d} = await boot();
  openMemo(w, d);
  const blocks = [...d.querySelectorAll('.mf-shift')];
  expect(blocks.length === 2, 'two shift blocks (シフトA/B) are rendered');
  setVal(w, blocks[0].querySelector('[data-sf="name"]'), '田中');
  setVal(w, blocks[0].querySelector('[data-sf="people"]'), '2');
  setVal(w, blocks[0].querySelector('[data-sf="tMeet"]'), '1700');
  setVal(w, blocks[0].querySelector('[data-sf="tLeave"]'), '2100');
  let m = w.FC_MEMO.get();
  report.shifts = m.shifts;
  expect(m.shifts[0].name === '田中', 'shift A name saved');
  expect(m.shifts[0].tMeet === '17:00' && m.shifts[0].tLeave === '21:00', 'shift A times auto-normalized on change');
  expect(!m.shifts[1].name && !m.shifts[1].tMeet, 'shift B stays blank (optional, independent)');
  const sheet = w.FC_MEMO.renderSheet();
  expect(/ms-shifts/.test(sheet.outerHTML) && /田中/.test(sheet.outerHTML) && /シフトA/.test(sheet.outerHTML), 'filled shift A prints on the sheet');
  expect(!/シフトB/.test(sheet.outerHTML), 'blank shift B is omitted from the printed sheet');
  const txt = w.FC_MEMO.plainText();
  expect(/シフトA.*田中/.test(txt.replace(/\n/g, ' ')), 'plainText() includes the shift line');
} catch(e){ failures.push('shifts: threw: ' + e.message); }

try {
  section = 'staffMode';
  const {w, d} = await boot();
  openMemo(w, d);
  const btn = d.querySelector('.memo-seg[data-seg="staffMode"] button[data-v="full3"]');
  expect(!!btn, 'staffMode full3 option is present');
  btn.click();
  const m = w.FC_MEMO.get();
  expect(m.staffMode === 'full3', 'staffMode is saved');
  const sheet = w.FC_MEMO.renderSheet();
  expect(!/フル\/半面/.test(sheet.outerHTML), 'staffMode hint text never appears on the printed sheet (internal only)');
  const txt = w.FC_MEMO.plainText();
  expect(/体制の目安/.test(txt) && /フル\/半面/.test(txt), 'plainText() does include the staffMode hint (internal channel, "includes everything")');
} catch(e){ failures.push('staffMode: threw: ' + e.message); }

try {
  section = 'time-formats';
  const {w, d} = await boot();
  openMemo(w, d);
  const rowEl = d.querySelector('.mf-row'); // the 'meet' row
  const timeInput = rowEl.querySelector('.mf-row-time');
  const tries = [
    ['18:00-18:30', '18:00–18:30'],
    ['18:00~19:00', '18:00–19:00'],
    ['18:00〜19:00', '18:00–19:00'],
    ['〜', '〜'],
    ['ー', '〜'],
    ['1830', '18:30'],
    ['', '']
  ];
  for (const [input, expected] of tries){
    setVal(w, timeInput, input);
    const m = w.FC_MEMO.get();
    expect(m.rows[0].time === expected, `time "${input}" -> "${expected}" (got "${m.rows[0].time}")`);
  }
} catch(e){ failures.push('time-formats: threw: ' + e.message); }

try {
  section = 'reset';
  const {w, d} = await boot();
  openMemo(w, d);
  click(d, '[data-template="night"]');
  expect(w.FC_MEMO.get().rows.length === 7, 'template applied before reset (sanity)');
  click(d, '#memo-reset');
  click(d, '#memo-reset-yes');
  const m = w.FC_MEMO.get();
  expect(m.rows.length === 5 && m.rows.find(r => r.id === 'end').time === '21:30', '初期値に戻す restores the 5 default rows');
} catch(e){ failures.push('reset: threw: ' + e.message); }

try {
  section = 'plainText';
  const {w, d} = await boot();
  openMemo(w, d);
  w.FC_MEMO.set({eventName:'テストイベント', date:'2026-12-18', staff:'山田', guests:'40', drink:'order',
    keep:'展示台', dishes:'バーで洗う', trash:'裏口', trashWhen:'翌朝', extra:'休憩は交代で'});
  const rowEl = d.querySelectorAll('.mf-row')[1]; // prep row
  setVal(w, rowEl.querySelector('.mf-row-note'), '佐藤');
  const txt = w.FC_MEMO.plainText();
  report.plainTextSample = txt.slice(0, 400);
  expect(txt.includes('テストイベント'), 'plainText includes the event name');
  expect(txt.includes('山田'), 'plainText includes the staff name');
  expect(txt.includes('[佐藤]'), 'plainText includes a per-row note');
  expect(txt.includes('休憩は交代で'), 'plainText includes the free-note (extra)');
  expect(txt.includes('■ 時間') && txt.includes('■ ゴミ') && txt.includes('■ 帰る前チェック'), 'plainText keeps all the original sections');
} catch(e){ failures.push('plainText: threw: ' + e.message); }

try {
  section = 'print-compat';
  const {w, d} = await boot();
  openMemo(w, d);
  w.FC_MEMO.set({eventName:'印刷テスト', guests:'20', staff:'鈴木', tMeet:'17:00', tPrep:'17:30', tOpen:'18:00', tEnd:'20:00', tLeave:'20:30'});
  expect(!!(w.FC_PRINT && typeof w.FC_PRINT.open === 'function'), 'window.FC_PRINT is present');
  w.FC_PRINT.open();
  await new Promise(r => setTimeout(r, 50));
  const pages = d.querySelectorAll('#pd-pages .print-page');
  report.printPages = pages.length;
  expect(pages.length >= 2, 'print composer built pages (map + memo [+ restore]) without throwing');
  expect(!!d.querySelector('#pd-pages .pp-memo'), 'a staff-sheet (pp-memo) page was composed');
  const mapPage = d.querySelector('#pd-pages .print-page');
  expect(mapPage && /20:00|18:00/.test(mapPage.textContent), 'print.js still reads legacy tOpen/tEnd via FC_MEMO.get() for the cover meta line');
} catch(e){ failures.push('print-compat: threw: ' + e.message); }

const out = { failCount: failures.length, failures, report };
console.log(JSON.stringify(out, null, 1));
process.exit(failures.length ? 1 : 0);
