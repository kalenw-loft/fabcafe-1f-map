# FabCafe Tokyo 1F Map

**English** · [日本語](README.ja.md)

A floor-plan tool for FabCafe Tokyo 1F. Plan an event layout, fill in the part-time staff sheet, and print everything on A4.

**Open it:** https://kalenw-loft.github.io/fabcafe-1f-map/

## What you can do

- **Lay out the floor:** start from a preset (Cafe, Talk ~50, Talk – back half, Workshop, Breakfast, Empty), then drag, rotate and add tables, chairs, zones and notes. Seats, tables and standing room update as you go, and items that hit a wall or each other are flagged. To change a preset, tap ✎ next to it (or **+ New preset**), arrange it, then **Save**, **Save as new** or **Cancel**. Changed presets stay in this browser; send them with **Manage presets… → Copy presets code**.
- **Fill in the staff sheet (当日シート):** event name, times, the drink style and lock-up owners for part-time staff. It prints as one A4 page in Japanese.
- **Print:** **Print PDF / 印刷用PDF** lets you pick pages and preview them:
  1. **Floor plan:** your layout with the event details and a legend
  2. **Staff sheet:** the 当日シート
  3. **Teardown:** the normal cafe layout, for putting everything back
- **Machine sign (貼り紙):** a "no drinks on the machines" sign, A4 landscape.
- **Share a layout:** Share → **Copy layout link** gives a link that opens the layout and staff sheet directly (or Copy layout code, which the other person pastes in).
- **Save the PDF:** Print PDF saves one A4 `.pdf` file straight to Downloads — no print dialog.

Everything stays in your browser (local storage). There's no account, no server and no tracking.

## For AI agents and scripts

- Open a ready layout with `…/#floor=1F&layout=<code>` (the link from Share → Copy layout link).
- In the page: `FC_MAP.switchFloor('10F')`, `FC_MAP.loadCode(text)`, `FC_MAP.layoutCode()`, `FC_MAP.layoutLink()`, `FC_MEMO.set({...})` for the staff sheet.
- `FC_PRINT.savePDF(['map', 'memo', 'restore'])` downloads the A4 PDF (pick the pages you want).

## Tips

- Print at **100% / actual size** on A4.
- Layouts are saved per browser. Use Share to move one to another computer.
- The plan is traced from the 2026/02 floor drawing at 1:100. It's accurate to about 10 cm, so double-check tight spots on site.

## For developers

No dependencies beyond Python 3 (Node is only needed for the test).

```
python3 build.py      # builds index.html (and fabcafe-1f-map.html for the Claude artifact)
node check.mjs        # smoke test (needs jsdom: npm i jsdom)
```

| File | What it is |
|---|---|
| `editor.html` | Map editor: canvas, presets, saved layouts, share, sign |
| `plan-data.js` | 1F geometry in mm: walls, rooms, fixtures, default cafe furniture |
| `memo.html` / `memo.css` / `memo.js` | 当日シート: the fill-in staff sheet |
| `print.html` / `print.css` / `print.js` | Print composer: page picker, A4 pages, PDF |
| `build.py` | Inlines everything into one self-contained page |
| `check-presets.mjs` | Presets keep kitchen/entrances clear (2F: back half only) |
| `check.mjs` | jsdom smoke test |

Edit the source files, run `python3 build.py`, then commit and push. GitHub Pages updates the site in a minute or two.
