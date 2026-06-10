function Combat(player, enemyDef, ctx) {
  this.player = player;
  this.enemyDef = enemyDef;
  this.ctx = ctx;

  this.active = false;
  this.finished = false;
  this.result = null;

  this.playerHP = player.stats.hp;
  this.maxPlayerHP = player.stats.maxHp;
  this.enemyHP = enemyDef.hp;
  this.maxEnemyHP = enemyDef.hp;

  var feetY = 450;
  this.playerX = 220;
  this.playerY = feetY - 48;
  this.enemyScale = enemyDef.scale || 1;
  this.enemyX = 700;
  this.enemyY = feetY - 40 * this.enemyScale;

  this.pState = 'idle';
  this.pStateTimer = 0;
  this.pAnimX = 0;
  this.pAnimY = 0;
  this.pAnimScale = 1;
  this.pInvincible = 0;
  this.pBlocking = false;
  this.dodgeDir = null;
  this.pAttackType = null;
  this.pAttackCooldown = 0;
  this.pPunchExtend = 0;

  this.eState = 'idle';
  this.eStateTimer = 0;
  this.eAnimX = 0;
  this.eAnimY = 0;
  this.eAttackType = null;
  this.eActiveFrames = 0;
  this.ePunchExtend = 0;

  this.fightPhase = 'intro';
  this.phaseTimer = 2.0;

  this.round = 1;
  this.maxRounds = 3;
  this.timeLeft = 60;
  this.enemyKnockdowns = 0;
  this.playerDamageDealt = 0;
  this.enemyDamageDealt = 0;

  this.patternIndex = 0;
  this.nextAttackTimer = 0.8;
  this.enemyRecoveryBonus = 0;
  this.roundPatternOffset = 0;
  this.enemyCurrentAtkDef = null;

  this.stunHitsInWindow = 0;
  this.stunWindowTimer = 0;

  this.floatingTexts = [];
  this.battleLog = [];
  this.screenShake = 0;
  this.hitFlash = 0;
  this.stunSparkles = 0;
  this.bobTimer = 0;

  this.knockdownText = '';
  this.knockdownTextTimer = 0;
}

Combat.prototype.start = function() {
  this.active = true;
  this.finished = false;
  this.result = null;

  this.playerHP = this.player.stats.hp;
  this.maxPlayerHP = this.player.stats.maxHp;
  this.enemyHP = this.enemyDef.hp;
  this.maxEnemyHP = this.enemyDef.hp;

  this.pState = 'idle';
  this.pStateTimer = 0;
  this.pAnimX = 0;
  this.pAnimY = 0;
  this.pAnimScale = 1;
  this.pInvincible = 0;
  this.pBlocking = false;
  this.dodgeDir = null;
  this.pAttackType = null;
  this.pAttackCooldown = 0;
  this.pPunchExtend = 0;

  this.eState = 'idle';
  this.eStateTimer = 0;
  this.eAnimX = 0;
  this.eAnimY = 0;
  this.eAttackType = null;
  this.ePunchExtend = 0;

  this.fightPhase = 'intro';
  this.phaseTimer = 2.0;
  this.round = 1;
  this.timeLeft = 60;
  this.enemyKnockdowns = 0;
  this.playerDamageDealt = 0;
  this.enemyDamageDealt = 0;

  this.patternIndex = 0;
  this.nextAttackTimer = 1.5;
  this.roundPatternOffset = 0;
  this.enemyRecoveryBonus = 0;

  this.stunHitsInWindow = 0;
  this.stunWindowTimer = 0;

  this.floatingTexts = [];
  this.battleLog = ['Round 1! FIGHT!'];
  this.screenShake = 0;
  this.hitFlash = 0;
  this.stunSparkles = 0;
  this.bobTimer = 0;

  this.player.currentStamina = this.player.maxStamina;
  this.player.specialMeter = 0;
};

