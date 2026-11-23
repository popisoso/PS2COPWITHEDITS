/* Community Map (#map): an illustrated field of The Hague where every organization is a flower.
   Views: field (map) → list → profile → contact. Data comes from js/orgs.js (KV_MAP_ORGS).
   Mounted by app.js on [data-mount="org-map"]. Empty data fields render a [text] placeholder. */
(function () {
  "use strict";

  /* Illustrative neighbourhood shapes (viewBox 0 0 1000 560). Not to scale. */
  var HOODS = [
    { id: "scheveningen", name: "Scheveningen", lx: 515, ly: 70, d: "M430 0H640L650 90 590 150 480 170 400 150 330 95Z" },
    { id: "haagse-hout", name: "Haagse Hout", lx: 742, ly: 118, d: "M640 0H870L885 120 830 225 705 248 620 200 590 150 650 90Z" },
    { id: "segbroek", name: "Segbroek", lx: 322, ly: 292, d: "M330 95 400 150 430 230 380 300 290 320 220 200Z" },
    { id: "centrum", name: "Centrum", lx: 528, ly: 250, d: "M400 150 480 170 590 150 620 200 610 290 520 330 430 320 380 300 430 230Z" },
    { id: "loosduinen", name: "Loosduinen", lx: 150, ly: 405, d: "M220 200 290 320 300 420 230 520H60L0 470V410L120 300Z" },
    { id: "escamp", name: "Escamp", lx: 400, ly: 452, d: "M290 320 380 300 430 320 520 330 560 420 520 520H230L300 420Z" },
    { id: "laak", name: "Laak", lx: 655, ly: 302, d: "M520 330 610 290 705 248 720 330 690 400 560 420Z" },
    { id: "leidschenveen", name: "Leidschenveen-Ypenburg", lx: 880, ly: 372, d: "M805 300 975 280 1000 300V430L905 485 795 440Z" },
    { id: "rijswijk", name: "Rijswijk", lx: 630, ly: 538, d: "M560 420 690 400 765 470 735 560H500L520 520Z", outside: true }
  ];
  window.KV_HOODS = HOODS;
  /* visible window: extra room on the left keeps the city clear of the floating cards */
  var VB = { x: -300, y: -10, w: 1300, h: 580 };
  function pos(o) { return "left:" + ((o.x - VB.x) / VB.w * 100).toFixed(2) + "%;top:" + ((o.y - VB.y) / VB.h * 100).toFixed(2) + "%"; }

  var PURPOSE = {
    connect: { label: "Meet & connect", petal: "#dd5c90", petal2: "#f3a6c4", heart: "#ffd36b" },
    learn: { label: "Learn & grow", petal: "#8f6fd0", petal2: "#c1a4e9", heart: "#ffd36b" },
    support: { label: "Support", petal: "#ffa62b", petal2: "#ffd08a", heart: "#a83565" }
  };

  var FILTERS = [
    { key: "hood", label: "Neighbourhood", title: "Neighbourhood", hint: "Find a community close to you." },
    { key: "reach", label: "Who they reach", title: "Who they reach", hint: "Organizations for people like you." },
    { key: "themes", label: "Themes", title: "Themes", hint: "What would you like to do?" },
    { key: "languages", label: "Languages", title: "Languages", hint: "Languages spoken by the organization." },
    { key: "type", label: "Type", title: "Type of organization", hint: "Foundation, club, group and more." }
  ];

  window.KVOrgMap = function (el, kit) {
    var esc = kit.esc;
    var ORGS = (window.KV_MAP_ORGS || []).slice();
    var byId = {}; ORGS.forEach(function (o) { byId[o.id] = o; });
    var hoodById = {}; HOODS.forEach(function (h) { hoodById[h.id] = h; });

    var st = { view: "field", back: "field", sel: null, q: "", sort: "az", tab: "about", zoom: 1, px: 0, py: 0, f: { hood: [], reach: [], themes: [], languages: [], type: [] } };
    var uid = "fm" + Math.random().toString(36).slice(2, 7);

    /* ---------- helpers ---------- */
    function ph(what) { return '<span class="ph" title="Missing: ' + esc(what) + '">[text]</span>'; }
    function val(v, what) { return v ? esc(v) : ph(what); }
    function hoodName(o) { return o.hood && hoodById[o.hood] ? hoodById[o.hood].name : null; }
    function valuesOf(o, key) {
      if (key === "hood") return o.hood ? [o.hood] : [];
      if (key === "type") return o.type ? [o.type] : [];
      return o[key] || [];
    }
    function optionLabel(key, v) { return key === "hood" ? (hoodById[v] ? hoodById[v].name : v) : v; }
    function hasHash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

    function matches(o, skip) {
      var ok = FILTERS.every(function (fl) {
        if (fl.key === skip) return true;
        var sel = st.f[fl.key];
        if (!sel.length) return true;
        var have = valuesOf(o, fl.key);
        return sel.some(function (v) { return have.indexOf(v) > -1; });
      });
      if (!ok) return false;
      if (!st.q) return true;
      var hay = [o.name, hoodName(o), o.type, o.tagline, o.about].concat(o.themes || [], o.reach || [], o.languages || []).join(" ").toLowerCase();
      return st.q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    }
    function visible() {
      var list = ORGS.filter(function (o) { return matches(o); });
      list.sort(function (a, b) {
        if (st.sort === "hood") { var ha = hoodName(a) || "~", hb = hoodName(b) || "~"; if (ha !== hb) return ha < hb ? -1 : 1; }
        var r = a.name.localeCompare(b.name, "nl"); return st.sort === "za" ? -r : r;
      });
      return list;
    }
    function filtersOn() { return FILTERS.some(function (fl) { return st.f[fl.key].length; }) || !!st.q; }
    function oneHood() { return st.f.hood.length === 1 ? hoodById[st.f.hood[0]] : null; }
    function placeLabel() {
      var h = oneHood();
      if (h) return h.name;
      if (st.f.hood.length > 1) return st.f.hood.length + " neighbourhoods";
      return "The Hague";
    }
    function plural(n, w) { return n + " " + w + (n === 1 ? "" : "s"); }

    /* ---------- flower art ---------- */
    function flower(o, size, opts) {
      opts = opts || {};
      var p = PURPOSE[o.purpose] || PURPOSE.connect;
      var h = hasHash(o.id);
      var n = 5 + (h % 4);              // 5–8 petals
      var round = (h >> 3) % 2 === 0;   // round or pointed petals
      var rot = (h >> 5) % 40;
      var petals = "";
      for (var i = 0; i < n; i++) {
        var a = rot + i * 360 / n;
        petals += round
          ? '<ellipse cx="0" cy="-11" rx="6.4" ry="10" fill="' + (i % 2 ? p.petal2 : p.petal) + '" transform="rotate(' + a + ')"/>'
          : '<path d="M0 -2 C 7 -8 6 -18 0 -23 C -6 -18 -7 -8 0 -2Z" fill="' + (i % 2 ? p.petal2 : p.petal) + '" transform="rotate(' + a + ')"/>';
      }
      var stem = opts.noStem ? "" :
        '<path d="M0 6 C 1 22 -2 34 0 46" stroke="#5f8f3e" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '<path d="M0 30 C 8 24 15 25 18 20 C 11 18 4 22 0 30Z" fill="#7fb04f"/>' +
        '<path d="M0 38 C -7 33 -13 34 -16 29 C -10 27 -4 31 0 38Z" fill="#6aa045"/>';
      var vb = opts.noStem ? "-26 -26 52 52" : "-26 -26 52 74";
      var hgt = opts.noStem ? size : Math.round(size * 74 / 52);
      return '<svg class="fm-flower" viewBox="' + vb + '" width="' + size + '" height="' + hgt + '" aria-hidden="true" focusable="false">' + stem +
        '<g>' + petals + '</g><circle r="6.5" fill="' + p.heart + '"/><circle r="6.5" fill="none" stroke="rgba(30,27,38,.12)"/></svg>';
    }

    function mapSvg(cls, list) {
      var active = {}; st.f.hood.forEach(function (id) { active[id] = 1; });
      var withOrgs = {}; list.forEach(function (o) { if (o.hood) withOrgs[o.hood] = 1; });
      return '<svg class="' + cls + '" viewBox="' + [VB.x, VB.y, VB.w, VB.h].join(" ") + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
        '<rect x="' + VB.x + '" y="' + VB.y + '" width="' + VB.w + '" height="' + VB.h + '" fill="var(--fm-land)"/>' +
        '<path d="M-300 -10H430L330 95 220 200 120 300 0 410 -170 570H-300Z" fill="var(--fm-sea)"/>' +
        '<path d="M430 0L330 95 220 200 120 300 0 410 -170 570" fill="none" stroke="var(--fm-coast)" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>' +
        HOODS.map(function (h) {
          var on = active[h.id];
          return '<path class="fm-hood' + (on ? " is-on" : "") + (h.outside ? " is-outside" : "") + '" d="' + h.d + '"/>';
        }).join("") +
        '<path d="M380 300 C 470 330 560 320 640 300 S 820 250 1000 280" class="fm-road"/>' +
        '<path d="M520 330 C 540 380 552 430 540 560" class="fm-road"/>' +
        HOODS.map(function (h) {
          var on = active[h.id];
          var fs = h.id === "leidschenveen" ? 22 : 30;
          return '<text class="fm-hood-label' + (on ? " is-on" : "") + (withOrgs[h.id] ? "" : " is-quiet") + '" x="' + h.lx + '" y="' + h.ly + '" font-size="' + fs + '" text-anchor="middle">' + esc(h.name) + "</text>";
        }).join("") +
        '<text class="fm-sea-label" x="262" y="70" font-size="16" text-anchor="middle" transform="rotate(-42 262 70)">North Sea</text>' +
        "</svg>";
    }

    /* ---------- shell ---------- */
    el.innerHTML =
      '<div class="fm">' +
        '<div class="fm-top">' +
          '<form class="search search--lg fm-search" role="search" data-fm-search>' +
            '<label class="sr-only" for="' + uid + '-q">Search organizations by name, neighbourhood or theme</label>' +
            '<input id="' + uid + '-q" type="search" placeholder="Search by name, neighbourhood or theme" autocomplete="off">' +
            '<button type="submit" aria-label="Search"><img src="assets/icons/search.svg" alt="" width="18" height="18"></button>' +
          "</form>" +
        "</div>" +
        '<div class="fm-bar" role="toolbar" aria-label="Filter organizations" data-fm-bar></div>' +
        '<div class="fm-view" data-fm-view></div>' +
      "</div>";
    var bar = el.querySelector("[data-fm-bar]");
    var host = el.querySelector("[data-fm-view]");
    var storiesHost = document.querySelector("[data-fm-stories]");
    var qInput = el.querySelector("#" + uid + "-q");
    var openKey = null;

    el.querySelector("[data-fm-search]").addEventListener("submit", function (e) { e.preventDefault(); });
    qInput.addEventListener("input", function () { st.q = qInput.value.trim().toLowerCase(); st.sel = null; drawBar(); draw(); });

    /* ---------- filter bar ---------- */
    function options(key) {
      var seen = {};
      ORGS.forEach(function (o) { valuesOf(o, key).forEach(function (v) { seen[v] = 1; }); });
      var list = Object.keys(seen);
      if (key === "hood") list = HOODS.map(function (h) { return h.id; }).filter(function (id) { return seen[id]; });
      else list.sort();
      return list;
    }
    function drawBar() {
      var focused = document.activeElement && bar.contains(document.activeElement) ? document.activeElement.getAttribute("data-fm-key") : null;
      var n = visible().length;
      bar.innerHTML = FILTERS.map(function (fl) {
        var sel = st.f[fl.key];
        var lab = sel.length === 1 ? optionLabel(fl.key, sel[0]) : sel.length > 1 ? fl.label + " · " + sel.length : fl.label;
        return '<div class="fm-drop' + (openKey === fl.key ? " is-open" : "") + '">' +
          '<button type="button" class="fm-pill' + (sel.length ? " is-on" : "") + '" data-fm-key="' + fl.key + '" aria-expanded="' + (openKey === fl.key) + '" aria-controls="' + uid + "-p-" + fl.key + '">' + esc(lab) + '<span class="fm-caret" aria-hidden="true"></span></button>' +
          (openKey === fl.key ? panel(fl) : "") +
        "</div>";
      }).join("") +
      '<button type="button" class="fm-clear" data-fm-clear' + (filtersOn() ? "" : " disabled") + ">Clear all</button>" +
      '<span class="fm-count" aria-live="polite">' + plural(n, "organization") + "</span>";

      bar.querySelectorAll("[data-fm-key]").forEach(function (b) {
        b.addEventListener("click", function (e) { e.stopPropagation(); openKey = openKey === b.dataset.fmKey ? null : b.dataset.fmKey; drawBar(); var p = bar.querySelector(".fm-panel input"); if (p) p.focus(); });
      });
      bar.querySelectorAll(".fm-panel").forEach(function (p) {
        p.addEventListener("click", function (e) { e.stopPropagation(); });
        p.addEventListener("change", function (e) {
          var c = e.target; if (!c.matches("input[type=checkbox]")) return;
          var arr = st.f[p.dataset.key]; var i = arr.indexOf(c.value);
          if (c.checked && i < 0) arr.push(c.value); if (!c.checked && i > -1) arr.splice(i, 1);
          st.sel = null; drawBar(); draw();
          var again = bar.querySelector('.fm-panel input[value="' + c.value.replace(/"/g, '\\"') + '"]'); if (again) again.focus();
        });
        var done = p.querySelector("[data-fm-done]");
        if (done) done.addEventListener("click", function () { var k = openKey; openKey = null; drawBar(); var b = bar.querySelector('[data-fm-key="' + k + '"]'); if (b) b.focus(); });
        var reset = p.querySelector("[data-fm-reset]");
        if (reset) reset.addEventListener("click", function () { st.f[p.dataset.key] = []; st.sel = null; drawBar(); draw(); });
        p.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); var k = openKey; openKey = null; drawBar(); bar.querySelector('[data-fm-key="' + k + '"]').focus(); } });
      });
      bar.querySelector("[data-fm-clear]").addEventListener("click", function () {
        FILTERS.forEach(function (fl) { st.f[fl.key] = []; }); st.q = ""; qInput.value = ""; st.sel = null; openKey = null; drawBar(); draw();
      });
      if (focused) { var again = bar.querySelector('[data-fm-key="' + focused + '"]'); if (again) again.focus(); }
    }
    function panel(fl) {
      var opts = options(fl.key);
      var n = visible().length;
      return '<div class="fm-panel" id="' + uid + "-p-" + fl.key + '" data-key="' + fl.key + '" role="group" aria-label="' + esc(fl.title) + '">' +
        '<p class="fm-panel__title">' + esc(fl.title) + '</p><p class="fm-panel__hint">' + esc(fl.hint) + "</p>" +
        '<div class="fm-panel__list">' + (opts.length ? opts.map(function (v) {
          var count = ORGS.filter(function (o) { return matches(o, fl.key) && valuesOf(o, fl.key).indexOf(v) > -1; }).length;
          var on = st.f[fl.key].indexOf(v) > -1;
          return '<label class="fm-opt' + (on ? " is-on" : "") + '"><input type="checkbox" value="' + esc(v) + '"' + (on ? " checked" : "") + '><span>' + esc(optionLabel(fl.key, v)) + '</span><span class="fm-opt__n">' + count + "</span></label>";
        }).join("") : '<p class="small muted">' + ph(fl.title + " options") + " No data yet.</p>") + "</div>" +
        '<div class="fm-panel__foot"><button type="button" class="fm-link" data-fm-reset>Reset</button><button type="button" class="btn btn--sm" data-fm-done>Show ' + plural(n, "organization") + " →</button></div>" +
      "</div>";
    }
    document.addEventListener("click", function () { if (openKey && document.body.contains(el)) { openKey = null; drawBar(); } });

    /* ---------- views ---------- */
    function draw() {
      if (st.view === "list") drawList();
      else if (st.view === "profile") drawProfile();
      else if (st.view === "contact") drawContact();
      else drawField();
      drawStories();
    }
    function go(view, opts) {
      opts = opts || {};
      if (view === "profile" && st.view !== "contact") st.back = st.view === "profile" ? st.back : st.view;
      st.view = view; if (opts.sel !== undefined) st.sel = opts.sel; if (opts.tab) st.tab = opts.tab;
      openKey = null; drawBar(); draw();
      var top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      if (Math.abs(window.pageYOffset - top) > 140 && !opts.stay) window.scrollTo({ top: top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      var f = host.querySelector("[data-fm-focus]"); if (f) f.focus({ preventScroll: true });
    }

    /* field */
    function drawField() {
      var list = visible();
      var on = {}; list.forEach(function (o) { on[o.id] = 1; });
      var placed = ORGS.filter(function (o) { return o.x != null && o.y != null; });
      var unplaced = list.filter(function (o) { return o.x == null || o.y == null; });
      var h = oneHood();
      var sel = st.sel && byId[st.sel];

      var intro = h ?
        '<div class="fm-card fm-card--intro"><p class="fm-eyebrow">Your neighbourhood</p><h2 class="fm-h">Together in ' + esc(h.name) + '</h2>' +
          '<p class="fm-p">' + plural(list.length, "place") + " to connect, learn and feel at home.</p>" +
          '<ul class="fm-mini">' + list.map(function (o) { return '<li><button type="button" class="fm-mini__btn' + (st.sel === o.id ? " is-on" : "") + '" data-fm-pick="' + o.id + '"><span class="fm-dot fm-dot--' + o.purpose + '"></span>' + esc(o.name) + "</button></li>"; }).join("") + "</ul>" +
          '<p class="fm-p fm-p--note">Your neighbourhood filter is on. Choose a flower to discover an organization.</p><button type="button" class="fm-link" data-fm-list>Show as a list →</button></div>'
        :
        '<div class="fm-card fm-card--intro"><p class="fm-eyebrow">Rooted in The Hague</p><h2 class="fm-h fm-h--lg">Find your place. <br>Grow together.</h2>' +
          '<p class="fm-p">Discover the women’s organizations making our city a place to connect, learn and belong.</p>' +
          '<button type="button" class="btn btn--sm fm-wide" data-fm-list>Explore ' + plural(list.length, "organization") + ' <span class="arrow" aria-hidden="true">→</span></button></div>';

      var hint = h ? "" :
        '<div class="fm-card fm-card--hint"><h3 class="fm-h3">A field of possibilities</h3><p class="fm-p">Every flower is an organization. Select one to discover the people behind it.</p>' +
          (unplaced.length ? '<p class="fm-p fm-p--note">' + plural(unplaced.length, "organization") + " still need a location on the map — find them in the list.</p>" : "") +
          '<button type="button" class="fm-link" data-fm-list>Show as a list →</button></div>';

      host.innerHTML =
        '<div class="fm-stage">' +
          '<div class="fm-canvas" data-fm-canvas tabindex="-1" data-fm-focus aria-label="Map of The Hague with ' + plural(list.length, "organization") + '">' +
            '<div class="fm-world" data-fm-world style="--z:' + st.zoom + ";transform:translate(" + st.px + "px," + st.py + "px) scale(" + st.zoom + ')">' +
              mapSvg("fm-svg", list) +
              placed.map(function (o) {
                var vis = !!on[o.id];
                return '<button type="button" class="fm-pin fm-pin--' + o.purpose + (vis ? "" : " is-dim") + (st.sel === o.id ? " is-sel" : "") + '" data-fm-pin="' + o.id + '" style="' + pos(o) + '"' +
                  (vis ? "" : ' tabindex="-1" aria-hidden="true"') + ' aria-label="' + esc(o.name) + (hoodName(o) ? ", " + esc(hoodName(o)) : "") + '">' +
                  flower(o, 34) + '<span class="fm-pin__label">' + esc(o.name) + "</span></button>";
              }).join("") +
            "</div>" +
            '<div class="fm-zoom" role="group" aria-label="Zoom"><button type="button" data-fm-zoom="1" aria-label="Zoom in">+</button><button type="button" data-fm-zoom="-1" aria-label="Zoom out">−</button></div>' +
          "</div>" +
          '<span class="fm-place glass" aria-hidden="true">The Hague, Netherlands</span>' +
          intro + hint +
          '<ul class="fm-legend" aria-label="Legend">' + Object.keys(PURPOSE).map(function (k) { return '<li><span class="fm-dot fm-dot--' + k + '"></span>' + PURPOSE[k].label + "</li>"; }).join("") + "</ul>" +
          (sel ? popup(sel) : "") +
        "</div>" +
        '<div class="fm-foot"><span>A city of connections. Every organization grows its own flower.</span><span>Neighbourhood boundaries are illustrative.</span></div>';

      host.querySelectorAll("[data-fm-list]").forEach(function (b) { b.addEventListener("click", function () { go("list"); }); });
      host.querySelectorAll("[data-fm-pin],[data-fm-pick]").forEach(function (b) {
        b.addEventListener("click", function (e) { if (dragged) { e.preventDefault(); return; } var id = b.dataset.fmPin || b.dataset.fmPick; st.sel = st.sel === id ? null : id; drawField(); var p = host.querySelector(".fm-pop"); if (p) p.querySelector("h3").focus(); else { var pin = host.querySelector('[data-fm-pin="' + id + '"]'); if (pin) pin.focus(); } });
      });
      var pop = host.querySelector(".fm-pop");
      if (pop) {
        placePopup(pop);
        pop.querySelector("[data-fm-close]").addEventListener("click", function () { var id = st.sel; st.sel = null; drawField(); var pin = host.querySelector('[data-fm-pin="' + id + '"]'); if (pin) pin.focus(); });
        pop.querySelector("[data-fm-open]").addEventListener("click", function () { go("profile", { sel: st.sel, tab: "about" }); });
        pop.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); pop.querySelector("[data-fm-close]").click(); } });
      }
      host.querySelectorAll("[data-fm-zoom]").forEach(function (b) {
        b.addEventListener("click", function () {
          var z = Math.min(2.6, Math.max(1, Math.round((st.zoom + (+b.dataset.fmZoom) * 0.4) * 10) / 10));
          var k = z / st.zoom; st.px *= k; st.py *= k; st.zoom = z; clampPan(); applyWorld(); if (pop) placePopup(pop);
        });
      });
      bindPan();
    }
    function popup(o) {
      var p = PURPOSE[o.purpose] || PURPOSE.connect;
      return '<div class="fm-pop" role="dialog" aria-label="' + esc(o.name) + '">' +
        '<div class="fm-pop__band fm-band--' + o.purpose + '"><span>A place to bloom</span>' + flower(o, 30) + '<button type="button" class="fm-x" data-fm-close aria-label="Close">×</button></div>' +
        '<div class="fm-pop__body"><p class="fm-eyebrow fm-eyebrow--check">' + val(o.type, "type of organization") + "</p>" +
          '<h3 class="fm-h3" tabindex="-1">' + esc(o.name) + "</h3>" +
          '<p class="fm-meta">The Hague · ' + val(hoodName(o), "neighbourhood") + "</p>" +
          '<p class="fm-p">' + val(o.tagline, "short description") + "</p>" +
          '<button type="button" class="btn btn--sm fm-wide" data-fm-open>View organization <span class="arrow" aria-hidden="true">→</span></button>' +
          '<p class="sr-only">' + esc(p.label) + "</p></div></div>";
    }
    function placePopup(pop) {
      if (matchMedia("(max-width: 760px)").matches) { pop.style.left = ""; pop.style.top = ""; return; }
      var pin = host.querySelector('[data-fm-pin="' + st.sel + '"]'); var stage = host.querySelector(".fm-stage");
      if (!pin || !stage) return;
      var r = pin.getBoundingClientRect(), s = stage.getBoundingClientRect();
      var w = pop.offsetWidth, hgt = pop.offsetHeight;
      var x = r.right - s.left + 14; if (x + w > s.width - 12) x = r.left - s.left - w - 14;
      var y = r.top - s.top + r.height / 2 - hgt / 2;
      pop.style.left = Math.max(12, x) + "px"; pop.style.top = Math.max(12, Math.min(s.height - hgt - 12, y)) + "px";
    }

    /* pan & zoom */
    var dragged = false;
    function applyWorld() { var w = host.querySelector("[data-fm-world]"); if (w) { w.style.transform = "translate(" + st.px + "px," + st.py + "px) scale(" + st.zoom + ")"; w.style.setProperty("--z", st.zoom); } }
    function clampPan() {
      var c = host.querySelector("[data-fm-canvas]"); if (!c) return;
      var mx = c.clientWidth * (st.zoom - 1) / 2, my = c.clientHeight * (st.zoom - 1) / 2;
      st.px = Math.max(-mx, Math.min(mx, st.px)); st.py = Math.max(-my, Math.min(my, st.py));
    }
    function bindPan() {
      var c = host.querySelector("[data-fm-canvas]"); if (!c) return;
      var start = null;
      c.addEventListener("pointerdown", function (e) { if (st.zoom <= 1 || e.button !== 0 || e.target.closest(".fm-zoom")) return; e.preventDefault(); start = { x: e.clientX, y: e.clientY, px: st.px, py: st.py }; dragged = false; });
      c.addEventListener("pointermove", function (e) {
        if (!start) return;
        var dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (!dragged && Math.abs(dx) + Math.abs(dy) < 5) return;
        if (!dragged) { dragged = true; try { c.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } c.classList.add("is-dragging"); }
        st.px = start.px + dx; st.py = start.py + dy; clampPan(); applyWorld();
        var pop = host.querySelector(".fm-pop"); if (pop) placePopup(pop);
      });
      var end = function () { start = null; c.classList.remove("is-dragging"); setTimeout(function () { dragged = false; }, 0); };
      c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
      c.classList.toggle("can-pan", st.zoom > 1);
    }
    window.addEventListener("resize", function () { var pop = host.querySelector(".fm-pop"); if (pop && document.body.contains(el)) placePopup(pop); });

    /* list */
    function drawList() {
      var list = visible();
      host.innerHTML =
        '<div class="fm-list-wrap">' +
          '<div class="min0">' +
            '<div class="fm-list-head"><div><p class="fm-eyebrow">Your community, at a glance</p>' +
              '<h2 class="fm-h fm-h--lg" tabindex="-1" data-fm-focus>' + plural(list.length, "organization") + " in " + esc(placeLabel()) + "</h2>" +
              '<p class="fm-p">A few different ways to find your people. Explore a profile to learn more.</p></div>' +
              '<div class="select"><label class="sr-only" for="' + uid + '-sort">Sort</label><select id="' + uid + '-sort" data-fm-sort>' +
                '<option value="az"' + (st.sort === "az" ? " selected" : "") + ">Sort: Name A–Z</option>" +
                '<option value="za"' + (st.sort === "za" ? " selected" : "") + ">Sort: Name Z–A</option>" +
                '<option value="hood"' + (st.sort === "hood" ? " selected" : "") + ">Sort: Neighbourhood</option></select></div></div>" +
            '<ul class="fm-rows">' + list.map(function (o) {
              return '<li class="fm-row' + (st.sel === o.id ? " is-sel" : "") + '"><span class="fm-row__art fm-band--' + o.purpose + '">' + flower(o, 30) + "</span>" +
                '<div class="fm-row__text"><p class="fm-meta">The Hague · ' + val(hoodName(o), "neighbourhood") + "</p>" +
                  '<h3 class="fm-h3">' + esc(o.name) + '</h3><p class="fm-p">' + val(o.tagline, "short description") + "</p></div>" +
                '<button type="button" class="btn btn--sm' + (st.sel === o.id ? "" : " btn--outline") + '" data-fm-profile="' + o.id + '">View profile <span class="arrow" aria-hidden="true">→</span></button></li>';
            }).join("") + "</ul>" +
            (list.length ? "" : '<p class="fm-empty">No organizations match these filters yet.</p>') +
            '<p class="fm-p fm-p--note">Nothing that feels right yet? Try another neighbourhood or <button type="button" class="fm-link" data-fm-clearall>clear your filters</button>.</p>' +
          "</div>" +
          '<aside class="fm-aside"><div class="fm-card fm-card--soft"><h3 class="fm-h3">Stories and reports</h3><p class="fm-p">Read success stories and genuine experiences from women in the area.</p>' +
            '<div class="fm-minimap">' + mapSvg("fm-svg", list) + list.filter(function (o) { return o.x != null; }).map(function (o) {
              return '<span class="fm-minipin" style="' + pos(o) + '">' + flower(o, 16) + "</span>";
            }).join("") + "</div>" +
            '<button type="button" class="btn btn--sm fm-wide" data-fm-field>Back to the field <span class="arrow" aria-hidden="true">→</span></button>' +
            '<a class="fm-link" href="#map-stories" data-scroll="map-stories">Read stories from the field ↓</a></div></aside>' +
        "</div>";
      host.querySelector("[data-fm-sort]").addEventListener("change", function (e) { st.sort = e.target.value; drawList(); host.querySelector("[data-fm-sort]").focus(); });
      host.querySelectorAll("[data-fm-profile]").forEach(function (b) { b.addEventListener("click", function () { go("profile", { sel: b.dataset.fmProfile, tab: "about" }); }); });
      host.querySelector("[data-fm-field]").addEventListener("click", function () { go("field"); });
      host.querySelector("[data-fm-clearall]").addEventListener("click", function () { bar.querySelector("[data-fm-clear]").disabled = false; bar.querySelector("[data-fm-clear]").click(); });
      bindScroll(host);
    }

    /* profile */
    function drawProfile() {
      var o = byId[st.sel]; if (!o) { st.view = "field"; return drawField(); }
      var hn = hoodName(o);
      var backLabel = st.back === "list" ? "Back to organizations in " + placeLabel() : "Back to the field";
      var stories = (o.stories && o.stories.length) ? o.stories : null;
      var tab = function (id, label) { return '<button class="fm-tab' + (st.tab === id ? " is-active" : "") + '" data-tab="' + id + '">' + label + "</button>"; };
      host.innerHTML =
        '<button type="button" class="fm-back" data-fm-back>← ' + esc(backLabel) + "</button>" +
        '<div class="fm-profile">' +
          '<div class="min0 stack" style="--gap:18px">' +
            '<header class="fm-card fm-card--head"><p class="fm-eyebrow">' + val(o.type, "type of organization") + " · The Hague · " + val(hn, "neighbourhood") + "</p>" +
              '<h2 class="fm-h fm-h--xl" tabindex="-1" data-fm-focus>' + esc(o.name) + '</h2><p class="fm-p fm-p--lead">' + val(o.tagline, "short description") + "</p>" +
              (o.route ? '<a class="fm-link" href="#' + o.route + '">Visit the full organization page →</a>' : "") + "</header>" +
            '<div data-tabs><div class="fm-tabs tabs__list" role="tablist" aria-label="About ' + esc(o.name) + '">' + tab("about", "About") + tab("stories", "Community stories") + tab("contact", "Get in touch") + "</div>" +
              '<section class="fm-panel-body" data-tab-panel="about">' +
                '<h3 class="fm-h3">A space to connect and grow</h3><p class="fm-p">' + val(o.about, "about the organization") + "</p>" +
                '<p class="fm-label">What you can do here</p><ul class="fm-tags">' + ((o.themes && o.themes.length) ? o.themes.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") : "<li>" + ph("themes") + "</li>") + "</ul>" +
                '<div class="fm-facts"><div><p class="fm-label">Who they reach</p><p class="fm-p">' + ((o.reach && o.reach.length) ? esc(o.reach.join(", ")) : ph("who they reach")) + "</p></div>" +
                  '<div><p class="fm-label">Languages</p><p class="fm-p">' + ((o.languages && o.languages.length) ? esc(o.languages.join(", ")) : ph("languages")) + "</p></div></div>" +
                quote(stories ? stories[0] : null, o) +
              "</section>" +
              '<section class="fm-panel-body" data-tab-panel="stories" hidden><h3 class="fm-h3">Community stories</h3><p class="fm-p">How women found their place at ' + esc(o.name) + ".</p>" +
                '<div class="fm-story-grid">' + (stories || [null, null]).map(function (s) { return quote(s, o); }).join("") + "</div>" +
                '<p class="fm-p fm-p--note">Are you part of ' + esc(o.name) + '? <a class="fm-link" href="#contact">Share your story with us</a>.</p></section>' +
              '<section class="fm-panel-body" data-tab-panel="contact" hidden><h3 class="fm-h3">Get in touch</h3>' +
                '<dl class="fm-dl"><div><dt>Address</dt><dd>' + val(o.address, "address") + "</dd></div>" +
                  "<div><dt>Website</dt><dd>" + (o.website ? '<a class="fm-link" href="' + esc(o.website) + '" target="_blank" rel="noopener">' + esc(o.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) + " ↗</a>" : ph("website")) + "</dd></div>" +
                  "<div><dt>E-mail</dt><dd>" + (o.email ? '<a class="fm-link" href="mailto:' + esc(o.email) + '">' + esc(o.email) + "</a>" : ph("e-mail")) + "</dd></div>" +
                  "<div><dt>Phone</dt><dd>" + val(o.phone, "phone number") + "</dd></div></dl>" +
                '<button type="button" class="btn btn--sm" data-fm-contact>Start a conversation <span class="arrow" aria-hidden="true">→</span></button></section>' +
            "</div>" +
          "</div>" +
          '<aside class="stack fm-aside" style="--gap:16px"><div class="fm-art fm-band--' + o.purpose + '">' + flower(o, 96) + '<p class="fm-eyebrow">Rooted in ' + (hn ? esc(hn) : "The Hague") + "</p></div>" +
            '<div class="fm-card fm-card--soft"><h3 class="fm-h3">Your next connection starts with a hello.</h3><p class="fm-p">Ask about activities, joining in, or how this organization can support you.</p>' +
              '<button type="button" class="btn btn--sm fm-wide" data-fm-contact>Get in touch <span class="arrow" aria-hidden="true">→</span></button>' +
              (o.x != null ? '<button type="button" class="btn btn--sm btn--outline fm-wide" data-fm-find>Find on the field</button>' : "") +
              '<p class="fm-p fm-p--note">No pressure. Find the right pace for you.</p></div></aside>' +
        "</div>";
      initTabs(host);
      host.querySelector("[data-fm-back]").addEventListener("click", function () { go(st.back === "list" ? "list" : "field"); });
      host.querySelectorAll("[data-fm-contact]").forEach(function (b) { b.addEventListener("click", function () { go("contact"); }); });
      var find = host.querySelector("[data-fm-find]");
      if (find) find.addEventListener("click", function () { go("field", { sel: o.id }); });
    }
    function quote(s, o) {
      return '<figure class="fm-quote"><blockquote>“' + (s && s.quote ? esc(s.quote) : ph("success story quote")) + '”</blockquote>' +
        "<figcaption>— " + (s && s.by ? esc(s.by) : ph("member name")) + ", " + esc(o.name) + "</figcaption></figure>";
    }
    function initTabs(root) {
      var wrap = root.querySelector("[data-tabs]"); var tabs = wrap.querySelectorAll("[data-tab]");
      function select(id) {
        st.tab = id;
        tabs.forEach(function (t) { var on = t.dataset.tab === id; t.setAttribute("aria-selected", String(on)); t.classList.toggle("is-active", on); t.tabIndex = on ? 0 : -1; });
        wrap.querySelectorAll("[data-tab-panel]").forEach(function (p) { p.hidden = p.dataset.tabPanel !== id; });
      }
      tabs.forEach(function (t, i) {
        t.setAttribute("role", "tab"); t.type = "button";
        t.addEventListener("click", function () { select(t.dataset.tab); });
        t.addEventListener("keydown", function (e) { var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n.dataset.tab); } });
      });
      select(st.tab);
    }

    /* contact */
    function drawContact() {
      var o = byId[st.sel]; if (!o) { st.view = "field"; return drawField(); }
      host.innerHTML =
        '<button type="button" class="fm-back" data-fm-back>← Back to ' + esc(o.name) + "</button>" +
        '<div class="fm-contact">' +
          '<div class="fm-hello"><p class="fm-eyebrow">A small hello, a new beginning</p><h2 class="fm-h fm-h--xl">You don’t have to know anyone to belong.</h2>' +
            '<p class="fm-p">Ask a question, share what you’re looking for, or find out how to join in.</p>' +
            '<div class="fm-to"><div><p class="fm-eyebrow">You’re contacting</p><p class="fm-to__name">' + esc(o.name) + '</p><p class="fm-meta">The Hague · ' + val(o.type, "type of organization") + "</p></div>" + flower(o, 44) + "</div></div>" +
          '<form class="fm-card fm-form" data-form>' +
            '<h2 class="fm-h" tabindex="-1" data-fm-focus>Start a conversation</h2><p class="fm-p">Tell the organization a little about how you’d like to connect.</p>' +
            '<div class="fm-form__row"><div class="field"><label for="' + uid + '-n">Your name</label><input class="input" id="' + uid + '-n" name="name" autocomplete="name" required></div>' +
              '<div class="field"><label for="' + uid + '-e">Email address</label><input class="input" id="' + uid + '-e" name="email" type="email" autocomplete="email" required></div></div>' +
            '<div class="field"><label for="' + uid + '-i">I’m interested in</label><div class="select"><select id="' + uid + '-i" name="interest"><option>Meeting other women</option><option>Joining an activity</option><option>Volunteering</option><option>Getting support or advice</option><option>Something else</option></select></div></div>' +
            '<div class="field"><label for="' + uid + '-m">Your message</label><textarea class="textarea" id="' + uid + '-m" name="message" required placeholder="Hello! I live in ' + esc(hoodName(o) || "The Hague") + ' and would love to meet other women in the neighbourhood. Could you tell me more about your activities and how I can join in?"></textarea></div>' +
            '<label class="fm-consent"><input type="checkbox" name="consent" required> I agree to share my name, email and message with this organization.</label>' +
            '<div class="fm-form__foot"><button class="btn" type="submit">Send message <span class="arrow" aria-hidden="true">→</span></button><span class="small muted">Sample contact form — no message is sent yet.</span></div>' +
            '<div class="form-note" data-form-success hidden><b>Thank you!</b> Your message for ' + esc(o.name) + ' is ready. This form is not connected yet, so nothing has been sent — please use the <a class="fm-link" href="#contact">contact page</a> for now.</div>' +
          "</form>" +
        "</div>";
      kit.bindForm(host.querySelector("form"));
      host.querySelector("[data-fm-back]").addEventListener("click", function () { go("profile"); });
    }

    /* stories section (outside the mount, if present on the page) */
    function drawStories() {
      if (!storiesHost) return;
      var list = visible();
      var items = [];
      list.forEach(function (o) { (o.stories || []).forEach(function (s) { items.push({ s: s, o: o }); }); });
      var fill = list.length ? list : ORGS;
      for (var i = 0; items.length < 3 && i < fill.length; i++) items.push({ s: null, o: fill[i] });
      storiesHost.innerHTML = items.slice(0, 6).map(function (it) {
        return '<article class="card fm-story"><div class="fm-story__top"><span class="fm-row__art fm-band--' + it.o.purpose + '">' + flower(it.o, 26) + '</span><div><p class="fm-meta">' + val(hoodName(it.o), "neighbourhood") + '</p><p class="fm-story__org">' + esc(it.o.name) + "</p></div></div>" +
          '<blockquote>“' + (it.s && it.s.quote ? esc(it.s.quote) : ph("success story quote")) + '”</blockquote>' +
          '<p class="fm-story__by">— ' + (it.s && it.s.by ? esc(it.s.by) : ph("member name")) + "</p>" +
          '<button type="button" class="fm-link" data-fm-story="' + it.o.id + '">Read their story →</button></article>';
      }).join("");
      storiesHost.querySelectorAll("[data-fm-story]").forEach(function (b) { b.addEventListener("click", function () { go("profile", { sel: b.dataset.fmStory, tab: "stories" }); }); });
    }
    function bindScroll(root) {
      root.querySelectorAll("[data-scroll]").forEach(function (a) {
        a.addEventListener("click", function (e) { var t = document.getElementById(a.dataset.scroll); if (!t) return; e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 95, behavior: "smooth" }); });
      });
    }

    drawBar();
    draw();
  };
})();
