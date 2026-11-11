/* Pick which floor plan the editor opens: #floor=2F in the URL, else the floor used last, else 1F. */
(function(){
  'use strict';
  var P = window.PLANS || {}, f = null;
  var m = /floor=(\w+)/i.exec(location.hash || '');
  if (m && P[m[1].toUpperCase()]) f = m[1].toUpperCase();
  if (!f){ try { var s = localStorage.getItem('fabcafe-map:floor'); if (s && P[s]) f = s; } catch(e){} }
  if (!f) f = P['1F'] ? '1F' : Object.keys(P)[0];
  try { localStorage.setItem('fabcafe-map:floor', f); } catch(e){}
  window.FLOOR_ID = f;
  window.PLAN = P[f];
})();