Combat.prototype.update = function(dt, input) {
  if (!this.active) return;

  dt = Math.min(dt, 0.05);

  if (this.screenShake > 0) this.screenShake -= dt * 5;
  if (this.hitFlash > 0) this.hitFlash -= dt * 2.5;
  if (this.stunSparkles > 0) this.stunSparkles -= dt;
  this.bobTimer += dt;

  this.pAttackCooldown -= dt;
  this.pStateTimer -= dt;
  this.pInvincible -= dt * 60;
  this.pPunchExtend = Math.max(0, this.pPunchExtend - dt * 3);

  if (this.stunWindowTimer > 0) {
    this.stunWindowTimer -= dt;
    if (this.stunWindowTimer <= 0) {
      this.stunHitsInWindow = 0;
    }
  }

  if (this.knockdownTextTimer > 0) {
    this.knockdownTextTimer -= dt;
  }

  for (var f = this.floatingTexts.length - 1; f >= 0; f--) {
    var ft = this.floatingTexts[f];
    ft.y -= 40 * dt;
    ft.life -= dt;
    if (ft.life <= 0) {
      this.floatingTexts.splice(f, 1);
    }
  }

  this.player.regenStamina(dt);

  if (this.fightPhase === 'intro') {
    this.phaseTimer -= dt;
    if (this.phaseTimer <= 0) {
      this.fightPhase = 'fighting';
      this.battleLog = ['Round ' + this.round + '! FIGHT!'];
    }
    return;
  }

  if (this.fightPhase === 'result') {
    if (input.wasPressed('Enter') || input.wasPressed(' ') || input.wasPressed('Escape')) {
      this.finished = true;
    }
    return;
  }

  if (this.fightPhase === 'enemy_knockdown') {
    this.phaseTimer -= dt;
    if (this.phaseTimer <= 0) {
      this.enemyKnockdowns++;
      if (this.enemyKnockdowns >= 3) {
        this.endFight('victory');
        return;
      }
      this.enemyHP = Math.floor(this.maxEnemyHP * 0.4);
      this.eState = 'idle';
      this.eAnimX = 0;
      this.eAnimY = 0;
      this.patternIndex = 0;
      this.nextAttackTimer = 1.5;
      this.stunHitsInWindow = 0;
      this.stunWindowTimer = 0;
      this.fightPhase = 'fighting';
      this.knockdownText = '';
      this.knockdownTextTimer = 0;
      this.battleLog.push(this.enemyDef.name + ' gets up!');
    }
    return;
  }

  if (this.fightPhase === 'player_knockdown') {
    this.phaseTimer -= dt;
    if (this.phaseTimer <= 0) {
      this.endFight('defeat');
    }
    return;
  }

  if (this.fightPhase === 'round_end') {
    this.phaseTimer -= dt;
    if (this.phaseTimer <= 0) {
      this.round++;
      if (this.round > this.maxRounds) {
        this.judgeDecision();
        return;
      }
      this.fightPhase = 'intro';
      this.phaseTimer = 2.0;
      this.timeLeft = 60;
      this.roundPatternOffset = (this.round - 1) * 2;
      this.player.currentStamina = Math.min(this.player.maxStamina, this.player.currentStamina + this.player.maxStamina * 0.4);
      this.pState = 'idle';
      this.eState = 'idle';
      this.pAnimX = 0;
      this.pAnimY = 0;
      this.eAnimX = 0;
      this.eAnimY = 0;
      this.dodgeDir = null;
      this.pBlocking = false;
      this.battleLog = ['Round ' + this.round + '...'];
    }
    return;
  }

  if (this.fightPhase !== 'fighting') return;

  this.timeLeft -= dt;
  if (this.timeLeft <= 0) {
    this.timeLeft = 0;
    this.fightPhase = 'round_end';
    this.phaseTimer = 2.0;
    this.battleLog.push('Round ' + this.round + ' ends!');
    return;
  }

  if (this.pState === 'punching' && this.pStateTimer <= 0) {
    this.pState = 'idle';
    this.pAttackType = null;
  }

  if (this.pState === 'hit' && this.pStateTimer <= 0) {
    this.pState = 'idle';
    this.pAnimX = 0;
    this.pAnimY = 0;
  }

  if ((this.pState === 'dodging' || this.pState === 'ducking') && this.pInvincible <= 0) {
    this.pState = 'idle';
    this.pAnimX = 0;
    this.pAnimY = 0;
    this.pAnimScale = 1;
    this.dodgeDir = null;
  }

  this.processPlayerInput(dt, input);
  this.updateEnemyAI(dt);
};

Combat.prototype.processPlayerInput = function(dt, input) {
  if (this.pState !== 'idle') return;

  if (input.wasPressed('ArrowLeft')) {
    this.dodgeDir = 'left';
    this.pAnimX = -45;
    this.pAnimY = 0;
    this.pAnimScale = 1;
    this.pInvincible = 18;
    this.pState = 'dodging';
    this.pBlocking = false;
    return;
  }
  if (input.wasPressed('ArrowRight')) {
    this.dodgeDir = 'right';
    this.pAnimX = 45;
    this.pAnimY = 0;
    this.pAnimScale = 1;
    this.pInvincible = 18;
    this.pState = 'dodging';
    this.pBlocking = false;
    return;
  }
  if (input.wasPressed('ArrowUp')) {
    this.dodgeDir = 'duck';
    this.pAnimScale = 0.55;
    this.pAnimY = 14;
    this.pAnimX = 0;
    this.pInvincible = 18;
    this.pState = 'ducking';
    this.pBlocking = false;
    return;
  }

  this.pBlocking = input.isDown('ArrowDown');

  if (this.pAttackCooldown <= 0) {
    if (input.wasPressed('a') || input.wasPressed('A')) {
      this.doPlayerAttack('jab');
    } else if (input.wasPressed('s') || input.wasPressed('S')) {
      this.doPlayerAttack('hook');
    } else if (input.wasPressed('d') || input.wasPressed('D')) {
      this.doPlayerAttack('uppercut');
    } else if (input.wasPressed(' ') && this.player.specialMeter >= 100) {
      this.doSpecialAttack();
    }
  }
};

