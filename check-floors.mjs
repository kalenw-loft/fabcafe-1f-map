// Headless smoke test for every floor (no browser): JSDOM_FROM=<dir with jsdom>/x node check-floors.mjs
// Per floor: boots without errors, lists presets, applies each one (clash count + trash), then the preset
// edit bar (✎ edit + save/cancel, + New preset, soft "changed from preset" bar, Save as new, dismiss)
// and the Manage modal: overwrite a built-in, reset, hide, presets code round trip.
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
// floors to test: whatever window.PLANS actually has at boot (not a fixed list), so a new floor (3F) is
// picked up the moment its plan-*.js lands, and this suite still passes fine while it does not yet exist
const probe = await boot('1F');
const FLOORS = Object.keys(probe.w.PLANS || {});
const report = {}, failures = [];
let fail = 0, floor;
const expect = (ok, what) => { if (!ok){ fail++; failures.push(floor + ': ' + what); } return !!ok; };
for (floor of FLOORS){
  const {w, d, errors} = await boot(floor);
  const r = report[floor] = {floorId: w.FLOOR_ID, title: d.title, errors};
  try {
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
    // sim slot + areas toggle plumbing: present on every floor regardless of whether it has sim/areas data yet
    r.simViewPresent = !!d.querySelector('#sim-view') && d.querySelector('#sim-view').hidden;
    expect(r.simViewPresent, 'hidden #sim-view slot element present');
    r.tool3dDisabled = d.querySelector('#tool-3d')?.disabled === true;
    expect(r.tool3dDisabled, '#tool-3d stays disabled (no viewer yet)');
    const planAreas = (w.PLANS[floor].areas || []).length;
    r.areasToggleShown = !d.querySelector('#tool-group-areas').hidden;
    expect(r.areasToggleShown === (planAreas > 0), 'Areas toggle shown only when PLAN.areas is non-empty');
    click(d, '#tool-sim-info');
    r.simModalOpen = !d.querySelector('#modal').hidden && d.querySelector('#modal').dataset.kind === 'sim';
    expect(r.simModalOpen, 'Sim info opens the sim modal');
    click(d, '#modal-close');
    const key = () => JSON.parse(w.localStorage.getItem(floor === '1F' ? 'fabcafe-1f-map:v1' : 'fabcafe-1f-map:' + floor + ':v1') || '{}');
    const lay = () => w.FC_MAP.getLayout(), pe = () => w.FC_MAP.presetEditing ? w.FC_MAP.presetEditing() : 'no hook';
    const barShown = () => !!d.querySelector('#pe-bar') && !d.querySelector('#pe-bar').hidden;
    const customs = () => [...d.querySelectorAll('#menu-presets [data-preset]')].filter(b => b.dataset.preset.startsWith('u:')).length;
    const setName = (sel, v) => { const n = d.querySelector(sel); if (!n) throw new Error('missing ' + sel); n.value = v; n.dispatchEvent(new w.Event('input', {bubbles:true})); n.dispatchEvent(new w.Event('change', {bubbles:true})); };
    const key2id = k => k.replace(':', '-'), other = r.presets.find(k => k !== 'cafe');
    // (a) one ✎ per preset; [data-preset] still means apply buttons only
    const edits = [...d.querySelectorAll('#menu-presets [data-edit-preset]')];
    r.editButtons = edits.length;
    expect(edits.length === r.presets.length && edits.every(b => b.id === 'preset-editbtn-' + key2id(b.dataset.editPreset) && !b.hasAttribute('data-preset') && b.getAttribute('aria-label')), 'one ✎ (preset-editbtn-<key>, aria-label, no data-preset) per preset');
    expect([...d.querySelectorAll('#menu-presets [data-preset]')].every(b => !b.hasAttribute('data-edit-preset') && b.id === 'preset-' + key2id(b.dataset.preset)), '[data-preset] lists apply buttons only');
    expect(!d.querySelector('#preset-save-new') && d.querySelector('#preset-new') && d.querySelector('#preset-edit'), 'footer = #preset-new + #preset-edit, no #preset-save-new');
    if (r.presets.includes('cafe')){
    // (b) ✎ cafe → explicit edit, add a trash can, rename, save over the built-in
    click(d, '#preset-editbtn-cafe');
    r.editCafe = pe();
    expect(r.editCafe && r.editCafe.key === 'cafe' && r.editCafe.explicit && r.editCafe.barShown, '✎ cafe → explicit edit + bar');
    expect(JSON.stringify(lay().items) === JSON.stringify(w.FC_MAP.presetItems('cafe')), '✎ cafe applies the preset');
    click(d, '#add-trash');
    setName('#pe-bar-name', 'Cafe edited');
    click(d, '#pe-bar-save');
    r.cafeSaved = {items: (key().presets?.over?.cafe?.items || []).length, layout: lay().items.length, name: key().presets?.over?.cafe?.name, layoutName: lay().name, bar: barShown(), editing: pe()};
    expect(r.cafeSaved.items === r.cafeSaved.layout && r.cafeSaved.items > 0, 'save: over.cafe.items = layout');
    expect(r.cafeSaved.name === 'Cafe edited' && r.cafeSaved.layoutName === 'Cafe edited', 'save: name stored + layout renamed');
    expect(!r.cafeSaved.bar && !r.cafeSaved.editing, 'save: bar hidden, edit cleared');
    // (c) ✎ again, change things, cancel → exactly the previous layout (items, name, id)
    if (other) click(d, '#preset-' + key2id(other));
    setName('#layout-name', 'Before edit');
    const before = JSON.stringify(lay());
    click(d, '#preset-editbtn-cafe'); click(d, '#add-trash'); setName('#pe-bar-name', 'Throwaway');
    click(d, '#pe-bar-cancel');
    r.cancelRestored = JSON.stringify(lay()) === before;
    expect(r.cancelRestored && lay().name === 'Before edit', 'cancel restores items + name');
    expect(!barShown() && !pe(), 'cancel: bar hidden, edit cleared');
    expect(key().presets?.over?.cafe?.name === 'Cafe edited', 'cancel leaves the saved preset alone');
    // (d) + New preset → bar with key null + prefilled name; save via button, then via Enter
    const c0 = customs(), n0 = lay().items.length;
    click(d, '#preset-new');
    r.newEdit = pe(); r.newPrefill = d.querySelector('#pe-bar-name')?.value;
    expect(r.newEdit && r.newEdit.key === null && r.newEdit.explicit && r.newEdit.barShown, 'new: explicit edit, key null, bar');
    expect(r.newPrefill === 'Before edit' && lay().items.length === n0, 'new: name prefilled, plan kept');
    expect(d.querySelector('#pe-bar-saveas')?.hidden, 'new: Save as new hidden');
    setName('#pe-bar-name', 'My preset');
    click(d, '#pe-bar-save');
    r.newSaved = {menu: customs(), stored: (key().presets?.custom || []).map(p => p.name), bar: barShown()};
    expect(r.newSaved.menu === c0 + 1 && r.newSaved.stored.includes('My preset') && !r.newSaved.bar, 'new: saved as u: preset');
    click(d, '#preset-new'); setName('#pe-bar-name', 'Enter preset');
    d.querySelector('#pe-bar-name').dispatchEvent(new w.KeyboardEvent('keydown', {key:'Enter', bubbles:true, cancelable:true}));
    r.enterSaved = customs() === c0 + 2 && (key().presets?.custom || []).some(p => p.name === 'Enter preset') && !barShown();
    expect(r.enterSaved, 'new: Enter in name field saves');
    // (e) plain apply → no bar until the plan differs; soft bar → Save as new; dismiss keeps the plan
    click(d, '#preset-cafe');
    r.applyEdit = pe();
    expect(!barShown() && r.applyEdit && r.applyEdit.key === 'cafe' && !r.applyEdit.explicit, 'apply: soft edit state, bar hidden');
    click(d, '#add-trash');
    r.softShown = barShown();
    expect(r.softShown && d.querySelector('#pe-bar-name')?.hidden, 'soft: bar shown after a change, name field hidden');
    click(d, '#pe-bar-saveas');
    r.saveAs = {menu: customs(), bar: barShown()};
    expect(r.saveAs.menu === c0 + 3 && !r.saveAs.bar, 'soft: Save as new adds a u: preset');
    click(d, '#preset-cafe'); click(d, '#add-trash');
    const soft = JSON.stringify(lay().items);
    expect(barShown(), 'soft: bar back after another change');
    click(d, '#pe-bar-cancel');
    r.dismissed = !barShown() && !pe() && JSON.stringify(lay().items) === soft;
    expect(r.dismissed, 'soft: dismiss hides bar, layout untouched');
    r.customSaved = (key().presets?.custom || []).length;
    r.menuHasCustom = customs() > 0;
    // (f) manage modal: overwrite + reset the built-in "cafe", hide empty, copy code
    click(d, '#preset-edit');
    click(d, '#pe-set-cafe'); click(d, '#pe-set-cafe');            // two-step confirm
    r.overrideItems = (key().presets?.over?.cafe?.items || []).length;
    expect(r.overrideItems === lay().items.length, 'manage: Use current layout overwrites cafe');
    click(d, '#pe-reset-cafe'); click(d, '#pe-reset-cafe');
    r.overrideCleared = !key().presets?.over?.cafe;
    expect(r.overrideCleared, 'manage: reset clears the cafe override');
    if (r.presets.includes('empty')){ click(d, '#pe-hide-empty'); r.emptyHidden = !d.querySelector('#menu-presets [data-preset="empty"]'); expect(r.emptyHidden, 'manage: hide empty'); }
    click(d, '#modal-copy-presets');
    const code = d.querySelector('#modal-text').value;
    r.presetsCodeFloor = JSON.parse(code).floor;
    expect(r.presetsCodeFloor === w.FC_MAP.floor(), 'presets code carries the floor');
    // round trip into a fresh browser on the same floor
    const fresh = await boot(floor);
    click(fresh.d, '#share-import');
    fresh.d.querySelector('#modal-text').value = code; click(fresh.d, '#modal-go');
    r.importedCustom = [...fresh.d.querySelectorAll('#menu-presets [data-preset]')].filter(b => b.dataset.preset.startsWith('u:')).length;
    expect(r.importedCustom === r.customSaved, 'presets code round trip keeps every custom preset');
    r.importErrors = fresh.errors;
    // a layout code from another floor is refused with a hint
    fresh.d.querySelector('#share-import').click();
    fresh.d.querySelector('#modal-text').value = JSON.stringify({app:'fabcafe-1f-map', v:1, floor: floor === '1F' ? '10F' : '1F', name:'x', items:[]});
    click(fresh.d, '#modal-go');
    r.crossFloorMsg = fresh.d.querySelector('#modal-err').textContent;
    r.printPages = !!w.FC_PRINT;
    expect(!fresh.errors.length, 'import: no errors');
    } else r.editFlow = 'skipped (no cafe preset on this floor)';
  } catch (e){ expect(false, 'threw: ' + e.message); }
  expect(!errors.length, 'no errors: ' + errors.join(' | '));
}
console.log(JSON.stringify(report, null, 1));
if (failures.length) console.error('FAIL\n  ' + failures.join('\n  '));
process.exit(fail ? 1 : 0);
