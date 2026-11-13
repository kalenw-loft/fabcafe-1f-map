/* FabCafe 3F — conference / YEP floor. Same building shell, grid, core and columns as 2F (plan-2f.js);
   the 2025/10 3F base drawing matches the 2F outline (ELV block, WC, stair, diagonal façade, back room).
   No fixed furniture: 3F is set up per event, so it opens empty and offers only the Empty preset (presetsOnly);
   people can still save their own presets. Positions inherit 2F's ±0.5 m. */
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
  }
 ],
 "furniture": [],
 "presets": [],
 "defaultPreset": "empty",
 "presetsOnly": [
  "empty"
 ],
 "keepClear": [
  {
   "id": "lobby",
   "label_en": "Lobby door",
   "label_jp": "EVホール側の入口",
   "points": [
    [
     4483,
     600
    ],
    [
     7337,
     600
    ],
    [
     7337,
     4000
    ],
    [
     4483,
     4000
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
 }
};
