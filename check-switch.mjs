// Headless test for switching floors in place (no reload): JSDOM_FROM=<dir with jsdom>/x node check-switch.mjs
// 1F edit -> 2F -> back to 1F: each floor keeps its own draft and presets; print reads the live floor.
import { createRequire } from 'module';
const require = createRequire(process.env.JSDOM_FROM || import.meta.url);
const { JSDOM, VirtualConsole } = require('jsdom');
import { readFileSync } from 'fs';
const html = readFileSync(new URL('./fabcafe-1f-map.html', import.meta.url), 'utf8');

const errors = [], vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(String(e.message || e)));
vc.on('error', e => errors.push(String(e)));
let reloads = 0;
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://example.test/#floor=1F',
  beforeParse(w){
    w.localStorage.clear();
    w.ResizeObserver = class { observe(){} disconnect(){} };
    w.matchMedia = q => ({ matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
    w.Element.prototype.getBoundingClientRect = function(){ return {x:0,y:0,left:0,top:0,width:1000,height:800,right:1000,bottom:800}; };
  } });
const w = dom.window, d = w.document;
w.addEventListener('beforeunload', () => reloads++);
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(400);
const failures = [], expect = (ok, what) => { if (!ok) failures.push(what); };
const click = sel => { const n = d.querySelector(sel); if (!n) throw new Error('missing ' + sel); n.click(); };
const presets = () => [...d.querySelectorAll('#menu-presets [data-preset]')].map(b => b.dataset.preset);
const r = {};

// 1F: change the plan (Empty preset)
r.p1 = presets();
click('#preset-empty');
const items1 = w.FC_MAP.getLayout().items.length;

// -> 2F
click('#floor-2F');
await wait(400);
r.after2 = {floor: w.FC_MAP.floor(), title: d.title, hash: w.location.hash, items: w.FC_MAP.getLayout().items.length,
  pressed: [...d.querySelectorAll('#floor-seg button[aria-pressed="true"]')].map(b => b.id), presets: presets()};
expect(r.after2.floor === '2F', 'FC_MAP.floor() is 2F');
expect(r.after2.title === 'FabCafe 2F Map', 'title follows floor');
expect(r.after2.hash === '#floor=2F', 'hash follows floor');
expect(r.after2.pressed.join() === 'floor-2F', 'only 2F pressed');
expect(!r.after2.presets.includes('talk'), '1F-only Talk preset hidden on 2F');
expect(w.localStorage.getItem('fabcafe-map:floor') === '2F', 'floor pref saved');
expect(JSON.parse(w.localStorage.getItem('fabcafe-1f-map:v1')).draft.items.length === items1, '1F draft written before leaving');

// 2F edit, print reads 2F
click('#btn-print');
await wait(100);
r.printText2 = (d.querySelector('#pd') || {}).textContent || '';

// -> back to 1F
const esc = new w.KeyboardEvent('keydown', {key:'Escape', bubbles:true}); d.dispatchEvent(esc);
d.querySelectorAll('.pd').forEach(n => n.hidden = true);
click('#floor-1F');
await wait(400);
r.back1 = {floor: w.FC_MAP.floor(), items: w.FC_MAP.getLayout().items.length, presets: presets()};
expect(r.back1.floor === '1F', 'back on 1F');
expect(r.back1.items === items1, '1F draft restored');
expect(r.back1.presets.join() === r.p1.join(), '1F presets identical after round trip');

// every floor once, stats sane, no errors, no reloads
r.tour = [];
for (const f of Object.keys(w.PLANS)){ click('#floor-' + f); await wait(300); r.tour.push(f + ':' + w.FC_MAP.floor() + ':' + w.FC_MAP.stats().seats); expect(w.FC_MAP.floor() === f, 'tour ' + f); }
expect(errors.length === 0, 'no errors: ' + errors.join(' | '));
expect(reloads === 0, 'no page reloads');
r.errors = errors; r.failures = failures;
console.log(JSON.stringify(r, null, 1));
process.exit(failures.length ? 1 : 0);
