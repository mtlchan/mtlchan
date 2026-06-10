function InventoryScreen(player, ctx) {
  this.player = player;
  this.ctx = ctx;
  this.active = false;
  this.tab = 'inventory';
  this.selectedIndex = 0;
  this.scrollOffset = 0;
  this.allocMode = false;
  this.selectedStat = 0;
  this.allocResult = '';
}

InventoryScreen.prototype.open = function() {
  this.active = true;
  this.selectedIndex = 0;
  this.scrollOffset = 0;
  this.tab = 'inventory';
  this.allocMode = false;
  this.selectedStat = 0;
  this.allocResult = '';
};

InventoryScreen.prototype.close = function() {
  this.active = false;
};

InventoryScreen.prototype.update = function(dt, input) {
  if (!this.active) return;

  if (input.wasPressed('Escape') || input.wasPressed('i') || input.wasPressed('I')) {
    this.close();
    return;
  }

  if (input.wasPressed('Tab')) {
    this.allocMode = !this.allocMode;
    this.selectedStat = 0;
    this.allocResult = '';
    return;
  }

  if (this.allocMode) {
    var stats = ['health', 'stamina', 'power', 'speed', 'energy'];
    if (input.wasPressed('ArrowUp') || input.wasPressed('w')) {
      this.selectedStat = Math.max(0, this.selectedStat - 1);
    }
    if (input.wasPressed('ArrowDown') || input.wasPressed('s')) {
      this.selectedStat = Math.min(stats.length - 1, this.selectedStat + 1);
    }
    if (input.wasPressed('1')) this.selectedStat = 0;
    if (input.wasPressed('2')) this.selectedStat = 1;
    if (input.wasPressed('3')) this.selectedStat = 2;
    if (input.wasPressed('4')) this.selectedStat = 3;
    if (input.wasPressed('5')) this.selectedStat = 4;

    if (input.wasPressed('Enter') || input.wasPressed(' ')) {
      var statNames = ['Health', 'Stamina', 'Power', 'Speed', 'Energy'];
      var ok = this.player.allocateStat(stats[this.selectedStat]);
      if (ok) {
        this.allocResult = 'Allocated 1 point to ' + statNames[this.selectedStat] + '! (' + this.player.statPoints + ' remaining)';
      } else {
        this.allocResult = 'No stat points available!';
      }
    }
    return;
  }

  if (input.wasPressed('ArrowUp') || input.wasPressed('w')) {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
  }
  if (input.wasPressed('ArrowDown') || input.wasPressed('s')) {
    this.selectedIndex = Math.min(this.player.inventory.length - 1, this.selectedIndex + 1);
  }
  if (input.wasPressed('Enter') || input.wasPressed(' ')) {
    this.useSelectedItem();
  }
};

InventoryScreen.prototype.useSelectedItem = function() {
  if (this.selectedIndex < 0 || this.selectedIndex >= this.player.inventory.length) return;
  var item = this.player.inventory[this.selectedIndex];
  var def = ITEMS[item.id];
  if (!def) return;

  if (def.type === 'consumable') {
    var result = this.player.useItem(this.selectedIndex);
    if (this.selectedIndex >= this.player.inventory.length) {
      this.selectedIndex = Math.max(0, this.player.inventory.length - 1);
    }
    this.actionResult = result;
  } else if (def.type === 'weapon' || def.type === 'armor') {
    var result = this.player.equipItem(this.selectedIndex);
    if (this.selectedIndex >= this.player.inventory.length) {
      this.selectedIndex = Math.max(0, this.player.inventory.length - 1);
    }
    this.actionResult = result;
  }
};

InventoryScreen.prototype.render = function(ctx, canvas) {
  if (!this.active) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);

  var boxX = 60;
  var boxY = 40;
  var boxW = canvas.gameWidth - 120;
  var boxH = canvas.gameHeight - 80;

  ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('INVENTORY', boxX + 20, boxY + 16);

  ctx.fillStyle = '#888888';
  ctx.font = '12px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('[I] or [ESC] to close  [Tab] Switch to ' + (this.allocMode ? 'Items' : 'Stats'), boxX + boxW - 20, boxY + 20);

  this.drawStats(ctx, boxX, boxY + 50);
  this.drawEquipment(ctx, boxX, boxY + 300);

  if (!this.allocMode) {
    this.drawItemList(ctx, boxX + 260, boxY + 50, boxW - 280, boxH - 70);
  }

  if (this.actionResult) {
    ctx.fillStyle = '#44ff44';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.actionResult, boxX + boxW / 2, boxY + boxH - 16);
  }

  if (this.player.statPoints > 0) {
    this.drawStatAllocation(ctx, boxX + 20, boxY + 180, boxW - 40);
  }

  if (this.allocResult) {
    ctx.fillStyle = '#ffff44';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.allocResult, boxX + boxW / 2, boxY + boxH - 36);
  }
};

