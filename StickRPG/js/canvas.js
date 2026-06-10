function Canvas(gameWidth, gameHeight) {
  this.canvas = document.getElementById('gameCanvas');
  this.ctx = this.canvas.getContext('2d');
  this.gameWidth = gameWidth || 960;
  this.gameHeight = gameHeight || 640;
  this.scale = 1;
  this.offsetX = 0;
  this.offsetY = 0;

  var self = this;

  function resize() {
    self.canvas.width = window.innerWidth;
    self.canvas.height = window.innerHeight;

    var scaleX = self.canvas.width / self.gameWidth;
    var scaleY = self.canvas.height / self.gameHeight;
    self.scale = Math.min(scaleX, scaleY);

    self.offsetX = (self.canvas.width - self.gameWidth * self.scale) / 2;
    self.offsetY = (self.canvas.height - self.gameHeight * self.scale) / 2;
  }

  resize();
  window.addEventListener('resize', resize);
}
