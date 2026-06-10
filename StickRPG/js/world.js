function World() {
  this.currentArea = null;
  this.currentAreaName = 'downtown';
  this.transitionTimer = 0;
  this.portalPulse = 0;
  this.areas = AREAS;
  this.currentArea = this.areas[this.currentAreaName];
}

World.prototype.transitionTo = function(areaName, spawnX, spawnY) {
  if (!this.areas[areaName]) return;
  if (this.transitionTimer > 0) return;
  this.currentAreaName = areaName;
  this.currentArea = this.areas[areaName];
  this.transitionTimer = 0.3;
  return { x: spawnX, y: spawnY };
};

World.prototype.update = function(dt) {
  if (this.transitionTimer > 0) {
    this.transitionTimer -= dt;
  }
  this.portalPulse += dt * 3;
};

World.prototype.render = function(ctx, canvas) {
  var area = this.currentArea;
  ctx.fillStyle = area.backgroundColor;
  ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);

  for (var i = 0; i < area.buildings.length; i++) {
    var b = area.buildings[i];
    if (b.type === 'ground' || !b.type) {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      if (b.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
      }
    } else if (b.type === 'landmark') {
      this.drawLandmark(ctx, b);
    } else if (b.type === 'doorway') {
      this.drawDoorway(ctx, b);
    } else if (b.type === 'furniture') {
      this.drawFurniture(ctx, b);
    } else {
      this.drawDetailedBuilding(ctx, b, canvas);
    }
  }

  this.renderPortalMarkers(ctx);
  this.renderNPCs(ctx);
};

World.prototype.drawDoorway = function(ctx, b) {
  var x = b.x, y = b.y, w = b.w, h = b.h;

  ctx.fillStyle = b.wallColor || '#5D3A1A';
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#333333';
  ctx.fillRect(x + 6, y + 4, w - 12, h - 4);

  ctx.fillStyle = b.doorColor || '#2E1A0A';
  ctx.fillRect(x + 10, y + 6, w - 20, h - 6);

  ctx.fillStyle = '#ffdd44';
  ctx.beginPath();
  ctx.arc(x + w - 18, y + h / 2 + 2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = b.doorColor || '#2E1A0A';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x + 16, y + h / 2 + 3);
  ctx.lineTo(x + w - 24, y + h / 2 + 3);
  ctx.stroke();

  if (b.label) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(b.label, x + w / 2, y - 4);
  }
};

