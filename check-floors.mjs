// Headless smoke test for every floor (no browser): JSDOM_FROM=<dir with jsdom>/x node check-floors.mjs
// Per floor: boots without errors, lists presets, applies each one (clash count + trash), and runs the
// preset editor: save as preset, overwrite a built-in, reset, presets code round trip.
import { createRequire } from 'module';
const require = createRequire(process.env.JSDOM_FROM || import.meta.url);
const { JSDOM, VirtualConsole } = require('jsdom');
import { readFileSync } from 'fs';
const html = readFileSync(new URL('./fabcafe-1f-map.html', import.meta.url), 'utf8');

async function boot(floor, storage){
  const errors = [], vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e.message || e)));
  vc.on('error', e => errors.push(String(e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://example.test/#floor=' + floor,
    beforeParse(w){
      for (const [k, v] of Object.entries(storage || {})) w.localStorage.setItem(k, v);
      w.ResizeObserver = class { observe(){} disconnect(){} };
      w.matchMedia = q => ({ matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
      w.Element.prototype.getBoundingClientRect = function(){ return {x:0,y:0,left:0,top:0,width:1000,height:800,right:1000,bottom:800}; };
    } });
  await new Promise(r => setTimeout(r, 400));
  return {w: dom.window, d: dom.window.document, errors};
}
const click = (d, sel) => { const n = d.querySelector(sel); if (!n) throw new Error('missing ' + sel); n.click(); };
const report = {};
let fail = 0;
for (const floor of ['1F', '2F', '10F']){
  const {w, d, errors} = await boot(floor);
  const r = report[floor] = {floorId: w.FLOOR_ID, title: d.title, errors};
  r.floorButtons = [...d.querySelectorAll('#floor-seg button')].map(b => b.textContent + (b.getAttribute('aria-pressed') === 'true' ? '*' : ''));
  r.signShown = !d.querySelector('#btn-sign').hidden;
  r.presets = [...d.querySelectorAll('#menu-presets [data-preset]')].map(b => b.dataset.preset);
  r.palette = ['trash', 'trash-sort'].map(t => !!d.querySelector('#add-' + t));
  r.applied = {};
  for (const k of r.presets){
    click(d, '#preset-' + k.replace(':', '-'));
    const items = w.FC_MAP.getLayout().items, st = w.FC_MAP.stats();
    r.applied[k] = {items: items.length, seats: st.seats, clashes: st.conflicts ?? st.clashes, trash: items.filter(i => i.type.startsWith('trash')).length, name: w.FC_MAP.getLayout().name};
  }
  // add a trash can from the palette
  click(d, '#add-trash');
  r.trashAdded = w.FC_MAP.getLayout().items.some(i => i.type === 'trash');
  // save current as a preset, overwrite + reset the built-in "cafe"
  click(d, '#preset-save-new');
  const key = () => JSON.parse(w.localStorage.getItem(floor === '1F' ? 'fabcafe-1f-map:v1' : 'fabcafe-1f-map:' + floor + ':v1') || '{}');
  r.customSaved = (key().presets?.custom || []).length;
  r.menuHasCustom = [...d.querySelectorAll('#menu-presets [data-preset]')].some(b => b.dataset.preset.startsWith('u:'));
  click(d, '#preset-edit');
  click(d, '#pe-set-cafe'); click(d, '#pe-set-cafe');            // two-step confirm
  r.overrideItems = (key().presets?.over?.cafe?.items || []).length;
  click(d, '#pe-reset-cafe'); click(d, '#pe-reset-cafe');
  r.overrideCleared = !key().presets?.over?.cafe;
  click(d, '#pe-hide-empty');
  r.emptyHidden = !d.querySelector('#menu-presets [data-preset="empty"]');
  click(d, '#modal-copy-presets');
  const code = d.querySelector('#modal-text').value;
  r.presetsCodeFloor = JSON.parse(code).floor;
  // round trip into a fresh browser on the same floor
  const fresh = await boot(floor);
  click(fresh.d, '#share-import');
  fresh.d.querySelector('#modal-text').value = code; click(fresh.d, '#modal-go');
  r.importedCustom = [...fresh.d.querySelectorAll('#menu-presets [data-preset]')].filter(b => b.dataset.preset.startsWith('u:')).length;
  r.importErrors = fresh.errors;
  // a layout code from another floor is refused with a hint
  fresh.d.querySelector('#share-import').click();
  fresh.d.querySelector('#modal-text').value = JSON.stringify({app:'fabcafe-1f-map', v:1, floor: floor === '1F' ? '10F' : '1F', name:'x', items:[]});
  click(fresh.d, '#modal-go');
  r.crossFloorMsg = fresh.d.querySelector('#modal-err').textContent;
  r.printPages = !!w.FC_PRINT;
  if (errors.length || fresh.errors.length) fail++;
}
console.log(JSON.stringify(report, null, 1));
process.exit(fail ? 1 : 0);
