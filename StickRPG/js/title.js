function TitleScreen(ctx) {
  this.ctx = ctx;
  this.active = true;
  this.selectedOption = 0;
  this.options = ['New Game', 'Continue', 'Controls'];
  this.hasSave = (new SaveSystem()).hasSlot(1);
}

TitleScreen.prototype.update = function(dt, input) {
  if (!this.active) return;

  var self = this;
  this.hasSave = (new SaveSystem()).hasSlot(1);
  this.options = ['New Game', 'Continue', 'Controls'];

  if (input.wasPressed('ArrowUp') || input.wasPressed('w')) {
    this.selectedOption = Math.max(0, this.selectedOption - 1);
  }
  if (input.wasPressed('ArrowDown') || input.wasPressed('s')) {
    this.selectedOption = Math.min(this.options.length - 1, this.selectedOption + 1);
  }
  if (input.wasPressed('Enter') || input.wasPressed(' ')) {
    switch (this.selectedOption) {
      case 0:
        this.result = 'new';
        this.active = false;
        break;
      case 1:
        if (this.hasSave) {
          this.result = 'continue';
          this.active = false;
        } else {
          this.message = 'No save file found!';
        }
        break;
      case 2:
        this.result = 'controls';
        this.active = false;
        break;
    }
  }
};

TitleScreen.prototype.render = function(ctx, canvas) {
  if (!this.active) return;

  ctx.fillStyle = '#111122';
  ctx.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);

  var cx = canvas.gameWidth / 2;
  var cy = canvas.gameHeight / 2;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('STICK RPG', cx, cy - 100);

  drawStickFigure(ctx, cx, cy - 40, '#44ff44', false, 0);

  for (var i = 0; i < this.options.length; i++) {
    var isSelected = i === this.selectedOption;
    var disableOption = i === 1 && !this.hasSave;

    ctx.fillStyle = disableOption ? '#444444' : (isSelected ? '#ffcc00' : '#cccccc');
    ctx.font = (isSelected ? 'bold ' : '') + '18px monospace';
    var optY = cy + 50 + i * 32;

    if (isSelected) {
      ctx.fillText('> ' + this.options[i] + ' <', cx, optY);
    } else {
      ctx.fillText(this.options[i], cx, optY);
    }
  }

  if (this.message) {
    ctx.fillStyle = '#ff6666';
    ctx.font = '12px monospace';
    ctx.fillText(this.message, cx, cy + 160);
  }

  ctx.fillStyle = '#666666';
  ctx.font = '10px monospace';
  ctx.fillText('Arrow Keys/WASD: Move  |  E/Space: Talk  |  I: Inventory  |  F5: Save  |  F9: Load', cx, canvas.gameHeight - 30);
};