World.prototype.drawFurniture = function(ctx, b) {
  var x = b.x, y = b.y, w = b.w, h = b.h;
  var ft = b.furnType || 'generic';

  if (ft === 'bed') {
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x + 4, y + h - 14, w - 8, 14);
    ctx.fillStyle = '#A08050';
    ctx.fillRect(x, y + 4, 6, h - 4);
    ctx.fillRect(x + w - 6, y + 4, 6, h - 4);
    ctx.fillRect(x, y, w, 6);
    ctx.fillStyle = '#4A7BC8';
    ctx.fillRect(x + 8, y + 8, w - 16, h - 18);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 12, y + 6, w * 0.35, 8);
    ctx.strokeStyle = '#CCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 12, y + 6, w * 0.35, 8);

  } else if (ft === 'nightstand') {
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + w * 0.3, y + h * 0.35, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#444';
    ctx.fillRect(x + w * 0.2, y + h * 0.7, w * 0.6, 2);

  } else if (ft === 'rug') {
    ctx.fillStyle = b.color;
    var rx = x + 4, ry = y + 2, rw = w - 8, rh = h - 4;
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeStyle = this.darken(b.color, 0.25);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx, ry, rw, rh);
    ctx.fillStyle = this.darken(b.color, 0.15);
    ctx.fillRect(rx + 10, ry + 3, rw - 20, rh - 6);
    ctx.strokeStyle = this.darken(b.color, 0.3);
    ctx.strokeRect(rx + 10, ry + 3, rw - 20, rh - 6);

  } else if (ft === 'board') {
    ctx.fillStyle = '#2E5A2E';
    ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
    ctx.strokeStyle = '#6B4226';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(x, y, w, 4);
    ctx.fillRect(x, y + h - 4, w, 4);
    ctx.fillRect(x, y, 4, h);
    ctx.fillRect(x + w - 4, y, 4, h);
    if (b.detail) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.detail, x + w / 2, y + h / 2);
    }

  } else if (ft === 'desk') {
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(x + 5, y + h * 0.6, w - 10, 8);
    ctx.fillStyle = '#7B5236';
    ctx.fillRect(x + 5, y, w - 10, h * 0.6);
    ctx.fillStyle = '#5B3216';
    ctx.fillRect(x + 2, y + h * 0.7, 6, h * 0.3);
    ctx.fillRect(x + w - 8, y + h * 0.7, 6, h * 0.3);

  } else if (ft === 'shelf') {
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(x, y, w, h);
    var shelves = b.shelves || 4;
    for (var s = 1; s < shelves; s++) {
      var sy = y + (h * s / shelves);
      ctx.fillStyle = '#5B3216';
      ctx.fillRect(x + 2, sy - 2, w - 4, 4);
    }
    if (b.books) {
      var colors = ['#cc4444', '#4444cc', '#44cc44', '#cccc44', '#cc44cc'];
      for (var bk = 0; bk < b.books; bk++) {
        var seed = bk * 2654435761;
        var bkW = 6 + ((seed % 80) / 10);
        var bkH = 14 + (((seed * 7) % 80) / 10);
        var shelfRow = Math.floor(bk / 5);
        var slot = bk % 5;
        var bkX = x + 6 + slot * 12;
        var bkY = y + 8 + shelfRow * (h / shelves);
        if (bkY + bkH > y + h - 2) bkH = (y + h - 2) - bkY;
        ctx.fillStyle = colors[bk % colors.length];
        ctx.fillRect(bkX, bkY, bkW, bkH);
      }
    }

  } else if (ft === 'counter') {
    ctx.fillStyle = '#5D3A1A';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#7B5236';
    ctx.fillRect(x, y, w, h * 0.85);
    ctx.fillStyle = '#8B6236';
    ctx.fillRect(x + 4, y + 4, w - 8, 5);
    if (b.detail === 'bottles') {
      for (var bl = 0; bl < 6; bl++) {
        var bx = x + 10 + bl * (w - 24) / 5;
        ctx.fillStyle = ['#4B8', '#A54', '#88F', '#DAA'][bl % 4];
        ctx.fillRect(bx, y + 10, 5, 14);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(bx, y + 8, 5, 4);
      }
    }

  } else if (ft === 'table') {
    ctx.fillStyle = '#8B6236';
    ctx.fillRect(x + 4, y + h * 0.5, w - 8, 8);
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(x + 4, y + h * 0.55, 6, h * 0.45);
    ctx.fillRect(x + w - 10, y + h * 0.55, 6, h * 0.45);

  } else if (ft === 'bench') {
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(x + 4, y + h * 0.3, w - 8, 8);
    ctx.fillStyle = '#5B3216';
    ctx.fillRect(x + 6, y + h * 0.4, 5, h * 0.6);
    ctx.fillRect(x + w - 11, y + h * 0.4, 5, h * 0.6);

  } else if (ft === 'mat') {
    ctx.fillStyle = b.color || '#3A5A3A';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    ctx.setLineDash([]);

  } else if (ft === 'rack') {
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
    ctx.fillStyle = '#666';
    ctx.fillRect(x + 6, y + h - 6, w - 12, 4);
    ctx.fillRect(x + 6, y + 2, w - 12, 4);
    if (b.detail === 'weights') {
      for (var wt = 0; wt < 4; wt++) {
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(x + 14 + wt * 14, y + h * 0.5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

  } else if (ft === 'bag') {
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w * 0.4, h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CCC';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + 4);
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + w / 2 - 8, y - 3, 16, 4);

  } else if (ft === 'cabinet') {
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#CCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(x + w / 2 - 5, y + 6, 10, 16);
    ctx.fillRect(x + w / 2 - 10, y + 16, 20, 5);
    ctx.fillStyle = '#AAA';
    ctx.fillRect(x + 6, y + h * 0.55, w * 0.3, 3);
    ctx.fillRect(x + 6, y + h * 0.75, w * 0.3, 3);

  } else {
    ctx.fillStyle = b.color || '#888';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = this.darken(b.color || '#888', 0.2);
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }

  if (b.label) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(b.label, x + w / 2, y - 2);
  }
};

