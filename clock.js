/* daedalOS-clone/clock.js — Canvas-rendered analog clock + Calendar popup */

var Clock = (function() {
  var canvas, ctx, calendarEl, clockText;
  var calendarOpen = false;
  var currentDate = new Date();
  var calendarViewDate = new Date();

  function init() {
    canvas = document.getElementById('clock-canvas');
    clockText = document.getElementById('clock-text');
    calendarEl = document.getElementById('calendar-popup');

    // Resize canvas for HiDPI
    var dpr = window.devicePixelRatio || 1;
    canvas.width = 36 * dpr;
    canvas.height = 22 * dpr;
    canvas.style.width = '36px';
    canvas.style.height = '22px';
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    draw();
    updateDigital();
    buildCalendar();

    // Tick aligned to seconds
    var now = Date.now();
    setTimeout(function() {
      draw();
      updateDigital();
      setInterval(function() {
        draw();
        updateDigital();
      }, 1000);
    }, 1000 - (now % 1000));

    // Click handler
    document.getElementById('tray').addEventListener('click', function(e) {
      e.stopPropagation();
      toggleCalendar();
    });
  }

  function updateDigital() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    clockText.textContent = h + ':' + String(m).padStart(2, '0') + ' ' + ampm;
    clockText.title = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function draw() {
    var w = 36, h = 22;
    ctx.clearRect(0, 0, w, h);

    var cx = w / 2, cy = h / 2;
    var r = 9;

    var now = new Date();
    var hours = now.getHours() % 12;
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Face ticks
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 0.5;
    for (var i = 0; i < 12; i++) {
      var angle = (i * 30 - 90) * Math.PI / 180;
      var inner = r - 1.5;
      var outer = r;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
      ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
      ctx.stroke();
    }

    // Hour hand
    var ha = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ha) * (r * 0.55), cy + Math.sin(ha) * (r * 0.55));
    ctx.stroke();

    // Minute hand
    var ma = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ma) * (r * 0.75), cy + Math.sin(ma) * (r * 0.75));
    ctx.stroke();

    // Second hand
    var sa = (seconds * 6 - 90) * Math.PI / 180;
    ctx.strokeStyle = '#ff5252';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sa) * (r * 0.8), cy + Math.sin(sa) * (r * 0.8));
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  /* === CALENDAR === */
  function buildCalendar() {
    calendarViewDate = new Date();
    renderCalendar();
  }

  function renderCalendar() {
    var year = calendarViewDate.getFullYear();
    var month = calendarViewDate.getMonth();
    var today = new Date();

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var daysInPrev = new Date(year, month, 0).getDate();

    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

    var html = '<div class="cal-header">' +
      '<button onclick="Clock.prevMonth()">&lt;</button>' +
      '<span>' + monthNames[month] + ' ' + year + '</span>' +
      '<button onclick="Clock.nextMonth()">&gt;</button>' +
      '</div><div class="cal-grid">';

    // Day names
    for (var i = 0; i < 7; i++) {
      html += '<div class="day-name">' + dayNames[i] + '</div>';
    }

    // Previous month days
    for (var i = firstDay - 1; i >= 0; i--) {
      html += '<div class="day other">' + (daysInPrev - i) + '</div>';
    }

    // Current month days
    for (var d = 1; d <= daysInMonth; d++) {
      var cls = 'day current-month';
      if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
        cls += ' today';
      }
      html += '<div class="' + cls + '">' + d + '</div>';
    }

    // Next month days to fill row
    var totalCells = firstDay + daysInMonth;
    var remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (var n = 1; n <= remaining; n++) {
      html += '<div class="day other">' + n + '</div>';
    }

    html += '</div>';
    calendarEl.innerHTML = html;
  }

  function prevMonth() {
    calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
    renderCalendar();
  }

  function nextMonth() {
    calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
    renderCalendar();
  }

  function toggleCalendar() {
    calendarOpen = !calendarOpen;
    calendarEl.classList.toggle('open', calendarOpen);
    if (calendarOpen) {
      calendarViewDate = new Date();
      renderCalendar();
    }
  }

  return {
    init: init,
    prevMonth: prevMonth,
    nextMonth: nextMonth,
    toggleCalendar: toggleCalendar
  };
})();
