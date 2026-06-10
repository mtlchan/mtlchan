function ShopScreen(player, ctx) {
  this.player = player;
  this.ctx = ctx;
  this.active = false;
  this.mode = 'buy';
  this.selectedIndex = 0;
  this.message = null;

  this.shopStock = [
    { id: 'bandage', stock: 10 },
    { id: 'potion', stock: 5 },
    { id: 'energyDrink', stock: 3 },
    { id: 'brassKnuckles', stock: 2 },
    { id: 'woodenShield', stock: 2 },
    { id: 'sword', stock: 1 },
    { id: 'chainmail', stock: 1 }
  ];
}

ShopScreen.prototype.open = function() {
  this.active = true;
  this.selectedIndex = 0;
  this.message = null;
  this.mode = 'buy';
};

ShopScreen.prototype.close = function() {
  this.active = false;
};

ShopScreen.prototype.update = function(dt, input) {
  if (!this.active) return;

  if (input.wasPressed('Escape')) {
    this.close();
    return;
  }

  if (input.wasPressed('Tab')) {
    this.mode = this.mode === 'buy' ? 'sell' : 'buy';
    this.selectedIndex = 0;
    return;
  }

  var items = this.getCurrentList();
  if (input.wasPressed('ArrowUp') || input.wasPressed('w')) {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
  }
  if (input.wasPressed('ArrowDown') || input.wasPressed('s')) {
    this.selectedIndex = Math.min(items.length - 1, this.selectedIndex + 1);
  }
  if (input.wasPressed('Enter') || input.wasPressed(' ')) {
    if (this.mode === 'buy') {
      this.buyItem();
    } else {
      this.sellItem();
    }
  }
};

ShopScreen.prototype.getCurrentList = function() {
  if (this.mode === 'buy') {
    return this.shopStock.filter(function(s) { return s.stock > 0; });
  }
  return this.player.inventory;
};

ShopScreen.prototype.buyItem = function() {
  var available = this.getCurrentList();
  if (this.selectedIndex < 0 || this.selectedIndex >= available.length) return;

  var shopItem = available[this.selectedIndex];
  var itemDef = ITEMS[shopItem.id];
  if (!itemDef) return;

  if (this.player.stats.money < itemDef.price) {
    this.message = 'Not enough money! Need $' + itemDef.price + '.';
    return;
  }

  if (this.player.inventory.length >= this.player.maxInventorySize) {
    this.message = 'Inventory full!';
    return;
  }

  this.player.stats.money -= itemDef.price;
  this.player.addItem(shopItem.id, 1);
  shopItem.stock--;

  this.message = 'Bought ' + itemDef.name + ' for $' + itemDef.price + '!';
};

ShopScreen.prototype.sellItem = function() {
  var items = this.player.inventory;
  if (this.selectedIndex < 0 || this.selectedIndex >= items.length) return;

  var item = items[this.selectedIndex];
  var itemDef = ITEMS[item.id];
  if (!itemDef) return;

  var sellPrice = Math.floor(itemDef.price * 0.5);
  this.player.stats.money += sellPrice;
  this.player.removeItem(this.selectedIndex);

  if (this.selectedIndex >= items.length) {
    this.selectedIndex = Math.max(0, items.length - 1);
  }

  this.message = 'Sold ' + itemDef.name + ' for $' + sellPrice + '.';
};

ShopScreen.prototype.render = function(ctx, canvas) {
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

  ctx.fillStyle = '#ffcc44';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('SHOP', boxX + 20, boxY + 16);

  ctx.fillStyle = '#888888';
  ctx.font = '12px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('[ESC] to close  |  [Tab] switch Buy/Sell', boxX + boxW - 20, boxY + 20);

  ctx.fillStyle = '#66ff66';
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Your Money: $' + this.player.stats.money, boxX + 20, boxY + 44);

  var tabX = boxX + 20;
  var tabY = boxY + 60;
  this.drawTab(ctx, 'Buy', tabX, tabY, this.mode === 'buy');
  this.drawTab(ctx, 'Sell', tabX + 160, tabY, this.mode === 'sell');

  var listX = boxX + 20;
  var listY = tabY + 40;
  this.drawItemTable(ctx, listX, listY, boxW - 40, boxH - 130);

  if (this.message) {
    ctx.fillStyle = '#44ff44';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.message, boxX + boxW / 2, boxY + boxH - 16);
  }

  ctx.fillStyle = '#666666';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Arrow keys to select  |  Enter to ' + (this.mode === 'buy' ? 'buy' : 'sell'), boxX + boxW / 2, boxY + boxH - 4);
};

ShopScreen.prototype.drawTab = function(ctx, label, x, y, active) {
  var w = 100;
  var h = 28;

  ctx.fillStyle = active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(x, y, w, h);

  if (active) {
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
  }

  ctx.fillStyle = active ? '#ffffff' : '#888888';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2);
};

ShopScreen.prototype.drawItemTable = function(ctx, x, y, w, h) {
  ctx.strokeStyle = '#444444';
  ctx.lineWidth = 1;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(x, y, w, 24);

  ctx.fillStyle = '#ffcc44';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  var col1 = x + 8;
  var col2 = x + 220;
  var col3 = x + 320;
  var headerY = y + 12;
  ctx.fillText('Item', col1, headerY);
  ctx.fillText('Price', col2, headerY);
  ctx.fillText(this.mode === 'buy' ? 'Stock' : 'Info', col3, headerY);

  var items = this.getCurrentList();
  for (var i = 0; i < items.length; i++) {
    var rowY = y + 26 + i * 26;
    var isSelected = i === this.selectedIndex;

    if (isSelected) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(x, rowY - 2, w, 24);
      ctx.strokeStyle = '#ffcc00';
      ctx.strokeRect(x, rowY - 2, w, 24);
    }

    var itemDef;
    if (this.mode === 'buy') {
      itemDef = ITEMS[items[i].id];
    } else {
      itemDef = ITEMS[items[i].id];
    }

    if (!itemDef) continue;

    ctx.fillStyle = isSelected ? '#ffffff' : '#cccccc';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    var prefix = isSelected ? '> ' : '  ';
    ctx.fillText(prefix + itemDef.name, col1, rowY + 10);

    ctx.textAlign = 'center';
    ctx.fillText('$' + itemDef.price, col2 + 30, rowY + 10);

    if (this.mode === 'buy') {
      ctx.fillText('' + items[i].stock, col3 + 30, rowY + 10);
    } else {
      ctx.fillText(itemDef.description, col3 + 30, rowY + 10);
    }
  }

  if (items.length === 0) {
    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.mode === 'buy' ? 'Nothing left in stock!' : 'No items to sell.', x + w / 2, y + 80);
  }
};
