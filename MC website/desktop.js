/* daedalOS-clone/desktop.js — Desktop Icon System */

var Desktop = (function() {
  var ICON_GRID, START_LIST, CTX_MENU, DRAG_CLONE;
  var selectedIds = [];
  var iconData = [];
  var renameTarget = null;
  var dragData = null;
  var contextSubMenuTimer = null;

  var DEFAULT_ICONS = [
    { id: 'tetris', name: 'Tetris', icon: 'tetris', appId: 'tetris', type: 'app' },
    { id: 'cursors', name: 'Cursors', icon: 'cursor', appId: 'cursors', type: 'app' },
    { id: 'biology-folder', name: 'Biology', icon: 'dna', appId: 'biology-folder', type: 'folder' },
    { id: 'uk-field-trip', name: 'UK Field Trip', icon: 'trowel', appId: 'uk-field-trip', type: 'folder' },
    { id: 'chemistry-folder', name: 'Chemistry', icon: 'flask', appId: 'chemistry-folder', type: 'folder' },
    { id: 'physics-folder', name: 'Physics', icon: 'atom', appId: 'physics-folder', type: 'folder' },
    { id: 'cs-folder', name: 'Computer Science', icon: 'terminal', appId: 'cs-folder', type: 'folder' },
    { id: 'cv', name: 'CV', icon: 'cv', appId: 'cv', type: 'app' },
    { id: 'binaryGame', name: "Mr Chan's Binary Game", icon: 'binaryGame', appId: 'binaryGame', type: 'app' },
    { id: 'extra-curricular', name: 'Extra-curricular', icon: 'rocket', appId: 'extra-curricular', type: 'folder' }
  ];

  function loadPositions() {
    try {
      var saved = JSON.parse(localStorage.getItem('daedalOS-icon-positions') || '{}');
      // Filter out positions for icons that still exist
      var valid = {};
      var ids = iconData.map(function(d) { return d.id; });
      Object.keys(saved).forEach(function(k) {
        if (ids.indexOf(k) !== -1) valid[k] = saved[k];
      });
      return valid;
    } catch(e) { return {}; }
  }

  function savePositions() {
    var positions = {};
    iconData.forEach(function(d) {
      if (d.pos) positions[d.id] = d.pos;
    });
    try { localStorage.setItem('daedalOS-icon-positions', JSON.stringify(positions)); } catch(e) {}
  }

  function loadIconData() {
    try {
      var saved = JSON.parse(localStorage.getItem('daedalOS-icons') || 'null');
      if (saved && saved.length) {
        iconData = saved;
        return;
      }
    } catch(e) {}
    iconData = DEFAULT_ICONS.map(function(d) { return Object.assign({}, d); });
  }

  function saveIconData() {
    var toSave = iconData.map(function(d) {
      return { id: d.id, name: d.name, icon: d.icon, appId: d.appId, type: d.type, pos: d.pos };
    });
    try { localStorage.setItem('daedalOS-icons', JSON.stringify(toSave)); } catch(e) {}
  }

  function renderIcon(icon) {
    var div = document.createElement('div');
    div.className = 'icon';
    div.setAttribute('data-id', icon.id);
    if (icon.type === 'folder') div.setAttribute('data-folder', 'true');
    div.innerHTML = '<div class="icon-img">' + iconSVG(icon.icon, 64) + '</div><span>' + escHTML(icon.name) + '</span>';

    div.addEventListener('mousedown', function(e) {
      if (e.button !== 0) return;
      if (renameTarget) return;
      var isCtrl = e.ctrlKey || e.metaKey;

      if (!isCtrl) {
        if (selectedIds.indexOf(icon.id) === -1) {
          deselectAll();
          selectOne(icon.id);
        }
      } else {
        toggleSelect(icon.id);
      }

      // Start potential drag
      var startX = e.clientX, startY = e.clientY;
      var startTime = Date.now();
      var dragged = false;
      var origPos = { row: icon.pos.row, col: icon.pos.col };

      function onMove(ev) {
        if (dragged) return moveDrag(ev);
        var dx = ev.clientX - startX, dy = ev.clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5 || Date.now() - startTime > 150) {
          dragged = true;
          startDrag(icon, ev);
        }
      }

      function onUp(ev) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (dragged) endDrag(icon, ev, origPos);
      }

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    div.addEventListener('dblclick', function(e) {
      if (renameTarget) return;
      if (icon.appId) {
        WindowManager.open(icon.appId, APPS[icon.appId] ? APPS[icon.appId].title : icon.name);
      }
    });

    div.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      deselectAll();
      selectOne(icon.id);
      showContextMenu(e.clientX, e.clientY, [
        { label: 'Open', action: function() {
          if (icon.appId) WindowManager.open(icon.appId, APPS[icon.appId] ? APPS[icon.appId].title : icon.name);
        }},
        { sep: true },
        { label: 'Rename', shortcut: 'F2', action: function() { startRename(icon.id); }},
        { label: 'Delete', shortcut: 'Del', action: function() { deleteIcons([icon.id]); }},
        { sep: true },
        { label: 'Properties', action: function() {
          WindowManager.openCustom('Properties — ' + icon.name, 'properties',
            '<div style="color:#ccc;line-height:2.2"><div><b>Name:</b> ' + escHTML(icon.name) + '</div><div><b>Type:</b> ' + (icon.type || 'App') + '</div><div><b>App ID:</b> ' + (icon.appId || 'none') + '</div><div><b>Position:</b> row ' + (icon.pos ? icon.pos.row : '?') + ', col ' + (icon.pos ? icon.pos.col : '?') + '</div></div>');
        }}
      ]);
    });

    return div;
  }

  function assignAllPositions() {
    var positions = loadPositions();
    var used = {};
    // First pass: use saved positions
    iconData.forEach(function(d) {
      var saved = positions[d.id];
      if (saved && saved.row !== undefined && !used[saved.row + ',' + saved.col]) {
        d.pos = { row: saved.row, col: saved.col };
        used[saved.row + ',' + saved.col] = true;
      } else {
        d.pos = null;
      }
    });
    // Second pass: assign positions to any without one
    var col = 0, row = 0;
    iconData.forEach(function(d) {
      if (!d.pos) {
        while (used[row + ',' + col]) {
          col++;
          if (col > 40) { col = 0; row++; }
        }
        d.pos = { row: row, col: col };
        used[row + ',' + col] = true;
      }
    });
    // New tetris icon: swap to (0,0) if it has no saved position
    var savedTetris = positions['tetris'];
    if (!savedTetris) {
      var tetris = findIcon('tetris');
      if (tetris && tetris.pos && (tetris.pos.row !== 0 || tetris.pos.col !== 0)) {
        var at00 = null;
        for (var i = 0; i < iconData.length; i++) {
          if (iconData[i].id !== 'tetris' && iconData[i].pos && iconData[i].pos.row === 0 && iconData[i].pos.col === 0) {
            at00 = iconData[i]; break;
          }
        }
        if (at00) {
          var tp = tetris.pos;
          tetris.pos = { row: 0, col: 0 };
          at00.pos = tp;
        }
      }
    }
  }

  function renderAll() {
    ICON_GRID.innerHTML = '';
    assignAllPositions();
    iconData.sort(function(a, b) {
      if (a.pos.row !== b.pos.row) return a.pos.row - b.pos.row;
      return a.pos.col - b.pos.col;
    });
    iconData.forEach(function(d) {
      ICON_GRID.appendChild(renderIcon(d));
    });
    savePositions();
    renderStartMenu();
  }

  function findIcon(id) {
    for (var i = 0; i < iconData.length; i++) {
      if (iconData[i].id === id) return iconData[i];
    }
    return null;
  }

  function findIconIndex(id) {
    for (var i = 0; i < iconData.length; i++) {
      if (iconData[i].id === id) return i;
    }
    return -1;
  }

  function selectOne(id) {
    selectedIds = [id];
    updateSelection();
  }

  function toggleSelect(id) {
    var idx = selectedIds.indexOf(id);
    if (idx !== -1) selectedIds.splice(idx, 1);
    else selectedIds.push(id);
    updateSelection();
  }

  function deselectAll() {
    selectedIds = [];
    updateSelection();
  }

  function updateSelection() {
    var el = document.querySelectorAll('#icon-grid .icon');
    el.forEach(function(e) {
      var id = e.getAttribute('data-id');
      if (selectedIds.indexOf(id) !== -1) e.classList.add('selected');
      else e.classList.remove('selected');
    });
  }

  function startRename(id) {
    var el = document.querySelector('#icon-grid .icon[data-id="' + id + '"]');
    if (!el) return;
    var span = el.querySelector('span');
    var name = findIcon(id).name;
    renameTarget = id;
    span.style.display = 'none';
    var input = document.createElement('input');
    input.className = 'rename';
    input.value = name;
    input.setAttribute('spellcheck', 'false');
    el.appendChild(input);
    input.focus();
    input.select();

    function finish(save) {
      if (renameTarget !== id) return;
      var newName = input.value.trim();
      if (save && newName && newName !== name) {
        var icon = findIcon(id);
        icon.name = newName;
        saveIconData();
      }
      input.remove();
      span.style.display = '';
      span.textContent = findIcon(id).name;
      renameTarget = null;
      renderStartMenu();
    }

    input.addEventListener('blur', function() { finish(true); });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
    });
  }

  function deleteIcons(ids) {
    ids.forEach(function(id) {
      var idx = findIconIndex(id);
      if (idx !== -1) iconData.splice(idx, 1);
    });
    selectedIds = [];
    saveIconData();
    savePositions();
    renderAll();
  }

  function newFolder() {
    var num = 1;
    var baseName = 'New folder';
    while (findIcon('folder-' + num)) num++;
    var id = 'folder-' + num;
    var name = baseName + (num > 1 ? ' (' + num + ')' : '');
    iconData.push({ id: id, name: name, icon: 'folder_new', appId: null, type: 'folder', pos: null });
    saveIconData();
    renderAll();
    setTimeout(function() { startRename(id); }, 50);
  }

  function newTextFile() {
    var num = 1;
    var baseName = 'New Text Document';
    while (findIcon('text-' + num)) num++;
    var id = 'text-' + num;
    var name = baseName + (num > 1 ? ' (' + num + ')' : '') + '.txt';
    iconData.push({ id: id, name: name, icon: 'txt', appId: 'textedit', type: 'file', pos: null });
    saveIconData();
    renderAll();
    setTimeout(function() { startRename(id); }, 50);
  }

  /* === DRAG === */
  function startDrag(icon, e) {
    dragData = { id: icon.id, icon: icon, startX: e.clientX, startY: e.clientY, origPos: { row: icon.pos.row, col: icon.pos.col } };
    var el = document.querySelector('#icon-grid .icon[data-id="' + icon.id + '"]');
    if (el) el.classList.add('dragging');
    DRAG_CLONE.style.display = 'block';
    DRAG_CLONE.innerHTML = '<div style="text-align:center">' + iconSVG(icon.icon, 64) + '<div style="color:#fff;font-size:12px;text-shadow:0 1px 2px #000">' + escHTML(icon.name) + '</div></div>';
  }

  function moveDrag(e) {
    if (!dragData) return;
    DRAG_CLONE.style.left = (e.clientX - 60) + 'px';
    DRAG_CLONE.style.top = (e.clientY - 64) + 'px';
    // Highlight nearest grid cell
    document.querySelectorAll('.drop-target').forEach(function(el) { el.classList.remove('drop-target'); });
    var grid = ICON_GRID;
    var rect = grid.getBoundingClientRect();
    var col = Math.round((e.clientX - rect.left) / 100);
    var row = Math.round((e.clientY - rect.top) / 98);
    if (col >= 0 && row >= 0) {
      var existing = document.querySelector('#icon-grid .icon[style*="grid-row:' + (row+1) + '"][style*="grid-column:' + (col+1) + '"]');
      if (!existing || existing.getAttribute('data-id') === dragData.id) {
        // Can't highlight grid cells directly; highlight an existing icon instead
      }
    }
  }

  function endDrag(icon, e, origPos) {
    if (!dragData) return;
    DRAG_CLONE.style.display = 'none';
    var el = document.querySelector('#icon-grid .icon[data-id="' + icon.id + '"]');
    if (el) el.classList.remove('dragging');

    var grid = ICON_GRID;
    var rect = grid.getBoundingClientRect();
    var col = Math.max(0, Math.round((e.clientX - rect.left) / 120));
    var row = Math.max(0, Math.round((e.clientY - rect.top) / 128));

    // Reorder: find the icon that would be at (row, col) and insert before/after it
    var targetIndex = -1;
    for (var i = 0; i < iconData.length; i++) {
      if (iconData[i].id !== icon.id) {
        var ip = iconData[i].pos;
        if (ip.row > row || (ip.row === row && ip.col >= col)) {
          targetIndex = i;
          break;
        }
      }
    }
    if (targetIndex === -1) targetIndex = iconData.length;

    var oldIndex = findIconIndex(icon.id);
    if (oldIndex !== targetIndex && oldIndex !== targetIndex - 1) {
      if (oldIndex < targetIndex) targetIndex--;
      iconData.splice(oldIndex, 1);
      iconData.splice(targetIndex, 0, icon);
      // Reassign sequential positions
      iconData.forEach(function(d, idx) {
        d.pos = { row: Math.floor(idx / 20), col: idx % 20 };
      });
      saveIconData();
      savePositions();
      renderAll();
    }
    dragData = null;
  }

  /* === CONTEXT MENU === */
  function showContextMenu(x, y, items) {
    CTX_MENU.innerHTML = '';
    CTX_MENU.style.display = 'block';
    items.forEach(function(item) {
      if (item.sep) {
        CTX_MENU.appendChild(el('div', 'ctx-sep'));
        return;
      }
      var div = el('div', 'ctx-item' + (item.disabled ? ' disabled' : '') + (item.sub ? ' ctx-sub' : ''));
      div.textContent = item.label;
      if (item.shortcut) div.appendChild(el('span', 'shortcut', item.shortcut));
      if (item.sub) {
        var sub = el('div', 'ctx-sub-menu');
        item.sub.forEach(function(si) {
          if (si.sep) { sub.appendChild(el('div', 'ctx-sep')); return; }
          var sd = el('div', 'ctx-item');
          sd.textContent = si.label;
          sd.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); hideContextMenu(); si.action(); });
          sub.appendChild(sd);
        });
        div.appendChild(sub);
      }
      if (!item.sub) {
        div.addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopPropagation();
          hideContextMenu();
          if (item.action) item.action();
        });
      }
      CTX_MENU.appendChild(div);
    });

    // Position
    var mx = x, my = y;
    var mw = CTX_MENU.offsetWidth || 180;
    var mh = CTX_MENU.offsetHeight || 200;
    if (mx + mw > window.innerWidth) mx = window.innerWidth - mw - 4;
    if (my + mh > window.innerHeight) my = window.innerHeight - mh - 4;
    CTX_MENU.style.left = mx + 'px';
    CTX_MENU.style.top = my + 'px';

    setTimeout(function() {
      document.addEventListener('mousedown', hideContextMenu, { once: true });
      document.addEventListener('keydown', function(e) { if (e.key === 'Escape') hideContextMenu(); }, { once: true });
    }, 0);
  }

  function hideContextMenu() {
    CTX_MENU.style.display = 'none';
  }

  function showDesktopContextMenu(x, y) {
    var sortItems = [
      { label: 'Name', action: function() { sortIcons('name'); }},
      { label: 'Size', action: function() { sortIcons('size'); }},
      { label: 'Item type', action: function() { sortIcons('type'); }},
      { label: 'Date modified', action: function() { sortIcons('date'); }}
    ];

    showContextMenu(x, y, [
      { label: 'Sort by', sub: sortItems },
      { label: 'Refresh', action: function() { renderAll(); }},
      { sep: true },
      { label: 'New', sub: [
        { label: 'Folder', action: function() { newFolder(); }},
        { sep: true },
        { label: 'Text Document', action: function() { newTextFile(); }}
      ]},
      (selectedIds.length > 0 ? { sep: true } : null),
      (selectedIds.length > 0 ? { label: 'Delete', action: function() { deleteIcons(selectedIds.slice()); }} : null),
      (selectedIds.length === 1 ? { label: 'Rename', shortcut: 'F2', action: function() { startRename(selectedIds[0]); }} : null)
    ].filter(Boolean));
  }

  function sortIcons(by) {
    if (by === 'name') {
      iconData.sort(function(a, b) { return a.name.localeCompare(b.name); });
    } else if (by === 'type') {
      iconData.sort(function(a, b) { return (a.type||'').localeCompare(b.type||''); });
    }
    // Reassign sequential positions
    iconData.forEach(function(d, i) {
      d.pos = { row: Math.floor(i / 20), col: i % 20 };
    });
    saveIconData();
    savePositions();
    renderAll();
  }

  /* === START MENU === */
  function renderStartMenu() {
    START_LIST.innerHTML = '';
    var appIcons = iconData.filter(function(d) { return d.appId && APPS[d.appId]; });
    appIcons.forEach(function(d) {
      var div = el('div', 'start-item');
      div.innerHTML = '<div class="start-item-icon">' + iconSVG(d.icon, 24) + '</div>' + escHTML(d.name);
      div.addEventListener('mousedown', function(e) {
        e.preventDefault();
        StartMenu.hide();
        WindowManager.open(d.appId, APPS[d.appId].title);
      });
      START_LIST.appendChild(div);
    });

    START_LIST.appendChild(el('div', 'start-sep', ''));
    var sep2 = el('div', 'start-item');
    sep2.innerHTML = '<div class="start-item-icon">' + iconSVG('folder', 24) + '</div>Documents';
    START_LIST.appendChild(sep2);
    var sep3 = el('div', 'start-item');
    sep3.innerHTML = '<div class="start-item-icon">' + iconSVG('photo', 24) + '</div>Pictures';
    START_LIST.appendChild(sep3);
    START_LIST.appendChild(el('div', 'start-sep', ''));
    var power = el('div', 'start-item');
    power.innerHTML = '<div class="start-item-icon"><svg width="24" height="24" viewBox="0 0 48 48"><circle cx="24" cy="24" r="8" fill="none" stroke="#f44336" stroke-width="2"/><line x1="24" y1="4" x2="24" y2="18" stroke="#f44336" stroke-width="2"/></svg></div><span style="color:#f44336">Power</span>';
    power.addEventListener('mousedown', function(e) {
      e.preventDefault();
      StartMenu.hide();
      if (confirm('Clear all session data?')) {
        localStorage.clear();
        location.reload();
      }
    });
    START_LIST.appendChild(power);
  }

  function el(tag, cls, text) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (text) d.textContent = text;
    return d;
  }

  function escHTML(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function init() {
    ICON_GRID = document.getElementById('icon-grid');
    START_LIST = document.getElementById('start-list');
    CTX_MENU = document.getElementById('context-menu');
    DRAG_CLONE = document.getElementById('drag-clone');

    loadIconData();
    // Ensure all default icons exist, inserting at correct order
    DEFAULT_ICONS.forEach(function(di, idx) {
      if (findIcon(di.id)) return;
      var insIdx = 0;
      for (var i = 0; i < idx; i++) {
        var found = findIcon(DEFAULT_ICONS[i].id);
        if (found) insIdx = iconData.indexOf(found) + 1;
      }
      iconData.splice(insIdx, 0, Object.assign({}, di));
    });
    saveIconData();
    renderAll();

    // Desktop right-click
    document.getElementById('icon-grid').addEventListener('contextmenu', function(e) {
      if (e.target === ICON_GRID || e.target.id === 'desktop') {
        e.preventDefault();
        showDesktopContextMenu(e.clientX, e.clientY);
      }
    });

    // Click empty area to deselect
    ICON_GRID.addEventListener('mousedown', function(e) {
      if (e.target === ICON_GRID) {
        if (e.button === 0) deselectAll();
        hideContextMenu();
      }
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (renameTarget) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'F2' && selectedIds.length === 1) {
        e.preventDefault();
        startRename(selectedIds[0]);
      } else if (e.key === 'Delete' && selectedIds.length > 0) {
        e.preventDefault();
        deleteIcons(selectedIds.slice());
      } else if (e.key === 'F5') {
        e.preventDefault();
        renderAll();
      } else if (e.key === 'Escape') {
        deselectAll();
        hideContextMenu();
      }
    });

    // Global click to close context menu
    document.addEventListener('mousedown', function(e) {
      if (!CTX_MENU.contains(e.target)) hideContextMenu();
    });
  }

  return {
    init: init,
    renderAll: renderAll,
    deselectAll: deselectAll,
    getSelected: function() { return selectedIds; },
    find: findIcon,
    deleteIcons: deleteIcons
  };
})();