World.prototype.drawDetailedBuilding = function(ctx, b) {
  var x = b.x, y = b.y, w = b.w, h = b.h;
  var type = b.type || 'shop';

  var roofH = b.roofHeight || 22;
  var roofY = y;
  var wallY = y + roofH;
  var wallH = h - roofH;

  var wallC = b.wallColor || b.color || '#888888';
  var roofC = b.roofColor || this.darken(wallC, 0.4);
  ctx.fillStyle = roofC;
  ctx.fillRect(x, roofY, w, roofH);

  ctx.fillStyle = wallC;
  ctx.fillRect(x, wallY, w, wallH);

  this.drawBuildingWindows(ctx, x, wallY, w, wallH, type);

  this.drawBuildingDoor(ctx, x, wallY, w, wallH, b);

  if (b.label) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var labelY = wallY + wallH / 2 - 8;
    if (type === 'shop') labelY = wallY + 14;
    if (type === 'bar') labelY = wallY + 14;
    if (type === 'gym') labelY = wallY + 18;
    ctx.fillText(b.label, x + w / 2, labelY);

    var underlineW = Math.min(w - 30, 100);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + w / 2 - underlineW / 2, labelY + 12, underlineW, 1.5);
  }
};

World.prototype.drawBuildingWindows = function(ctx, x, y, w, h, type) {
  var winColor = '#88ccff';
  var winW = 16, winH = 14, gap = 10;

  if (type === 'house') {
    var winY = y + 12;
    ctx.fillStyle = winColor;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.fillRect(x + 14, winY, winW, winH);
    ctx.strokeRect(x + 14, winY, winW, winH);
    ctx.fillRect(x + w - 14 - winW, winY, winW, winH);
    ctx.strokeRect(x + w - 14 - winW, winY, winW, winH);
    ctx.fillStyle = '#222';
    ctx.fillRect(x + 14 + 6, winY, 1.5, winH);
    ctx.fillRect(x + w - 14 - winW + 6, winY, 1.5, winH);
    ctx.fillRect(x + 14, winY + 6, winW, 1.5);
    ctx.fillRect(x + w - 14 - winW, winY + 6, winW, 1.5);
  } else if (type === 'office') {
    var cols = Math.floor((w - 20) / (winW + gap));
    for (var c = 0; c < cols; c++) {
      var wx = x + 12 + c * (winW + gap);
      ctx.fillStyle = winColor;
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 0.8;
      ctx.fillRect(wx, y + 10, winW, winH);
      ctx.strokeRect(wx, y + 10, winW, winH);
      ctx.fillRect(wx, y + 28, winW, winH);
      ctx.strokeRect(wx, y + 28, winW, winH);
    }
  } else if (type === 'gym') {
    ctx.fillStyle = '#7799aa';
    ctx.fillRect(x + 12, y + 10, 24, 10);
    ctx.fillRect(x + w - 36, y + 10, 24, 10);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 12, y + 10, 24, 10);
    ctx.strokeRect(x + w - 36, y + 10, 24, 10);
  } else if (type === 'bar') {
    ctx.fillStyle = 'rgba(255, 200, 50, 0.6)';
    ctx.fillRect(x + 20, y + 10, 16, 10);
    ctx.fillRect(x + w - 36, y + 10, 16, 10);
  } else if (type === 'hospital') {
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(x + w / 2 - 3, y + 10, 6, 18);
    ctx.fillRect(x + w / 2 - 10, y + 14, 20, 6);
  } else if (type === 'shop') {
    ctx.fillStyle = 'rgba(200, 220, 255, 0.7)';
    ctx.fillRect(x + 15, y + 6, w - 30, 26);
    ctx.strokeStyle = '#886622';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 15, y + 6, w - 30, 26);
  }
};

