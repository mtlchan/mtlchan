function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function aabbCollision(a, b) {
  var aw = a.w || a.width || 0;
  var ah = a.h || a.height || 0;
  var bw = b.w || b.width || 0;
  var bh = b.h || b.height || 0;
  return a.x < b.x + bw &&
         a.x + aw > b.x &&
         a.y < b.y + bh &&
         a.y + ah > b.y;
}

function wrapText(ctx, text, maxWidth) {
  var words = text.split(' ');
  var lines = [];
  var currentLine = '';

  for (var i = 0; i < words.length; i++) {
    var testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
    var metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawStickFigure(ctx, feetX, feetY, color, moving, walkTimer) {
  var headR = 7;
  var headY = feetY - 40;
  var neckY = feetY - 32;
  var hipY = feetY - 16;

  var swing = Math.sin(walkTimer || 0) * 6;
  var armSwing = moving ? swing : 0;
  var legSwing = moving ? -swing : 0;

  ctx.strokeStyle = color || '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(feetX, headY, headR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(feetX, neckY);
  ctx.lineTo(feetX, hipY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(feetX, neckY + 2);
  ctx.lineTo(feetX - 12 + armSwing, neckY + 16);
  ctx.moveTo(feetX, neckY + 2);
  ctx.lineTo(feetX + 12 - armSwing, neckY + 16);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(feetX, hipY);
  ctx.lineTo(feetX - 8 - legSwing, feetY);
  ctx.moveTo(feetX, hipY);
  ctx.lineTo(feetX + 8 + legSwing, feetY);
  ctx.stroke();

  ctx.fillStyle = color || '#ffffff';
  ctx.beginPath();
  ctx.arc(feetX - 3, headY - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(feetX + 3, headY - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
