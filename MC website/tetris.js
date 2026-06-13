/* daedalOS-clone/tetris.js — Tetris game engine */

var TetrisGame = (function() {
  var COLS = 10, ROWS = 20, BLOCK = 28, PBLOCK = 20;
  var colors = ['#00e5ff','#ffeb3b','#aa00ff','#00e676','#ff1744','#2979ff','#ff9100'];
  var pieces = [
    { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], c: 0 },
    { shape: [[1,1],[1,1]], c: 1 },
    { shape: [[0,1,0],[1,1,1],[0,0,0]], c: 2 },
    { shape: [[0,1,1],[1,1,0],[0,0,0]], c: 3 },
    { shape: [[1,1,0],[0,1,1],[0,0,0]], c: 4 },
    { shape: [[1,0,0],[1,1,1],[0,0,0]], c: 5 },
    { shape: [[0,0,1],[1,1,1],[0,0,0]], c: 6 }
  ];
  var scores = [100, 300, 500, 800];

  var uid = '', state = null, rafId = null, lastDrop = 0, dropInterval = 800;
  var active = false;

  function setup(appEl) {
    uid = appEl.id.replace('tetris-app-', '');
    active = true;

    state = {
      board: Array.from({length: ROWS}, function() { return new Array(COLS).fill(0); }),
      pieceIdx: -1,
      piece: null,
      px: 0,
      py: 0,
      nextIdx: -1,
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      paused: false
    };

    nextPiece();
    spawnPiece();
    updateUI();
    getEl('overlay').style.display = 'none';
    lastDrop = performance.now();
    dropInterval = 800;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);

    // Restart button
    var restartBtn = getEl('restart');
    if (restartBtn) {
      restartBtn.onclick = function() { reset(); };
    }
  }

  function reset() {
    state.board = Array.from({length: ROWS}, function() { return new Array(COLS).fill(0); });
    state.pieceIdx = -1;
    state.piece = null;
    state.px = 0;
    state.py = 0;
    state.nextIdx = -1;
    state.score = 0;
    state.lines = 0;
    state.level = 1;
    state.gameOver = false;
    state.paused = false;
    nextPiece();
    spawnPiece();
    updateUI();
    getEl('overlay').style.display = 'none';
    lastDrop = performance.now();
    dropInterval = 800;
    active = true;
  }

  function stop() {
    active = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function getEl(name) {
    return document.getElementById('tetris-' + name + '-' + uid);
  }

  function nextPiece() {
    var n = state.nextIdx;
    state.pieceIdx = n >= 0 ? n : Math.floor(Math.random() * 7);
    state.piece = pieces[state.pieceIdx].shape;
    state.nextIdx = Math.floor(Math.random() * 7);
  }

  function spawnPiece() {
    nextPiece();
    state.px = Math.floor((COLS - state.piece[0].length) / 2);
    state.py = 0;
    if (collides(state.piece, state.px, state.py)) state.gameOver = true;
  }

  function collides(s, ox, oy) {
    for (var r = 0; r < s.length; r++) {
      for (var c = 0; c < s[r].length; c++) {
        if (!s[r][c]) continue;
        var x = ox + c, y = oy + r;
        if (x < 0 || x >= COLS || y >= ROWS) return true;
        if (y < 0) continue;
        if (state.board[y][x]) return true;
      }
    }
    return false;
  }

  function move(dx, dy) {
    if (!collides(state.piece, state.px + dx, state.py + dy)) {
      state.px += dx;
      state.py += dy;
      return true;
    }
    return false;
  }

  function rotateCW(s) {
    var rows = s.length, cols = s[0].length, rot = [];
    for (var c = 0; c < cols; c++) {
      rot[c] = [];
      for (var r = rows - 1; r >= 0; r--) {
        rot[c][rows - 1 - r] = s[r][c];
      }
    }
    return rot;
  }

  function tryRotate() {
    if (state.pieceIdx === 1) return;
    var r = rotateCW(state.piece);
    if (!collides(r, state.px, state.py)) { state.piece = r; return; }
    var kicks = [-1, 1, -2, 2];
    for (var i = 0; i < kicks.length; i++) {
      if (!collides(r, state.px + kicks[i], state.py)) { state.piece = r; state.px += kicks[i]; return; }
    }
    if (!collides(r, state.px, state.py - 1)) { state.piece = r; state.py--; }
  }

  function hardDrop() {
    while (move(0, 1)) {}
    lock();
  }

  function lock() {
    var s = state.piece;
    for (var r = 0; r < s.length; r++) {
      for (var c = 0; c < s[r].length; c++) {
        if (!s[r][c]) continue;
        var y = state.py + r, x = state.px + c;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          state.board[y][x] = state.pieceIdx + 1;
        }
      }
    }
    clearLines();
    spawnPiece();
    updateUI();
  }

  function clearLines() {
    var cleared = 0;
    for (var r = ROWS - 1; r >= 0; r--) {
      if (state.board[r].every(function(v) { return v !== 0; })) {
        state.board.splice(r, 1);
        state.board.unshift(new Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }
    if (cleared > 0) {
      state.lines += cleared;
      state.score += scores[cleared - 1] * state.level;
      state.level = Math.floor(state.lines / 10) + 1;
      dropInterval = Math.max(50, 800 - (state.level - 1) * 70);
    }
  }

  function updateUI() {
    var se = getEl('score'), le = getEl('lines'), ve = getEl('level');
    if (se) se.textContent = state.score;
    if (le) le.textContent = state.lines;
    if (ve) ve.textContent = state.level;
    drawPreview();
    drawBoard();
    if (state.gameOver) {
      var ov = getEl('overlay'), sf = getEl('final'), ms = getEl('msg'), ph = getEl('hint'), rb = getEl('restart');
      if (ov) ov.style.display = 'flex';
      if (ms) ms.textContent = 'GAME OVER';
      if (sf) sf.textContent = 'Final Score: ' + state.score;
      if (ph) ph.textContent = '';
      if (rb) rb.style.display = '';
    }
  }

  function updatePauseUI() {
    var ov = getEl('overlay'), ms = getEl('msg'), sf = getEl('final'), ph = getEl('hint'), rb = getEl('restart');
    if (state.paused) {
      if (ov) ov.style.display = 'flex';
      if (ms) ms.textContent = 'PAUSED';
      if (sf) sf.textContent = '';
      if (ph) ph.textContent = 'Press P to resume';
      if (rb) rb.style.display = 'none';
    } else {
      if (ov) ov.style.display = 'none';
      lastDrop = performance.now();
    }
  }

  function drawBlock(ctx, x, y, s, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillRect(x + 1, y + 1, s - 2, 3);
    ctx.fillRect(x + 1, y + 1, 3, s - 2);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(x + 1, y + s - 4, s - 2, 3);
    ctx.fillRect(x + s - 4, y + 1, 3, s - 2);
  }

  function drawBoard() {
    var cv = getEl('board');
    if (!cv) return;
    var ctx = cv.getContext('2d'), b = BLOCK, w = COLS * b, h = ROWS * b;
    cv.width = w; cv.height = h;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#1a1a3a';
    ctx.lineWidth = 0.5;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        ctx.strokeRect(c * b, r * b, b, b);
      }
    }
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (state.board[r][c]) {
          drawBlock(ctx, c * b, r * b, b, colors[state.board[r][c] - 1]);
        }
      }
    }
    if (!state.gameOver && state.piece) {
      var gy = state.py;
      while (!collides(state.piece, state.px, gy + 1)) gy++;
      var s = state.piece;
      for (var r = 0; r < s.length; r++) {
        for (var c = 0; c < s[r].length; c++) {
          if (!s[r][c]) continue;
          var cx = (state.px + c) * b, cy = (gy + r) * b;
          if (cy >= 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.10)';
            ctx.fillRect(cx + 1, cy + 1, b - 2, b - 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.22)';
            ctx.strokeRect(cx + 1, cy + 1, b - 2, b - 2);
          }
        }
      }
      var clr = colors[state.pieceIdx];
      for (var r = 0; r < s.length; r++) {
        for (var c = 0; c < s[r].length; c++) {
          if (!s[r][c]) continue;
          var cx = (state.px + c) * b, cy = (state.py + r) * b;
          if (cy >= 0) drawBlock(ctx, cx, cy, b, clr);
        }
      }
    }
  }

  function drawPreview() {
    var cv = getEl('next');
    if (!cv) return;
    var ctx = cv.getContext('2d'), b = PBLOCK;
    var s = pieces[state.nextIdx].shape;
    var w = s[0].length * b, h = s.length * b;
    cv.width = w; cv.height = h;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);
    var clr = colors[state.nextIdx];
    for (var r = 0; r < s.length; r++) {
      for (var c = 0; c < s[r].length; c++) {
        if (s[r][c]) drawBlock(ctx, c * b, r * b, b, clr);
      }
    }
  }

  function loop(ts) {
    if (!active) return;
    if (state.paused || state.gameOver) {
      drawBoard();
      rafId = requestAnimationFrame(loop);
      return;
    }
    if (ts - lastDrop >= dropInterval) {
      if (!move(0, 1)) lock();
      lastDrop = ts;
    }
    drawBoard();
    rafId = requestAnimationFrame(loop);
  }

  function togglePause() {
    state.paused = !state.paused;
    updatePauseUI();
  }

  // ── Keyboard handler ─────────────────────────────────
  document.addEventListener('keydown', function(e) {
    if (!active) return;
    var win = document.getElementById('window-tetris');
    if (!win || win.style.display === 'none' || !win.classList.contains('focused')) return;
    var target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    if (e.key === 'p' || e.key === 'P') { togglePause(); e.preventDefault(); return; }
    if (state.gameOver || state.paused) return;
    switch (e.key) {
      case 'ArrowLeft': move(-1, 0); e.preventDefault(); break;
      case 'ArrowRight': move(1, 0); e.preventDefault(); break;
      case 'ArrowDown': if (move(0, 1)) state.score += 1; lastDrop = performance.now(); e.preventDefault(); break;
      case 'ArrowUp': tryRotate(); e.preventDefault(); break;
      case ' ': hardDrop(); e.preventDefault(); break;
    }
    drawBoard();
  });

  return { setup: setup, stop: stop, reset: reset };
})();
