// Headless smoke test (no browser): node check.mjs  — needs jsdom (NODE_PATH or local install)
import { createRequire } from 'module';
const require = createRequire(process.env.JSDOM_FROM || import.meta.url);
const { JSDOM, VirtualConsole } = require('jsdom');
import { readFileSync } from 'fs';
const html = readFileSync(new URL('./fabcafe-1f-map.html', import.meta.url), 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(String(e.message || e)));
vc.on('error', e => errors.push(String(e)));
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://example.test/',
  beforeParse(w){
    w.ResizeObserver = class { observe(){} disconnect(){} };
    w.matchMedia = q => ({ matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
    w.Element.prototype.getBoundingClientRect = function(){ return {x:0,y:0,left:0,top:0,width:1000,height:800,right:1000,bottom:800}; };
    w.print = () => { w.__printed = (w.__printed || 0) + 1; };
  } });
const w = dom.window;
await new Promise(r => setTimeout(r, 500));
const out = { errors, seats: w.document.querySelector('#st-seats')?.textContent, api: !!w.FC_MAP, print: !!w.FC_PRINT };
if (w.FC_MAP) { out.stats = w.FC_MAP.stats(); out.svgLen = w.FC_MAP.svg().length; out.cafeSvgLen = w.FC_MAP.svg(w.FC_MAP.presetItems('cafe'), '通常営業').length; }
if (process.argv.includes('--extra') && w.__extraCheck) out.extra = await w.__extraCheck();
console.log(JSON.stringify(out, null, 1));
process.exit(errors.length ? 1 : 0);
