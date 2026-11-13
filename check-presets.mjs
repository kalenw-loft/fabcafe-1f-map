// Preset rules check (no browser): node check-presets.mjs
// Every built-in preset on every floor keeps its furniture out of the floor's keepClear zones
// (kitchen / entrances) and, where the floor sets an eventArea (2F: back half only), inside it.
// Zones and notes are annotations and may sit anywhere (the 10F kitchen is marked as standing room).
import { createRequire } from 'module';
const require = createRequire(process.env.JSDOM_FROM || import.meta.url);
const { JSDOM, VirtualConsole } = require('jsdom');
import { readFileSync } from 'fs';
const html = readFileSync(new URL('./fabcafe-1f-map.html', import.meta.url), 'utf8');
const pip = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++){ const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const failures = [], report = {};
async function boot(floor){
  const vc = new VirtualConsole(), errors = [];
  vc.on('jsdomError', e => errors.push(String(e.message || e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://example.test/#floor=' + floor,
    beforeParse(w){ w.ResizeObserver = class { observe(){} disconnect(){} };
      w.matchMedia = q => ({ matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
      w.Element.prototype.getBoundingClientRect = function(){ return {x:0,y:0,left:0,top:0,width:1000,height:800,right:1000,bottom:800}; }; } });
  await new Promise(r => setTimeout(r, 400));
  return {w: dom.window, errors};
}
const probe = await boot('1F');
for (const floor of Object.keys(probe.w.PLANS)){
  const {w, errors} = await boot(floor), P = w.PLANS[floor];
  const keep = P.keepClear || [], area = P.eventArea;
  const keys = [...w.document.querySelectorAll('#menu-presets [data-preset]')].map(b => b.dataset.preset).filter(k => k !== 'cafe');
  report[floor] = {errors};
  for (const k of keys){
    const items = w.FC_MAP.presetItems(k) || [];
    const furn = items.filter(it => it.type !== 'zone' && it.type !== 'note');
    const plan = (P.presets || []).some(p => p.id === k);   // hand-drawn plan presets: keepClear is advisory
    let bad = 0;
    for (const it of furn){
      const inKeep = keep.find(z => pip([it.x, it.y], z.points));
      const outArea = area && !pip([it.x, it.y], area);
      if ((inKeep || outArea) && !plan){ bad++; failures.push(`${floor} ${k}: ${it.type} at ${it.x},${it.y} ${inKeep ? 'in ' + inKeep.id : 'outside event area'}`); }
    }
    report[floor][k] = {items: items.length, furniture: furn.length, chairs: furn.filter(i => i.type === 'chair').length, bad, standing: items.some(i => /Standing 立ち見 \(kitchen\)/.test(i.label || ''))};
  }
  if (errors.length) failures.push(floor + ': ' + errors.join('; '));
}
console.log(JSON.stringify({report, failures}, null, 1));
process.exit(failures.length ? 1 : 0);
