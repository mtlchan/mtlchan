function Player(x, y) {
  this.x = x;
  this.y = y;
  this.width = 20;
  this.height = 48;
  this.speed = 200;
  this.direction = 'down';
  this.moving = false;
  this.walkTimer = 0;

  this.stats = {
    hp: 100,
    maxHp: 100,
    strength: 5,
    intelligence: 5,
    charisma: 5,
    money: 100,
    energy: 100,
    maxEnergy: 100,
    power: 10,
    speed: 10
  };

  this.inventory = [];
  this.equipment = { weapon: null, armor: null };
  this.maxInventorySize = 20;

  this.level = 1;
  this.xp = 0;
  this.xpToNext = 100;
  this.statPoints = 0;
  this.currentStamina = 100;
  this.specialMeter = 0;
  this.skills = [];
  this.statAllocations = { health: 0, stamina: 0, power: 0, speed: 0, energy: 0 };

  var self = this;
  Object.defineProperty(this, 'maxStamina', {
    get: function() { return 100 + self.statAllocations.stamina * 5; },
    configurable: true
  });
}

Player.prototype.addItem = function(itemId, quantity) {
  quantity = quantity || 1;
  for (var i = 0; i < quantity; i++) {
    if (this.inventory.length >= this.maxInventorySize) return false;
    this.inventory.push({ id: itemId });
  }
  return true;
};

Player.prototype.hasItem = function(itemId) {
  for (var i = 0; i < this.inventory.length; i++) {
    if (this.inventory[i].id === itemId) return i;
  }
  return -1;
};

Player.prototype.removeItem = function(index) {
  if (index >= 0 && index < this.inventory.length) {
    this.inventory.splice(index, 1);
    return true;
  }
  return false;
};

Player.prototype.useItem = function(index) {
  if (index < 0 || index >= this.inventory.length) return null;
  var item = this.inventory[index];
  var def = ITEMS[item.id];
  if (!def) return null;

  if (def.type === 'consumable') {
    if (def.healHP) {
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + def.healHP);
    }
    if (def.healEnergy) {
      this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + def.healEnergy);
    }
    this.inventory.splice(index, 1);
    return 'Used ' + def.name + '!';
  }
  return null;
};

Player.prototype.equipItem = function(index) {
  if (index < 0 || index >= this.inventory.length) return null;
  var item = this.inventory[index];
  var def = ITEMS[item.id];
  if (!def || (def.type !== 'weapon' && def.type !== 'armor')) return null;

  var slot = def.type;
  var oldItem = this.equipment[slot];

  this.equipment[slot] = item;
  this.inventory.splice(index, 1);

  if (oldItem) {
    this.inventory.push(oldItem);
    return 'Equipped ' + def.name + '! (Unequipped ' + ITEMS[oldItem.id].name + ')';
  }
  return 'Equipped ' + def.name + '!';
};

Player.prototype.getAttackBonus = function() {
  if (this.equipment.weapon && ITEMS[this.equipment.weapon.id]) {
    return ITEMS[this.equipment.weapon.id].attackBonus || 0;
  }
  return 0;
};

Player.prototype.getDefenseBonus = function() {
  if (this.equipment.armor && ITEMS[this.equipment.armor.id]) {
    return ITEMS[this.equipment.armor.id].defenseBonus || 0;
  }
  return 0;
};

Player.prototype.countItem = function(itemId) {
  var count = 0;
  for (var i = 0; i < this.inventory.length; i++) {
    if (this.inventory[i].id === itemId) count++;
  }
  return count;
};

Player.prototype.gainXP = function(amount) {
  this.xp += amount;
  if (this.xp >= this.xpToNext) {
    this.xp -= this.xpToNext;
    this.xpToNext = Math.floor(this.xpToNext * 1.5);
    this.level++;
    this.statPoints += 5;
    return true;
  }
  return false;
};