Combat.prototype.doPlayerAttack = function(type) {
  var staminaCosts = { jab: 5, hook: 10, uppercut: 20 };
  var cooldowns = { jab: 0.4, hook: 0.55, uppercut: 0.85 };
  var animTimes = { jab: 0.14, hook: 0.2, uppercut: 0.28 };
  var speedMult = Math.max(0.5, 1 - this.player.stats.speed * 0.008);

  var staminaCost = staminaCosts[type];
  var lowStamina = this.player.currentStamina < staminaCost;

  this.player.useStamina(staminaCost);
  this.pState = 'punching';
  this.pAttackType = type;
  this.pAttackCooldown = cooldowns[type] * speedMult;
  this.pStateTimer = animTimes[type];
  this.pPunchExtend = 1;

  var canLand = this.eState === 'stunned' || this.eState === 'recovering';
  var isCounter = this.eState === 'recovering' && this.enemyRecoveryBonus > 0;

  if (!canLand) {
    this.battleLog.push('Whiff! Wait for an opening.');
    return;
  }

  var baseDmg = this.player.getAttackPower();
  var typeMult = { jab: 0.7, hook: 1.2, uppercut: 1.8 };
  var dmg = Math.floor(baseDmg * typeMult[type] + Math.random() * 3);

  if (lowStamina) {
    dmg = Math.floor(dmg * 0.5);
  }
  if (this.eState === 'stunned') {
    dmg = Math.floor(dmg * 1.5);
  }

  this.enemyHP -= dmg;
  this.playerDamageDealt += dmg;
  this.player.addSpecialMeter(5);
  this.hitFlash = 0.2;
  this.screenShake = 0.2;

  this.stunHitsInWindow++;
  this.stunWindowTimer = 2.0;
  if (this.stunHitsInWindow >= 3) {
    this.stunEnemy(1.5);
    this.battleLog.push('Rapid hits! ' + this.enemyDef.name + ' is stunned!');
  }

  if (isCounter) {
    this.player.addSpecialMeter(10);
    this.stunEnemy(1.8);
    this.battleLog.push('Perfect counter! ' + this.enemyDef.name + ' stunned!');
  }

  this.battleLog.push(type.toUpperCase() + '! ' + dmg + ' dmg');
  this.addFloatingText(this.enemyX - 20 + Math.random() * 20, this.enemyY - 45, dmg + '', '#ff6666');

  if (this.enemyHP <= 0) {
    this.enemyHP = 0;
    if (type === 'uppercut' && this.eState === 'stunned') {
      this.battleLog.push('DEVASTATING UPPERCUT!');
    }
    this.startEnemyKnockdown();
  }
};

Combat.prototype.doSpecialAttack = function() {
  this.player.specialMeter = 0;
  this.player.useStamina(30);
  this.pState = 'punching';
  this.pAttackType = 'special';
  this.pStateTimer = 0.35;
  this.pAttackCooldown = 1.0;
  this.pPunchExtend = 1;

  var dmg = 40 + Math.floor(this.player.getAttackPower() * 0.4);
  this.enemyHP -= dmg;
  this.playerDamageDealt += dmg;
  this.hitFlash = 0.5;
  this.screenShake = 0.6;
  this.stunEnemy(1.8);
  this.battleLog.push('SPECIAL!! ' + dmg + ' damage!');
  this.addFloatingText(this.enemyX, this.enemyY - 55, dmg + '', '#ffff00');

  if (this.enemyHP <= 0) {
    this.enemyHP = 0;
    this.startEnemyKnockdown();
  }
};

Combat.prototype.startEnemyKnockdown = function() {
  this.fightPhase = 'enemy_knockdown';
  this.phaseTimer = 2.5;
  this.eState = 'knocked_down';
  this.stunHitsInWindow = 0;
  this.stunWindowTimer = 0;
  this.stunSparkles = 0;
  this.knockdownText = 'DOWN!';
  this.knockdownTextTimer = 2.0;
};

