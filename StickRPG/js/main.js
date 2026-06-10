(function() {
  var canvas, input, player, world, dialogue, timeSystem, combat, inventoryScreen, shopScreen, saveSystem, titleScreen;
  var lastTime = 0;
  var gameState = 'world';
  var nearbyNPC = null;
  var actionQueue = [];

  var GAME_WIDTH = 960;
  var GAME_HEIGHT = 640;

  function init() {
    canvas = new Canvas(GAME_WIDTH, GAME_HEIGHT);
    input = new Input();
    saveSystem = new SaveSystem();
    titleScreen = new TitleScreen(canvas.ctx);

    gameState = 'title';

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function startNewGame() {
    world = new World();
    var spawn = world.currentArea.playerSpawn;
    player = new Player(spawn.x, spawn.y);
    timeSystem = new TimeSystem();

    dialogue = new Dialogue([], canvas.ctx);
    combat = new Combat(player, ENEMIES.thug, canvas.ctx);
    inventoryScreen = new InventoryScreen(player, canvas.ctx);
    shopScreen = new ShopScreen(player, canvas.ctx);

    player.addItem('potion', 2);
    player.addItem('bandage', 3);

    gameState = 'world';
  }

  function continueGame() {
    world = new World();
    timeSystem = new TimeSystem();
    var spawn = world.currentArea.playerSpawn;
    player = new Player(spawn.x, spawn.y);

    dialogue = new Dialogue([], canvas.ctx);
    combat = new Combat(player, ENEMIES.thug, canvas.ctx);
    inventoryScreen = new InventoryScreen(player, canvas.ctx);
    shopScreen = new ShopScreen(player, canvas.ctx);

    if (saveSystem.load(1, player, timeSystem, world)) {
      gameState = 'world';
    } else {
      actionQueue.push('Failed to load save! Starting new game.');
      startNewGame();
    }
  }

  function update(dt) {
    if (gameState === 'title') {
      titleScreen.update(dt, input);
      if (!titleScreen.active) {
        if (titleScreen.result === 'new') {
          startNewGame();
        } else if (titleScreen.result === 'continue') {
          continueGame();
        } else if (titleScreen.result === 'controls') {
          actionQueue.push('Controls: Arrow Keys/WASD to move, E/Space to interact, I for Inventory, F5 Save, F9 Load');
          titleScreen.active = true;
          gameState = 'title';
        }
      }
      return;
    }

    world.update(dt);

    if (gameState === 'menu') {
      inventoryScreen.update(dt, input);
      if (!inventoryScreen.active) {
        gameState = 'world';
      }
      return;
    }

    if (gameState === 'shop') {
      shopScreen.update(dt, input);
      if (!shopScreen.active) {
        gameState = 'world';
      }
      return;
    }

    if (gameState === 'combat') {
      combat.update(dt, input);
      if (combat.finished) {
        handleCombatResult(combat.result);
      }
      return;
    }

    if (gameState === 'dialogue') {
      dialogue.update(dt, input);
      if (dialogue.finished) {
        handleDialogueResult(dialogue.choiceResult);
      }
      return;
    }

    if (gameState === 'world' && world.transitionTimer <= 0) {
      if (input.wasPressed('F5')) {
        if (saveSystem.save(1, player, timeSystem, world)) {
          actionQueue.push('Game saved! (Slot 1)');
        } else {
          actionQueue.push('Save failed!');
        }
      }

      if (input.wasPressed('F9')) {
        if (saveSystem.hasSlot(1)) {
          saveSystem.load(1, player, timeSystem, world);
          actionQueue.push('Game loaded! (Slot 1)');
        } else {
          actionQueue.push('No save file found in Slot 1.');
        }
      }

      if (input.wasPressed('i') || input.wasPressed('I') || input.wasPressed('Escape')) {
        inventoryScreen.open();
        gameState = 'menu';
        return;
      }

      player.update(dt, input, world.currentArea.collidables);

      player.x = clamp(player.x, 0, GAME_WIDTH - player.width);
      player.y = clamp(player.y, 0, GAME_HEIGHT - player.height);

      nearbyNPC = world.findNearbyNPC(player.x, player.y);

      if (nearbyNPC) {
        if (input.wasPressed('e') || input.wasPressed('E') || input.wasPressed(' ')) {
          startDialogue(nearbyNPC.dialogues);
          return;
        }
      }

      for (var i = 0; i < world.currentArea.portals.length; i++) {
        var portal = world.currentArea.portals[i];
        if (aabbCollision(player, portal)) {
          var spawn = world.transitionTo(portal.targetArea, portal.targetX, portal.targetY);
          if (spawn) {
            player.x = spawn.x;
            player.y = spawn.y;
          }
          break;
        }
      }
    }

    processActionQueue();
  }

  function startDialogue(dialogueTree) {
    dialogue.tree = dialogueTree;
    dialogue.start();
    gameState = 'dialogue';
  }

  function handleDialogueResult(result) {
    gameState = 'world';
    if (!result || result === 'exit') return;

    switch (result) {
      case 'study':
        if (player.stats.energy >= 20) {
          player.stats.energy -= 20;
          player.stats.intelligence += 1;
          timeSystem.advance(3);
          actionQueue.push('You studied hard! +1 Intelligence, -20 Energy. Time passed: 3 hours.');
        } else {
          actionQueue.push('Not enough energy to study! You need 20 energy.');
        }
        break;

      case 'train':
        if (player.stats.energy >= 25 && player.stats.money >= 20) {
          player.stats.energy -= 25;
          player.stats.money -= 20;
          player.stats.strength += 1;
          timeSystem.advance(2);
          actionQueue.push('You trained hard! +1 Strength, -25 Energy, -$20. Time passed: 2 hours.');
        } else if (player.stats.energy < 25) {
          actionQueue.push('Not enough energy to train! You need 25 energy.');
        } else {
          actionQueue.push('Not enough money! Training costs $20.');
        }
        break;

      case 'drink':
        if (player.stats.money >= 15) {
          player.stats.money -= 15;
          player.stats.charisma += 1;
          player.stats.energy -= 5;
          timeSystem.advance(1);
          actionQueue.push('You had a drink. +1 Charisma, -$15, -5 Energy. Time passed: 1 hour.');
        } else {
          actionQueue.push('Not enough money! A drink costs $15.');
        }
        break;

      case 'sleep':
        player.stats.energy = player.stats.maxEnergy;
        player.stats.hp = player.stats.maxHp;
        timeSystem.advanceToNextMorning();
        saveSystem.save(1, player, timeSystem, world);
        actionQueue.push('You slept soundly. Fully restored! Game saved. ' + timeSystem.getDayName() + ' ' + timeSystem.getTimeString());
        break;

      case 'rumor':
        actionQueue.push('The bartender leans in: "Word is, the hospital is running low on supplies. And the fight club pays well."');
        break;

      case 'fight_bar':
        startCombat(ENEMIES.brawler);
        return;

      case 'fight_thug':
        startCombat(ENEMIES.thug);
        return;

      case 'fight_bouncer':
        startCombat(ENEMIES.bouncer);
        return;

      case 'shop_open':
        shopScreen.open();
        gameState = 'shop';
        return;

      case 'heal':
        if (player.stats.money >= 50) {
          player.stats.money -= 50;
          player.stats.hp = player.stats.maxHp;
          timeSystem.advance(1);
          actionQueue.push('The doctor healed you completely! -$50');
        } else if (player.stats.money >= 10) {
          player.stats.money -= 10;
          var healAmt = 30;
          player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + healAmt);
          actionQueue.push('You received basic treatment. +' + healAmt + ' HP. -$10');
        } else {
          actionQueue.push('Not enough money! Minimum $10 for basic treatment.');
        }
        break;

      case 'work':
        if (player.stats.energy >= 30) {
          player.stats.energy -= 30;
          var pay = 40 + player.stats.intelligence * 5 + Math.floor(Math.random() * 20);
          player.stats.money += pay;
          timeSystem.advance(8);
          actionQueue.push('You worked a long shift. Earned $' + pay + '. -30 Energy. Time passed: 8 hours.');
        } else {
          actionQueue.push('Not enough energy to work! You need 30 energy.');
        }
        break;

      default:
        actionQueue.push(result);
    }
  }

  function startCombat(enemyDef) {
    combat = new Combat(player, enemyDef, canvas.ctx);
    combat.start();
    gameState = 'combat';
  }

  function handleCombatResult(result) {
    gameState = 'world';
    player.stats.hp = combat.playerHP;
    player.currentStamina = combat.player.currentStamina;

    if (result === 'victory') {
      player.stats.money += combat.enemyDef.reward;
      var xpBase = 100 + combat.enemyDef.reward * 2;
      var xpEarned = xpBase + Math.floor(Math.random() * 20);
      var leveled = player.gainXP(xpEarned);
      timeSystem.advance(1);
      actionQueue.push('You won! Earned $' + combat.enemyDef.reward + ' and ' + xpEarned + ' XP.');
      if (leveled) {
        actionQueue.push('LEVEL UP! You are now level ' + player.level + '! 5 stat points available. Open Inventory to allocate.');
      }
      saveSystem.save(1, player, timeSystem, world);
    } else if (result === 'defeat') {
      var xpLoss = 25 + combat.enemyDef.reward;
      player.gainXP(xpLoss);
      player.stats.hp = Math.floor(player.stats.maxHp * 0.3);
      timeSystem.advance(4);
      world.transitionTo('home', 470, 600);
      player.x = 470;
      player.y = 600;
      actionQueue.push('You were defeated... You wake up at home with low HP. Earned ' + xpLoss + ' consolation XP.');
    } else {
      actionQueue.push('The fight was interrupted.');
    }
  }

  function processActionQueue() {
    if (actionQueue.length === 0) return;

    if (input.wasPressed('Enter') || input.wasPressed(' ')) {
      actionQueue.shift();
    }
  }

  function render() {
    var ctx = canvas.ctx;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

    ctx.save();
    ctx.translate(canvas.offsetX, canvas.offsetY);
    ctx.scale(canvas.scale, canvas.scale);

    if (gameState === 'title') {
      titleScreen.render(ctx, canvas);
    } else if (gameState === 'combat') {
      combat.render(ctx, canvas);
    } else if (gameState === 'menu') {
      world.render(ctx, canvas);
      player.render(ctx);
      drawTimeOverlay(ctx);
      drawHUD(ctx);
      inventoryScreen.render(ctx, canvas);
    } else if (gameState === 'shop') {
      world.render(ctx, canvas);
      player.render(ctx);
      drawTimeOverlay(ctx);
      drawHUD(ctx);
      shopScreen.render(ctx, canvas);
    } else {
      world.render(ctx, canvas);
      player.render(ctx);
      drawTimeOverlay(ctx);
      drawHUD(ctx);

      if (gameState === 'dialogue') {
        dialogue.render(ctx, canvas);
      }

      drawNearbyPrompt(ctx);

      if (actionQueue.length > 0) {
        drawActionNotification(ctx);
      }
    }

    ctx.restore();

    input.clearJustPressed();
  }

  function drawHUD(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    var area = world.currentArea;
    var x = 14;
    var y = 14;

    ctx.font = 'bold 18px monospace';
    ctx.fillText(area.name, x, y);
    y += 26;

    ctx.font = '13px monospace';
    ctx.fillStyle = '#ff6666';
    ctx.fillText('HP: ' + player.stats.hp + '/' + player.stats.maxHp, x, y);
    y += 18;

    ctx.fillStyle = '#66ccff';
    ctx.fillText('Energy: ' + player.stats.energy + '/' + player.stats.maxEnergy, x, y);
    y += 18;

    ctx.fillStyle = '#66ff66';
    ctx.fillText('$' + player.stats.money, x, y);
    y += 18;

    ctx.fillStyle = '#ffffff';
    ctx.fillText('STR: ' + player.stats.strength + '  INT: ' + player.stats.intelligence + '  CHA: ' + player.stats.charisma, x, y);
    y += 18;

    ctx.fillStyle = '#ffdd44';
    ctx.fillText('POW: ' + player.stats.power + '  SPD: ' + player.stats.speed, x, y);
    y += 18;

    ctx.fillStyle = '#ffaa00';
    ctx.fillText('Lv.' + player.level + '  XP: ' + player.xp + '/' + player.xpToNext, x, y);

    if (player.statPoints > 0) {
      ctx.fillStyle = '#44ff44';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('STAT POINTS: ' + player.statPoints + ' (open Inventory)', x, y + 24);
    }
    y += 20;

    ctx.fillStyle = '#ffdd44';
    ctx.fillText(timeSystem.getDayName() + ' ' + timeSystem.getTimeString() + ' (' + timeSystem.getPeriodName() + ')', x, y);
  }

  function drawTimeOverlay(ctx) {
    var overlay = timeSystem.getOverlay();
    if (!overlay) return;

    ctx.fillStyle = overlay.color;
    ctx.globalAlpha = overlay.alpha;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.globalAlpha = 1;
  }

  function drawNearbyPrompt(ctx) {
    if (gameState !== 'world' || !nearbyNPC) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    var promptW = 180;
    var promptX = nearbyNPC.feetX - promptW / 2;
    var promptY = nearbyNPC.feetY - 70;
    ctx.fillRect(promptX, promptY, promptW, 22);

    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('[E] Talk to ' + nearbyNPC.name, nearbyNPC.feetX, promptY + 11);
  }

  function drawActionNotification(ctx) {
    if (actionQueue.length === 0) return;

    var msg = actionQueue[0];
    var boxW = GAME_WIDTH - 40;
    var boxH = 50;
    var boxX = 20;
    var boxY = GAME_HEIGHT - 70;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(boxX, boxY, boxW, boxH);

    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(msg, boxX + boxW / 2, boxY + boxH / 2 - 6);

    ctx.fillStyle = '#888888';
    ctx.font = '10px monospace';
    ctx.fillText('[Enter] to dismiss', boxX + boxW / 2, boxY + boxH / 2 + 14);
  }

  function gameLoop(timestamp) {
    var dt = (timestamp - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1;
    lastTime = timestamp;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }

  window.addEventListener('load', init);
})();
