function Input() {
  this.keys = {};
  this.justPressed = {};

  var self = this;

  window.addEventListener('keydown', function(e) {
    if (!self.keys[e.key]) {
      self.justPressed[e.key] = true;
    }
    self.keys[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'e', 'E', 'Escape', 'a', 'A', 's', 'S', 'd', 'D'].indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', function(e) {
    self.keys[e.key] = false;
  });
}

Input.prototype.isDown = function(key) {
  return !!this.keys[key];
};

Input.prototype.wasPressed = function(key) {
  if (this.justPressed[key]) {
    delete this.justPressed[key];
    return true;
  }
  return false;
};

Input.prototype.clearJustPressed = function() {
  this.justPressed = {};
};
