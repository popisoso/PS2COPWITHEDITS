/* Kracht(vrouwen) in de Wijk — site shell, hash router and page behaviors. No dependencies. */
(function () {
  "use strict";

  var SITE = "Kracht(vrouwen) in de Wijk";
  var NAV = [
    { route: "home", label: "Home" },
    { route: "organizations", label: "Organizations", match: ["org-vbl", "org-reva"] },
    { label: "Resources", children: [
      { route: "guide", label: "Guide", match: ["guide-location", "guide-structure", "guide-frictions", "guide-balance", "guide-generations"] },
      { route: "faq", label: "FAQ" },
      { route: "media", label: "Media" }
    ] },
    { route: "about", label: "About Us" },
    { route: "events", label: "Events" },
    { route: "blog", label: "Blog", match: ["blog-entry"] }
  ];
  var FOOTER_LINKS = [
    ["home", "Home"], ["organizations", "Organizations"], ["guide", "Tools & Downloads"],
    ["about", "About Us"], ["blog", "Blog"], ["contact", "Contact Us"]
  ];

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------------- templates & routes ---------------- */
  var templates = {};
  $$("template[data-route]").forEach(function (t) { templates[t.dataset.route] = t; });
  var searchQuery = "";

  function matches(item, route) {
    return item.route === route || (item.match && item.match.indexOf(route) > -1);
  }

  /* ---------------- header ---------------- */
  function renderHeader() {
    var links = NAV.map(function (item) {
      if (item.children) {
        return '<div class="nav__drop" data-drop>' +
          '<button class="nav__link" type="button" aria-expanded="false" aria-haspopup="true" data-drop-btn data-group="' + item.children.map(function (c) { return [c.route].concat(c.match || []).join(" "); }).join(" ") + '">' + item.label + ' <span aria-hidden="true" style="font-size:.7em">▾</span></button>' +
          '<div class="nav__menu" role="menu">' + item.children.map(function (c) {
            return '<a role="menuitem" href="#' + c.route + '" data-nav="' + c.route + '" data-match="' + (c.match || []).join(" ") + '">' + c.label + '</a>';
          }).join("") + '</div></div>';
      }
      return '<a class="nav__link" href="#' + item.route + '" data-nav="' + item.route + '" data-match="' + (item.match || []).join(" ") + '">' + item.label + '</a>';
    }).join("");

    var search = function (id) {
      return '<form class="search" role="search" data-site-search>' +
        '<label class="sr-only" for="' + id + '">Search the site</label>' +
        '<input id="' + id + '" type="search" placeholder="Search" autocomplete="off">' +
        '<button type="submit" aria-label="Search"><img src="assets/icons/search.svg" alt="" width="18" height="18"></button></form>';
    };

    $("#site-header").innerHTML =
      '<div class="site-header__inner">' +
        '<a class="brand" href="#home" aria-label="' + SITE + ' — home">' +
          '<img src="assets/icons/logo-circle.svg" alt="" width="69" height="69">' +
          '<img src="assets/icons/logo.png" alt="" width="704" height="665">' +
        '</a>' +
        '<nav class="nav" aria-label="Main">' + links + search("q-desktop") +
          '<div style="position:relative">' +
            '<button class="globe" type="button" aria-label="Language" aria-expanded="false" data-lang-btn><img src="assets/icons/globe.png" alt="" width="29" height="29"></button>' +
            '<div class="lang-menu" data-lang-menu><button type="button" aria-pressed="true">English</button><button type="button" aria-pressed="false" data-lang-nl>Nederlands</button></div>' +
          '</div>' +
        '</nav>' +
        '<div class="header-tools">' + search("q-mobile") +
          '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" data-burger><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div>';

    var drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.setAttribute("data-drawer", "");
    drawer.innerHTML = '<div class="drawer__scrim" data-drawer-close></div>' +
      '<nav class="drawer__panel" aria-label="Mobile">' +
        '<button class="drawer__close" type="button" aria-label="Close menu" data-drawer-close>&times;</button>' +
        NAV.map(function (item) {
          if (item.children) {
            return '<a href="#' + item.children[0].route + '" data-nav="' + item.children[0].route + '">' + item.label + '</a>' +
              item.children.map(function (c) { return '<a class="sub" href="#' + c.route + '" data-nav="' + c.route + '" data-match="' + (c.match || []).join(" ") + '">' + c.label + '</a>'; }).join("");
          }
          return '<a href="#' + item.route + '" data-nav="' + item.route + '" data-match="' + (item.match || []).join(" ") + '">' + item.label + '</a>';
        }).join("") +
        '<a href="#contact" data-nav="contact">Contact Us</a>' +
      '</nav>';
    document.body.appendChild(drawer);

    // dropdown
    $$("[data-drop]").forEach(function (drop) {
      var btn = $("[data-drop-btn]", drop);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !drop.classList.contains("is-open");
        closeMenus();
        drop.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    var langBtn = $("[data-lang-btn]"), langMenu = $("[data-lang-menu]");
    langBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !langMenu.classList.contains("is-open");
      closeMenus();
      langMenu.classList.toggle("is-open", open);
      langBtn.setAttribute("aria-expanded", String(open));
    });
    $("[data-lang-nl]").addEventListener("click", function () { closeMenus(); toast("The Dutch version is coming soon."); });
    document.addEventListener("click", closeMenus);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenus(); closeDrawer(); closeModal(); } });

    // drawer
    $("[data-burger]").addEventListener("click", function () { drawer.classList.add("is-open"); this.setAttribute("aria-expanded", "true"); $(".drawer__close", drawer).focus(); });
    $$("[data-drawer-close]", drawer).forEach(function (el) { el.addEventListener("click", closeDrawer); });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", closeDrawer); });

    // site search
    $$("[data-site-search]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = $("input", form).value.trim();
        if (!q) { $("input", form).focus(); return; }
        searchQuery = q;
        if (location.hash === "#search") render(); else location.hash = "search";
      });
    });
  }
  function closeMenus() {
    $$("[data-drop]").forEach(function (d) { d.classList.remove("is-open"); $("[data-drop-btn]", d).setAttribute("aria-expanded", "false"); });
    var lm = $("[data-lang-menu]"); if (lm) { lm.classList.remove("is-open"); $("[data-lang-btn]").setAttribute("aria-expanded", "false"); }
  }
  function closeDrawer() {
    var d = $("[data-drawer]"); if (d && d.classList.contains("is-open")) { d.classList.remove("is-open"); $("[data-burger]").setAttribute("aria-expanded", "false"); }
  }

  /* ---------------- footer ---------------- */
  function renderFooter() {
    $("#site-footer").innerHTML =
      '<div class="container">' +
        '<div class="site-footer__top">' +
          '<nav class="site-footer__links" aria-label="Footer">' + FOOTER_LINKS.map(function (l) { return '<a href="#' + l[0] + '">' + esc(l[1]) + '</a>'; }).join("") + '</nav>' +
          '<div class="social">' +
            '<a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><img src="assets/icons/facebook.svg" alt="" width="42" height="42"></a>' +
            '<a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube"><img src="assets/icons/youtube.svg" alt="" width="42" height="42"></a>' +
            '<a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><img src="assets/icons/instagram.svg" alt="" width="42" height="42"></a>' +
          '</div>' +
        '</div>' +
        '<div class="site-footer__bottom">' +
          '<span class="loc"><img src="assets/icons/location.svg" alt="" width="9" height="13">Netherlands</span>' +
          '<nav aria-label="Legal"><a href="#terms" data-legal="Terms of Use">Terms of Use</a><a href="#privacy" data-legal="Privacy &amp; Cookie Policy">Privacy &amp; Cookie Policy</a><a href="#cookies" data-legal="Cookie Settings">Cookie Settings</a></nav>' +
        '</div>' +
      '</div>';
    $$("[data-legal]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        openModal('<h2 class="h-sub" style="margin-bottom:12px">' + esc(a.dataset.legal) + '</h2><p class="body">This page is not part of the design yet. ' +
          (a.dataset.legal === "Cookie Settings" ? "This site does not set tracking cookies; it only remembers nothing beyond the page you are on." : "Contact the Kracht(vrouwen) in de Wijk team for the full text.") +
          '</p><p style="margin-top:20px"><a class="btn btn--sm" href="#contact" data-modal-close>Contact us</a></p>');
      });
    });
  }

  /* ---------------- router ---------------- */
  function currentRoute() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!h) return "home";
    if (h === "search" || templates[h]) return h;
    return null;
  }

  function render() {
    var route = currentRoute();
    var app = $("#app");
    if (route === null) {
      // not a page: maybe an in-page anchor
      var target = document.getElementById(location.hash.slice(1));
      if (target && app.contains(target)) { target.scrollIntoView(); return; }
      route = "home";
    }
    var title;
    if (route === "search") {
      app.innerHTML = renderSearch(searchQuery);
      title = "Search";
    } else {
      var tpl = templates[route];
      app.innerHTML = "";
      app.appendChild(document.importNode(tpl.content, true));
      title = tpl.dataset.title;
    }
    document.title = (route === "home" ? SITE : title + " · " + SITE);
    window.scrollTo(0, 0);
    setActive(route);
    initBehaviors(app);
    closeMenus();
  }

  function setActive(route) {
    $$("[data-nav]").forEach(function (a) {
      var m = (a.dataset.match || "").split(" ");
      var on = a.dataset.nav === route || m.indexOf(route) > -1;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    $$("[data-drop-btn]").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.group.split(" ").indexOf(route) > -1);
    });
  }

  /* ---------------- site search ---------------- */
  function renderSearch(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var results = [];
    Object.keys(templates).forEach(function (route) {
      var tpl = templates[route];
      var text = (tpl.content.textContent || "").replace(/\s+/g, " ").trim();
      var lower = text.toLowerCase();
      var score = 0;
      words.forEach(function (w) { var i = lower.indexOf(w); while (i > -1) { score++; i = lower.indexOf(w, i + w.length); } });
      if (score && words.every(function (w) { return lower.indexOf(w) > -1; })) {
        var at = Math.max(0, lower.indexOf(words[0]) - 80);
        var snip = (at ? "…" : "") + text.slice(at, at + 220) + "…";
        results.push({ route: route, title: tpl.dataset.title, snip: snip, score: score });
      }
    });
    results.sort(function (a, b) { return b.score - a.score; });
    var hi = function (s) {
      var out = esc(s);
      words.forEach(function (w) { out = out.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>"); });
      return out;
    };
    return '<div class="page page-search"><section class="container section"><div class="stack" style="--gap:28px">' +
      '<h1 class="h-section">Search</h1>' +
      '<form class="search" role="search" data-site-search style="width:min(420px,100%)"><label class="sr-only" for="q-page">Search the site</label><input id="q-page" type="search" value="' + esc(q) + '" placeholder="Search"><button type="submit" aria-label="Search"><img src="assets/icons/search.svg" alt="" width="18" height="18"></button></form>' +
      (q ? '<p class="muted">' + results.length + ' result' + (results.length === 1 ? "" : "s") + ' for “' + esc(q) + '”</p>' : '<p class="muted">Type a word and press Enter.</p>') +
      '<div class="stack" style="--gap:16px">' + results.map(function (r) {
        return '<a class="card card--link" href="#' + r.route + '"><h2 class="h-card" style="margin-bottom:8px">' + esc(r.title) + '</h2><p class="small muted">' + hi(r.snip) + '</p></a>';
      }).join("") + '</div>' +
      (q && !results.length ? '<p class="body">Nothing matched. Try another word, or browse <a href="#organizations">organizations</a>, the <a href="#guide">guide</a> or the <a href="#faq">FAQ</a>.</p>' : '') +
      '</div></section></div>';
  }

  /* ---------------- toast & modal ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }
  var lastFocus;
  function openModal(html) {
    var m = $("#kv-modal");
    if (!m) {
      m = document.createElement("div"); m.id = "kv-modal"; m.className = "modal"; m.hidden = true;
      m.innerHTML = '<div class="modal__scrim" data-modal-close></div><div class="modal__card" role="dialog" aria-modal="true" tabindex="-1"><button class="modal__close" type="button" aria-label="Close" data-modal-close>&times;</button><div data-modal-body></div></div>';
      document.body.appendChild(m);
      m.addEventListener("click", function (e) { if (e.target.closest("[data-modal-close]")) closeModal(); });
    }
    lastFocus = document.activeElement;
    $("[data-modal-body]", m).innerHTML = html;
    m.hidden = false;
    $(".modal__card", m).focus();
  }
  function closeModal() {
    var m = $("#kv-modal"); if (m && !m.hidden) { m.hidden = true; if (lastFocus) lastFocus.focus(); }
  }

  /* ---------------- behaviors ---------------- */
  function initBehaviors(root) {
    // header-style search inside pages
    $$("[data-site-search]", root).forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault(); searchQuery = $("input", form).value.trim(); render();
      });
    });

    // in-page scroll
    $$("[data-scroll]", root).forEach(function (a) {
      a.addEventListener("click", function (e) {
        var t = document.getElementById(a.dataset.scroll);
        if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.pageYOffset - 95;
        window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
    });

    // filter chips + live search (shared per group name)
    var groups = {};
    function applyGroup(name) {
      var g = groups[name]; var shown = 0;
      $$('[data-filter-item="' + name + '"]', root).forEach(function (item) {
        var tags = (item.dataset.tags || "").toLowerCase().split(/\s+/);
        var okTag = !g.tag || g.tag === "all" || tags.indexOf(g.tag.toLowerCase()) > -1;
        var okText = !g.q || item.textContent.toLowerCase().indexOf(g.q) > -1 || (item.dataset.tags || "").toLowerCase().indexOf(g.q) > -1;
        var out = !(okTag && okText);
        item.dataset.out = out ? "1" : "0";
        item.hidden = out;
        if (!out) shown++;
      });
      $$('[data-empty="' + name + '"]', root).forEach(function (el) { el.hidden = shown > 0; });
      $$('[data-paginate]', root).forEach(function (list) { if (list._repage) list._repage(); });
    }
    function group(name) { return groups[name] || (groups[name] = { tag: "all", q: "" }); }
    $$("[data-filter-group]", root).forEach(function (wrap) {
      var name = wrap.dataset.filterGroup; group(name);
      var btns = $$("[data-filter]", wrap);
      btns.forEach(function (b, i) {
        b.setAttribute("type", "button");
        b.setAttribute("aria-pressed", b.dataset.filter === "all" || (i === 0 && !btns.some(function (x) { return x.dataset.filter === "all"; })) ? "true" : "false");
        b.addEventListener("click", function () {
          var already = b.getAttribute("aria-pressed") === "true" && b.dataset.filter !== "all";
          btns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.classList.remove("is-active"); });
          var tag = already ? "all" : b.dataset.filter;
          var active = btns.filter(function (x) { return x.dataset.filter === tag; })[0];
          if (active) { active.setAttribute("aria-pressed", "true"); active.classList.add("is-active"); }
          groups[name].tag = tag; applyGroup(name);
        });
      });
      var first = btns.filter(function (x) { return x.getAttribute("aria-pressed") === "true"; })[0];
      if (first) first.classList.add("is-active");
    });
    $$("[data-search-target]", root).forEach(function (input) {
      var name = input.dataset.searchTarget; group(name);
      input.addEventListener("input", function () { groups[name].q = input.value.trim().toLowerCase(); applyGroup(name); });
      var form = input.closest("form");
      if (form && !form.hasAttribute("data-form")) form.addEventListener("submit", function (e) { e.preventDefault(); });
    });

    // checkbox filters: OR inside a group (checkbox name), AND across groups
    $$("[data-check-filter]", root).forEach(function (wrap) {
      var name = wrap.dataset.checkFilter;
      function apply() {
        var sel = {};
        $$('input[type="checkbox"]:checked', wrap).forEach(function (c) { (sel[c.name] = sel[c.name] || []).push(c.value); });
        var shown = 0;
        $$('[data-filter-item="' + name + '"]', root).forEach(function (item) {
          var ok = Object.keys(sel).every(function (g) {
            var have = (item.getAttribute("data-" + g) || "").split(/\s+/);
            return sel[g].some(function (v) { return have.indexOf(v) > -1; });
          });
          item.dataset.out = ok ? "0" : "1"; item.hidden = !ok; if (ok) shown++;
        });
        $$('[data-empty="' + name + '"]', root).forEach(function (el) { el.hidden = shown > 0; });
        $$("[data-paginate]", root).forEach(function (list) { if (list._repage) list._repage(); });
      }
      wrap.addEventListener("change", apply);
      $$('[data-check-clear="' + name + '"]', root).forEach(function (b) {
        b.addEventListener("click", function () { $$('input[type="checkbox"]', wrap).forEach(function (c) { c.checked = false; }); apply(); });
      });
    });

    // carousel: controls ([data-carousel]) drive the list right before them
    $$("[data-carousel]", root).forEach(function (ctrl) {
      var track = ctrl.previousElementSibling;
      if (!track) return;
      var items = Array.prototype.slice.call(track.children);
      var n = items.length;
      if (n < 2) { ctrl.hidden = true; return; }
      track.classList.add("carousel-track");
      var dotsBox = $("[data-carousel-dots]", ctrl);
      var live = document.createElement("p"); live.className = "sr-only"; live.setAttribute("aria-live", "polite"); ctrl.appendChild(live);
      var i = 0;
      dotsBox.innerHTML = items.map(function (_, k) {
        return '<button type="button" aria-label="Show item ' + (k + 1) + ' of ' + n + '"><img src="" alt="" width="20" height="20"></button>';
      }).join("");
      var dots = $$("button", dotsBox);
      function go(k, animate) {
        i = (k + n) % n;
        items.forEach(function (it, idx) { var pos = (idx - i + n) % n; it.style.order = pos; it.dataset.pos = pos; });
        dots.forEach(function (d, idx) {
          $("img", d).src = idx === i ? dotsBox.dataset.on : dotsBox.dataset.off;
          if (idx === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        });
        if (animate) {
          track.classList.remove("is-moving"); void track.offsetWidth; track.classList.add("is-moving");
          live.textContent = "Item " + (i + 1) + " of " + n;
        }
      }
      $("[data-carousel-prev]", ctrl).addEventListener("click", function () { go(i - 1, true); });
      $("[data-carousel-next]", ctrl).addEventListener("click", function () { go(i + 1, true); });
      dots.forEach(function (d, idx) { d.addEventListener("click", function () { go(idx, true); }); });
      ctrl.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { go(i + 1, true); } else if (e.key === "ArrowLeft") { go(i - 1, true); }
      });
      go(0, false);
    });

    // linked highlight: hovering/focusing one [data-hl] element highlights all with the same key
    $$("[data-hl]", root).forEach(function (el) {
      var on = function (v) { $$('[data-hl="' + el.dataset.hl + '"]', root).forEach(function (x) { x.classList.toggle("is-hl", v); }); };
      el.addEventListener("mouseenter", function () { on(true); });
      el.addEventListener("mouseleave", function () { on(false); });
      el.addEventListener("focus", function () { on(true); });
      el.addEventListener("blur", function () { on(false); });
    });

    // tabs
    $$("[data-tabs]", root).forEach(function (wrap) {
      var tabs = $$("[data-tab]", wrap);
      var select = function (id) {
        tabs.forEach(function (t) { var on = t.dataset.tab === id; t.setAttribute("aria-selected", String(on)); t.classList.toggle("is-active", on); t.setAttribute("tabindex", on ? "0" : "-1"); });
        $$("[data-tab-panel]", wrap).forEach(function (p) { p.hidden = p.dataset.tabPanel !== id; });
      };
      tabs.forEach(function (t, i) {
        t.setAttribute("role", "tab"); t.setAttribute("type", "button");
        t.addEventListener("click", function () { select(t.dataset.tab); });
        t.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n.dataset.tab); }
        });
      });
      var initial = tabs.filter(function (t) { return t.classList.contains("is-active") || t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
      if (initial) select(initial.dataset.tab);
    });

    // forms
    $$("form[data-form]", root).forEach(function (form) {
      form.setAttribute("novalidate", "");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var bad = $$("input, textarea, select", form).filter(function (f) { return !f.checkValidity(); });
        $$(".field-error", form).forEach(function (n) { n.remove(); });
        bad.forEach(function (f) {
          f.setAttribute("aria-invalid", "true");
          var msg = document.createElement("p");
          msg.className = "field-error small"; msg.style.color = "#b0174f";
          msg.textContent = f.validity.valueMissing ? "Please fill in this field." : f.validity.typeMismatch ? "Please enter a valid " + (f.type === "email" ? "email address." : "value.") : f.validationMessage;
          f.insertAdjacentElement("afterend", msg);
          f.addEventListener("input", function once() { f.removeAttribute("aria-invalid"); if (msg.parentNode) msg.remove(); f.removeEventListener("input", once); });
        });
        if (bad.length) { bad[0].focus(); return; }
        var ok = $("[data-form-success]", form);
        $$(":scope > *", form).forEach(function (c) { if (c !== ok) c.hidden = true; });
        if (ok) { ok.hidden = false; ok.setAttribute("role", "status"); ok.setAttribute("tabindex", "-1"); ok.focus(); }
        else toast("Thank you! Your message has been received.");
      });
    });

    // lightbox
    $$("img[data-lightbox]", root).forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      var open = function () { openModal('<img src="' + img.currentSrc + '" alt="' + esc(img.alt) + '" style="width:100%;height:auto;border-radius:10px">' + (img.alt ? '<p class="small muted" style="margin-top:10px">' + esc(img.alt) + '</p>' : "")); $(".modal__card").style.maxWidth = "900px"; };
      img.addEventListener("click", open);
      img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });

    // copy
    $$("[data-copy]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var text = b.dataset.copy;
        var done = function () { toast("Copied: " + text); };
        try {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } catch (err) { fallbackCopy(text); done(); }
      });
    });

    // pagination
    $$("[data-paginate]", root).forEach(paginate);

    // mounts
    $$('[data-mount="calendar"]', root).forEach(mountCalendar);
    $$('[data-mount="upcoming"]', root).forEach(mountUpcoming);
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    ta.remove();
  }

  function paginate(list) {
    var per = parseInt(list.dataset.paginate, 10) || 6;
    var pager = document.createElement("nav");
    pager.className = "pager"; pager.setAttribute("aria-label", "Pages"); pager.style.marginTop = "40px";
    list.insertAdjacentElement("afterend", pager);
    var page = 1;
    function draw() {
      var items = Array.prototype.slice.call(list.children);
      var visible = items.filter(function (c) { return c.dataset.out !== "1"; });
      var pages = Math.max(1, Math.ceil(visible.length / per));
      if (page > pages) page = pages;
      items.forEach(function (c) { if (c.dataset.out === "1") c.hidden = true; });
      visible.forEach(function (c, i) { c.hidden = Math.floor(i / per) + 1 !== page; });
      pager.innerHTML = pages < 2 ? "" : Array.apply(null, { length: pages }).map(function (_, i) {
        return '<button type="button" ' + (i + 1 === page ? 'aria-current="page"' : "") + ' aria-label="Page ' + (i + 1) + '">' + (i + 1) + "</button>";
      }).join("");
      $$("button", pager).forEach(function (b, i) { b.addEventListener("click", function () { page = i + 1; draw(); var y = list.getBoundingClientRect().top + window.pageYOffset - 110; window.scrollTo(0, y); }); });
    }
    list._repage = function () { page = 1; draw(); };
    draw();
  }

  /* ---------------- calendar ---------------- */
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function longDate(s) { var d = parse(s); return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(); }
  function orgOf(ev) { return (window.KV_ORGS || {})[ev.org] || { name: ev.org, color: "#ccc" }; }
  function badge(ev) {
    var o = orgOf(ev);
    if (o.badge) return '<img class="cal__badge" src="' + o.badge + '" alt="" width="38" height="38">';
    var initials = o.name.replace(/[^A-Za-zÀ-ÿ ]/g, "").split(" ").filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
    return '<span class="cal__badge" style="background:' + o.color + '" aria-hidden="true">' + initials + "</span>";
  }
  function eventDetails(ev) {
    var o = orgOf(ev);
    return '<p class="eyebrow" style="color:' + "#b0174f" + '">' + esc(ev.category || "Event") + '</p>' +
      '<h2 class="h-sub" style="margin:6px 0 14px">' + esc(ev.title) + '</h2>' +
      '<dl class="stack" style="--gap:8px;margin:0">' +
        '<div><dt class="small muted">Date</dt><dd style="margin:0">' + longDate(ev.date) + (ev.time ? ", " + esc(ev.time) : "") + (ev.recurring ? " (every week)" : "") + '</dd></div>' +
        '<div><dt class="small muted">Organization</dt><dd style="margin:0">' + esc(o.name) + '</dd></div>' +
        (ev.location ? '<div><dt class="small muted">Location</dt><dd style="margin:0">' + esc(ev.location) + '</dd></div>' : "") +
      '</dl>' +
      (ev.description ? '<p class="body" style="margin-top:14px">' + esc(ev.description) + '</p>' : "") +
      '<p style="margin-top:22px"><a class="btn btn--sm" href="#' + (o.route || "organizations") + '" data-modal-close>View organization</a></p>';
  }
  function bindEventButtons(scope, list) {
    $$("[data-ev]", scope).forEach(function (b) {
      b.addEventListener("click", function () { openModal(eventDetails(list[+b.dataset.ev])); });
    });
  }

  function expandEvents() {
    var out = [];
    var now = new Date();
    (window.KV_EVENTS || []).forEach(function (e) {
      if (typeof e.weekly !== "number") { out.push(e); return; }
      // weekly: 0 = Monday ... 6 = Sunday; generate from 3 months back to 9 months ahead
      var d = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      var end = new Date(now.getFullYear(), now.getMonth() + 9, 0);
      while ((d.getDay() + 6) % 7 !== e.weekly) d.setDate(d.getDate() + 1);
      for (; d <= end; d.setDate(d.getDate() + 7)) {
        var copy = {}; for (var k in e) copy[k] = e[k];
        copy.date = iso(d); delete copy.weekly; copy.recurring = true;
        out.push(copy);
      }
    });
    return out;
  }

  function mountCalendar(el) {
    var events = expandEvents().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    var start = window.KV_CALENDAR_START ? parse(window.KV_CALENDAR_START + "-01") : new Date();
    var st = { y: start.getFullYear(), m: start.getMonth(), view: "month", sel: null, org: "", cat: "" };
    var orgs = window.KV_ORGS || {};
    var cats = events.map(function (e) { return e.category; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; }).sort();
    var uid = "cal" + Math.random().toString(36).slice(2, 7);

    el.innerHTML =
      '<div class="cal">' +
        '<div class="min0">' +
          '<div class="cal__filters">' +
            '<label class="sr-only" for="' + uid + '-org">Organization</label>' +
            '<div class="select"><select id="' + uid + '-org" data-f="org"><option value="">Organizations</option>' +
              Object.keys(orgs).filter(function (k) { return events.some(function (e) { return e.org === k; }); }).map(function (k) { return '<option value="' + k + '">' + esc(orgs[k].name) + "</option>"; }).join("") + '</select></div>' +
            '<label class="sr-only" for="' + uid + '-cat">Category</label>' +
            '<div class="select"><select id="' + uid + '-cat" data-f="cat"><option value="">Category</option>' + cats.map(function (c) { return '<option>' + esc(c) + "</option>"; }).join("") + '</select></div>' +
            '<button class="icon-btn" type="button" data-clear aria-label="Clear filters" title="Clear filters"><img src="assets/icons/filter.svg" alt="" width="23" height="23"></button>' +
            '<button class="icon-btn" type="button" data-today aria-label="Go to the next upcoming event" title="Next upcoming event"><img src="assets/icons/dots.svg" alt="" width="19" height="19" style="width:19px;height:19px"></button>' +
          '</div>' +
          '<div class="cal__board">' +
            '<div class="cal__head">' +
              '<div class="cal__month"><h3 aria-live="polite" data-title></h3>' +
                '<button class="cal__nav" type="button" data-prev aria-label="Previous"><img src="assets/icons/arrow-left.svg" alt="" width="12" height="24" style="transform:rotate(180deg)"></button>' +
                '<img src="assets/icons/calendar.svg" alt="" width="24" height="24">' +
                '<button class="cal__nav" type="button" data-next aria-label="Next"><img src="assets/icons/arrow-right.svg" alt="" width="12" height="24"></button>' +
              '</div>' +
              '<div class="cal__views" role="group" aria-label="View"><button type="button" data-view="day" aria-pressed="false">Day</button><button type="button" data-view="week" aria-pressed="false">Week</button><button type="button" data-view="month" aria-pressed="true">Month</button></div>' +
            '</div>' +
            '<div data-body></div>' +
          '</div>' +
        '</div>' +
        '<aside class="cal__side" aria-label="Upcoming events">' +
          '<h3 data-side-title>Upcoming Events</h3><hr class="divider">' +
          '<div class="cal__list" data-list></div>' +
        '</aside>' +
      '</div>';

    function filtered() {
      return events.filter(function (e) { return (!st.org || e.org === st.org) && (!st.cat || e.category === st.cat); });
    }
    function on(dayIso) { return filtered().filter(function (e) { return e.date === dayIso; }); }
    function anchor() { return st.sel ? parse(st.sel) : new Date(st.y, st.m, 1); }

    function draw() {
      var body = $("[data-body]", el);
      $$("[data-view]", el).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.view === st.view)); });
      var todayIso = iso(new Date());
      if (st.view === "month") {
        $("[data-title]", el).textContent = MONTHS[st.m] + (st.y !== new Date().getFullYear() ? " " + st.y : "");
        var first = new Date(st.y, st.m, 1);
        var offset = (first.getDay() + 6) % 7;
        var gridStart = new Date(st.y, st.m, 1 - offset);
        var daysInMonth = new Date(st.y, st.m + 1, 0).getDate();
        var cells = Math.ceil((offset + daysInMonth) / 7) * 7;
        var html = '<div class="cal__dow" aria-hidden="true">' + DOW.map(function (d) { return "<span>" + d + "</span>"; }).join("") + '</div><div class="cal__grid">';
        for (var i = 0; i < cells; i++) {
          var d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
          var di = iso(d), evs = on(di), out = d.getMonth() !== st.m;
          var dots = evs.slice(0, 2).map(function (e) { return '<span class="cal__dot" style="background:' + orgOf(e).color + '"></span>'; }).join("") + (evs.length > 2 ? '<span class="cal__more">+' + (evs.length - 2) + "</span>" : "");
          html += '<button type="button" class="cal__day' + (out ? " is-out" : "") + (di === todayIso ? " is-today" : "") + (st.sel === di ? " is-selected" : "") + '" data-day="' + di + '" aria-label="' + longDate(di) + (evs.length ? ", " + evs.length + " event" + (evs.length > 1 ? "s" : "") : "") + '"' + (st.sel === di ? ' aria-pressed="true"' : "") + '>' +
            "<span>" + d.getDate() + '</span><span class="cal__dots">' + dots + "</span></button>";
        }
        body.innerHTML = html + "</div>";
      } else {
        var a = anchor();
        var days = [];
        if (st.view === "week") {
          var monday = new Date(a.getFullYear(), a.getMonth(), a.getDate() - ((a.getDay() + 6) % 7));
          for (var k = 0; k < 7; k++) days.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + k));
          $("[data-title]", el).textContent = "Week of " + days[0].getDate() + " " + MONTHS[days[0].getMonth()].slice(0, 3);
        } else {
          days.push(a);
          $("[data-title]", el).textContent = a.getDate() + " " + MONTHS[a.getMonth()];
        }
        var all = filtered();
        body.innerHTML = '<div class="cal__week">' + days.map(function (d) {
          var di = iso(d), evs = on(di);
          return '<div class="cal__weekrow"><b>' + DOW[(d.getDay() + 6) % 7] + " " + d.getDate() + '</b><div class="stack" style="--gap:8px">' +
            (evs.length ? evs.map(function (e) { return '<button type="button" class="cal__event" data-ev="' + all.indexOf(e) + '">' + badge(e) + '<span><b>' + esc(e.title) + "</b><span>" + esc(orgOf(e).name) + "</span></span></button>"; }).join("") : '<span class="small muted">No events</span>') +
            "</div></div>";
        }).join("") + "</div>";
        bindEventButtons(body, all);
      }
      $$("[data-day]", body).forEach(function (b) {
        b.addEventListener("click", function () {
          st.sel = st.sel === b.dataset.day ? null : b.dataset.day;
          var d = parse(b.dataset.day);
          if (d.getMonth() !== st.m) { st.y = d.getFullYear(); st.m = d.getMonth(); }
          draw();
        });
      });
      drawList();
    }

    function drawList() {
      var all = filtered();
      var list;
      if (st.sel) {
        list = all.filter(function (e) { return e.date === st.sel; });
        $("[data-side-title]", el).textContent = "Events on " + longDate(st.sel);
      } else {
        var from = iso(new Date(st.y, st.m, 1)), todayIso = iso(new Date());
        if (todayIso > from && todayIso.slice(0, 7) === from.slice(0, 7)) from = todayIso;
        list = all.filter(function (e) { return e.date >= from; });
        $("[data-side-title]", el).textContent = "Upcoming Events";
      }
      var html = "", last = "";
      list.forEach(function (e) {
        if (e.date !== last) { html += '<p class="cal__date">' + longDate(e.date) + "</p>"; last = e.date; }
        html += '<button type="button" class="cal__event" data-ev="' + all.indexOf(e) + '">' + badge(e) + "<span><b>" + esc(e.title) + "</b><span>" + esc(orgOf(e).name) + "</span></span></button>";
      });
      if (!list.length) html = '<p class="cal__empty">No events' + (st.sel ? " on this day" : "") + (st.org || st.cat ? " for these filters" : "") + ".</p>";
      if (st.sel) html += '<button type="button" class="btn btn--outline btn--sm" data-showall style="margin-top:14px;align-self:center">Show all upcoming</button>';
      var box = $("[data-list]", el);
      box.innerHTML = html;
      bindEventButtons(box, all);
      var sa = $("[data-showall]", box); if (sa) sa.addEventListener("click", function () { st.sel = null; draw(); });
    }

    $("[data-prev]", el).addEventListener("click", function () { step(-1); });
    $("[data-next]", el).addEventListener("click", function () { step(1); });
    function step(dir) {
      if (st.view === "month") { st.m += dir; if (st.m < 0) { st.m = 11; st.y--; } if (st.m > 11) { st.m = 0; st.y++; } st.sel = null; }
      else {
        var a = anchor(); var n = new Date(a.getFullYear(), a.getMonth(), a.getDate() + dir * (st.view === "week" ? 7 : 1));
        st.sel = iso(n); st.y = n.getFullYear(); st.m = n.getMonth();
      }
      draw();
    }
    $$("[data-view]", el).forEach(function (b) { b.addEventListener("click", function () { st.view = b.dataset.view; if (st.view !== "month" && !st.sel) { var f = filtered().filter(function (e) { return e.date >= iso(new Date(st.y, st.m, 1)); })[0]; st.sel = f ? f.date : iso(new Date(st.y, st.m, 1)); } draw(); }); });
    $$("[data-f]", el).forEach(function (s) { s.addEventListener("change", function () { st[s.dataset.f] = s.value; draw(); }); });
    $("[data-clear]", el).addEventListener("click", function () { st.org = ""; st.cat = ""; st.sel = null; $$("[data-f]", el).forEach(function (s) { s.value = ""; }); draw(); });
    $("[data-today]", el).addEventListener("click", function () {
      var today = iso(new Date());
      var next = filtered().filter(function (e) { return e.date >= today; })[0] || filtered()[filtered().length - 1];
      if (!next) return;
      var d = parse(next.date); st.y = d.getFullYear(); st.m = d.getMonth(); st.sel = next.date; draw();
    });
    draw();
  }

  function mountUpcoming(el) {
    var limit = parseInt(el.dataset.limit, 10) || 3;
    var org = el.dataset.org;
    var today0 = iso(new Date());
    var events = expandEvents().filter(function (e) { return (!org || e.org === org) && e.date >= today0; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, limit);
    el.innerHTML = '<div class="grid" style="--min:240px">' + events.map(function (e, i) {
      return '<button type="button" class="cal__event" data-ev="' + i + '">' + badge(e) + "<span><b>" + esc(e.title) + "</b><span>" + longDate(e.date) + " · " + esc(orgOf(e).name) + "</span></span></button>";
    }).join("") + "</div>";
    bindEventButtons(el, events);
  }

  /* ---------------- boot ---------------- */
  renderHeader();
  renderFooter();
  window.addEventListener("hashchange", render);
  render();
  window.KV = { toast: toast, openModal: openModal, render: render };
})();
