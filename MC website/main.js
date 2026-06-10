/* daedalOS-clone/main.js — Startup, start menu, search, global events */

var StartMenu = (function() {
  var menu, overlay;
  var open = false;

  function init() {
    menu = document.getElementById('start-menu');
    overlay = document.createElement('div');
    overlay.id = 'desktop-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:99998';
    overlay.addEventListener('mousedown', function() { hide(); });
    document.getElementById('desktop').appendChild(overlay);

    document.getElementById('btn-start').addEventListener('click', function(e) {
      e.stopPropagation();
      toggle();
    });
  }

  function toggle() {
    open = !open;
    menu.classList.toggle('open', open);
    overlay.style.display = open ? 'block' : 'none';
    document.getElementById('search-box').classList.remove('open');
  }

  function hide() {
    open = false;
    menu.classList.remove('open');
    overlay.style.display = 'none';
  }

  return { init: init, toggle: toggle, hide: hide };
})();

var Search = (function() {
  var box, input, results;
  var open = false;

  function init() {
    box = document.getElementById('search-box');
    input = document.getElementById('search-input');
    results = document.getElementById('search-results');

    document.getElementById('btn-search').addEventListener('click', function(e) {
      e.stopPropagation();
      toggle();
    });

    input.addEventListener('input', function() {
      doSearch();
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { e.preventDefault(); hide(); }
    });
  }

  function toggle() {
    open = !open;
    box.classList.toggle('open', open);
    StartMenu.hide();
    if (open) {
      setTimeout(function() { input.focus(); }, 50);
    }
  }

  function hide() {
    open = false;
    box.classList.remove('open');
    results.innerHTML = '';
    input.value = '';
  }

  function doSearch() {
    var q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ''; return; }
    var matches = [];
    var seen = {};
    // Search apps
    Object.keys(APPS).forEach(function(k) {
      if (APPS[k].title.toLowerCase().indexOf(q) !== -1 && !seen[k]) {
        matches.push({ id: k, title: APPS[k].title, icon: APPS[k].icon });
        seen[k] = true;
      }
    });
    // Search desktop icons
    var desktopIcons = Desktop.find ? [] : [];
    // (icons are managed by Desktop module)
    results.innerHTML = matches.map(function(m) {
      return '<div class="search-result" data-id="' + m.id + '">' +
        '<span style="display:inline-flex;align-items:center;gap:6px">' +
        iconSVG(m.icon, 16) + ' ' + m.title +
        '</span></div>';
    }).join('');

    results.querySelectorAll('.search-result').forEach(function(r) {
      r.addEventListener('mousedown', function(e) {
        e.preventDefault();
        var id = r.getAttribute('data-id');
        hide();
        if (APPS[id]) WindowManager.open(id, APPS[id].title);
      });
    });
  }

  return { init: init, toggle: toggle, hide: hide };
})();

/* === GLOBAL INIT === */
(function() {
  var VERSION = '6-newicons';
  var currentVersion = localStorage.getItem('daedalOS-version');
  if (currentVersion !== VERSION) {
    localStorage.clear();
    localStorage.setItem('daedalOS-version', VERSION);
  }

  Desktop.init();
  WindowManager.open = WindowManager.open;
  WindowManager.close = WindowManager.close;
  WindowManager.getWindows = WindowManager.getWindows;
  Clock.init();
  StartMenu.init();
  Search.init();

  // Global click to close panels
  document.addEventListener('click', function(e) {
    var target = e.target;
    // Don't close if clicking inside panels or taskbar buttons
    if (target.closest('#start-menu') || target.closest('#btn-start')) return;
    if (target.closest('#search-box') || target.closest('#btn-search')) return;
    if (target.closest('#calendar-popup') || target.closest('#tray')) return;
    if (target.closest('#context-menu')) return;

    StartMenu.hide();
    Search.hide();
    document.getElementById('calendar-popup').classList.remove('open');
    document.getElementById('context-menu').style.display = 'none';
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      StartMenu.hide();
      Search.hide();
      document.getElementById('calendar-popup').classList.remove('open');
      document.getElementById('context-menu').style.display = 'none';
    }
  });

  console.log('Science Portfolio Desktop ready');
  console.log('Based on daedalOS by DustinBrett/daedalOS');
})();

