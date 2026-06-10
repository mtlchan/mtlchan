function Dialogue(tree, ctx) {
  this.tree = tree || [];
  this.ctx = ctx;
  this.currentIndex = 0;
  this.charIndex = 0;
  this.charTimer = 0;
  this.charSpeed = 0.025;
  this.textFinished = false;
  this.showingChoices = false;
  this.selectedChoice = 0;
  this.choiceResult = null;
  this.active = false;
  this.finished = false;
}

Dialogue.prototype.start = function() {
  this.currentIndex = 0;
  this.charIndex = 0;
  this.charTimer = 0;
  this.textFinished = false;
  this.showingChoices = false;
  this.selectedChoice = 0;
  this.choiceResult = null;
  this.active = true;
  this.finished = false;
};

Dialogue.prototype.update = function(dt, input) {
  if (!this.active) return;

  var node = this.tree[this.currentIndex];
  if (!node) { this.end(); return; }

  if (!this.textFinished) {
    this.charTimer += dt;
    var targetChars = Math.floor(this.charTimer / this.charSpeed);
    if (targetChars > node.text.length) targetChars = node.text.length;
    this.charIndex = targetChars;

    if (input.wasPressed('Enter') || input.wasPressed(' ')) {
      this.charIndex = node.text.length;
      this.charTimer = node.text.length * this.charSpeed;
    }

    if (this.charIndex >= node.text.length) {
      this.textFinished = true;
      if (node.choices && node.choices.length > 0) {
        this.showingChoices = true;
        this.selectedChoice = 0;
      }
    }
  } else if (this.showingChoices) {
    if (input.wasPressed('ArrowUp') || input.wasPressed('w')) {
      this.selectedChoice = Math.max(0, this.selectedChoice - 1);
    }
    if (input.wasPressed('ArrowDown') || input.wasPressed('s')) {
      this.selectedChoice = Math.min(node.choices.length - 1, this.selectedChoice + 1);
    }
    if (input.wasPressed('Enter') || input.wasPressed(' ')) {
      var choice = node.choices[this.selectedChoice];
      if (choice.nextIndex !== undefined) {
        this.currentIndex = choice.nextIndex;
        this.charIndex = 0;
        this.charTimer = 0;
        this.textFinished = false;
        this.showingChoices = false;
      } else {
        this.choiceResult = choice.action || 'exit';
        this.end();
      }
    }
  } else {
    if (input.wasPressed('Enter') || input.wasPressed(' ')) {
      if (this.currentIndex + 1 < this.tree.length) {
        this.currentIndex++;
        this.charIndex = 0;
        this.charTimer = 0;
        this.textFinished = false;
        this.showingChoices = false;
      } else {
        this.choiceResult = 'exit';
        this.end();
      }
    }
  }
};

Dialogue.prototype.end = function() {
  this.active = false;
  this.finished = true;
};

Dialogue.prototype.render = function(ctx, canvas) {
  if (!this.active) return;
  var node = this.tree[this.currentIndex];
  if (!node) return;

  var boxX = 20;
  var boxY = canvas.gameHeight - 200;
  var boxW = canvas.gameWidth - 40;
  var boxH = 180;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(boxX, boxY, boxW, boxH);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  if (node.speaker) {
    ctx.fillText(node.speaker, boxX + 14, boxY + 12);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '13px monospace';
  var displayText = node.text.substring(0, this.charIndex);
  var textLines = wrapText(ctx, displayText, boxW - 30);

  var textY = boxY + (node.speaker ? 34 : 16);
  for (var i = 0; i < textLines.length; i++) {
    ctx.fillText(textLines[i], boxX + 16, textY + i * 20);
  }

  if (!this.textFinished) {
    var blinkOn = Math.floor(Date.now() / 500) % 2 === 0;
  } else if (!this.showingChoices) {
    var pressX = boxX + boxW - 120;
    var pressY = boxY + boxH - 28;
    ctx.fillStyle = '#888888';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('[Enter] to continue', pressX, pressY);
  }

  if (this.showingChoices && node.choices) {
    var choicesY = boxY + boxH - 18 - node.choices.length * 28;
    for (var j = 0; j < node.choices.length; j++) {
      var isSelected = j === this.selectedChoice;
      var choiceX = boxX + 20;
      var choiceW = Math.min(boxW - 60, 300);

      ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(choiceX - 4, choicesY + j * 30 - 2, choiceW + 8, 26);

      if (isSelected) {
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 1;
        ctx.strokeRect(choiceX - 4, choicesY + j * 30 - 2, choiceW + 8, 26);
      }

      ctx.fillStyle = isSelected ? '#ffffff' : '#cccccc';
      ctx.font = '13px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText((isSelected ? '> ' : '  ') + node.choices[j].text, choiceX + 6, choicesY + j * 30 + 11);
    }
  }
};
