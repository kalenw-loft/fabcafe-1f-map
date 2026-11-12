#!/usr/bin/env python3
"""Build the single-file FabCafe Floor Map (1F / 2F / 3F / 10F): editor + floor data + staff sheet + print composer.

    python3 build.py        -> fabcafe-1f-map.html (artifact) + index.html (web)
"""
from pathlib import Path

ROOT = Path(__file__).parent
read = lambda n: (ROOT / n).read_text(encoding='utf-8')


def opt(n):
    p = ROOT / n
    return p.read_text(encoding='utf-8') if p.exists() else ''


def main():
    s = read('editor.html')
    # floor plans (1F, 2F, 3F, 10F) + the floor picker, inlined in this order.
    # plan-3f.js is tolerated missing (empty <script></script>) until a 3F trace exists;
    # Object.keys(window.PLANS) then just skips 3F everywhere that reads it.
    for n in ('plan-data.js', 'plan-2f.js', 'plan-3f.js', 'plan-10f.js', 'floors.js'):
        tag = f'<script src="{n}"></script>'
        assert s.count(tag) == 1, n + ' tag not found'
        s = s.replace(tag, '<script>\n' + opt(n).replace('</script', '<\\/script') + '\n</script>')

    css = ''.join(f'<style id="{n.replace(".", "-")}">\n{opt(n)}\n</style>\n' for n in ('memo.css', 'print.css', 'sim.css') if opt(n))
    anchor = '<style id="plan-css"></style>\n'
    assert s.count(anchor) == 1, 'plan-css anchor not found'
    s = s.replace(anchor, anchor + css)

    # modules load after the editor script, so window.FC_MAP / window.FC_SIM already exist.
    # sim.js is optional (none committed yet — see SIMULATION.md); it slots in next to memo/print.
    tail = ''
    for mod in ('memo', 'print', 'sim'):
        tail += opt(mod + '.html')
        if opt(mod + '.js'):
            tail += f'\n<script>\n{opt(mod + ".js")}\n</script>\n'
    s = s.rstrip() + '\n' + tail

    (ROOT / 'fabcafe-1f-map.html').write_text(s, encoding='utf-8')
    print(f'fabcafe-1f-map.html  {len(s.encode()) // 1024} KB')

    # standalone web page (GitHub Pages): the artifact host normally adds this head
    head = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<meta name="robots" content="noindex">\n</head>\n<body>\n')
    (ROOT / 'index.html').write_text(head + s + '</body>\n</html>\n', encoding='utf-8')
    print('index.html (web)')


if __name__ == '__main__':
    main()