window._showLightbox = function(src) {
  var m = document.createElement('div');
  m.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;cursor:default';
  m.innerHTML = '<img src="' + src + '" style="max-width:90vw;max-height:90vh;border-radius:4px;box-shadow:0 4px 40px rgba(0,0,0,.8)" onclick="event.stopPropagation()"><span style="position:fixed;top:16px;right:24px;color:#fff;font-size:28px;cursor:default;z-index:1" onclick="this.parentElement.remove()">&#x2715;</span>';
  m.onclick = function() { m.remove(); };
  document.body.appendChild(m);
};

var CURSOR_NAMES = {default:'Default',rocket:'Rocket',atom:'Atom',lightning:'Lightning',star:'Star',heart:'Heart',crosshair:'Crosshair'};

var CURSOR_DATA = [
  { id: 'default',  name: 'Default',   svg: '', hx: 0, hy: 0 },
  { id: 'rocket',   name: 'Rocket',    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1l-5 11 5 6 5-11z" fill="#ff6600" stroke="#fff" stroke-width=".6"/><rect x="9" y="16" width="6" height="5" rx="1.5" fill="#ccc"/><path d="M8 20l-3 4m14-4l3 4" stroke="#ffaa00" stroke-width="1" stroke-linecap="round"/></svg>', hx: 12, hy: 1 },
  { id: 'atom',     name: 'Atom',       svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="#00f0ff"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#00f0ff" stroke-width="1"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#00f0ff" stroke-width="1" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#00f0ff" stroke-width="1" transform="rotate(-60 12 12)"/></svg>', hx: 12, hy: 12 },
  { id: 'lightning',name: 'Lightning',  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 1L6 13h5l-2 10 10-13h-5z" fill="#ffd700" stroke="#ffaa00" stroke-width=".5"/></svg>', hx: 10, hy: 1 },
  { id: 'star',     name: 'Star',       svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1l3 8h8l-6.5 5 2.5 8-7-5-7 5 2.5-8L1 9h8z" fill="#ff00aa" stroke="#ffaa88" stroke-width=".4"/></svg>', hx: 12, hy: 12 },
  { id: 'heart',    name: 'Heart',      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C5 16 0 11 0 7.5 0 4.5 2.5 2 5.5 2c2 0 3.5 1 4.5 2l2 3 2-3c1-1 2.5-2 4.5-2 3 0 5.5 2.5 5.5 5.5C24 11 19 16 12 22z" fill="#ff1744" stroke="#ff5252" stroke-width=".3"/></svg>', hx: 12, hy: 12 },
  { id: 'crosshair',name: 'Crosshair',  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#00f0ff" stroke-width="1.5"/><line x1="12" y1="2" x2="12" y2="8" stroke="#00f0ff" stroke-width="1.5"/><line x1="12" y1="16" x2="12" y2="22" stroke="#00f0ff" stroke-width="1.5"/><line x1="2" y1="12" x2="8" y2="12" stroke="#00f0ff" stroke-width="1.5"/><line x1="16" y1="12" x2="22" y2="12" stroke="#00f0ff" stroke-width="1.5"/></svg>', hx: 12, hy: 12 }
];

window._setCursor = function(id) {
  var c = null;
  for (var i = 0; i < CURSOR_DATA.length; i++) {
    if (CURSOR_DATA[i].id === id) { c = CURSOR_DATA[i]; break; }
  }
  if (!c) return;
  var style = document.getElementById('cursor-override-style');
  if (id === 'default') {
    if (style) { style.remove(); style = null; }
    document.body.style.cursor = '';
  } else {
    if (!style) {
      style = document.createElement('style');
      style.id = 'cursor-override-style';
      document.head.appendChild(style);
    }
    var encoded = encodeURIComponent(c.svg);
    var val = 'url(data:image/svg+xml,' + encoded + ') ' + c.hx + ' ' + c.hy + ', auto';
    style.textContent = '*,*::before,*::after{cursor:' + val + ' !important}input,textarea{cursor:text !important}';
  }
  var label = document.getElementById('cursor-label');
  if (label) label.textContent = 'Current: ' + c.name;
};
