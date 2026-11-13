/* Loftwork COOOP10 (10F) — traced from the architect's 10F plan (2017/12/24 情報更新); the dimensioned
   vector exports and the raster of the same drawing all agree.
   Same building shell and grid as 2F (A–E 18260mm, rows 5→1 16885mm).

   2026/11 accuracy check: the architect's dimension chain — columns A/B/C/D/E = 3480/4050/3200/7530mm
   (cumulative 18260) and rows 5/4/3/1 = 8450/7700/735mm (cumulative 16885) — matches `grid` exactly, so the
   shell/grid is high-confidence. Walls, WC, ELV, stair, EPS, cloak and the sofa were checked by eye against the
   same drawing (not re-measured to the mm). Soft flag: the 受付 (reception) counter in `fixed` may sit
   ~0.5–1 m further south/east than drawn — worth a check in the room. Elsewhere ±150–300mm.

   2026/11/13 — furniture, areas and the event preset re-laid from an event layout sketch of this floor
   (drawn rotated 90°, ~14.5 mm/px; sofa + kitchen island land within 0.4 m), so positions are ±0.5 m.
   Preset rules: keepClear (kitchen, lobby entrance, inner door) is never filled by presets; the kitchen
   counter is standing room during events (`standing`). */
(window.PLANS = window.PLANS || {})['10F'] = {
 "meta": {
  "name": "Loftwork COOOP10 10F",
  "source": "10F_loft_平面 (BATTA NATION, 2017/12/24 情報更新)",
  "units": "mm",
  "titleNote": "source plan 2017/12",
  "tenant": {
   "en": "Loftwork COOOP10",
   "jp": "ロフトワーク COOOP10",
   "owner": "loftwork",
   "short": "Loftwork"
  }
 },
 "defaultPreset": "empty",
 "normal_en": "Usual",
 "normal_jp": "通常",
 "normal_sub": {
  "en": "Big tables, window tables, sofa + stools",
  "jp": "大テーブル・窓側の机・ソファ・スツール"
 },
 "stage": {
  "x": 17000,
  "y": 14000,
  "w": 2000,
  "h": 4200,
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
  9700,
  10300
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
     2241,
     2116
    ],
    [
     6096,
     2116
    ]
   ],
   "closed": false,
   "thick": 150
  },
  {
   "points": [
    [
     7200,
     2116
    ],
    [
     7530,
     2116
    ]
   ],
   "closed": false,
   "thick": 150
  },
  {
   "points": [
    [
     10740,
     8200
    ],
    [
     18260,
     8200
    ]
   ],
   "closed": false,
   "thick": 150
  },
  {
   "points": [
    [
     18260,
     8200
    ],
    [
     18260,
     11000
    ]
   ],
   "closed": false,
   "thick": 200
  },
  {
   "points": [
    [
     18260,
     11800
    ],
    [
     18260,
     17250
    ]
   ],
   "closed": false,
   "thick": 200
  },
  {
   "points": [
    [
     13000,
     9199
    ],
    [
     18260,
     10454
    ]
   ],
   "closed": false,
   "thick": 120
  }
 ],
 "rooms": [
  {
   "id": "wc",
   "label_en": "WC",
   "label_jp": "トイレ",
   "kind": "wc",
   "points": [
    [
     4483,
     -2152
    ],
    [
     6096,
     -2152
    ],
    [
     6096,
     2116
    ],
    [
     2241,
     2116
    ],
    [
     3729,
     -1291
    ]
   ]
  },
  {
   "id": "elv",
   "label_en": "Elevators",
   "label_jp": "エレベーター",
   "kind": "core",
   "points": [
    [
     6200,
     -2100
    ],
    [
     10700,
     -2100
    ],
    [
     10700,
     -36
    ],
    [
     6200,
     -36
    ]
   ]
  },
  {
   "id": "stair",
   "label_en": "Stairs",
   "label_jp": "階段",
   "kind": "core",
   "points": [
    [
     7530,
     2116
    ],
    [
     8964,
     2116
    ],
    [
     8964,
     8248
    ],
    [
     7530,
     8248
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
     6903,
     8248
    ],
    [
     8964,
     8248
    ],
    [
     8964,
     9235
    ],
    [
     6903,
     9235
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
     10668,
     7400
    ],
    [
     11475,
     7400
    ],
    [
     11475,
     8158
    ],
    [
     12909,
     8158
    ],
    [
     12909,
     9055
    ],
    [
     10399,
     9055
    ],
    [
     10399,
     8158
    ],
    [
     10668,
     8158
    ]
   ]
  },
  {
   "id": "cloak",
   "label_en": "Cloak / storage",
   "label_jp": "クローク兼倉庫",
   "kind": "backyard",
   "points": [
    [
     12909,
     8200
    ],
    [
     18260,
     8200
    ],
    [
     18260,
     10454
    ],
    [
     13000,
     9199
    ]
   ]
  }
 ],
 "fixed": [
  {
   "id": "col-a4",
   "kind": "column",
   "shape": "rect",
   "x": 269,
   "y": 8302,
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
   "x": 7441,
   "y": 15921,
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
   "x": 10704,
   "y": 16065,
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
   "y": 16750,
   "w": 600,
   "h": 900,
   "rot": 0,
   "label_en": "Column",
   "label_jp": "柱"
  },
  {
   "id": "col-e4",
   "kind": "column",
   "shape": "rect",
   "x": 17930,
   "y": 8550,
   "w": 600,
   "h": 600,
   "rot": 0,
   "label_en": "Column",
   "label_jp": "柱"
  },
  {
   "id": "kitchen-island",
   "kind": "counter",
   "shape": "rect",
   "x": 5576,
   "y": 7109,
   "w": 860,
   "h": 4000,
   "rot": 0,
   "label_en": "Kitchen counter",
   "label_jp": "キッチンカウンター"
  },
  {
   "id": "kitchen-wall",
   "kind": "counter",
   "shape": "rect",
   "x": 7110,
   "y": 6553,
   "w": 663,
   "h": 3317,
   "rot": 0,
   "label_en": "Kitchen",
   "label_jp": "キッチン"
  },
  {
   "id": "reception",
   "kind": "counter",
   "shape": "rect",
   "x": 6320,
   "y": 3990,
   "w": 2205,
   "h": 627,
   "rot": 0,
   "label_en": "Reception",
   "label_jp": "受付"
  },
  {
   "id": "sofa",
   "kind": "fixed-table",
   "shape": "rect",
   "x": 9055,
   "y": 15966,
   "w": 2510,
   "h": 807,
   "rot": 0,
   "label_en": "Sofa (built-in)",
   "label_jp": "ソファ"
  },
  {
   "id": "wb-north",
   "kind": "screen",
   "shape": "rect",
   "x": 3570,
   "y": 2230,
   "w": 2660,
   "h": 100,
   "rot": 0,
   "label_en": "Whiteboard wall",
   "label_jp": "ホワイトボード壁"
  },
  {
   "id": "wb-east",
   "kind": "screen",
   "shape": "rect",
   "x": 18150,
   "y": 14000,
   "w": 100,
   "h": 2690,
   "rot": 0,
   "label_en": "Whiteboard wall",
   "label_jp": "ホワイトボード壁"
  },
  {
   "id": "door-lobby",
   "kind": "door",
   "shape": "arc",
   "x": 6096,
   "y": 2116,
   "r": 1100,
   "rot": 0,
   "sweep": 90,
   "label_en": "Entrance from lobby",
   "label_jp": "入口（EVホール）"
  },
  {
   "id": "door-core-l",
   "kind": "door",
   "shape": "arc",
   "x": 9055,
   "y": 8481,
   "r": 600,
   "rot": 270,
   "sweep": 90,
   "label_en": "Door",
   "label_jp": "扉"
  },
  {
   "id": "door-core-r",
   "kind": "door",
   "shape": "arc",
   "x": 10310,
   "y": 8481,
   "r": 600,
   "rot": 180,
   "sweep": 90,
   "label_en": "Door",
   "label_jp": "扉"
  },
  {
   "id": "door-eps-w-l",
   "kind": "door",
   "shape": "arc",
   "x": 7710,
   "y": 9235,
   "r": 560,
   "rot": 0,
   "sweep": 90,
   "label_en": "EPS door",
   "label_jp": "EPS 扉"
  },
  {
   "id": "door-eps-w-r",
   "kind": "door",
   "shape": "arc",
   "x": 8890,
   "y": 9235,
   "r": 560,
   "rot": 90,
   "sweep": 90,
   "label_en": "EPS door",
   "label_jp": "EPS 扉"
  },
  {
   "id": "door-eps-e-l",
   "kind": "door",
   "shape": "arc",
   "x": 11475,
   "y": 9055,
   "r": 560,
   "rot": 0,
   "sweep": 90,
   "label_en": "EPS door",
   "label_jp": "EPS 扉"
  },
  {
   "id": "door-eps-e-r",
   "kind": "door",
   "shape": "arc",
   "x": 12640,
   "y": 9055,
   "r": 560,
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
   "y": 11800,
   "r": 800,
   "rot": 180,
   "sweep": 90,
   "label_en": "Exterior stair",
   "label_jp": "外階段"
  }
 ],
 "furniture": [
  {
   "x": 14530,
   "y": 12100,
   "rot": 0,
   "type": "table-long",
   "w": 2700,
   "h": 1500
  },
  {
   "x": 14900,
   "y": 15290,
   "rot": 0,
   "type": "table-long",
   "w": 2700,
   "h": 1500
  },
  {
   "x": 8690,
   "y": 14350,
   "rot": 0,
   "type": "table-long",
   "w": 2100,
   "h": 700
  },
  {
   "x": 4270,
   "y": 11590,
   "rot": 45,
   "type": "table-sq",
   "w": 900,
   "h": 900
  },
  {
   "x": 1510,
   "y": 7680,
   "rot": 25,
   "type": "table-sq",
   "w": 900,
   "h": 900
  },
  {
   "type": "stool",
   "x": 571,
   "y": 7174,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 1029,
   "y": 7374,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 1017,
   "y": 6157,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 1475,
   "y": 6358,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 1462,
   "y": 5140,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 1920,
   "y": 5341,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 1907,
   "y": 4124,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 2365,
   "y": 4324,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 2353,
   "y": 3107,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 2811,
   "y": 3308,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 744,
   "y": 9088,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 1604,
   "y": 9969,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 2465,
   "y": 10851,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 3325,
   "y": 11732,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 4185,
   "y": 12613,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 5045,
   "y": 13495,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 5905,
   "y": 14376,
   "rot": 0
  },
  {
   "type": "stool",
   "x": 6765,
   "y": 15257,
   "rot": 0
  }
 ],
 "areas": [
  {
   "id": "hall",
   "label_at": [
    10950,
    9800
   ],
   "label_en": "Main hall",
   "label_jp": "メインホール",
   "owner": "loftwork",
   "points": [
    [
     10740,
     9100
    ],
    [
     12909,
     9100
    ],
    [
     13000,
     9199
    ],
    [
     18260,
     10454
    ],
    [
     18260,
     17250
    ],
    [
     11800,
     16780
    ],
    [
     10740,
     16700
    ]
   ]
  },
  {
   "id": "lounge",
   "label_at": [
    7750,
    9750
   ],
   "label_en": "Sofa lounge",
   "label_jp": "ソファラウンジ",
   "owner": "loftwork",
   "points": [
    [
     7530,
     9235
    ],
    [
     10740,
     9235
    ],
    [
     10740,
     16700
    ],
    [
     7300,
     16450
    ],
    [
     7530,
     12000
    ]
   ]
  },
  {
   "id": "window",
   "label_at": [
    700,
    6800
   ],
   "label_en": "Window side",
   "label_jp": "窓側",
   "owner": "loftwork",
   "points": [
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
     5146,
     2116
    ],
    [
     5146,
     9109
    ],
    [
     7530,
     9235
    ],
    [
     7530,
     12000
    ],
    [
     7300,
     16450
    ]
   ]
  },
  {
   "id": "kitchen",
   "label_at": [
    5300,
    5300
   ],
   "label_en": "Kitchen & counter",
   "label_jp": "キッチン＆カウンター",
   "owner": "loftwork",
   "points": [
    [
     5146,
     4895
    ],
    [
     7442,
     4895
    ],
    [
     7442,
     9109
    ],
    [
     5146,
     9109
    ]
   ]
  }
 ],
 "presets": [
  {
   "id": "talk-tables",
   "en": "Talk + tables",
   "jp": "トーク＋テーブル",
   "sub_en": "Event layout used 2026/10: 2 big tables + 4 tables borrowed from 2F, PA, reception at the inner door, kitchen = standing",
   "sub_jp": "2026/10のイベント配置：大テーブル2台＋2Fから借りた机4台、PA、奥の扉で受付、キッチンは立ち見",
   "items": [
    {
     "x": 14530,
     "y": 12100,
     "rot": 0,
     "type": "table-long",
     "w": 2700,
     "h": 1500
    },
    {
     "x": 14900,
     "y": 15290,
     "rot": 0,
     "type": "table-long",
     "w": 2700,
     "h": 1500
    },
    {
     "x": 8690,
     "y": 14350,
     "rot": 0,
     "type": "table-long",
     "w": 2100,
     "h": 700
    },
    {
     "x": 15070,
     "y": 11090,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 14060,
     "y": 11090,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 15390,
     "y": 13190,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 14490,
     "y": 13190,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 13720,
     "y": 13190,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 15360,
     "y": 14320,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 14390,
     "y": 14320,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 15800,
     "y": 16410,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 14900,
     "y": 16410,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 14100,
     "y": 16410,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 11290,
     "y": 11130,
     "rot": 0,
     "type": "table-sq",
     "w": 800,
     "h": 1300
    },
    {
     "x": 10260,
     "y": 11130,
     "rot": 0,
     "type": "table-sq",
     "w": 800,
     "h": 1300
    },
    {
     "x": 11110,
     "y": 9970,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 10200,
     "y": 9970,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 11270,
     "y": 12000,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 10290,
     "y": 12000,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 11880,
     "y": 14610,
     "rot": 0,
     "type": "table-sq",
     "w": 800,
     "h": 1300
    },
    {
     "x": 10970,
     "y": 14610,
     "rot": 0,
     "type": "table-sq",
     "w": 800,
     "h": 1300
    },
    {
     "x": 12140,
     "y": 13450,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 11110,
     "y": 13450,
     "rot": 0,
     "type": "chair"
    },
    {
     "x": 11810,
     "y": 15770,
     "rot": 180,
     "type": "chair"
    },
    {
     "x": 10020,
     "y": 14700,
     "rot": 270,
     "type": "chair"
    },
    {
     "x": 4270,
     "y": 11590,
     "rot": 45,
     "type": "table-sq",
     "w": 900,
     "h": 900
    },
    {
     "x": 1510,
     "y": 7680,
     "rot": 25,
     "type": "table-sq",
     "w": 900,
     "h": 900
    },
    {
     "x": 8440,
     "y": 9850,
     "rot": 0,
     "type": "zone",
     "w": 800,
     "h": 1500,
     "label": "Reception 受付",
     "color": "sky"
    },
    {
     "x": 5960,
     "y": 10070,
     "rot": 90,
     "type": "table-long",
     "w": 1900,
     "h": 600
    },
    {
     "x": 5960,
     "y": 10070,
     "rot": 0,
     "type": "note",
     "label": "ソファ机：荷物置き",
     "fs": 150
    },
    {
     "x": 4270,
     "y": 8090,
     "rot": 0,
     "type": "zone",
     "w": 900,
     "h": 2500,
     "label": "Chair storage 椅子置き場",
     "color": "gray"
    },
    {
     "type": "zone",
     "x": 5240,
     "y": 13700,
     "w": 3300,
     "h": 600,
     "rot": 46,
     "label": "Magazines 雑誌",
     "color": "yellow"
    },
    {
     "type": "zone",
     "x": 1870,
     "y": 5320,
     "w": 4500,
     "h": 1500,
     "rot": 294,
     "label": "Green room 控室・ドリンク",
     "color": "orange"
    },
    {
     "x": 3910,
     "y": 4560,
     "rot": 90,
     "type": "projector-screen",
     "w": 1400
    },
    {
     "type": "pa",
     "x": 13870,
     "y": 10080,
     "rot": 90
    },
    {
     "type": "zone",
     "x": 6290,
     "y": 7000,
     "rot": 0,
     "w": 2200,
     "h": 4100,
     "label": "Standing 立ち見 (kitchen)",
     "color": "leaf"
    }
   ]
  },
  {
   "id": "exhibit-10f",
   "en": "Exhibit zones",
   "jp": "展示ゾーン",
   "sub_en": "Year-end party exhibit zones (approximate) — rename the zones for your event",
   "sub_jp": "忘年会の展示ゾーン（概算）— ゾーン名はイベントに合わせて変更",
   "items": [
    {
     "type": "zone",
     "x": 4630,
     "y": 2895,
     "rot": 0,
     "w": 2480,
     "h": 390,
     "label": "Projection 投影",
     "color": "lavender"
    },
    {
     "type": "zone",
     "x": 5650,
     "y": 13610,
     "rot": 0,
     "w": 1340,
     "h": 1340,
     "label": "Bar バー",
     "color": "orange"
    },
    {
     "type": "zone",
     "x": 6565,
     "y": 14455,
     "rot": 0,
     "w": 1290,
     "h": 1290,
     "label": "Exhibit A 展示A",
     "color": "sky"
    },
    {
     "type": "zone",
     "x": 9105,
     "y": 14760,
     "rot": 0,
     "w": 1910,
     "h": 1120,
     "label": "Exhibit B 展示B",
     "color": "lavender"
    },
    {
     "type": "zone",
     "x": 14465,
     "y": 12275,
     "rot": 0,
     "w": 7470,
     "h": 7650,
     "label": "Main exhibit メイン展示",
     "color": "gray"
    },
    {
     "type": "zone",
     "x": 6290,
     "y": 7000,
     "rot": 0,
     "w": 2200,
     "h": 4100,
     "label": "Standing 立ち見 (kitchen)",
     "color": "leaf"
    }
   ]
  }
 ],
 "sim": {
  "scans": [
   {
    "id": "10f-scan",
    "kind": "photo360",
    "format": "360",
    "captured": "2026-09-14",
    "note": "360° walkthrough scan (2026-09) — link kept internally; unregistered to this plan",
    "register": {
     "origin_mm": [
      0,
      0
     ],
     "z_mm": 0,
     "rot_deg": 0,
     "scale": 1
    }
   }
  ],
  "heights": {
   "floor_to_floor_mm": null,
   "ceiling_mm": 3400,
   "beam_mm": 2600,
   "floor_z_mm": 0
  },
  "notes": "Ceiling/beam heights are upper-floor figures measured on 3F — placeholder for 10F (same shell); confirm before relying on them."
 },
 "keepClear": [
  {
   "id": "kitchen",
   "label_en": "Kitchen (standing only)",
   "label_jp": "キッチン（立ち見のみ）",
   "points": [
    [
     5146,
     4895
    ],
    [
     7442,
     4895
    ],
    [
     7442,
     9109
    ],
    [
     5146,
     9109
    ]
   ]
  },
  {
   "id": "entrance",
   "label_en": "Entrance from lobby",
   "label_jp": "入口（EVホール側）",
   "points": [
    [
     4600,
     2116
    ],
    [
     7530,
     2116
    ],
    [
     7530,
     4895
    ],
    [
     4600,
     4895
    ]
   ]
  },
  {
   "id": "inner-door",
   "label_en": "Inner door",
   "label_jp": "奥の扉",
   "points": [
    [
     8964,
     8248
    ],
    [
     10740,
     8248
    ],
    [
     10740,
     9800
    ],
    [
     8964,
     9800
    ]
   ]
  }
 ],
 "standing": [
  {
   "x": 6290,
   "y": 7000,
   "w": 2200,
   "h": 4100,
   "label": "Standing 立ち見 (kitchen)"
  }
 ]
};
