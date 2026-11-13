/* FabCafe 3F — conference / YEP floor. Same building shell, grid, core and columns as 2F (plan-2f.js);
   the 2025/10 3F base drawing matches the 2F outline (ELV block, WC, stair, diagonal façade, back room).
   No fixed furniture: 3F is set up per event, so it opens empty and offers only the Empty preset (presetsOnly);
   people can still save their own presets. Positions inherit 2F's ±0.5 m. 
   2026/11/13 — room zones (backyard, lab space 1, lounge, lab space 2, war room) and a YEP 2026 preset with the
   cloak in lab space 1, from the 11/10 YEP layout draft. The conference room east of the war room is outside
   this outline. Entrance from the EV hall = the core doors (kept clear). */
(window.PLANS = window.PLANS || {})['3F'] = {
 "meta": {
  "name": "FabCafe 3F",
  "source": "3F base plan (2025/10, same shell as 2F)",
  "units": "mm",
  "titleNote": "plan 2025/10"
 },
 "normal_en": "Empty",
 "normal_jp": "空",
 "normal_sub": {
  "en": "Conference / YEP floor — starts empty",
  "jp": "カンファレンス・YEP用フロア — 空の状態から"
 },
 "stage": {
  "x": 17000,
  "y": 13200,
  "w": 2000,
  "h": 4400,
  "face": [
   -1,
   0
  ]
 },
 "grid": {
  "x": [
   {
    "id": "A",
    "v": 0
   },
   {
    "id": "B",
    "v": 3480
   },
   {
    "id": "C",
    "v": 7530
   },
   {
    "id": "D",
    "v": 10730
   },
   {
    "id": "E",
    "v": 18260
   }
  ],
  "y": [
   {
    "id": "5",
    "v": 0
   },
   {
    "id": "4",
    "v": 8450
   },
   {
    "id": "3",
    "v": 16150
   },
   {
    "id": "1",
    "v": 16885
   }
  ]
 },
 "view": {
  "minX": -1700,
  "minY": -3400,
  "maxX": 19600,
  "maxY": 18400
 },
 "floor": [
  [
   4483,
   -2152
  ],
  [
   10740,
   -2152
  ],
  [
   10740,
   8200
  ],
  [
   18260,
   8200
  ],
  [
   18260,
   17250
  ],
  [
   7300,
   16450
  ],
  [
   -179,
   8786
  ],
  [
   -359,
   8302
  ],
  [
   -233,
   7764
  ],
  [
   2241,
   2116
  ],
  [
   3729,
   -1291
  ]
 ],
 "trashSpot": [
  11500,
  10000
 ],
 "walls": [
  {
   "points": [
    [
     4483,
     -2152
    ],
    [
     10740,
     -2152
    ],
    [
     10740,
     8200
    ]
   ],
   "closed": false,
   "thick": 200
  },
  {
   "points": [
    [
     18260,
     17250
    ],
    [
     7300,
     16450
    ],
    [
     -179,
     8786
    ],
    [
     -359,
     8302
    ],
    [
     -233,
     7764
    ],
    [
     2241,
     2116
    ],
    [
     3729,
     -1291
    ],
    [
     4483,
     -2152
    ]
   ],
   "closed": false,
   "thick": 100
  },
  {
   "points": [
    [
     5965,
     -2150
    ],
    [
     5965,
     600
    ]
   ],
   "closed": false,
   "thick": 150
  },
  {
   "points": [
    [
     6800,
     2170
    ],
    [
     7337,
     2170
    ]
   ],
   "closed": false,
   "thick": 150
  },
  {
   "points": [
    [
     10730,
     8230
    ],
    [
     18260,
     8230
    ]
   ],
   "closed": false,
   "thick": 150
  },
  {
   "points": [
    [
     18260,
     8230
    ],
    [
     18260,
     10300
    ]
   ],
   "closed": false,
   "thick": 200
  },
  {
   "points": [
    [
     18260,
     11300
    ],
    [
     18260,
     17250
    ]
   ],
   "closed": false,
   "thick": 200
  }
 ],
 "rooms": [
  {
   "id": "elv",
   "label_en": "Elevators",
   "label_jp": "エレベーター",
   "kind": "core",
   "points": [
    [
     5965,
     -2150
    ],
    [
     10730,
     -2150
    ],
    [
     10730,
     600
    ],
    [
     5965,
     600
    ]
   ]
  },
  {
   "id": "core",
   "label_en": "Stairs · PS · DS",
   "label_jp": "階段",
   "kind": "core",
   "points": [
    [
     7337,
     2170
    ],
    [
     10730,
     2170
    ],
    [
     10730,
     8230
    ],
    [
     7337,
     8230
    ]
   ]
  },
  {
   "id": "eps-w",
   "label_en": "EPS",
   "label_jp": "EPS",
   "kind": "core",
   "points": [
    [
     6858,
     8230
    ],
    [
     8932,
     8230
    ],
    [
     8932,
     8932
    ],
    [
     6858,
     8932
    ]
   ]
  },
  {
   "id": "eps-e",
   "label_en": "EPS",
   "label_jp": "EPS",
   "kind": "core",
   "points": [
    [
     10367,
     8230
    ],
    [
     12920,
     8230
    ],
    [
     12920,
     8932
    ],
    [
     10367,
     8932
    ]
   ]
  }
 ],
 "fixed": [
  {
   "id": "col-b5",
   "kind": "column",
   "shape": "rect",
   "x": 3828,
   "y": 96,
   "w": 800,
   "h": 800,
   "rot": 0,
   "label_en": "Column",
   "label_jp": "柱"
  },
  {
   "id": "col-a4",
   "kind": "column",
   "shape": "rect",
   "x": 319,
   "y": 8294,
   "w": 800,
   "h": 800,
   "rot": 0,
   "label_en": "Column",
   "label_jp": "柱"
  },
  {
   "id": "col-c1",
   "kind": "column",
   "shape": "rect",
   "x": 7433,
   "y": 15631,
   "w": 800,
   "h": 800,
   "rot": 0,
   "label_en": "Column",
   "label_jp": "柱"
  },
  {
   "id": "col-d1",
   "kind": "column",
   "shape": "rect",
   "x": 10687,
   "y": 15982,
   "w": 700,
   "h": 700,
   "rot": 0,
   "label_en": "Column",
   "label_jp": "柱"
  },
  {
   "id": "col-e2",
   "kind": "column",
   "shape": "rect",
   "x": 18050,
   "y": 16650,
   "w": 600,
   "h": 900,
   "rot": 0,
   "label_en": "Column",
   "label_jp": "柱"
  },
  {
   "id": "door-lobby",
   "kind": "door",
   "shape": "arc",
   "x": 6000,
   "y": 2170,
   "r": 800,
   "rot": 0,
   "sweep": 90,
   "label_en": "Door from lobby",
   "label_jp": "扉（EVホール）"
  },
  {
   "id": "door-core-l",
   "kind": "door",
   "shape": "arc",
   "x": 9000,
   "y": 8932,
   "r": 600,
   "rot": 0,
   "sweep": 90,
   "label_en": "Door from core",
   "label_jp": "扉"
  },
  {
   "id": "door-core-r",
   "kind": "door",
   "shape": "arc",
   "x": 10300,
   "y": 8932,
   "r": 600,
   "rot": 90,
   "sweep": 90,
   "label_en": "Door from core",
   "label_jp": "扉"
  },
  {
   "id": "door-eps-w-l",
   "kind": "door",
   "shape": "arc",
   "x": 7656,
   "y": 8932,
   "r": 540,
   "rot": 0,
   "sweep": 90,
   "label_en": "EPS door",
   "label_jp": "EPS 扉"
  },
  {
   "id": "door-eps-w-r",
   "kind": "door",
   "shape": "arc",
   "x": 8773,
   "y": 8932,
   "r": 540,
   "rot": 90,
   "sweep": 90,
   "label_en": "EPS door",
   "label_jp": "EPS 扉"
  },
  {
   "id": "door-eps-e-l",
   "kind": "door",
   "shape": "arc",
   "x": 11484,
   "y": 8932,
   "r": 540,
   "rot": 0,
   "sweep": 90,
   "label_en": "EPS door",
   "label_jp": "EPS 扉"
  },
  {
   "id": "door-eps-e-r",
   "kind": "door",
   "shape": "arc",
   "x": 12760,
   "y": 8932,
   "r": 540,
   "rot": 90,
   "sweep": 90,
   "label_en": "EPS door",
   "label_jp": "EPS 扉"
  },
  {
   "id": "door-stair-ext",
   "kind": "door",
   "shape": "arc",
   "x": 18260,
   "y": 11300,
   "r": 800,
   "rot": 180,
   "sweep": 90,
   "label_en": "Exterior stair",
   "label_jp": "外階段"
  },
  {
   "id": "cross-a",
   "kind": "fixed-table",
   "shape": "rect",
   "x": 14170,
   "y": 12380,
   "w": 4460,
   "h": 500,
   "rot": 79,
   "label_en": "Cross table 十字台",
   "label_jp": "十字台",
   "note": "fixed — position read off the YEP 2026 layout draft (±0.5 m), check in the room"
  },
  {
   "id": "cross-b",
   "kind": "fixed-table",
   "shape": "rect",
   "x": 14160,
   "y": 12380,
   "w": 5860,
   "h": 500,
   "rot": -11,
   "label_en": "",
   "label_jp": "",
   "note": "fixed — position read off the YEP 2026 layout draft (±0.5 m), check in the room"
  },
  {
   "id": "safecast",
   "kind": "counter",
   "shape": "rect",
   "x": 5670,
   "y": 12450,
   "w": 3320,
   "h": 600,
   "rot": 44,
   "label_en": "Safecast area",
   "label_jp": "Safecastエリア",
   "note": "fixed — position read off the YEP 2026 layout draft (±0.5 m), check in the room"
  },
  {
   "id": "shelf-cloak",
   "kind": "counter",
   "shape": "rect",
   "x": 4560,
   "y": 11120,
   "w": 1780,
   "h": 350,
   "rot": -42,
   "label_en": "Shelf 棚",
   "label_jp": "棚",
   "note": "fixed — position read off the YEP 2026 layout draft (±0.5 m), check in the room"
  },
  {
   "id": "shelf-warroom-door",
   "kind": "counter",
   "shape": "rect",
   "x": 10610,
   "y": 10830,
   "w": 1810,
   "h": 350,
   "rot": 79,
   "label_en": "Shelf 棚",
   "label_jp": "棚",
   "note": "fixed — position read off the YEP 2026 layout draft (±0.5 m), check in the room"
  },
  {
   "id": "shelf-window",
   "kind": "counter",
   "shape": "rect",
   "x": 14360,
   "y": 16140,
   "w": 6410,
   "h": 400,
   "rot": 4,
   "label_en": "Bookshelf 本棚",
   "label_jp": "本棚",
   "note": "fixed — position read off the YEP 2026 layout draft (±0.5 m), check in the room"
  },
  {
   "id": "shelf-east",
   "kind": "counter",
   "shape": "rect",
   "x": 17790,
   "y": 14830,
   "w": 1780,
   "h": 350,
   "rot": 90,
   "label_en": "Shelf 棚",
   "label_jp": "棚",
   "note": "fixed — position read off the YEP 2026 layout draft (±0.5 m), check in the room"
  }
 ],
 "furniture": [],
 "presets": [
  {
   "id": "yep-2026",
   "en": "YEP 2026 (draft)",
   "jp": "YEP 2026（案）",
   "sub_en": "Cloak in lab space 1, Theme A in the war room, Theme B in the lounge — from the 11/10 layout draft (±0.5 m)",
   "sub_jp": "クロークはラボスペース1、テーマAはウォールーム、テーマBはラウンジ（11/10版レイアウト案より・±0.5m）",
   "items": [
    {"type": "zone", "x": 3550, "y": 7700, "rot": 45, "w": 5600, "h": 5600, "label": "Cloak クローク", "color": "gray"},
    {
     "type": "zone",
     "x": 7560,
     "y": 11330,
     "rot": 0,
     "w": 5200,
     "h": 4200,
     "label": "Theme B テーマB",
     "color": "orange"
    },
    {
     "type": "zone",
     "x": 14430,
     "y": 12470,
     "rot": 0,
     "w": 6870,
     "h": 7180,
     "label": "Theme A テーマA",
     "color": "lavender"
    },
    {
     "type": "note",
     "x": 9800,
     "y": 9700,
     "rot": 0,
     "label": "入口 Entrance ↓",
     "fs": 260
    }
   ]
  }
 ],
 "defaultPreset": "empty",
 "presetsOnly": [
  "empty",
  "yep-2026"
 ],
 "keepClear": [
  {
   "id": "entrance",
   "label_en": "Entrance (core doors)",
   "label_jp": "入口（コア側の扉）",
   "points": [
    [
     8900,
     8932
    ],
    [
     10740,
     8932
    ],
    [
     10740,
     10400
    ],
    [
     8900,
     10400
    ]
   ]
  }
 ],
 "sim": {
  "scans": [],
  "heights": {
   "floor_to_floor_mm": null,
   "ceiling_mm": 3400,
   "beam_mm": 2600,
   "floor_z_mm": 0
  },
  "notes": "Ceiling 3400 mm / beam underside 2600 mm (measured on 3F for the year-end party layout)."
 },
 "areas": [
  {
   "id": "backyard",
   "label_en": "Backyard",
   "label_jp": "バックヤード",
   "owner": "loftwork",
   "label_at": [
    3900,
    400
   ],
   "points": [
    [
     3729,
     -1291
    ],
    [
     4483,
     -2152
    ],
    [
     5965,
     -2152
    ],
    [
     5965,
     600
    ],
    [
     7337,
     600
    ],
    [
     7337,
     3985
    ],
    [
     1422,
     3985
    ],
    [
     2241,
     2116
    ]
   ]
  },
  {
   "id": "lab1",
   "label_en": "Lab space 1 (YEP: cloak)",
   "label_jp": "ラボスペース1（YEP時はクローク）",
   "owner": "loftwork",
   "label_at": [
    1700,
    4500
   ],
   "points": [
    [
     1422,
     3985
    ],
    [
     7337,
     3985
    ],
    [
     6858,
     8932
    ],
    [
     3300,
     12300
    ],
    [
     3122,
     12170
    ],
    [
     -179,
     8786
    ],
    [
     -359,
     8302
    ],
    [
     -233,
     7764
    ]
   ]
  },
  {
   "id": "lounge",
   "label_en": "Lounge",
   "label_jp": "ラウンジ",
   "owner": "loftwork",
   "label_at": [
    7300,
    9400
   ],
   "points": [
    [
     6858,
     8932
    ],
    [
     10740,
     8932
    ],
    [
     10740,
     12900
    ],
    [
     10048,
     12935
    ],
    [
     7083,
     13500
    ],
    [
     3300,
     12300
    ]
   ]
  },
  {
   "id": "lab2",
   "label_en": "Lab space 2",
   "label_jp": "ラボスペース2",
   "owner": "loftwork",
   "label_at": [
    5200,
    13700
   ],
   "points": [
    [
     3300,
     12300
    ],
    [
     7083,
     13500
    ],
    [
     10048,
     12935
    ],
    [
     10480,
     15607
    ],
    [
     10480,
     16682
    ],
    [
     7300,
     16450
    ],
    [
     3122,
     12170
    ]
   ]
  },
  {
   "id": "warroom",
   "label_en": "War room",
   "label_jp": "ウォールーム",
   "owner": "loftwork",
   "label_at": [
    11000,
    8800
   ],
   "points": [
    [
     10740,
     8200
    ],
    [
     18260,
     8200
    ],
    [
     18260,
     17250
    ],
    [
     10480,
     16682
    ],
    [
     10480,
     15607
    ],
    [
     10048,
     12935
    ],
    [
     10740,
     12900
    ]
   ]
  }
 ]
};
