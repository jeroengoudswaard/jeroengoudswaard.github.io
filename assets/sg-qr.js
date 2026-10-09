// Course QR codes for Strokes Gained (the app reads them in
// Meer → GPS-coördinaten → QR-code scannen).
// Same format as lib/services/baan_qr.dart in the app — keep them in sync:
//   https://jeroengoudswaard.github.io/strokes-gained/qr/#sg1&n=<name>&d=<holes>
// holes are "hole,v,v,…" joined by ';' with 2/4/6 values (green |
// tee,green | tee,green,bend); each value is a lat or lon in micro-degrees,
// stored as the difference to the previous lat or lon (starting at 0).
var SgQr = (function () {
  var BASE = "https://jeroengoudswaard.github.io/strokes-gained/qr/";

  // holes: {n: {tee:[lat,lon], green:[lat,lon], bend:[lat,lon]}}
  function encode(name, holes) {
    var pLat = 0, pLon = 0, out = [];
    Object.keys(holes).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
      var h = holes[n], pts;
      if (h.tee && h.green) pts = h.bend ? [h.tee, h.green, h.bend] : [h.tee, h.green];
      else if (h.green) pts = [h.green];
      else return;
      var row = [n];
      pts.forEach(function (p) {
        var lat = Math.round(p[0] * 1e6), lon = Math.round(p[1] * 1e6);
        row.push(lat - pLat, lon - pLon);
        pLat = lat; pLon = lon;
      });
      out.push(row.join(","));
    });
    return BASE + "#sg1&n=" + encodeURIComponent(name) + "&d=" + out.join(";");
  }

  // Returns {name, holes} or null.
  function decode(text) {
    var i = text.indexOf("#");
    var parts = (i >= 0 ? text.slice(i + 1) : text).trim().split("&");
    if (parts[0] !== "sg1") return null;
    var name = null, data = null;
    for (var k = 1; k < parts.length; k++) {
      var eq = parts[k].indexOf("=");
      if (eq < 0) continue;
      var key = parts[k].slice(0, eq), val = parts[k].slice(eq + 1);
      if (key === "n") { try { name = decodeURIComponent(val); } catch (e) { return null; } }
      else if (key === "d") data = val;
    }
    if (name === null || !data) return null;
    var lat = 0, lon = 0, holes = {}, count = 0;
    var rows = data.split(";");
    for (var r = 0; r < rows.length; r++) {
      if (!rows[r]) continue;
      var p = rows[r].split(",");
      var n = parseInt(p[0], 10);
      var v = p.slice(1).map(function (x) { return /^-?\d+$/.test(x) ? parseInt(x, 10) : NaN; });
      if (!(n >= 1) || String(n) !== p[0] || v.some(isNaN) || [2, 4, 6].indexOf(v.length) < 0) return null;
      var pts = [];
      for (var j = 0; j < v.length; j += 2) {
        lat += v[j]; lon += v[j + 1];
        if (Math.abs(lat) > 90e6 || Math.abs(lon) > 180e6) return null;
        pts.push([lat / 1e6, lon / 1e6]);
      }
      holes[n] = pts.length === 1 ? { green: pts[0] }
        : pts.length === 2 ? { tee: pts[0], green: pts[1] }
        : { tee: pts[0], green: pts[1], bend: pts[2] };
      count++;
    }
    return count ? { name: name.trim(), holes: holes } : null;
  }

  // CSV rows exactly as the app's importer expects.
  function csv(holes) {
    var f = function (p) { return p[0].toFixed(6) + "," + p[1].toFixed(6); };
    return Object.keys(holes).map(Number).sort(function (a, b) { return a - b; }).map(function (n) {
      var h = holes[n];
      if (h.tee && h.green) return n + "," + f(h.tee) + "," + f(h.green) + (h.bend ? "," + f(h.bend) : "");
      if (h.green) return n + "," + f(h.green);
      return null;
    }).filter(Boolean);
  }

  return { encode: encode, decode: decode, csv: csv, BASE: BASE };
})();