Combat.prototype.stunEnemy = function(duration) {
  this.eState = 'stunned';
  this.eStateTimer = duration;
  this.stunSparkles = 1.0;
  this.eAnimX = 0;
};

Combat.prototype.endFight = function(result) {
  this.fightPhase = 'result';
  this.phaseTimer = 0;
  this.result = result;
  if (result === 'victory') {
    this.battleLog = ['KNOCKOUT! You win!'];
    this.finished = false;
  } else {
    this.battleLog = ['You were knocked out...'];
    this.finished = false;
  }
};

Combat.prototype.judgeDecision = function() {
  if (this.playerDamageDealt > this.enemyDamageDealt) {
    this.result = 'victory';
    this.battleLog = ['Judge decision: YOU WIN!'];
  } else if (this.enemyDamageDealt > this.playerDamageDealt) {
    this.result = 'defeat';
    this.battleLog = ['Judge decision: You lose...'];
  } else {
    if (this.enemyKnockdowns > 0) {
      this.result = 'victory';
      this.battleLog = ['Draw, but knockdowns give you the win!'];
    } else {
      this.result = 'defeat';
      this.battleLog = ['Draw. The champion retains the title...'];
    }
  }
  this.fightPhase = 'result';
};

Combat.prototype.updateEnemyAI = function(dt) {
  if (this.eState === 'stunned') {
    this.eStateTimer -= dt;
    if (this.eStateTimer <= 0) {
      this.eState = 'idle';
      this.eAnimX = 0;
      this.stunHitsInWindow = 0;
      this.stunSparkles = 0;
      this.nextAttackTimer = 0.8 + Math.random() * 0.6;
    }
    return;
  }

  if (this.eState === 'telegraphing') {
    this.eStateTimer -= dt;
    if (this.eStateTimer <= 0) {
      this.eState = 'attacking';
      this.eStateTimer = (this.enemyCurrentAtkDef.activeFrames || 6) / 60;
      this.eAnimX = -50;
      this.ePunchExtend = 1;
    }
    return;
  }

  if (this.eState === 'attacking') {
    this.eStateTimer -= dt;
    if (this.eStateTimer <= 0) {
      this.resolveEnemyAttack();
    }
    return;
  }

  if (this.eState === 'recovering') {
    this.eStateTimer -= dt;
    this.eAnimX = lerp(this.eAnimX, 0, dt * 4);
    this.ePunchExtend = Math.max(0, this.ePunchExtend - dt * 2);
    if (this.eStateTimer <= 0) {
      this.eState = 'idle';
      this.eAnimX = 0;
      this.enemyRecoveryBonus = 0;
      this.ePunchExtend = 0;
      this.nextAttackTimer = 0.6 + Math.random() * 0.6;
    }
    return;
  }

  if (this.eState !== 'idle') return;

  this.nextAttackTimer -= dt;
  if (this.nextAttackTimer <= 0) {
    this.startEnemyAttack();
  }
};

Combat.prototype.startEnemyAttack = function() {
  var seq = this.enemyDef.patternSequence || ['jab'];
  var adjustedIndex = (this.patternIndex + this.roundPatternOffset) % seq.length;
  var atkName = seq[adjustedIndex];
  this.eAttackType = atkName;
  this.patternIndex = (this.patternIndex + 1) % seq.length;

  var defs = this.enemyDef.attackDefs || {};
  var def = (defs && defs[atkName]) ? defs[atkName] : { tellFrames: 12, activeFrames: 6, recoveryFrames: 15 };
  this.enemyCurrentAtkDef = def;

  var speed = this.enemyDef.telegraphSpeed || 1.0;
  this.eState = 'telegraphing';
  this.eStateTimer = (def.tellFrames / 60) * speed;
  this.eActiveFrames = def.activeFrames || 6;
  this.eAnimX = 0;
  this.ePunchExtend = 0;

  var vulnAfter = this.enemyDef.vulnerableAfter || [];
  for (var v = 0; v < vulnAfter.length; v++) {
    if (vulnAfter[v] === adjustedIndex) {
      this.enemyRecoveryBonus = 1.2;
      break;
    }
  }
};

