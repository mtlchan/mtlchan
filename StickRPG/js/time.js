function TimeSystem() {
  this.hour = 8;
  this.minute = 0;
  this.day = 1;
  this.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

TimeSystem.prototype.advance = function(hours) {
  this.hour += Math.floor(hours);
  this.minute += (hours - Math.floor(hours)) * 60;
  while (this.minute >= 60) {
    this.minute -= 60;
    this.hour++;
  }
  while (this.hour >= 24) {
    this.hour -= 24;
    this.day++;
  }
};

TimeSystem.prototype.advanceToNextMorning = function() {
  var hoursToAdvance;
  if (this.hour < 6) {
    hoursToAdvance = 6 - this.hour;
  } else {
    hoursToAdvance = 24 - this.hour + 6;
  }
  this.hour = 6;
  this.minute = 0;
  this.day++;
};

TimeSystem.prototype.getDayName = function() {
  return this.days[(this.day - 1) % 7];
};

TimeSystem.prototype.getTimeString = function() {
  var h = this.hour;
  var m = Math.floor(this.minute);
  var ampm = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  if (h > 12) h -= 12;
  return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
};

TimeSystem.prototype.getPeriodName = function() {
  var h = this.hour;
  if (h >= 6 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  if (h >= 17 && h < 20) return 'Evening';
  return 'Night';
};

TimeSystem.prototype.getOverlay = function() {
  var h = this.hour;
  if (h >= 6 && h < 18) {
    return null;
  } else if (h >= 18 && h < 20) {
    return { color: '#ff6600', alpha: 0.08 };
  } else if (h >= 20 || h < 4) {
    return { color: '#000022', alpha: 0.3 };
  } else {
    return { color: '#ff6600', alpha: 0.12 };
  }
};
