// FabCafe Tokyo 1F — traced from FC_1F_PLAN_2026.pdf (配置図, 2026/02 更新, 1:100 A3).
// Traced from the PDF's vector paths (layers 0_SRC / 1_座席 / 9_更新履歴), mapped to mm by piecewise-linear
// interpolation between grid lines X1..X3 / Y4..Y1. Typical error well under 100 mm.
// Coordinates: mm. Origin = X1 x Y4 (top-left grid corner). x right, y DOWN. rot = degrees clockwise.
// Chair rot convention: rot 0 = chair faces +y (down), backrest on the -y side.
//
// 2026-11 accuracy cross-check: compared this trace against the architect's 2026-11 CAD (a Make2D export
// of the 3D model: curves + grid-reference marks only). Fitting the grid marks to this file's grid
// (X1/X2/X3 = 0/5450/13885; Y4/Y3/Y2/Y1 = 0/7530/10730/18260, which also match the original 2011 1:100
// drawing) left residuals <10 mm and a scale of ~0.997 — trace and CAD agree on size to ~0.3%. Walls read
// within ~20–200 mm, so no geometry was changed. Open: the east wall near X3 (x=13516, ~370 mm inboard of
// the gridline) isn't confirmed by the CAD — tape-measure it before trusting it to better than ~150 mm.
//
// Preset rules (keepClear below): presets never fill the entrance, the order/pickup strip in front of
// the cafe counter, or the side-entrance doorway.
(window.PLANS = window.PLANS || {})['1F'] = {
  machines: true, // fab machines on this floor: shows the 貼り紙 (no-drinks sign) button
  meta: { name: 'FabCafe Tokyo 1F', source: 'FC_1F_PLAN_2026.pdf (配置図, 2026/02 更新, 1:100 A3)', units: 'mm',
    tenant: { en: 'FabCafe Tokyo', jp: 'FabCafe Tokyo', owner: 'fabcafe' } },
  // rental halves (not ownership splits — the whole floor is FabCafe's) matching the BACK_HALF rule
  // used elsewhere in the editor (y < 10730 && x > 6160). front half is in two pieces because the
  // back-half rectangle bites into the floor outline's middle; together the 3 polygons exactly tile
  // the public floor area (119.7 m²) with no gaps/overlap (checked by shoelace area sum).
  areas: [
    { id: 'back-half', label_en: 'Back half (rental)', label_jp: '奥半面', owner: 'fabcafe',
      points: [[6160,205],[12846,205],[13498,700],[13498,6900],[12955,8141],[12826,10001],[12412,10730],[6228,10730],[6228,6863],[6160,6863]] },
    { id: 'front-half-a', label_en: 'Front half', label_jp: '手前半面', owner: 'fabcafe',
      points: [[6160,205],[6160,16903],[5751,17294],[4676,17489],[4361,17213],[4071,17236],[1488,16140],[568,15787],[72,15504],[72,13135],[6122,13135],[5345,12357],[5345,11721],[6160,11721],[6160,6863],[5133,6863],[5133,7461],[4177,7461],[4177,5807],[6157,5807],[6157,958]] },
    { id: 'front-half-b', label_en: 'Front half', label_jp: '手前半面', owner: 'fabcafe',
      points: [[12412,10730],[12183,11133],[11651,11643],[11592,11686],[6440,16635],[6285,16783],[6160,16903],[6160,11721],[6228,11721],[6228,10730]] },
  ],
  grid: { x: [{id:'X1',v:0},{id:'X2',v:5450},{id:'X3',v:13885}], y: [{id:'Y4',v:0},{id:'Y3',v:7530},{id:'Y2',v:10730},{id:'Y1',v:18260}] },
  view: { minX: -1700, minY: -1700, maxX: 15000, maxY: 19150 },
  // public floor: main hall + fab area + entrance area + passage to the WCs
  floor: [[6160,205],[12846,205],[13498,700],[13498,6900],[12955,8141],[12826,10001],[12183,11133],[11651,11643],[11592,11686],[6440,16635],[6285,16783],[5751,17294],[4676,17489],[4361,17213],[4071,17236],[1488,16140],[568,15787],[72,15504],[72,13135],[6122,13135],[5345,12357],[5345,11721],[6228,11721],[6228,6863],[5133,6863],[5133,7461],[4177,7461],[4177,5807],[6157,5807],[6157,958]],
  walls: [
    { points: [[5119,65],[12900,65]], closed: false, thick: 280 }, // top wall
    { points: [[13516,640],[13516,916]], closed: false, thick: 100 }, // right wall above side doors
    { points: [[13516,2621],[13516,6900]], closed: false, thick: 100 }, // right wall (glazing line) below side doors
    { points: [[13030,8134],[12900,10018]], closed: false, thick: 150 }, // right wall between Y3 and Y2 columns
    { points: [[12235,11188],[11702,11698],[11858,12163]], closed: false, thick: 150 }, // wall stub from Y2 column to facade
    { points: [[11858,12163],[6775,16970]], closed: false, thick: 100 }, // diagonal glass facade
    { points: [[6775,16970],[6337,16837],[5803,17348]], closed: false, thick: 150 }, // facade return to bottom column
    { points: [[4054,17254],[4700,17530]], closed: false, thick: 300 }, // wall stub, bottom column to lower-left glass
    { points: [[1452,16158],[4054,17254]], closed: false, thick: 60 }, // lower-left glass wall
    { points: [[568,15787],[0,15560],[0,12021],[-530,12021],[-530,10731],[2691,10731],[2691,7549],[0,7549],[0,6833]], closed: false, thick: 160 }, // left wall, cafe counter bump, WC/backyard outline
    { points: [[0,5835],[0,5736],[3753,5736],[3753,-69]], closed: false, thick: 160 }, // backyard top wall + kitchen left wall
    { points: [[2691,7549],[4124,7549]], closed: false, thick: 176 }, // backyard bottom wall
    { points: [[4124,5807],[4124,6018]], closed: false, thick: 106 }, // backyard right wall (above door)
    { points: [[4124,6852],[4124,7549]], closed: false, thick: 106 }, // backyard right wall (below door)
    { points: [[3753,5315],[4602,5315]], closed: false, thick: 140 }, // kitchen bottom wall
    { points: [[5320,5315],[5469,5315],[5469,5807]], closed: false, thick: 110 }, // kitchen vestibule wall
    { points: [[6087,958],[6087,5807]], closed: false, thick: 120 }, // kitchen right wall
    { points: [[4921,7725],[6228,7725]], closed: false, thick: 527 }, // WC(M) top wall / shaft
    { points: [[6069,7988],[6069,9395]], closed: false, thick: 318 }, // WC right wall
    { points: [[2762,9255],[6228,9255]], closed: false, thick: 281 }, // WC bottom wall
    { points: [[6228,7532],[8769,7532]], closed: false, thick: 141 }, // Y3 service strip partition
    { points: [[4072,8340],[4072,9114]], closed: false, thick: 71 }, // WC(W) / handwash partition
    { points: [[5009,8621],[5009,9114]], closed: false, thick: 50 }, // handwash / WC(M) partition
    { points: [[6246,9395],[6246,10626]], closed: false, thick: 40 }, // thin wall, counter back room / fab area
  ],
  rooms: [
    {"id":"kitchen","label_en":"Kitchen","label_jp":"厨房","kind":"kitchen","points":[[3824,-69],[5119,-69],[5119,958],[6087,958],[6087,5807],[5469,5807],[5469,5315],[3824,5315]]},
    {"id":"backyard","label_en":"Backyard","label_jp":"バックヤード","kind":"backyard","points":[[72,5842],[4071,5842],[4071,7461],[72,7461]]},
    {"id":"wc-w","label_en":"WC (W)","label_jp":"WC(女)","kind":"wc","points":[[2797,7672],[4036,7672],[4036,9114],[2797,9114]]},
    {"id":"handwash-lobby","label_en":"Handwash","label_jp":"手洗い","kind":"wc","points":[[4107,7672],[4991,7672],[4991,9114],[4107,9114]]},
    {"id":"wc-m","label_en":"WC (M)","label_jp":"WC(男)","kind":"wc","points":[[5027,7988],[5910,7988],[5910,9114],[5027,9114]]},
    {"id":"cafe-counter-area","label_en":"Cafe counter (staff side)","label_jp":"カフェカウンター","kind":"counter","points":[[-459,10837],[2762,10837],[2762,9395],[6228,9395],[6228,11721],[5345,11721],[5345,12357],[6122,13135],[72,13135],[72,11933],[-459,11933]]},
  ],
  fixed: [
    {"id":"col-ne","kind":"column","shape":"circle","x":13498,"y":-62,"r":705,"label_en":"Column","label_jp":"柱"}, // round column, top-right corner (beyond X3/Y4)
    {"id":"col-e-y3","kind":"column","shape":"circle","x":12966,"y":7437,"r":705,"label_en":"Column","label_jp":"柱"}, // round column on right wall at Y3
    {"id":"col-e-y2","kind":"column","shape":"circle","x":12744,"y":10702,"r":705,"label_en":"Column","label_jp":"柱"}, // round column at Y2 where facade turns diagonal
    {"id":"col-sw-y1","kind":"column","shape":"circle","x":5291,"y":17834,"r":707,"label_en":"Column","label_jp":"柱"}, // round column bottom, at X2/Y1
    {"id":"col-x2-y4","kind":"column","shape":"rect","x":5640,"y":442,"w":1041,"h":1033,"rot":0,"label_en":"Column","label_jp":"柱"}, // solid block top of kitchen/hall at X2
    {"id":"col-x2-y3","kind":"column","shape":"rect","x":5681,"y":7162,"w":1095,"h":598,"rot":0,"label_en":"Column","label_jp":"柱"}, // solid block at X2/Y3 above WC lobby
    {"id":"door-kitchen-top-a","kind":"door","shape":"arc","x":3824,"y":-69,"r":1010,"rot":270,"sweep":90,"label_en":"Kitchen exterior door","label_jp":"厨房 外扉"}, // kitchen top exterior door, large leaf
    {"id":"door-kitchen-top-b","kind":"door","shape":"arc","x":5126,"y":-69,"r":290,"rot":180,"sweep":90,"label_en":"Kitchen exterior door","label_jp":"厨房 外扉"}, // kitchen top exterior door, small leaf
    {"id":"door-backyard-ext","kind":"door","shape":"arc","x":-69,"y":6827,"r":1000,"rot":180,"sweep":90,"label_en":"Backyard exterior door","label_jp":"バックヤード 外扉"}, // backyard exterior door (far left)
    {"id":"door-backyard-in","kind":"door","shape":"arc","x":4071,"y":6018,"r":840,"rot":90,"sweep":90,"label_en":"Backyard door","label_jp":"バックヤード 扉"}, // backyard to staff passage
    {"id":"door-kitchen-l","kind":"door","shape":"arc","x":4602,"y":5314,"r":355,"rot":270,"sweep":90,"label_en":"Kitchen door","label_jp":"厨房 扉"}, // kitchen double door, left leaf
    {"id":"door-kitchen-r","kind":"door","shape":"arc","x":5320,"y":5314,"r":355,"rot":180,"sweep":90,"label_en":"Kitchen door","label_jp":"厨房 扉"}, // kitchen double door, right leaf
    {"id":"door-kitchen-vest-l","kind":"door","shape":"arc","x":5522,"y":5807,"r":265,"rot":0,"sweep":90,"label_en":"Kitchen door","label_jp":"厨房 扉"}, // kitchen vestibule double door, left leaf
    {"id":"door-kitchen-vest-r","kind":"door","shape":"arc","x":6051,"y":5807,"r":265,"rot":90,"sweep":90,"label_en":"Kitchen door","label_jp":"厨房 扉"}, // kitchen vestibule double door, right leaf
    {"id":"door-kitchen-curved","kind":"door","shape":"poly","points":[[5320,5237],[5320,5386],[5451,5386],[5550,5302],[5642,5211],[5727,5115],[5806,5012],[5877,4905],[5942,4793],[5770,4793],[5718,4875],[5662,4954],[5602,5030],[5538,5103],[5470,5172],[5397,5237]],"label_en":"Kitchen curved door","label_jp":"厨房 扉"}, // curved door piece in kitchen vestibule
    {"id":"door-wc-w","kind":"door","shape":"arc","x":4036,"y":7742,"r":600,"rot":90,"sweep":90,"label_en":"WC (W) door","label_jp":"WC(女) 扉"}, // WC (women) door
    {"id":"door-wc-m","kind":"door","shape":"arc","x":5027,"y":8024,"r":600,"rot":0,"sweep":90,"label_en":"WC (M) door","label_jp":"WC(男) 扉"}, // WC (men) door
    {"id":"door-backroom-a","kind":"door","shape":"arc","x":6246,"y":9395,"r":600,"rot":0,"sweep":90,"label_en":"Folding door (counter back)","label_jp":"カウンター裏 扉"}, // dashed double door, counter back room -> fab area (upper leaf)
    {"id":"door-backroom-b","kind":"door","shape":"arc","x":6246,"y":10626,"r":600,"rot":270,"sweep":90,"label_en":"Folding door (counter back)","label_jp":"カウンター裏 扉"}, // dashed double door (lower leaf)
    {"id":"door-east-a","kind":"door","shape":"arc","x":13534,"y":916,"r":854,"rot":0,"sweep":90,"label_en":"Side entrance","label_jp":"東側 出入口"}, // right-wall door, upper leaf (opens outward)
    {"id":"door-east-b","kind":"door","shape":"arc","x":13534,"y":2621,"r":850,"rot":270,"sweep":90,"label_en":"Side entrance","label_jp":"東側 出入口"}, // right-wall door, lower leaf
    {"id":"door-entrance","kind":"door","shape":"arc","x":568,"y":15787,"r":887,"rot":23.4,"sweep":90,"label_en":"Entrance","label_jp":"エントランス"}, // main entrance, lower-left glass wall
    {"id":"win-east","kind":"window","shape":"rect","x":13516,"y":4540,"w":60,"h":3590,"rot":0,"label_en":"Window","label_jp":"窓"}, // right-wall glazing below the doors
    {"id":"win-facade","kind":"window","shape":"poly","points":[[11804,12110],[11875,12181],[6828,17024],[6757,16953]],"label_en":"Glass facade","label_jp":"ガラス面"}, // diagonal glass facade
    {"id":"win-sw","kind":"window","shape":"poly","points":[[4036,17271],[1452,16175],[1488,16140],[4071,17236]],"label_en":"Glass wall","label_jp":"ガラス面"}, // lower-left glass wall
    {"id":"window-counter","kind":"counter","shape":"poly","points":[[6440,16635],[11592,11686],[11902,12009],[6750,16958]],"label_en":"Window counter","label_jp":"窓際カウンター"}, // counter along the diagonal facade
    {"id":"cafe-counter","kind":"counter","shape":"poly","points":[[72,12357],[5345,12357],[6122,13135],[72,13135]],"label_en":"Cafe counter","label_jp":"カフェカウンター"}, // front cafe counter (angled right end)
    {"id":"back-counter","kind":"counter","shape":"rect","x":1134,"y":11156,"w":3186,"h":637,"rot":0,"label_en":"Back counter","label_jp":"バックカウンター"}, // back counter strip behind cafe counter
    {"id":"back-cabinets","kind":"counter","shape":"rect","x":3966,"y":11156,"w":2477,"h":637,"rot":0,"label_en":"Back counter cabinets","label_jp":"カウンター下収納"}, // under-counter units with cabinet doors
    {"id":"display-cabinet","kind":"counter","shape":"rect","x":5716,"y":11138,"w":1024,"h":1024,"rot":0,"label_en":"Display cabinet","label_jp":"ディスプレイ台"}, // cabinet at X2 just below Y2
    {"id":"display-x2","kind":"display","shape":"rect","x":5725,"y":11686,"w":1042,"h":71,"rot":0,"label_en":"Display","label_jp":"ディスプレイ"}, // display (screen) on the cabinet front
    {"id":"sink-back","kind":"handwash","shape":"circle","x":2427,"y":11238,"r":195,"label_en":"Sink","label_jp":"シンク"}, // sink in back counter
    {"id":"sink-front","kind":"handwash","shape":"circle","x":4895,"y":12576,"r":195,"label_en":"Sink","label_jp":"シンク"}, // sink in cafe counter
    {"id":"display-stand-x2","kind":"display","shape":"poly","points":[[7251,11686],[7922,12357],[7110,13135],[6440,12463]],"label_en":"Display stand","label_jp":"展示台"}, // rotated square stand near X2 below Y2 (unlabelled on plan)
    {"id":"display-counter","kind":"counter","shape":"poly","points":[[7146,248],[12863,248],[13428,635],[12898,1162],[7922,1162],[7922,1866],[7146,1866]],"label_en":"Counter under large display","label_jp":"大型ディスプレイ下カウンター"}, // L-shaped counter along top wall
    {"id":"large-display","kind":"screen","shape":"rect","x":10022,"y":546,"w":5330,"h":105,"rot":0,"label_en":"Large display","label_jp":"大型ディスプレイ"}, // large display along top wall
    {"id":"fixed-unit-nw","kind":"counter","shape":"rect","x":6652,"y":529,"w":989,"h":634,"rot":0,"label_en":"Fixed unit","label_jp":"什器"}, // box in top-left corner of hall
    {"id":"fixed-table","kind":"fixed-table","shape":"rect","x":7582,"y":4150,"w":901,"h":3086,"rot":0.0,"label_en":"Fixed table","label_jp":"固定テーブル"}, // long fixed table, vertical, X2+1200
    {"id":"roll-screen","kind":"screen","shape":"rect","x":13396,"y":4150,"w":203,"h":3086,"rot":0.0,"label_en":"Roll screen","label_jp":"ロールスクリーン"}, // roll screen along right wall
    {"id":"service-counter","kind":"counter","shape":"rect","x":6934,"y":7214,"w":1412,"h":493,"rot":0,"label_en":"Service counter","label_jp":"サービスカウンター"}, // service counter just above Y3 right of X2
    {"id":"fixed-unit-y3","kind":"counter","shape":"rect","x":8200,"y":7109,"w":955,"h":634,"rot":0.0,"label_en":"Fixed unit","label_jp":"什器"}, // box above Y3 strip (2026 update, unlabelled)
    {"id":"cabinet-y3","kind":"counter","shape":"rect","x":6706,"y":7877,"w":875,"h":492,"rot":0.0,"label_en":"Fixed unit","label_jp":"什器"}, // box below Y3 strip, left (2026 update, unlabelled)
    {"id":"display-table-y3","kind":"fixed-table","shape":"rect","x":7858,"y":8067,"w":1213,"h":872,"rot":0.0,"label_en":"Display table","label_jp":"ディスプレイ台"}, // stand below Y3 strip carrying the display (2026 update)
    {"id":"display-y3","kind":"display","shape":"rect","x":7858,"y":7672,"w":1041,"h":70,"rot":0,"label_en":"Display","label_jp":"ディスプレイ"}, // display at Y3 strip
    {"id":"fab-table","kind":"fixed-table","shape":"poly","points":[[7922,9655],[7906,9533],[7859,9424],[7788,9332],[7695,9260],[7585,9214],[7463,9198],[7341,9214],[7232,9260],[7139,9332],[7067,9424],[7021,9533],[7004,9655],[7004,11332],[7004,11756],[7046,11721],[7087,11686],[7128,11650],[7169,11615],[7210,11580],[7251,11544],[7363,11656],[7475,11768],[7587,11880],[7699,11992],[7810,12104],[7922,12216]],"label_en":"Fab area table","label_jp":"ファブエリア テーブル"}, // capsule-shaped table in ファブエリア (2026 update)
    {"id":"wall-panel-e","kind":"display","shape":"rect","x":12830,"y":9059,"w":122,"h":1812,"rot":3.8,"label_en":"Wall panel","label_jp":"壁面パネル"}, // thin panel on right wall between Y3 and Y2 columns (2026 update, unlabelled)
    {"id":"fixture-e1","kind":"display","shape":"rect","x":12472,"y":8195,"w":298,"h":431,"rot":-36.9,"label_en":"Small fixture","label_jp":"小什器"}, // small fixture by Y3 column (unlabelled)
    {"id":"fixture-e2","kind":"display","shape":"rect","x":12403,"y":9890,"w":431,"h":297,"rot":-27.9,"label_en":"Small fixture","label_jp":"小什器"}, // small fixture by Y2 column (unlabelled)
    {"id":"column-fixture-y3","kind":"display","shape":"poly","points":[[12228,6898],[12298,6827],[12334,6792],[12404,6722],[12475,6687],[12545,6652],[12616,6616],[12687,6581],[12792,6546],[12192,6898],[12157,6933],[12122,6968],[12122,7003],[12087,7074],[12051,7109],[12051,7144],[12051,7215],[12016,7250]],"label_en":"Fixture at column","label_jp":"柱まわり什器"}, // curved fixture wrapped on Y3 column (unlabelled)
    {"id":"handwash","kind":"handwash","shape":"rect","x":4549,"y":8903,"w":884,"h":422,"rot":0,"label_en":"Handwash","label_jp":"手洗い"}, // handwash counter with basin
  ],
  furniture: [
    {"type":"table-sq","x":8222,"y":1514,"rot":0}, // desk unit, display counter row
    {"type":"chair","x":8204,"y":2112,"rot":-180.0}, // chair
    {"type":"table-sq","x":9140,"y":1514,"rot":0}, // desk unit, display counter row
    {"type":"chair","x":9122,"y":2112,"rot":-180.0}, // chair
    {"type":"table-sq","x":10128,"y":1514,"rot":0}, // desk unit, display counter row
    {"type":"chair","x":10128,"y":2112,"rot":-180.0}, // chair
    {"type":"table-sq","x":11116,"y":1514,"rot":0}, // desk unit, display counter row
    {"type":"chair","x":11116,"y":2112,"rot":-180.0}, // chair
    {"type":"table-sq","x":12104,"y":1514,"rot":0}, // desk unit, display counter row
    {"type":"chair","x":12122,"y":2112,"rot":-180.0}, // chair
    {"type":"table-sq","x":12087,"y":3520,"rot":45}, // square table, 4 chairs
    {"type":"chair","x":11592,"y":3027,"rot":-45.1}, // chair
    {"type":"chair","x":12581,"y":3027,"rot":45.1}, // chair
    {"type":"chair","x":11592,"y":4013,"rot":-135.0}, // chair
    {"type":"chair","x":12581,"y":4013,"rot":134.9}, // chair
    {"type":"table-sq","x":12087,"y":5526,"rot":45}, // square table, 4 chairs
    {"type":"chair","x":11592,"y":5033,"rot":-45.1}, // chair
    {"type":"chair","x":12581,"y":5033,"rot":45.1}, // chair
    {"type":"chair","x":11592,"y":6018,"rot":-135.0}, // chair
    {"type":"chair","x":12581,"y":6018,"rot":134.9}, // chair
    {"type":"table-round","x":10168,"y":3240,"rot":0}, // round table (drawn D804)
    {"type":"chair","x":10629,"y":3649,"rot":127.6}, // chair
    {"type":"chair","x":9526,"y":3224,"rot":-77.8}, // chair
    {"type":"table-round","x":8946,"y":4610,"rot":0}, // round table (drawn D810)
    {"type":"chair","x":9149,"y":4030,"rot":15.3}, // chair
    {"type":"chair","x":9069,"y":5209,"rot":169.6}, // chair
    {"type":"table-round","x":10252,"y":6247,"rot":0}, // round table (drawn D794)
    {"type":"chair","x":10058,"y":6845,"rot":-160.0}, // chair
    {"type":"chair","x":10869,"y":6124,"rot":74.7}, // chair
    {"type":"chair","x":10031,"y":5658,"rot":-14.0}, // chair
    {"type":"table-round","x":9896,"y":8662,"rot":0}, // round table (drawn D941)
    {"type":"table-round","x":10287,"y":9641,"rot":0}, // round table (drawn D941)
    {"type":"table-round","x":5115,"y":16494,"rot":0}, // round table (drawn D796)
    {"type":"chair","x":5716,"y":16688,"rot":110.0}, // chair
    {"type":"chair","x":4992,"y":15875,"rot":-15.2}, // chair
    {"type":"chair","x":9334,"y":9307,"rot":-123.4}, // chair
    {"type":"chair","x":10640,"y":8410,"rot":74.9}, // chair
    {"type":"chair","x":9196,"y":8434,"rot":-75.7}, // chair
    {"type":"chair","x":10852,"y":9120,"rot":66.6}, // chair
    {"type":"chair","x":9640,"y":10015,"rot":-127.1}, // chair
    {"type":"chair","x":11014,"y":9893,"rot":92.0}, // chair
    {"type":"table-sq","x":8442,"y":14275,"rot":45}, // window-counter desk unit
    {"type":"table-sq","x":9052,"y":13692,"rot":45}, // window-counter desk unit
    {"type":"table-sq","x":9660,"y":13100,"rot":45}, // window-counter desk unit
    {"type":"table-sq","x":10286,"y":12508,"rot":45}, // window-counter desk unit
    {"type":"table-sq","x":10896,"y":11924,"rot":45}, // window-counter desk unit
    {"type":"table-sq","x":6590,"y":16034,"rot":45}, // window-counter desk unit
    {"type":"table-sq","x":7216,"y":15460,"rot":45}, // window-counter desk unit
    {"type":"table-sq","x":7816,"y":14868,"rot":45}, // window-counter desk unit
    {"type":"chair","x":10534,"y":11544,"rot":-44.9}, // chair
    {"type":"chair","x":6854,"y":15080,"rot":-45.0}, // chair
    {"type":"chair","x":9925,"y":12136,"rot":-44.9}, // chair
    {"type":"chair","x":9298,"y":12711,"rot":-45.0}, // chair
    {"type":"chair","x":8698,"y":13312,"rot":-45.0}, // chair
    {"type":"chair","x":8072,"y":13896,"rot":-37.9}, // chair
    {"type":"chair","x":7463,"y":14479,"rot":-45.0}, // chair
    {"type":"chair","x":6228,"y":15654,"rot":-41.6}, // chair
    {"type":"table-long","x":3248,"y":15693,"rot":22.8}, // long table (drawn 2308x801)
    {"type":"chair","x":4098,"y":15497,"rot":27.4}, // chair
    {"type":"chair","x":3698,"y":16481,"rot":-158.1}, // chair
    {"type":"chair","x":2977,"y":16148,"rot":-158.1}, // chair
    {"type":"chair","x":2850,"y":14912,"rot":27.4}, // chair
    {"type":"chair","x":3469,"y":15195,"rot":27.4}, // chair
    {"type":"chair","x":2357,"y":15894,"rot":-158.2}, // chair
  ],
  // 3D/scan references for this floor. Not yet registered to this plan's mm grid (no shared points
  // measured between the two), so register is left null rather than guessed — treat x/y/rotation
  // alignment between the Rhino model and this trace as unconfirmed until someone sets it.
  // kept free by every preset (see header)
  keepClear: [
    { id: 'entrance', label_en: 'Entrance', label_jp: '入口', points: [[72, 15050], [2000, 15050], [2000, 17000], [72, 17000]] },
    { id: 'counter-front', label_en: 'Order / pickup at the counter', label_jp: 'カウンター前（注文・受け取り）', points: [[72, 13135], [6122, 13135], [6122, 14100], [72, 14100]] },
    { id: 'side-entrance', label_en: 'Side entrance', label_jp: '側面入口', points: [[12500, 300], [13500, 300], [13500, 3300], [12500, 3300]] },
  ],
  // event reception: just inside the cafe door, between the counter strip and the door path
  reception: { x: 1300, y: 14550, w: 1800, h: 800 },
  sim: {
    scans: [
      { id: 'rhino-1f', kind: 'cad3d', format: '3dm',
                captured: '2026-11-06',
        note: 'Architect-supplied 3D model of 1F (file kept internally). Used only via its flattened 2D export for the accuracy cross-check above. Not registered to this floor\'s origin/scale.',
        register: { origin_mm: null, z_mm: null, rot_deg: null, scale: null } },
    ],
    heights: {},
    notes: 'No 1F floor-to-floor/ceiling/beam heights recorded yet. (Upper-floor heights: beam underside 2600 mm, ceiling 3400 mm — do not assume these apply to 1F, which has a different, taller cafe-hall ceiling.)',
  },
};