Combat.prototype.resolveEnemyAttack = function() {
  var def = this.enemyCurrentAtkDef || {};
  var dmg = def.damage || this.enemyDef.attack || 10;
  var blockDmg = def.blockDamage || Math.floor(dmg * 0.5);
  var dodgeWindow = def.dodgeWindow || 10;
  dmg += Math.floor(Math.random() * 5);

  var playerDodged = this.dodgeDir !== null && this.pInvincible > 0;
  var dodgeMatch = false;

  if (playerDodged) {
    var weakness = this.getAttackWeakness(this.eAttackType);
    if (this.dodgeDir === 'left' && (weakness === 'left' || weakness === 'any')) dodgeMatch = true;
    if (this.dodgeDir === 'right' && (weakness === 'right' || weakness === 'any')) dodgeMatch = true;
    if (this.dodgeDir === 'duck' && weakness === 'duck') dodgeMatch = true;
    if (this.dodgeDir === 'duck' && (weakness === 'down' || weakness === 'any')) dodgeMatch = true;
  }

  var recovery = (def.recoveryFrames || 15) / 60 + this.enemyRecoveryBonus;
  this.eState = 'recovering';
  this.eStateTimer = recovery;

  if (dodgeMatch) {
    this.battleLog.push('Perfect dodge!');
    this.player.addSpecialMeter(10);
    this.dodgeDir = null;
    this.pInvincible = 0;
    return;
  }

  if (playerDodged) {
    this.battleLog.push('Dodged!');
    this.dodgeDir = null;
    this.pInvincible = 0;
    return;
  }

  if (this.pBlocking && this.player.currentStamina >= 10) {
    this.player.useStamina(10);
    var finalDmg = Math.max(1, blockDmg - this.player.getDefenseBonus());
    this.playerHP -= finalDmg;
    this.enemyDamageDealt += finalDmg;
    this.player.addSpecialMeter(2);
    this.screenShake = 0.1;
    this.battleLog.push('Blocked! ' + finalDmg + ' chip dmg');
    this.addFloatingText(this.playerX + 20, this.playerY - 30, finalDmg + '', '#ffaa44');
  } else if (this.pBlocking && this.player.currentStamina < 10) {
    this.playerHP -= dmg;
    this.enemyDamageDealt += dmg;
    this.pState = 'hit';
    this.pStateTimer = 0.5;
    this.pAnimX = -14;
    this.pAnimY = -6;
    this.screenShake = 0.35;
    this.battleLog.push('Guard broken! ' + dmg + ' dmg');
    this.addFloatingText(this.playerX + 20, this.playerY - 30, dmg + '', '#ff4444');
  } else {
    var finalDmg = Math.max(1, dmg - this.player.getDefenseBonus());
    this.playerHP -= finalDmg;
    this.enemyDamageDealt += finalDmg;
    this.player.addSpecialMeter(2);
    this.pState = 'hit';
    this.pStateTimer = 0.5;
    this.pAnimX = -14;
    this.pAnimY = -6;
    this.screenShake = 0.35;
    this.battleLog.push('Hit! ' + finalDmg + ' dmg');
    this.addFloatingText(this.playerX + 20, this.playerY - 30, finalDmg + '', '#ff4444');
  }

  this.pBlocking = false;
  this.dodgeDir = null;
  this.pInvincible = 0;

  if (this.playerHP <= 0) {
    this.playerHP = 0;
    this.fightPhase = 'player_knockdown';
    this.phaseTimer = 2.0;
    this.battleLog.push('You go down...');
  }
};

Combat.prototype.getAttackWeakness = function(type) {
  switch (type) {
    case 'jab': return 'duck';
    case 'hook': return 'left';
    case 'uppercut': return 'left';
    case 'body_blow': return 'duck';
    case 'special': return 'right';
    case 'charge': return 'duck';
    default: return 'any';
  }
};

Combat.prototype.addFloatingText = function(x, y, text, color) {
  this.floatingTexts.push({ x: x, y: y, text: text, color: color || '#ff4444', life: 1.0 });
};

Combat.prototype.render = function(ctx, canvas) {
  if (!this.active) return;

  var shakeX = Math.floor(Math.sin(this.screenShake * 20) * 6 * this.screenShake);

  ctx.save();
  ctx.translate(shakeX, 0);

  this.drawArena(ctx, canvas);
  this.drawEnemy(ctx);
  this.drawPlayer(ctx);
  this.drawHUD(ctx, canvas);
  this.drawTimer(ctx, canvas);
  this.drawFloatingTexts(ctx);
  this.drawBattleLog(ctx, canvas);
  this.drawControlHints(ctx, canvas);

  if (this.knockdownTextTimer > 0) {
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.knockdownText, canvas.gameWidth / 2, canvas.gameHeight / 2 - 40);
  }

  if (this.fightPhase === 'intro') {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Round ' + this.round, canvas.gameWidth / 2, canvas.gameHeight / 2);
    ctx.font = '14px monospace';
    ctx.fillStyle = this.enemyDef.color || '#ff4444';
    ctx.fillText('vs ' + this.enemyDef.name, canvas.gameWidth / 2, canvas.gameHeight / 2 + 40);
    if (this.enemyDef.taunt) {
      ctx.fillStyle = '#ffcc00';
      ctx.font = 'italic 12px monospace';
      ctx.fillText('"' + this.enemyDef.taunt + '"', canvas.gameWidth / 2, canvas.gameHeight / 2 + 60);
    }
  }

  if (this.fightPhase === 'round_end' || this.fightPhase === 'judge') {
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.fightPhase === 'judge' ? 'Final Decision...' : 'Round ' + this.round + ' Complete', canvas.gameWidth / 2, canvas.gameHeight / 2);
  }

  if (this.fightPhase === 'result') {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
    ctx.fillStyle = this.result === 'victory' ? '#44ff44' : '#ff4444';
    ctx.font = 'bold 40px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.result === 'victory' ? 'YOU WIN!' : 'DEFEAT', canvas.gameWidth / 2, canvas.gameHeight / 2 - 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText('[Enter] to continue', canvas.gameWidth / 2, canvas.gameHeight / 2 + 30);
  }

  ctx.restore();
};

