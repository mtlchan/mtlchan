function SaveSystem() {
  this.SAVE_KEY_PREFIX = 'stickrpg_save_';
}

SaveSystem.prototype.save = function(slot, player, timeSystem, world) {
  var data = {
    version: 2,
    timestamp: Date.now(),
    player: {
      stats: {
        hp: player.stats.hp,
        maxHp: player.stats.maxHp,
        strength: player.stats.strength,
        intelligence: player.stats.intelligence,
        charisma: player.stats.charisma,
        money: player.stats.money,
        energy: player.stats.energy,
        maxEnergy: player.stats.maxEnergy,
        power: player.stats.power,
        speed: player.stats.speed
      },
      level: player.level,
      xp: player.xp,
      xpToNext: player.xpToNext,
      statPoints: player.statPoints,
      currentStamina: player.currentStamina,
      statAllocations: player.statAllocations,
      inventory: player.inventory.map(function(item) { return { id: item.id }; }),
      equipment: {
        weapon: player.equipment.weapon ? { id: player.equipment.weapon.id } : null,
        armor: player.equipment.armor ? { id: player.equipment.armor.id } : null
      }
    },
    time: {
      hour: timeSystem.hour,
      minute: timeSystem.minute,
      day: timeSystem.day
    },
    area: world.currentAreaName
  };

  try {
    localStorage.setItem(this.SAVE_KEY_PREFIX + slot, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
};

SaveSystem.prototype.load = function(slot, player, timeSystem, world) {
  try {
    var raw = localStorage.getItem(this.SAVE_KEY_PREFIX + slot);
    if (!raw) return false;

    var data = JSON.parse(raw);
    if (data.version !== 1 && data.version !== 2) return false;

    player.stats.hp = data.player.stats.hp;
    player.stats.maxHp = data.player.stats.maxHp;
    player.stats.strength = data.player.stats.strength;
    player.stats.intelligence = data.player.stats.intelligence;
    player.stats.charisma = data.player.stats.charisma;
    player.stats.money = data.player.stats.money;
    player.stats.energy = data.player.stats.energy;
    player.stats.maxEnergy = data.player.stats.maxEnergy;
    player.stats.power = data.player.stats.power || 10;
    player.stats.speed = data.player.stats.speed || 10;

    player.level = data.player.level || 1;
    player.xp = data.player.xp || 0;
    player.xpToNext = data.player.xpToNext || 100;
    player.statPoints = data.player.statPoints || 0;
    player.currentStamina = data.player.currentStamina || player.maxStamina;
    player.statAllocations = data.player.statAllocations || { health: 0, stamina: 0, power: 0, speed: 0, energy: 0 };

    player.inventory = data.player.inventory.map(function(item) { return { id: item.id }; });
    player.equipment.weapon = data.player.equipment.weapon ? { id: data.player.equipment.weapon.id } : null;
    player.equipment.armor = data.player.equipment.armor ? { id: data.player.equipment.armor.id } : null;

    timeSystem.hour = data.time.hour;
    timeSystem.minute = data.time.minute;
    timeSystem.day = data.time.day;

    var spawn = world.areas[data.area].playerSpawn;
    world.transitionTo(data.area, spawn.x, spawn.y);

    return true;
  } catch (e) {
    return false;
  }
};

SaveSystem.prototype.hasSlot = function(slot) {
  return localStorage.getItem(this.SAVE_KEY_PREFIX + slot) !== null;
};

SaveSystem.prototype.getSlotInfo = function(slot) {
  try {
    var raw = localStorage.getItem(this.SAVE_KEY_PREFIX + slot);
    if (!raw) return null;

    var data = JSON.parse(raw);
    var d = new Date(data.timestamp);
    var p = data.player.stats;
    return {
      timestamp: d.toLocaleString(),
      hp: p.hp + '/' + p.maxHp,
      money: '$' + p.money,
      str: p.strength,
      int: p.intelligence,
      cha: p.charisma,
      area: data.area,
      day: data.time.day
    };
  } catch (e) {
    return null;
  }
};

SaveSystem.prototype.deleteSlot = function(slot) {
  localStorage.removeItem(this.SAVE_KEY_PREFIX + slot);
};