InventoryScreen.prototype.drawStats = function(ctx, x, y) {
  var p = this.player.stats;
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Stats', x + 20, y);

  ctx.fillStyle = '#ffffff';
  ctx.font = '12px monospace';
  var items = [
    'Level: ' + this.player.level + '  XP: ' + this.player.xp + '/' + this.player.xpToNext,
    'HP: ' + p.hp + ' / ' + p.maxHp + '  STA: ' + Math.floor(this.player.currentStamina) + ' / ' + this.player.maxStamina,
    'Energy: ' + p.energy + ' / ' + p.maxEnergy,
    'STR: ' + p.strength + '  INT: ' + p.intelligence + '  CHA: ' + p.charisma,
    'POW: ' + p.power + ' (+' + this.player.getAttackBonus() + ' atk)  SPD: ' + p.speed,
    'Money: $' + p.money + '  Stat Pts: ' + this.player.statPoints
  ];
  for (var i = 0; i < items.length; i++) {
    ctx.fillText(items[i], x + 20, y + 22 + i * 20);
  }
};

InventoryScreen.prototype.drawEquipment = function(ctx, x, y) {
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Equipment', x + 20, y);

  var weapon = this.player.equipment.weapon;
  var armor = this.player.equipment.armor;

  ctx.fillStyle = '#ffffff';
  ctx.font = '12px monospace';
  ctx.fillText('Weapon: ' + (weapon ? ITEMS[weapon.id].name + ' (+' + ITEMS[weapon.id].attackBonus + ' atk)' : 'None'), x + 20, y + 24);
  ctx.fillText('Armor: ' + (armor ? ITEMS[armor.id].name + ' (+' + ITEMS[armor.id].defenseBonus + ' def)' : 'None'), x + 20, y + 46);
};

InventoryScreen.prototype.drawItemList = function(ctx, x, y, w, h) {
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Items (' + this.player.inventory.length + '/' + this.player.maxInventorySize + ')', x, y);

  if (this.player.inventory.length === 0) {
    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    ctx.fillText('No items. Buy items at the shop!', x + 20, y + 40);
    return;
  }

  var itemsPerPage = Math.floor(h / 26) - 2;
  var startIdx = Math.max(0, Math.min(this.selectedIndex - Math.floor(itemsPerPage / 2), this.player.inventory.length - itemsPerPage));

  for (var i = 0; i < Math.min(itemsPerPage, this.player.inventory.length); i++) {
    var idx = startIdx + i;
    if (idx >= this.player.inventory.length) break;

    var item = this.player.inventory[idx];
    var def = ITEMS[item.id];
    var isSelected = idx === this.selectedIndex;
    var itemY = y + 22 + i * 26;

    if (isSelected) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(x, itemY - 2, w - 20, 24);
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, itemY - 2, w - 20, 24);
    }

    var prefix = isSelected ? '> ' : '  ';
    ctx.fillStyle = isSelected ? '#ffffff' : '#cccccc';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(prefix + def.name, x + 8, itemY + 10);

    var actionText = def.type === 'consumable' ? '[Use]' : ' [Equip]';
    ctx.fillStyle = '#888888';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(actionText, x + w - 30, itemY + 10);
  }

  ctx.fillStyle = '#666666';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Arrow keys to select  |  Enter to use/equip', x + (w - 20) / 2, y + h - 10);
};

InventoryScreen.prototype.drawStatAllocation = function(ctx, x, y, w) {
  ctx.fillStyle = '#44ff44';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Allocate Stat Points (' + this.player.statPoints + ' available) [Tab to select]', x, y);

  var statDefs = [
    { key: 'health', name: 'Health', desc: '+10 Max HP', alloc: this.player.statAllocations.health },
    { key: 'stamina', name: 'Stamina', desc: '+5 Max Stamina', alloc: this.player.statAllocations.stamina },
    { key: 'power', name: 'Power', desc: '+1 Attack Power', alloc: this.player.statAllocations.power },
    { key: 'speed', name: 'Speed', desc: 'Faster attacks & recovery', alloc: this.player.statAllocations.speed },
    { key: 'energy', name: 'Energy', desc: '+5 Max Energy', alloc: this.player.statAllocations.energy }
  ];

  for (var i = 0; i < statDefs.length; i++) {
    var sd = statDefs[i];
    var ry = y + 22 + i * 22;
    var isSel = this.allocMode && this.selectedStat === i;

    if (isSel) {
      ctx.fillStyle = 'rgba(255, 255, 100, 0.2)';
      ctx.fillRect(x, ry - 2, Math.min(w, 400), 20);
      ctx.strokeStyle = '#44ff44';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, ry - 2, Math.min(w, 400), 20);
    }

    var prefix = isSel ? '> ' : '  ';
    ctx.fillStyle = isSel ? '#44ff44' : '#cccccc';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(prefix + sd.name + ': ' + sd.desc + ' (pts: ' + sd.alloc + ')', x + 8, ry);
  }

  if (this.allocMode) {
    ctx.fillStyle = '#888888';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Arrows/1-5 to select  |  Enter to allocate', x + 8, y + 22 + statDefs.length * 22 + 4);
  }
};