Combat.prototype.drawArena = function(ctx, canvas) {
  ctx.fillStyle = '#1a1a3e';
  ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);

  ctx.fillStyle = '#222255';
  for (var i = 0; i < 6; i++) {
    ctx.fillRect(0, i * 55, canvas.gameWidth, 1);
  }

  var ropeColors = ['#cc0000', '#ffffff', '#cc0000'];
  for (var r = 0; r < 3; r++) {
    var ry = 440 + r * 2;
    ctx.strokeStyle = ropeColors[r];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, ry);
    ctx.lineTo(canvas.gameWidth - 20, ry);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 524, canvas.gameWidth, 4);

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 528, canvas.gameWidth, canvas.gameHeight - 528);

  ctx.fillStyle = '#333';
  ctx.fillRect(0, 400, canvas.gameWidth, 40);
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 405, canvas.gameWidth, 30);
};

Combat.prototype.drawEnemy = function(ctx) {
  var x = this.enemyX + this.eAnimX;
  var y = this.enemyY + this.eAnimY;
  var scale = this.enemyScale;
  var color = this.enemyDef.color || '#ff4444';

  if (this.eState === 'telegraphing') {
    var flash = Math.sin(Date.now() * 0.018) > 0;
    if (flash) color = '#ff0000';
  }
  if (this.eState === 'stunned') {
    var wobble = Math.sin(Date.now() * 0.014) * 6;
    x += wobble;
  }

  if (this.eState === 'knocked_down') {
    ctx.save();
    ctx.translate(x, y + 30);
    ctx.rotate(-Math.PI / 2 + 0.3);
    ctx.scale(scale, scale);
    color = '#666';
    this.drawStickFigureBoxer(ctx, 0, 0, color, 'idle', false, '#ff0000');
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  var pose = 'idle';
  if (this.eState === 'attacking') pose = this.eAttackType || 'jab';
  if (this.eState === 'telegraphing') pose = 'telegraph';
  if (this.eState === 'stunned') pose = 'stunned';
  if (this.eState === 'recovering') pose = 'recover';

  var punchExtend = this.ePunchExtend || 0;

  this.drawStickFigureBoxer(ctx, 0, 0, color, pose, punchExtend > 0.3, '#ff0000');

  if (this.eState === 'stunned' && this.stunSparkles > 0) {
    for (var s = 0; s < 8; s++) {
      var angle = (Date.now() * 0.005 + s * Math.PI / 4) % (Math.PI * 2);
      var sx = Math.cos(angle) * 26;
      var sy = -55 + Math.sin(angle) * 18;
      ctx.fillStyle = '#ffff00';
      ctx.font = '14px sans-serif';
      ctx.fillText('*', sx - 5, sy + 5);
    }
  }

  ctx.restore();
};

Combat.prototype.drawPlayer = function(ctx) {
  var x = this.playerX + this.pAnimX;
  var y = this.playerY + this.pAnimY;
  var scale = this.pAnimScale;
  var color = '#44ff44';

  if (this.pInvincible > 0) {
    var alpha = 0.4 + Math.sin(Date.now() * 0.03) * 0.3;
    ctx.globalAlpha = alpha;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  var pose = 'idle';
  if (this.pBlocking) pose = 'block';
  if (this.pState === 'punching') pose = this.pAttackType || 'jab';
  if (this.pState === 'dodging') pose = this.dodgeDir === 'right' ? 'dodgeRight' : 'dodgeLeft';
  if (this.pState === 'ducking') pose = 'duck';
  if (this.pState === 'hit') pose = 'hit';

  var punchExtend = this.pPunchExtend || 0;

  this.drawStickFigureBoxer(ctx, 0, 0, color, pose, punchExtend > 0.3, '#4488ff');

  ctx.restore();
  ctx.globalAlpha = 1;
};

Combat.prototype.drawStickFigureBoxer = function(ctx, x, y, color, pose, extendPunch, gloveColor) {
  var bob = Math.sin(this.bobTimer * 3) * 2;
  var headY = -50 + (pose === 'duck' ? 18 : 0) + (pose === 'idle' || pose === 'block' ? bob : 0);
  var bodyTop = -36 + (pose === 'duck' ? 18 : 0);
  var bodyBot = 15 + (pose === 'duck' ? 10 : 0);

  if (pose === 'hit') {
    bodyTop += 4;
    headY += 6;
    x -= 5;
  }

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(x, headY, 11, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, bodyTop);
  ctx.lineTo(x, bodyBot);
  ctx.stroke();

  var shoulderY = bodyTop + 6;

  if (pose === 'block') {
    this.drawArm(ctx, x, shoulderY, -16, -22, gloveColor);
    this.drawArm(ctx, x, shoulderY, 16, -22, gloveColor);
    this.drawGlove(ctx, -16, shoulderY - 22, gloveColor);
    this.drawGlove(ctx, 16, shoulderY - 22, gloveColor);
  } else if (pose === 'jab' && extendPunch) {
    this.drawArm(ctx, x, shoulderY, 55, -20, gloveColor);
    this.drawGlove(ctx, 55, shoulderY - 20, gloveColor);
    this.drawArm(ctx, x, shoulderY, -14, -4, gloveColor);
    this.drawGlove(ctx, -14, shoulderY - 4, gloveColor);
  } else if (pose === 'hook' && extendPunch) {
    this.drawArm(ctx, x, shoulderY, 35, -30, gloveColor);
    this.drawArm(ctx, x, shoulderY, 40, -10, gloveColor);
    this.drawGlove(ctx, 40, shoulderY - 10, gloveColor);
    this.drawArm(ctx, x, shoulderY, -14, -4, gloveColor);
    this.drawGlove(ctx, -14, shoulderY - 4, gloveColor);
  } else if (pose === 'uppercut' && extendPunch) {
    this.drawArm(ctx, x, shoulderY, 20, -50, gloveColor);
    this.drawGlove(ctx, 20, shoulderY - 50, gloveColor);
    this.drawArm(ctx, x, shoulderY, -14, -4, gloveColor);
    this.drawGlove(ctx, -14, shoulderY - 4, gloveColor);
  } else if (pose === 'special' && extendPunch) {
    this.drawArm(ctx, x, shoulderY, 60, -15, gloveColor);
    this.drawGlove(ctx, 60, shoulderY - 15, gloveColor);
    this.drawArm(ctx, x, shoulderY, -20, -20, gloveColor);
    this.drawGlove(ctx, -20, shoulderY - 20, gloveColor);
  } else if (pose === 'telegraph') {
    this.drawArm(ctx, x, shoulderY, -20, -26, gloveColor);
    this.drawArm(ctx, x, shoulderY, 10, -6, gloveColor);
    this.drawGlove(ctx, -20, shoulderY - 26, gloveColor);
    this.drawGlove(ctx, 10, shoulderY - 6, gloveColor);
  } else if (pose === 'stunned' || pose === 'recover') {
    this.drawArm(ctx, x, shoulderY, -18, 6, gloveColor);
    this.drawArm(ctx, x, shoulderY, 18, 6, gloveColor);
    this.drawGlove(ctx, -18, shoulderY + 6, gloveColor);
    this.drawGlove(ctx, 18, shoulderY + 6, gloveColor);
  } else if (pose === 'dodgeLeft') {
    this.drawArm(ctx, x, shoulderY, -20, -4, gloveColor);
    this.drawArm(ctx, x, shoulderY, 14, 8, gloveColor);
    this.drawGlove(ctx, -20, shoulderY - 4, gloveColor);
    this.drawGlove(ctx, 14, shoulderY + 8, gloveColor);
  } else if (pose === 'dodgeRight') {
    this.drawArm(ctx, x, shoulderY, -10, 8, gloveColor);
    this.drawArm(ctx, x, shoulderY, 20, -4, gloveColor);
    this.drawGlove(ctx, -10, shoulderY + 8, gloveColor);
    this.drawGlove(ctx, 20, shoulderY - 4, gloveColor);
  } else {
    this.drawArm(ctx, x, shoulderY, -15, -4, gloveColor);
    this.drawArm(ctx, x, shoulderY, 15, -4, gloveColor);
    this.drawGlove(ctx, -15, shoulderY - 4, gloveColor);
    this.drawGlove(ctx, 15, shoulderY - 4, gloveColor);
  }

  ctx.beginPath();
  ctx.moveTo(x, bodyBot);
  ctx.lineTo(x - 12, bodyBot + 28);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, bodyBot);
  ctx.lineTo(x + 12, bodyBot + 28);
  ctx.stroke();

  var eyeY = headY - 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - 4, eyeY, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 4, eyeY, 1.8, 0, Math.PI * 2);
  ctx.fill();

  if (pose === 'stunned') {
    ctx.fillStyle = '#ffff00';
    ctx.font = '10px sans-serif';
    ctx.fillText('x', x - 16, headY - 18);
    ctx.fillText('x', x + 10, headY - 18);
  }
};