Player.prototype.allocateStat = function(statName) {
  if (this.statPoints <= 0) return false;
  switch (statName) {
    case 'health':
      this.statAllocations.health++;
      this.stats.maxHp += 10;
      this.stats.hp = Math.min(this.stats.hp + 10, this.stats.maxHp);
      break;
    case 'stamina':
      this.statAllocations.stamina++;
      this.currentStamina = Math.min(this.currentStamina + 5, this.maxStamina);
      break;
    case 'power':
      this.statAllocations.power++;
      this.stats.power++;
      break;
    case 'speed':
      this.statAllocations.speed++;
      this.stats.speed++;
      break;
    case 'energy':
      this.statAllocations.energy++;
      this.stats.maxEnergy += 5;
      this.stats.energy += 5;
      break;
    default:
      return false;
  }
  this.statPoints--;
  return true;
};

Player.prototype.useStamina = function(amount) {
  if (this.currentStamina < amount) return false;
  this.currentStamina -= amount;
  return true;
};

Player.prototype.regenStamina = function(dt) {
  this.currentStamina = Math.min(this.maxStamina, this.currentStamina + 15 * dt);
};

Player.prototype.addSpecialMeter = function(amount) {
  this.specialMeter = Math.min(100, this.specialMeter + amount);
};

Player.prototype.getAttackPower = function() {
  var weaponBonus = this.getAttackBonus();
  return this.stats.power * 1.5 + this.stats.strength * 0.5 + weaponBonus;
};

Player.prototype.update = function(dt, input, collidables) {
  var dx = 0;
  var dy = 0;

  if (input.isDown('ArrowLeft') || input.isDown('a')) dx = -1;
  if (input.isDown('ArrowRight') || input.isDown('d')) dx = 1;
  if (input.isDown('ArrowUp') || input.isDown('w')) dy = -1;
  if (input.isDown('ArrowDown') || input.isDown('s')) dy = 1;

  this.moving = dx !== 0 || dy !== 0;

  if (dx !== 0 && dy !== 0) {
    var len = Math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;
  }

  if (this.moving) {
    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 'right' : 'left';
    } else {
      this.direction = dy > 0 ? 'down' : 'up';
    }
  }

  var newX = this.x + dx * this.speed * dt;
  var newY = this.y + dy * this.speed * dt;

  var canMoveX = true;
  var canMoveY = true;

  if (collidables) {
    for (var i = 0; i < collidables.length; i++) {
      var col = collidables[i];
      if (aabbCollision({ x: newX, y: this.y, w: this.width, h: this.height }, col)) {
        canMoveX = false;
      }
      if (aabbCollision({ x: this.x, y: newY, w: this.width, h: this.height }, col)) {
        canMoveY = false;
      }
    }
  }

  if (canMoveX) this.x = newX;
  if (canMoveY) this.y = newY;

  if (this.moving) {
    this.walkTimer += dt * 10;
  } else {
    this.walkTimer = 0;
  }
};

Player.prototype.render = function(ctx) {
  var cx = this.x + this.width / 2;
  var headR = 7;
  var headY = this.y + headR + 2;
  var neckY = this.y + 15;
  var hipY = this.y + 30;
  var footY = this.y + 46;

  var swing = Math.sin(this.walkTimer) * 6;
  var armSwing = this.moving ? swing : 0;
  var legSwing = this.moving ? -swing : 0;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, neckY);
  ctx.lineTo(cx, hipY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, neckY + 2);
  ctx.lineTo(cx - 12 + armSwing, neckY + 16);
  ctx.moveTo(cx, neckY + 2);
  ctx.lineTo(cx + 12 - armSwing, neckY + 16);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, hipY);
  ctx.lineTo(cx - 8 - legSwing, footY);
  ctx.moveTo(cx, hipY);
  ctx.lineTo(cx + 8 + legSwing, footY);
  ctx.stroke();

  var eyeX = cx;
  var eyeY = headY - 1;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeX - 3, eyeY, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eyeX + 3, eyeY, 1.5, 0, Math.PI * 2);
  ctx.fill();
};

Player.prototype.getFeetX = function() {
  return this.x + this.width / 2;
};

Player.prototype.getFeetY = function() {
  return this.y + this.height;
};