World.prototype.drawBuildingDoor = function(ctx, x, y, w, h, b) {
  var doorW = b.doorW || 28;
  var doorH = b.doorH || 30;
  var doorX = b.doorX !== undefined ? b.doorX : x + w / 2 - doorW / 2;
  var doorY = y + h - doorH;

  var doorColor = b.doorColor || this.darken(b.wallColor || b.color || '#888', 0.35);

  ctx.fillStyle = doorColor;
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.strokeStyle = this.darken(doorColor, 0.3);
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  ctx.fillStyle = '#ffdd44';
  ctx.beginPath();
  ctx.arc(doorX + doorW - 8, doorY + doorH / 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = doorColor;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(doorX + 6, doorY + doorH / 2);
  ctx.lineTo(doorX + doorW - 14, doorY + doorH / 2);
  ctx.stroke();

  if (b.awningColor) {
    ctx.fillStyle = b.awningColor;
    ctx.fillRect(doorX - 8, doorY - 4, doorW + 16, 6);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(doorX - 8, doorY - 4, doorW + 16, 6);
  }
};

World.prototype.drawLandmark = function(ctx, b) {
  if (b.symbol === 'tree') {
    var cx = b.x + b.w / 2;
    var cy = b.y + b.h;
    ctx.fillStyle = '#5D3A1A';
    ctx.fillRect(cx - 3, cy - 20, 6, 20);
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 10, cy - 22, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 10, cy - 22, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.symbol === 'fence') {
    ctx.strokeStyle = '#5D3A1A';
    ctx.lineWidth = 2;
    for (var fx = b.x; fx < b.x + b.w; fx += 10) {
      ctx.beginPath();
      ctx.moveTo(fx, b.y);
      ctx.lineTo(fx, b.y + b.h);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + 4);
    ctx.lineTo(b.x + b.w, b.y + 4);
    ctx.stroke();
  }
};

World.prototype.renderPortalMarkers = function(ctx) {
  var area = this.currentArea;
  if (!area.portals) return;

  for (var i = 0; i < area.portals.length; i++) {
    var p = area.portals[i];
    var pulse = 0.3 + Math.sin(this.portalPulse + i) * 0.2;

    var gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    gradient.addColorStop(0, 'rgba(255, 255, 200, ' + (pulse * 0.5) + ')');
    gradient.addColorStop(0.5, 'rgba(255, 255, 100, ' + pulse + ')');
    gradient.addColorStop(1, 'rgba(255, 255, 200, ' + (pulse * 0.3) + ')');
    ctx.fillStyle = gradient;
    ctx.fillRect(p.x, p.y, p.w, p.h);

    ctx.strokeStyle = 'rgba(255, 255, 255, ' + (pulse * 0.6) + ')';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x, p.y, p.w, p.h);

    var arrows = ['\u25B2', '\u25B2'];
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (pulse) + ')';
    ctx.font = (8 + pulse * 3) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var arrowX = p.x + p.w / 2;
    ctx.fillText('\u25B2', arrowX - 8, p.y + p.h / 2);
    ctx.fillText('\u25B2', arrowX + 8, p.y + p.h / 2);
  }
};

World.prototype.renderNPCs = function(ctx) {
  var area = this.currentArea;
  if (!area.npcs || area.npcs.length === 0) return;

  for (var i = 0; i < area.npcs.length; i++) {
    var npc = area.npcs[i];
    drawStickFigure(ctx, npc.feetX, npc.feetY, npc.color, false, 0);
    ctx.fillStyle = '#ffdd44';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(npc.name, npc.feetX, npc.feetY - 46);
  }
};

World.prototype.findNearbyNPC = function(playerX, playerY) {
  var area = this.currentArea;
  if (!area.npcs) return null;
  var playerFeetX = playerX + 10;
  var playerFeetY = playerY + 48;
  for (var i = 0; i < area.npcs.length; i++) {
    var npc = area.npcs[i];
    var dx = playerFeetX - npc.feetX;
    var dy = playerFeetY - npc.feetY;
    if (Math.sqrt(dx * dx + dy * dy) < 60) {
      return npc;
    }
  }
  return null;
};

World.prototype.darken = function(hex, amount) {
  var r, g, b;
  if (hex[0] === '#') {
    var num = parseInt(hex.substring(1), 16);
    r = (num >> 16) & 0xFF;
    g = (num >> 8) & 0xFF;
    b = num & 0xFF;
  } else {
    return '#333333';
  }
  r = Math.floor(r * (1 - amount));
  g = Math.floor(g * (1 - amount));
  b = Math.floor(b * (1 - amount));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