Combat.prototype.drawArm = function(ctx, cx, shoulderY, endX, endY, color) {
  ctx.strokeStyle = color || '#44ff44';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, shoulderY);
  ctx.lineTo(cx + endX, shoulderY + endY);
  ctx.stroke();
};

Combat.prototype.drawGlove = function(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

Combat.prototype.drawHUD = function(ctx, canvas) {
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(30, 16, 260, 22);
  var pct = Math.max(0, this.playerHP / this.maxPlayerHP);
  ctx.fillStyle = '#44ff44';
  ctx.fillRect(30, 16, Math.floor(260 * pct), 22);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 16, 260, 22);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HP ' + Math.ceil(this.playerHP) + '/' + this.maxPlayerHP, 40, 33);

  ctx.fillStyle = '#224488';
  ctx.fillRect(30, 42, 260, 10);
  var spct = this.player.maxStamina > 0 ? (this.player.currentStamina / this.player.maxStamina) : 0;
  ctx.fillStyle = '#4488ff';
  ctx.fillRect(30, 42, Math.floor(260 * spct), 10);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 42, 260, 10);
  ctx.fillStyle = '#aaccff';
  ctx.font = '9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('STA ' + Math.floor(this.player.currentStamina), 34, 51);

  ctx.fillStyle = '#444400';
  ctx.fillRect(30, 56, 260, 8);
  var mct = this.player.specialMeter / 100;
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(30, 56, Math.floor(260 * mct), 8);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 56, 260, 8);
  ctx.fillStyle = '#ffdd44';
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  if (this.player.specialMeter >= 100) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('SPECIAL READY [SPACE]', 34, 63);
  } else {
    ctx.fillText('SP ' + Math.floor(this.player.specialMeter) + '%', 34, 63);
  }

  ctx.fillStyle = '#ff4444';
  ctx.fillRect(canvas.gameWidth - 290, 16, 260, 22);
  var epct = Math.max(0, this.enemyHP / this.maxEnemyHP);
  ctx.fillStyle = '#ff8844';
  ctx.fillRect(canvas.gameWidth - 290, 16, Math.floor(260 * epct), 22);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(canvas.gameWidth - 290, 16, 260, 22);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText(this.enemyDef.name.toUpperCase(), canvas.gameWidth - 30, 11);

  if (this.hitFlash > 0) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (this.hitFlash * 0.25) + ')';
    ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
  }
};

