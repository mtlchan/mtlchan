/* daedalOS-clone/window-manager.js — Window Manager with 8-edge resize, drag, z-order, persistence */

var WindowManager = (function() {
  var windows = {};
  var zCounter = 10;
  var openCount = 0;
  var TASKBAR_HEIGHT = 30;

  var RESIZE_HANDLES = ['top','bottom','left','right','topLeft','topRight','bottomLeft','bottomRight'];
  var CURSORS = {top:'ns-resize',bottom:'ns-resize',left:'ew-resize',right:'ew-resize',topLeft:'nwse-resize',topRight:'nesw-resize',bottomLeft:'nesw-resize',bottomRight:'nwse-resize'};

  var STYLE = {
    top: 'top:-3px;left:0;right:0;height:6px;cursor:ns-resize',
    bottom: 'bottom:-3px;left:0;right:0;height:6px;cursor:ns-resize',
    left: 'left:-3px;top:0;bottom:0;width:6px;cursor:ew-resize',
    right: 'right:-3px;top:0;bottom:0;width:6px;cursor:ew-resize',
    topLeft: 'top:-3px;left:-3px;width:12px;height:12px;cursor:nwse-resize',
    topRight: 'top:-3px;right:-3px;width:12px;height:12px;cursor:nesw-resize',
    bottomLeft: 'bottom:-3px;left:-3px;width:12px;height:12px;cursor:nesw-resize',
    bottomRight: 'bottom:-3px;right:-3px;width:12px;height:12px;cursor:nwse-resize'
  };

  function restoreWindowStates() {
    try {
      var saved = JSON.parse(localStorage.getItem('daedalOS-window-states') || '{}');
      return saved;
    } catch(e) { return {}; }
  }

  function saveWindowStates() {
    var states = {};
    Object.keys(windows).forEach(function(id) {
      if (windows[id].el && windows[id].el.parentNode) {
        states[id] = {
          position: windows[id].position,
          size: windows[id].size,
          maximized: windows[id].maximized
        };
      }
    });
    try { localStorage.setItem('daedalOS-window-states', JSON.stringify(states)); } catch(e) {}
  }

  function cascadePosition() {
    var offset = 30;
    var x = 80 + (openCount * offset) % (window.innerWidth - 400);
    var y = 30 + (openCount * offset) % (window.innerHeight - 300);
    openCount++;
    return { x: Math.max(0, x), y: Math.max(0, y) };
  }

  function open(id, title) {
    if (windows[id] && windows[id].el && windows[id].el.parentNode) {
      if (windows[id].minimized) restore(id);
      else bringToFront(id);
      return;
    }

    var savedStates = restoreWindowStates();
    var saved = savedStates[id] || {};
    var pos = saved.position || cascadePosition();
    var size = saved.size || { width: 560, height: 380 };
    var maximized = saved.maximized !== undefined ? saved.maximized : true;

    var win = document.createElement('div');
    win.className = 'window focused';
    if (maximized) win.classList.add('maximized');
    win.id = 'window-' + id;
    win.style.zIndex = ++zCounter;
    win.style.left = maximized ? '0' : pos.x + 'px';
    win.style.top = maximized ? '0' : pos.y + 'px';
    win.style.width = maximized ? '100%' : size.width + 'px';
    win.style.height = maximized ? 'calc(100% - ' + TASKBAR_HEIGHT + 'px)' : size.height + 'px';

    var app = APPS[id] || { content: '' };
    var content = typeof app.content === 'function' ? app.content.call(app) : (app.content || '');
    content = content.replace(/\{\{id\}\}/g, id);

    var progBar = Gamify.isSubject(id) ? Gamify.getProgressBarHTML(id) : '';

    win.innerHTML = '<div class="window-titlebar handle">' +
      '<span>' + (title || app.title || id) + '</span>' +
      '<button class="minimize" title="Minimize">&minus;</button>' +
      '<button class="maximize" title="Maximize">&#x25A1;</button>' +
      '<button class="close" title="Close">&#x2715;</button>' +
      '</div><div class="window-body">' + progBar + content + '</div>';

    // Add resize handles
    RESIZE_HANDLES.forEach(function(dir) {
      var handle = document.createElement('div');
      handle.className = 'resize-handle ' + dir;
      handle.style.cssText = STYLE[dir];
      handle.setAttribute('data-dir', dir);
      handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        startResize(id, dir, e);
      });
      win.appendChild(handle);
    });

    document.getElementById('desktop').appendChild(win);

    if (progBar) setTimeout(function() { Gamify.initProgress(id); }, 10);

    // Wire up titlebar buttons
    var buttons = win.querySelectorAll('.window-titlebar button');
    buttons[0].addEventListener('click', function(e) { e.stopPropagation(); minimize(id); });
    buttons[1].addEventListener('click', function(e) { e.stopPropagation(); toggleMaximize(id); });
    buttons[2].addEventListener('click', function(e) { e.stopPropagation(); close(id); });

    // Titlebar drag
    var titlebar = win.querySelector('.window-titlebar');
    titlebar.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') return;
      if (windows[id] && windows[id].maximized) return;
      e.preventDefault();
      startDrag(id, e);
    });

    // Focus on click
    win.addEventListener('mousedown', function() {
      bringToFront(id);
    });

    windows[id] = {
      el: win,
      title: title || app.title || id,
      position: pos,
      size: size,
      minimized: false,
      maximized: maximized,
      savedRect: maximized ? { position: pos, size: size } : null
    };

    addTab(id, windows[id].title);

    // Setup Paint canvas if needed
    if (id === 'paint') {
      setTimeout(function() {
        var appEl = win.querySelector('[id^="paint-app-"]');
        if (!appEl) return;
        setupPaintApp(appEl);
      }, 100);
    }

    // Setup Binary Game if needed
    if (id === 'binaryGame') {
      setTimeout(function() {
        var appEl = win.querySelector('[id^="binary-game-"]');
        if (!appEl) return;
        setupBinaryGame(appEl);
      }, 100);
    }

    // Setup Tetris if needed
    if (id === 'tetris') {
      setTimeout(function() {
        var appEl = win.querySelector('[id^="tetris-app-"]');
        if (!appEl) return;
        win.querySelector('.window-body').style.overflow = 'hidden';
        win.style.width = '430px';
        win.style.height = '640px';
        windows[id].size = { width: 430, height: 640 };
        TetrisGame.setup(appEl);
      }, 100);
    }
  }

  function openCustom(id, title, content) {
    if (windows[id] && windows[id].el && windows[id].el.parentNode) {
      bringToFront(id);
      return;
    }
    var win = document.createElement('div');
    win.className = 'window focused';
    win.id = 'window-' + id;
    win.style.zIndex = ++zCounter;
    var pos = cascadePosition();
    win.style.left = pos.x + 'px';
    win.style.top = pos.y + 'px';
    win.style.width = '400px';
    win.style.height = '300px';
    win.innerHTML = '<div class="window-titlebar handle"><span>' + title + '</span>' +
      '<button class="minimize">&minus;</button><button class="maximize">&#x25A1;</button><button class="close">&#x2715;</button>' +
      '</div><div class="window-body">' + content + '</div>';

    RESIZE_HANDLES.forEach(function(dir) {
      var handle = document.createElement('div');
      handle.className = 'resize-handle ' + dir;
      handle.style.cssText = STYLE[dir];
      handle.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); startResize(id, dir, e); });
      win.appendChild(handle);
    });

    document.getElementById('desktop').appendChild(win);
    var btns = win.querySelectorAll('.window-titlebar button');
    btns[0].addEventListener('click', function(e) { e.stopPropagation(); minimize(id); });
    btns[1].addEventListener('click', function(e) { e.stopPropagation(); toggleMaximize(id); });
    btns[2].addEventListener('click', function(e) { e.stopPropagation(); close(id); });
    win.querySelector('.window-titlebar').addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      startDrag(id, e);
    });
    win.addEventListener('mousedown', function() { bringToFront(id); });

    windows[id] = { el: win, title: title, position: pos, size: { width: 400, height: 300 }, minimized: false, maximized: false };
    addTab(id, title);
  }

  function bringToFront(id) {
    if (!windows[id] || !windows[id].el) return;
    windows[id].el.style.zIndex = ++zCounter;
    document.querySelectorAll('.window.focused').forEach(function(w) {
      if (w !== windows[id].el) w.classList.remove('focused');
    });
    windows[id].el.classList.add('focused');
    // Update tabs
    document.querySelectorAll('.window-tab').forEach(function(t) { t.classList.remove('active'); });
    var tab = document.getElementById('tab-' + id);
    if (tab) tab.classList.add('active');
  }

  function minimize(id) {
    if (!windows[id] || !windows[id].el) return;
    windows[id].el.style.display = 'none';
    windows[id].minimized = true;
    var tab = document.getElementById('tab-' + id);
    if (tab) tab.classList.add('minimized');
    saveWindowStates();
  }

  function restore(id) {
    if (!windows[id] || !windows[id].el) return;
    windows[id].el.style.display = '';
    windows[id].minimized = false;
    var tab = document.getElementById('tab-' + id);
    if (tab) tab.classList.remove('minimized');
    bringToFront(id);
  }

  function toggleMaximize(id) {
    if (!windows[id] || !windows[id].el) return;
    var win = windows[id].el;
    if (windows[id].maximized) {
      // Restore
      var rect = windows[id].savedRect || { position: { x: 100, y: 40 }, size: { width: 560, height: 380 } };
      win.style.left = rect.position.x + 'px';
      win.style.top = rect.position.y + 'px';
      win.style.width = rect.size.width + 'px';
      win.style.height = rect.size.height + 'px';
      win.classList.remove('maximized');
      windows[id].maximized = false;
      windows[id].position = rect.position;
      windows[id].size = rect.size;
      win.querySelector('.window-titlebar button.maximize').innerHTML = '&#x25A1;';
      // Re-enable resize handles
      win.querySelectorAll('.resize-handle').forEach(function(h) { h.style.display = ''; });
    } else {
      // Maximize
      var currentRect = win.getBoundingClientRect();
      windows[id].savedRect = {
        position: { x: parseInt(win.style.left) || currentRect.left, y: parseInt(win.style.top) || currentRect.top },
        size: { width: parseInt(win.style.width) || currentRect.width, height: parseInt(win.style.height) || currentRect.height }
      };
      win.style.left = '0';
      win.style.top = '0';
      win.style.width = '100%';
      win.style.height = 'calc(100% - ' + TASKBAR_HEIGHT + 'px)';
      win.classList.add('maximized');
      windows[id].maximized = true;
      win.querySelector('.window-titlebar button.maximize').innerHTML = '&#x2750;';
      win.querySelectorAll('.resize-handle').forEach(function(h) { h.style.display = 'none'; });
    }
    saveWindowStates();
  }

  function closeWindow(id) {
    if (!windows[id]) return;
    if (id === 'tetris' && typeof TetrisGame !== 'undefined') TetrisGame.stop();
    if (windows[id].el && windows[id].el.parentNode) windows[id].el.remove();
    var tab = document.getElementById('tab-' + id);
    if (tab) tab.remove();
    delete windows[id];
    saveWindowStates();
  }

  function addTab(id, title) {
    var tabs = document.getElementById('window-tabs');
    var existing = document.getElementById('tab-' + id);
    if (existing) {
      existing.classList.remove('minimized');
      return;
    }
    var tab = document.createElement('div');
    tab.className = 'window-tab active';
    tab.id = 'tab-' + id;
    tab.textContent = title;
    tab.title = title;
    tab.addEventListener('click', function(e) {
      e.stopPropagation();
      if (windows[id]) {
        if (windows[id].minimized) restore(id);
        else bringToFront(id);
      }
    });
    tab.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Simple right-click: close
      if (confirm('Close "' + title + '"?')) closeWindow(id);
    });
    tabs.appendChild(tab);
  }

  /* === DRAG === */
  function startDrag(id, e) {
    if (!windows[id] || !windows[id].el) return;
    var win = windows[id].el;
    var rect = win.getBoundingClientRect();
    var offsetX = e.clientX - rect.left;
    var offsetY = e.clientY - rect.top;

    bringToFront(id);

    function move(ev) {
      var x = ev.clientX - offsetX;
      var y = ev.clientY - offsetY;
      var maxX = window.innerWidth - 166;
      var maxY = window.innerHeight - TASKBAR_HEIGHT - 30;
      x = Math.max(-166 + 50, Math.min(maxX, x));
      y = Math.max(0, Math.min(maxY, y));
      win.style.left = x + 'px';
      win.style.top = y + 'px';
    }

    function up() {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      // Save position
      if (windows[id]) {
        windows[id].position = {
          x: parseInt(win.style.left) || 0,
          y: parseInt(win.style.top) || 0
        };
        saveWindowStates();
      }
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  /* === 8-EDGE RESIZE === */
  function startResize(id, dir, e) {
    if (!windows[id] || !windows[id].el || windows[id].maximized) return;
    var win = windows[id].el;
    var rect = win.getBoundingClientRect();
    var startX = e.clientX;
    var startY = e.clientY;
    var startLeft = rect.left;
    var startTop = rect.top;
    var startWidth = rect.width;
    var startHeight = rect.height;
    var MIN_W = 166, MIN_H = 70;

    bringToFront(id);

    function move(ev) {
      var dx = ev.clientX - startX;
      var dy = ev.clientY - startY;
      var newLeft = startLeft, newTop = startTop;
      var newWidth = startWidth, newHeight = startHeight;

      if (dir.indexOf('right') !== -1) newWidth = Math.max(MIN_W, startWidth + dx);
      if (dir.indexOf('left') !== -1) {
        newWidth = Math.max(MIN_W, startWidth - dx);
        newLeft = startLeft + startWidth - newWidth;
      }
      if (dir.indexOf('bottom') !== -1) newHeight = Math.max(MIN_H, startHeight + dy);
      if (dir.indexOf('top') !== -1) {
        newHeight = Math.max(MIN_H, startHeight - dy);
        newTop = startTop + startHeight - newHeight;
      }

      // Prevent going above screen
      if (newTop < 0) { newHeight += newTop; newTop = 0; }
      if (newHeight < MIN_H) return;

      win.style.left = newLeft + 'px';
      win.style.top = newTop + 'px';
      win.style.width = newWidth + 'px';
      win.style.height = newHeight + 'px';
    }

    function up() {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      if (windows[id]) {
        windows[id].position = {
          x: parseInt(win.style.left) || 0,
          y: parseInt(win.style.top) || 0
        };
        windows[id].size = {
          width: parseInt(win.style.width) || startWidth,
          height: parseInt(win.style.height) || startHeight
        };
        saveWindowStates();
      }
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  function close(id) {
    closeWindow(id);
  }

  /* === PAINT APP === */
  function setupPaintApp(appEl) {
    var uid = appEl.id.replace('paint-app-', '');
    var canvas = document.getElementById('paint-canvas-' + uid);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var state = {
      tool: 'pencil',
      color: '#000000',
      size: 1,
      drawing: false,
      startX: 0,
      startY: 0,
      snapshot: null
    };

    // Expose clear for the clear button
    window._paintClear = function(id) {
      if (id === uid) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Tool buttons
    var toolBtns = appEl.querySelectorAll('.paint-tool');
    toolBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toolBtns.forEach(function(b) { b.style.background = 'transparent'; b.style.borderColor = 'transparent'; });
        btn.style.background = 'hsla(0,0%,100%,.15)';
        btn.style.borderColor = '#555';
        state.tool = btn.getAttribute('data-tool');
      });
    });

    // Size buttons
    var sizeBtns = appEl.querySelectorAll('.paint-size');
    sizeBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        sizeBtns.forEach(function(b) { b.style.borderColor = 'transparent'; });
        btn.style.borderColor = '#00f0ff';
        state.size = parseInt(btn.getAttribute('data-size'));
      });
    });

    // Color buttons
    var colorBtns = appEl.querySelectorAll('.paint-color');
    colorBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        colorBtns.forEach(function(b) { b.style.border = '1px solid #555'; });
        btn.style.border = '2px solid #00f0ff';
        state.color = btn.getAttribute('data-color');
      });
    });

    function getPos(e) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function saveSnapshot() {
      state.snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function restoreSnapshot() {
      if (state.snapshot) ctx.putImageData(state.snapshot, 0, 0);
    }

    function startDraw(e) {
      e.preventDefault();
      e.stopPropagation();
      state.drawing = true;
      var pos = getPos(e);
      state.startX = pos.x;
      state.startY = pos.y;

      if (state.tool === 'pencil' || state.tool === 'eraser') {
        saveSnapshot();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.strokeStyle = state.tool === 'eraser' ? '#ffffff' : state.color;
        ctx.lineWidth = state.tool === 'eraser' ? state.size * 3 : state.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      } else if (state.tool === 'line' || state.tool === 'rect') {
        saveSnapshot();
      }
    }

    function moveDraw(e) {
      if (!state.drawing) return;
      var pos = getPos(e);

      if (state.tool === 'pencil' || state.tool === 'eraser') {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (state.tool === 'line' || state.tool === 'rect') {
        restoreSnapshot();
        ctx.beginPath();
        ctx.strokeStyle = state.color;
        ctx.lineWidth = state.size;
        ctx.lineCap = 'round';

        if (state.tool === 'line') {
          ctx.moveTo(state.startX, state.startY);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        } else if (state.tool === 'rect') {
          var w = pos.x - state.startX;
          var h = pos.y - state.startY;
          ctx.strokeRect(state.startX, state.startY, w, h);
        }
      }
    }

    function endDraw() {
      if (!state.drawing) return;
      state.drawing = false;

      if (state.tool === 'pencil' || state.tool === 'eraser') {
        ctx.closePath();
      }
    }

    function fillAt(x, y) {
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;
      var w = canvas.width;
      var h = canvas.height;

      var startIdx = (Math.floor(y) * w + Math.floor(x)) * 4;
      var startR = data[startIdx];
      var startG = data[startIdx + 1];
      var startB = data[startIdx + 2];

      // Parse target color
      var tc = state.color;
      var targetR = parseInt(tc.substr(1,2), 16);
      var targetG = parseInt(tc.substr(3,2), 16);
      var targetB = parseInt(tc.substr(5,2), 16);

      if (startR === targetR && startG === targetG && startB === targetB) return;

      var stack = [[Math.floor(x), Math.floor(y)]];
      var visited = {};
      var tol = 2;

      while (stack.length > 0) {
        var p = stack.pop();
        var px = p[0], py = p[1];
        if (px < 0 || px >= w || py < 0 || py >= h) continue;
        var key = px + ',' + py;
        if (visited[key]) continue;
        visited[key] = true;

        var idx = (py * w + px) * 4;
        var dr = Math.abs(data[idx] - startR);
        var dg = Math.abs(data[idx+1] - startG);
        var db = Math.abs(data[idx+2] - startB);

        if (dr <= tol && dg <= tol && db <= tol) {
          data[idx] = targetR;
          data[idx+1] = targetG;
          data[idx+2] = targetB;
          data[idx+3] = 255;
          stack.push([px+1, py], [px-1, py], [px, py+1], [px, py-1]);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    canvas.addEventListener('mousedown', function(e) {
      e.stopPropagation();
      if (state.tool === 'fill') {
        var pos = getPos(e);
        fillAt(pos.x, pos.y);
        return;
      }
      startDraw(e);
    });

    canvas.addEventListener('mousemove', moveDraw);

    document.addEventListener('mouseup', endDraw);
  }

  /* === BINARY GAME === */
  function setupBinaryGame(appEl) {
    var uid = appEl.id.replace('binary-game-', '');
    var score = 0, time = 60, bitCount = 4, bitValues = [], timer = null, gameOver = false, target;
    var elTarget = document.getElementById('bg-target-' + uid);
    var elHint = document.getElementById('bg-hint-' + uid);
    var elBits = document.getElementById('bg-bits-' + uid);
    var elCheck = document.getElementById('bg-check-' + uid);
    var elScore = document.getElementById('bg-score-' + uid);
    var elTime = document.getElementById('bg-time-' + uid);
    var elLevel = document.getElementById('bg-level-' + uid);
    var elFeedback = document.getElementById('bg-feedback-' + uid);

    function calcLevel() { if (score < 50) return 4; if (score < 120) return 5; if (score < 220) return 6; if (score < 350) return 7; return 8; }
    function updateLevel() { bitCount = calcLevel() + 3; elLevel.textContent = bitCount - 3; }
    function randomTarget() { var max = (1 << bitCount) - 1; return Math.floor(Math.random() * max) + 1; }

    function newRound() {
      bitValues = [];
      for (var i = 0; i < bitCount; i++) bitValues.push(0);
      target = randomTarget();
      elHint.style.display = 'none';
      render();
    }

    function render() {
      elTarget.textContent = target;
      elHint.textContent = target + ' = ' + target.toString(2);
      elBits.innerHTML = '';
      for (var i = 0; i < bitCount; i++) {
        var pwr = 1 << (bitCount - 1 - i);
        var col = document.createElement('div');
        col.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:3px';
        var lbl = document.createElement('div');
        lbl.style.cssText = 'color:#555;font-size:10px;font-weight:600;font-family:Consolas,monospace';
        lbl.textContent = pwr;
        col.appendChild(lbl);
        var b = document.createElement('div');
        b.className = 'bit-box' + (bitValues[i] ? ' on' : '');
        b.textContent = bitValues[i];
        b.setAttribute('data-idx', i);
        b.addEventListener('click', function() {
          if (gameOver) return;
          var j = parseInt(this.getAttribute('data-idx'));
          bitValues[j] = bitValues[j] ? 0 : 1;
          this.textContent = bitValues[j];
          if (bitValues[j]) this.classList.add('on'); else this.classList.remove('on');
        });
        col.appendChild(b);
        elBits.appendChild(col);
      }
    }

    function calcValue() {
      var v = 0;
      for (var i = 0; i < bitCount; i++) if (bitValues[i]) v += 1 << (bitCount - 1 - i);
      return v;
    }

    function checkAnswer() {
      if (gameOver) return;
      var val = calcValue();
      var boxes = elBits.querySelectorAll('.bit-box');
      if (val === target) {
        score += 10;
        elScore.textContent = score;
        elFeedback.innerHTML = '<span style="color:#4caf50">Correct! +10</span>';
        boxes.forEach(function(b) { b.classList.add('correct'); });
        updateLevel();
        setTimeout(function() { newRound(); elFeedback.innerHTML = ''; }, 600);
      } else {
        elHint.style.display = '';
        elFeedback.innerHTML = '<span style="color:#f44336">Wrong — the answer is shown above</span>';
        boxes.forEach(function(b) { b.classList.add('wrong'); setTimeout(function() { b.classList.remove('wrong'); }, 400); });
      }
    }

    function tick() {
      if (gameOver) return;
      time--;
      elTime.textContent = time;
      if (time <= 5) elTime.style.color = '#f44336';
      if (time <= 0) endGame();
    }

    function endGame() {
      gameOver = true;
      if (timer) { clearInterval(timer); timer = null; }
      elCheck.disabled = true;
      elCheck.style.opacity = '0.5';
      elCheck.style.cursor = 'default';
      elFeedback.innerHTML = '<div style="color:#ffd700;font-size:18px;font-weight:700;margin-bottom:8px">Game Over!</div><div style="color:#ccc;font-size:14px">Final Score: ' + score + '</div>';
      var restartBtn = document.createElement('button');
      restartBtn.textContent = 'Play Again';
      restartBtn.style.cssText = 'margin-top:10px;padding:10px 28px;background:linear-gradient(135deg,#ff00aa,#cc0088);border:none;border-radius:8px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:1px';
      restartBtn.addEventListener('click', function() {
        score = 0; time = 60; gameOver = false; bitCount = 4;
        elTime.style.color = '#ff00aa';
        elScore.textContent = '0'; elTime.textContent = '60'; elLevel.textContent = '1';
        elFeedback.innerHTML = '';
        elCheck.disabled = false; elCheck.style.opacity = ''; elCheck.style.cursor = '';
        restartBtn.remove();
        timer = setInterval(tick, 1000);
        newRound();
      });
      elFeedback.appendChild(restartBtn);
    }

    elCheck.addEventListener('click', checkAnswer);
    newRound();
    timer = setInterval(tick, 1000);
  }

  return {
    open: open,
    openCustom: openCustom,
    close: close,
    bringToFront: bringToFront,
    getWindows: function() { return windows; }
  };
})();