Combat.prototype.drawTimer = function(ctx, canvas) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var secs = Math.ceil(this.timeLeft);
  var display = '0:' + (secs < 10 ? '0' : '') + secs;
  ctx.fillText(display, canvas.gameWidth / 2, 36);

  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#ffcc00';
  ctx.fillText('Rd ' + this.round + '/' + this.maxRounds, canvas.gameWidth / 2, 55);

  for (var k = 0; k < 3; k++) {
    ctx.font = '16px sans-serif';
    ctx.fillStyle = k < this.enemyKnockdowns ? '#ff4444' : '#444444';
    ctx.fillText('K', canvas.gameWidth / 2 - 24 + k * 24, 70);
  }
};

Combat.prototype.drawFloatingTexts = function(ctx) {
  for (var f = 0; f < this.floatingTexts.length; f++) {
    var ft = this.floatingTexts[f];
    var alpha = Math.max(0, ft.life);
    ctx.fillStyle = ft.color;
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.globalAlpha = 1;
  }
};

Combat.prototype.drawBattleLog = function(ctx, canvas) {
  var startY = 545;
  var log = this.battleLog;
  var start = Math.max(0, log.length - 4);
  ctx.fillStyle = '#ccc';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  for (var i = start; i < log.length; i++) {
    var msg = log[i];
    if (msg && msg.length > 55) msg = msg.substring(0, 52) + '...';
    ctx.fillText(msg, canvas.gameWidth / 2, startY + (i - start) * 20);
  }
};

Combat.prototype.drawControlHints = function(ctx, canvas) {
  ctx.fillStyle = '#555';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('A: Jab  |  S: Hook  |  D: Uppercut  |  SPACE: Special  |  Arrows: Dodge/Block', canvas.gameWidth / 2, canvas.gameHeight - 12);
};
