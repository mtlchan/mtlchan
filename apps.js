/* daedalOS-clone/apps.js — App content definitions */

const APPS = {
  computer: {
    title: 'This PC',
    icon: 'computer',
    content: function() {
      return `<div style="padding:16px;text-align:center">
        <div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center">
          <div style="text-align:center;width:80px">
            ${iconSVG('computer',40)}
            <div style="color:#fff;font-size:11px;margin-top:6px">Local Disk (C:)</div>
            <div style="color:#888;font-size:10px">${this._diskSize()} GB free of 256 GB</div>
          </div>
          <div style="text-align:center;width:80px">
            ${iconSVG('folder',40)}
            <div style="color:#fff;font-size:11px;margin-top:6px">Home</div>
          </div>
        </div>
        <div style="margin-top:24px;border-top:1px solid #333;padding-top:16px;color:#888;font-size:11px;text-align:left">
          <div>Devices and drives (2)</div>
        </div>
      </div>`;
    },
    _diskSize: function() { return (Math.random()*80+100).toFixed(1); }
  },
  files: {
    title: 'File Explorer',
    icon: 'folder',
    content: `<div style="color:#ccc;line-height:2">
      <div style="display:flex;align-items:center;gap:8px;padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:12px">
        <span style="color:#888;font-size:18px">&#x1F4C2;</span>
        <span style="font-size:13px">Quick access</span>
      </div>
      <div style="padding-left:8px">
        <div style="display:flex;align-items:center;gap:6px">${iconSVG('folder',16)} <span>Documents</span></div>
        <div style="display:flex;align-items:center;gap:6px">${iconSVG('photo',16)} <span>Pictures</span></div>
        <div style="display:flex;align-items:center;gap:6px">${iconSVG('music',16)} <span>Music</span></div>
        <div style="display:flex;align-items:center;gap:6px">${iconSVG('folder',16)} <span>Videos</span></div>
        <div style="display:flex;align-items:center;gap:6px">${iconSVG('folder',16)} <span>Downloads</span></div>
        <div style="display:flex;align-items:center;gap:6px">${iconSVG('txt',16)} <span>README.md</span></div>
      </div>
    </div>`
  },
  browser: {
    title: 'Browser',
    icon: 'globe',
    content: `<div>
      <div style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:#2a2a3e;border-radius:6px;margin-bottom:12px">
        <span style="color:#888;font-size:14px">&#x1F512;</span>
        <input style="flex:1;background:none;border:none;color:#fff;font-size:12px;outline:0;cursor:text" value="https://science-portfolio.local" readonly>
        <span style="color:#888;font-size:14px">&#x21BB;</span>
      </div>
      <div style="text-align:center;padding:40px;color:#888;font-size:14px">
        <div style="font-size:48px;margin-bottom:16px">&#x1F310;</div>
        <div>Science Portfolio — Desktop Environment</div>
        <div style="margin-top:8px;font-size:12px">Explore the wonders of science</div>
      </div>
    </div>`
  },
  terminal: {
    title: 'Terminal',
    icon: 'terminal',
    content: `<div style="font-family:Consolas,'Courier New',monospace;color:#0f0;font-size:13px;line-height:1.6">
      <div>Science Portfolio [Version 1.0]</div>
      <div>(c) Science Educator. All rights reserved.</div>
      <div style="margin-top:8px">C:\\Users\\Teacher&gt; <span style="animation:blink 1s step-end infinite">_</span></div>
      <div style="margin-top:16px;color:#0a0;font-size:11px">
        <div>Type <b style="color:#0f0">help</b> for available commands</div>
        <div>Try: <b style="color:#0f0">neofetch</b>, <b style="color:#0f0">dir</b>, <b style="color:#0f0">cd</b></div>
      </div>
    </div><style>@keyframes blink{50%{opacity:0}}</style>`
  },
  music: {
    title: 'Webamp',
    icon: 'music',
    content: `<div style="text-align:center;padding:16px">
      <div style="background:#2a2a3e;border-radius:8px;padding:16px;display:inline-block;text-align:left">
        <div style="color:#ff9800;font-size:18px;font-weight:700;margin-bottom:12px">&#x25B6; Webamp</div>
        <div style="color:#888;font-size:11px">Now Playing: Track 01.mp3</div>
        <div style="display:flex;gap:2px;margin:12px 0;height:24px;align-items:flex-end">
          ${Array(20).fill(0).map(function(){return '<div style="width:6px;height:'+(Math.random()*22+2)+'px;background:#ff9800;border-radius:1px"></div>'}).join('')}
        </div>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:8px">
          <span style="cursor:default">&#x23EE;</span>
          <span style="cursor:default">&#x25B6;</span>
          <span style="cursor:default">&#x23ED;</span>
        </div>
      </div>
    </div>`
  },
  paint: {
    title: 'Paint',
    icon: 'paint',
    content: function() {
      var uid = 'p' + Math.random().toString(36).substr(2,6);
      return '<div id="paint-app-' + uid + '" style="display:flex;flex-direction:column;height:100%">' +
        '<div id="paint-toolbar-' + uid + '" style="display:flex;gap:4px;padding:4px 6px;background:#2a2a3e;border-bottom:1px solid #444;align-items:center;flex-wrap:wrap">' +
          '<div id="paint-tools-' + uid + '" style="display:flex;gap:2px;margin-right:8px">' +
            '<button class="paint-tool" data-tool="pencil" title="Pencil" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:hsla(0,0%,100%,.15);border:1px solid #555;border-radius:3px;color:#fff;font-size:13px;cursor:default">&#x270E;</button>' +
            '<button class="paint-tool" data-tool="eraser" title="Eraser" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid transparent;border-radius:3px;color:#ccc;font-size:13px;cursor:default">&#x25A0;</button>' +
            '<button class="paint-tool" data-tool="line" title="Line" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid transparent;border-radius:3px;color:#ccc;font-size:13px;cursor:default">\\</button>' +
            '<button class="paint-tool" data-tool="rect" title="Rectangle" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid transparent;border-radius:3px;color:#ccc;font-size:13px;cursor:default">&#x25AD;</button>' +
            '<button class="paint-tool" data-tool="fill" title="Fill" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid transparent;border-radius:3px;color:#ccc;font-size:13px;cursor:default">&#x1F4A7;</button>' +
          '</div>' +
          '<div style="width:1px;height:24px;background:#444;margin:0 4px"></div>' +
          '<div id="paint-sizes-' + uid + '" style="display:flex;gap:2px;align-items:center">' +
            '<button class="paint-size" data-size="1" title="1px" style="width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid #00f0ff;cursor:default"></button>' +
            '<button class="paint-size" data-size="3" title="3px" style="width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid transparent;cursor:default;position:relative"><span style="position:absolute;width:6px;height:6px;background:#888;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)"></span></button>' +
            '<button class="paint-size" data-size="5" title="5px" style="width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid transparent;cursor:default;position:relative"><span style="position:absolute;width:10px;height:10px;background:#888;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)"></span></button>' +
            '<button class="paint-size" data-size="9" title="9px" style="width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid transparent;cursor:default;position:relative"><span style="position:absolute;width:14px;height:14px;background:#888;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)"></span></button>' +
          '</div>' +
          '<div style="width:1px;height:24px;background:#444;margin:0 4px"></div>' +
          '<div id="paint-colors-' + uid + '" style="display:flex;gap:1px;flex-wrap:wrap">' +
            ['#000','#444','#888','#ccc','#fff','#f44336','#e91e63','#9c27b0','#673ab7','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107','#ff9800','#ff5722'].map(function(c,i){return '<button class="paint-color" data-color="'+c+'" style="width:16px;height:16px;background:'+c+';border:'+(i===0?'2px solid #00f0ff':'1px solid #555')+';border-radius:2px;cursor:default"></button>';}).join('') +
          '</div>' +
          '<div style="flex:1"></div>' +
          '<button onclick="window._paintClear(\''+uid+'\')" style="padding:2px 8px;background:transparent;border:1px solid #555;border-radius:3px;color:#ccc;font-size:11px;cursor:default">Clear</button>' +
        '</div>' +
        '<div style="flex:1;overflow:auto;background:#808080;padding:4px;display:flex;align-items:center;justify-content:center">' +
          '<canvas id="paint-canvas-' + uid + '" width="500" height="320" style="background:#fff;cursor:crosshair;image-rendering:auto"></canvas>' +
        '</div>' +
      '</div>';
    }
  },
  doom: {
    title: 'DOOM',
    icon: 'doom',
    content: `<div style="text-align:center;padding:40px;color:#f44336;font-size:24px;font-weight:700;letter-spacing:4px">
      <div style="font-size:64px;margin-bottom:16px">&#x2620;</div>
      RIP AND TEAR
      <div style="color:#888;font-size:12px;margin-top:16px;letter-spacing:0">DOOM running via js-dos</div>
    </div>`
  },
  blog: {
    title: 'Blog Posts',
    icon: 'blog',
    content: `<div style="color:#ccc;line-height:2.2">
      <div style="margin-bottom:8px;font-weight:600;color:#fff">Recent Posts</div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:6px;cursor:default">
        <div style="color:#00f0ff;font-size:13px">Live Well, Live Twice</div>
        <div style="font-size:10px;color:#888">April 15, 2025</div>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:6px;cursor:default">
        <div style="color:#00f0ff;font-size:13px">Building a Desktop Environment in the Browser</div>
        <div style="font-size:10px;color:#888">March 22, 2025</div>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:6px;cursor:default">
        <div style="color:#00f0ff;font-size:13px">WebAssembly Adventures</div>
        <div style="font-size:10px;color:#888">February 10, 2025</div>
      </div>
    </div>`
  },
  settings: {
    title: 'Settings',
    icon: 'settings',
    content: `<div style="color:#ccc;line-height:2.2">
      <div style="margin-bottom:8px;font-weight:600;color:#fff">System Settings</div>
      <div style="padding:8px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between">
        <span>Display</span><span style="color:#888">1920 x 1080</span>
      </div>
      <div style="padding:8px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between">
        <span>Theme</span><span style="color:#888">Dark</span>
      </div>
      <div style="padding:8px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between">
        <span>Clock Source</span><span style="color:#888">Local</span>
      </div>
      <div style="padding:8px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between">
        <span>Background</span><span style="color:#888">Gradient</span>
      </div>
    </div>`
  },
  chess: {
    title: 'Chess',
    icon: 'chess',
    content: `<div style="text-align:center;padding:20px;color:#ccc">
      <div style="font-size:14px;margin-bottom:12px">Play against Stockfish</div>
      <div style="display:inline-grid;grid-template-columns:repeat(8,1fr);width:240px;height:240px;border:2px solid #555">
        ${function(){
          var board = '';
          for(var r=0;r<8;r++){
            for(var c=0;c<8;c++){
              var isBlack = (r+c)%2===1;
              board += '<div style="background:'+(isBlack?'#769656':'#eeeed2')+';width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:18px"></div>';
            }
          }
          return board;
        }()}
      </div>
    </div>`
  },
  youtube: {
    title: 'YouTube',
    icon: 'youtube',
    content: `<div style="text-align:center;padding:20px;color:#888">
      <div style="background:#222;border-radius:8px;padding:24px;max-width:400px;margin:0 auto">
        <div style="font-size:48px;margin-bottom:12px">&#x25B6;</div>
        <div style="color:#fff;font-size:14px">YouTube Plugin</div>
        <div style="margin-top:8px;font-size:12px">Play videos directly from YouTube</div>
        <input style="margin-top:12px;width:100%;padding:8px;background:#333;border:1px solid #555;border-radius:4px;color:#fff;font-size:12px;cursor:text" placeholder="Paste YouTube URL...">
      </div>
    </div>`
  },
  github: {
    title: 'GitHub',
    icon: 'github',
    content: `<div style="text-align:center;padding:20px;color:#ccc">
      <div style="font-size:16px;margin-bottom:16px">DustinBrett/daedalOS</div>
      <div style="display:flex;gap:24px;justify-content:center;margin-bottom:16px">
        <div style="text-align:center"><div style="color:#ffd700;font-size:20px">&#x2605;</div><div style="color:#888;font-size:11px">12.9k</div></div>
        <div style="text-align:center"><div style="color:#888;font-size:20px">&#x2442;</div><div style="color:#888;font-size:11px">1.2k</div></div>
      </div>
      <a href="https://github.com/DustinBrett/daedalOS" style="color:#00f0ff;font-size:13px">View on GitHub</a>
    </div>`
  },
  textedit: {
    title: 'Text Editor',
    icon: 'txt',
    content: `<textarea style="width:100%;height:100%;background:#1a1a2e;color:#ccc;border:none;resize:none;font-family:Consolas,monospace;font-size:13px;padding:8px;cursor:text;-webkit-user-select:text;user-select:text;outline:0" placeholder="Type here..."></textarea>`
  },

  /* === Science Portfolio Apps === */
  welcome: {
    title: 'Welcome',
    icon: 'folder',
    content: `<div style="color:#ccc;line-height:2;max-width:600px">
      <h2 style="color:#00f0ff;font-size:20px;margin-bottom:12px">Welcome</h2>
      <p style="margin-bottom:16px;font-size:13px;">I am a passionate science educator dedicated to sparking curiosity and critical thinking in students. With experience teaching chemistry, biology, and physics, I believe hands-on learning—whether in the lab or on field trips—is the key to understanding the natural world. This portfolio showcases highlights from my classroom, lab activities, and the Science Club.</p>
      <h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Explore</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('chemistry','Chemistry')">
          <div style="color:#00f0ff;font-size:13px">Chemistry</div>
          <div style="font-size:11px;color:#888">Reactions, bonding, and the periodic table</div>
        </div>
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('biology','Biology')">
          <div style="color:#66bb6a;font-size:13px">Biology</div>
          <div style="font-size:11px;color:#888">Cells, ecosystems, genetics, and life</div>
        </div>
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('physics','Physics')">
          <div style="color:#ff7043;font-size:13px">Physics</div>
          <div style="font-size:11px;color:#888">Forces, energy, waves, and the universe</div>
        </div>
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('field-trips','Field Trips')">
          <div style="color:#ffca28;font-size:13px">Field Trips</div>
          <div style="font-size:11px;color:#888">Learning beyond the classroom walls</div>
        </div>
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('lab-activities','Lab Activities')">
          <div style="color:#ce93d8;font-size:13px">Lab Activities</div>
          <div style="font-size:11px;color:#888">Hands-on experiments and investigations</div>
        </div>
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('science-club','Science Club')">
          <div style="color:#ef5350;font-size:13px">Science Club</div>
          <div style="font-size:11px;color:#888">After-school projects and competitions</div>
        </div>
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('archaeology','Archaeology')">
          <div style="color:#bcaaa4;font-size:13px">Archaeology</div>
          <div style="font-size:11px;color:#888">Uncovering the past through discovery</div>
        </div>
        <div style="padding:8px;background:#2a2a3e;border-radius:4px;cursor:default" onclick="WindowManager.open('cv','CV')">
          <div style="color:#fff;font-size:13px">CV / Resume</div>
          <div style="font-size:11px;color:#888">Education, experience, and skills</div>
        </div>
      </div>
    </div>`
  },

  'biology-folder': {
    title: 'Biology',
    icon: 'folder',
    content: function() {
      return '<div style="color:#ccc">' +
        '<h2 style="color:#66bb6a;font-size:18px;margin-bottom:14px">Biology</h2>' +
        '<div onclick="WindowManager.open(\'biology\',\'Biology \u2014 Frog Dissection\')" style="display:flex;align-items:center;gap:14px;padding:16px;background:#111827;border-radius:8px;cursor:default;border:1px solid #1e2a3a;transition:background .2s;margin-bottom:10px" onmouseover="this.style.background=\'#1a2340\'" onmouseout="this.style.background=\'#111827\'">' +
          '<div style="flex-shrink:0">' + iconSVG('dna', 48) + '</div>' +
          '<div style="min-width:0">' +
            '<div style="color:#fff;font-size:14px;font-weight:600">Frog Dissection</div>' +
            '<div style="color:#888;font-size:11px;margin-top:3px">A KS3 Science Curriculum Practical Investigation</div>' +
          '</div>' +
          '<div style="color:#555;font-size:16px;margin-left:auto">&#x203A;</div>' +
        '</div>' +
        '<div onclick="WindowManager.open(\'biology-ecology\',\'Biology \u2014 Pennyhooks Ecology\')" style="display:flex;align-items:center;gap:14px;padding:16px;background:#111827;border-radius:8px;cursor:default;border:1px solid #1e2a3a;transition:background .2s;margin-bottom:10px" onmouseover="this.style.background=\'#1a2340\'" onmouseout="this.style.background=\'#111827\'">' +
          '<div style="flex-shrink:0">' + iconSVG('dna', 48) + '</div>' +
          '<div style="min-width:0">' +
            '<div style="color:#fff;font-size:14px;font-weight:600">Ecology \u2014 Pennyhooks Farm Biodiversity Study</div>' +
            '<div style="color:#888;font-size:11px;margin-top:3px">KS3 Field Study \u2014 Quadrat Sampling, Transects & Species Identification</div>' +
          '</div>' +
          '<div style="color:#555;font-size:16px;margin-left:auto">&#x203A;</div>' +
        '</div>' +
        '<div onclick="WindowManager.open(\'biology-lung-dissection\',\'Biology \u2014 Lung Dissection\')" style="display:flex;align-items:center;gap:14px;padding:16px;background:#111827;border-radius:8px;cursor:default;border:1px solid #1e2a3a;transition:background .2s" onmouseover="this.style.background=\'#1a2340\'" onmouseout="this.style.background=\'#111827\'">' +
          '<div style="flex-shrink:0">' + iconSVG('dna', 48) + '</div>' +
          '<div style="min-width:0">' +
            '<div style="color:#fff;font-size:14px;font-weight:600">Lung Dissection</div>' +
            '<div style="color:#888;font-size:11px;margin-top:3px">KS3 Science \u2014 Respiratory System Practical Investigation</div>' +
          '</div>' +
          '<div style="color:#555;font-size:16px;margin-left:auto">&#x203A;</div>' +
        '</div>' +
      '</div>';
    }
  },

  'uk-field-trip': {
    title: 'UK Field Trip',
    icon: 'folder',
    content: function() {
      function card(appId, icon, title, subtitle) {
        return '<div onclick="WindowManager.open(\''+appId+'\',\''+title+'\')" style="display:flex;align-items:center;gap:14px;padding:16px;background:#111827;border-radius:8px;cursor:default;border:1px solid #1e2a3a;transition:background .2s;margin-bottom:10px" onmouseover="this.style.background=\'#1a2340\'" onmouseout="this.style.background=\'#111827\'">' +
          '<div style="flex-shrink:0">' + iconSVG(icon, 48) + '</div>' +
          '<div style="min-width:0">' +
            '<div style="color:#fff;font-size:14px;font-weight:600">' + title + '</div>' +
            '<div style="color:#888;font-size:11px;margin-top:3px">' + subtitle + '</div>' +
          '</div>' +
          '<div style="color:#555;font-size:16px;margin-left:auto">\u203A</div>' +
        '</div>';
      }
      return '<div style="color:#ccc">' +
        '<h2 style="color:#ffca28;font-size:18px;margin-bottom:10px">UK Field Trip</h2>' +
        '<p style="font-size:13px;color:#aaa;margin-bottom:14px;line-height:1.7">Growing up and studying in the UK gave me a deep appreciation for the country\u2019s rich history, culture, and educational landmarks. Each year, I co-lead a small team of teachers on an annual trip to England, guiding students through iconic destinations that bring their classroom learning to life. Beyond planning the itinerary and leading activities, I also take on the practical side of the trip \u2014 from cooking meals to driving the minibus \u2014 ensuring every student has a safe, enriching, and memorable experience.</p>' +
        card('uk-london','bigben','London','Natural History Museum, British Museum, Science Museum & Buckingham Palace') +
        card('uk-oxford','book','Oxford','Bodleian Library & the University City') +
        card('uk-bath','column','Bath','Roman Baths, Mary Shelley Museum & the Royal Crescent') +
        card('uk-warwick','castle','Warwick Castle','Medieval History Brought to Life') +
        card('uk-stratford','quill','Stratford-upon-Avon','Shakespeare\u2019s Birthplace & Tudor England') +
      '</div>';
    }
  },

  'uk-london': {
    title: 'London',
    icon: 'globe',
    content: function() {
      var topPhotos = ['processed_IMG_8971.jpg','processed_IMG_8977.jpg','processed_IMG_8981.jpg'];
      var bottomPhotos = ['processed_IMG_8992.jpg','processed_IMG_9005.jpg','processed_IMG_9023.jpg','processed_IMG_9030.jpg','processed_ofm 2026-04-22 1744236C9EA09A68E4.JPG'];
      function tile(p) { return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/uk-trip/london/'+p+'\')"><img src="media/uk-trip/london/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>'; }
      return '<div style="color:#ccc;line-height:1.8;max-width:960px">'+
        '<h2 style="color:#ffca28;font-size:20px;margin-bottom:4px">London</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:8px">Natural History Museum, British Museum, Science Museum & Buckingham Palace</p>'+
        '<p style="font-size:11px;color:#555;margin-bottom:8px">Click any image to enlarge</p>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px">'+topPhotos.map(tile).join('')+'</div>'+
        '<p style="font-size:13px;margin-bottom:10px">London is the heart of the UK trip, offering an unparalleled concentration of world-class museums and cultural landmarks. Students spend several days exploring the capital, visiting institutions that connect directly to their studies in science, history, and the arts.</p>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Natural History Museum</b><p style="font-size:13px;color:#aaa;margin-top:2px">From the towering blue whale skeleton in the Hintze Hall to the earthquake simulator and the dazzling mineral gallery, the Natural History Museum brings biology, geology, and environmental science to life. Students explore exhibits on evolution, biodiversity, and Earth\u2019s history, making tangible connections to the KS3 and IGCSE curriculum.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">British Museum</b><p style="font-size:13px;color:#aaa;margin-top:2px">Home to the Rosetta Stone, the Elgin Marbles, and Egyptian mummies, the British Museum offers a journey through human civilisation. Students trace the development of writing, art, and technology across continents and millennia.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Science Museum</b><p style="font-size:13px;color:#aaa;margin-top:2px">With interactive galleries on space exploration, mathematics, engineering, and medicine, the Science Museum is a highlight for STEM-focused students. Hands-on exhibits encourage exploration of everything from steam engines to space capsules.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Buckingham Palace & Westminster</b><p style="font-size:13px;color:#aaa;margin-top:2px">Students walk through St James\u2019s Park to see Buckingham Palace, then along Whitehall past the Houses of Parliament and Big Ben \u2014 landmarks they have seen in textbooks and on screen, now experienced firsthand.</p></div>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px;margin-top:16px">More Photos</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:8px">'+bottomPhotos.map(tile).join('')+'</div>'+
      '</div>';
    }
  },

  'uk-oxford': {
    title: 'Oxford',
    icon: 'compass',
    content: function() {
      var topPhotos = ['processed_IMG_8517.jpg','processed_IMG_8764.jpg','processed_IMG_8767.jpg'];
      var bottomPhotos = ['processed_IMG_8769.jpg','processed_IMG_8771.jpg','processed_IMG_8775.jpg'];
      function tile(p) { return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/uk-trip/oxford/'+p+'\')"><img src="media/uk-trip/oxford/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>'; }
      return '<div style="color:#ccc;line-height:1.8;max-width:960px">'+
        '<h2 style="color:#ffca28;font-size:20px;margin-bottom:4px">Oxford</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:8px">Bodleian Library & the University City</p>'+
        '<p style="font-size:11px;color:#555;margin-bottom:8px">Click any image to enlarge</p>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px">'+topPhotos.map(tile).join('')+'</div>'+
        '<p style="font-size:13px;margin-bottom:10px">Oxford is a city that breathes academia. As the oldest university city in the English-speaking world, its cobbled streets, dreaming spires, and world-famous colleges provide an inspiring backdrop for students to imagine their own futures in higher education.</p>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Bodleian Library</b><p style="font-size:13px;color:#aaa;margin-top:2px">Students tour one of the oldest libraries in Europe, home to over 13 million printed items. The medieval architecture and the sheer scale of the collection offer a humbling reminder of the depth of human knowledge. Discussions centre on the history of printing, the preservation of texts, and the role of libraries in the digital age.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">University Colleges</b><p style="font-size:13px;color:#aaa;margin-top:2px">Walking through colleges such as Christ Church, Magdalen, and Balliol, students experience the traditions of Oxford firsthand \u2014 from the grand dining halls that inspired Hogwarts to the tranquil quads where generations of scholars have studied. Many students begin to seriously consider university pathways after this visit.</p></div>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px;margin-top:16px">More Photos</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:8px">'+bottomPhotos.map(tile).join('')+'</div>'+
      '</div>';
    }
  },

  'uk-bath': {
    title: 'Bath',
    icon: 'compass',
    content: function() {
      var topPhotos = ['processed_A7R01680.jpeg','processed_A7R01694.JPG','processed_IMG_4617.jpg'];
      var bottomPhotos = ['processed_A7R01769.jpeg','processed_A7R01795.JPG','processed_A7R01918.JPG','processed_IMG_8793.jpg'];
      function tile(p) { return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/uk-trip/bath/'+p+'\')"><img src="media/uk-trip/bath/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>'; }
      return '<div style="color:#ccc;line-height:1.8;max-width:960px">'+
        '<h2 style="color:#ffca28;font-size:20px;margin-bottom:4px">Bath</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:8px">Roman Baths, Mary Shelley Museum & the Royal Crescent</p>'+
        '<p style="font-size:11px;color:#555;margin-bottom:8px">Click any image to enlarge</p>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px">'+topPhotos.map(tile).join('')+'</div>'+
        '<p style="font-size:13px;margin-bottom:10px">A UNESCO World Heritage city, Bath is a living museum of Georgian architecture and Roman engineering. Students explore 2,000 years of history in a single day, from ancient baths to literary landmarks.</p>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Roman Baths</b><p style="font-size:13px;color:#aaa;margin-top:2px">Students walk through one of the best-preserved Roman spa complexes in the world. They learn about Roman engineering, the hypocaust heating system, and the social importance of public baths in the ancient world \u2014 linking directly to history and science curricula.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Mary Shelley Museum \u2014 House of Frankenstein</b><p style="font-size:13px;color:#aaa;margin-top:2px">Dedicated to Mary Shelley, the author of <i>Frankenstein</i>, this museum explores the life of one of literature\u2019s most influential writers and the creation of her iconic novel. Students connect Gothic literature to the scientific anxieties of the 19th century.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Royal Crescent & City Tour</b><p style="font-size:13px;color:#aaa;margin-top:2px">The city tour takes students along the sweeping curve of the Royal Crescent, through the Circus, and past Pulteney Bridge \u2014 one of the most photographed streets in England. Along the way, they learn about Bath\u2019s transformation from a Roman settlement to a fashionable Georgian spa town, the architecture of John Wood, and the city\u2019s place in English social history.</p></div>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px;margin-top:16px">More Photos</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:8px">'+bottomPhotos.map(tile).join('')+'</div>'+
      '</div>';
    }
  },

  'uk-warwick': {
    title: 'Warwick Castle',
    icon: 'compass',
    content: function() {
      var topPhotos = ['processed_IMG_8635.jpg','processed_IMG_9042.jpg','processed_IMG_9044.jpg'];
      var bottomPhotos = ['processed_IMG_9057.jpg','processed_IMG_9059.jpg','processed_IMG_9063.jpg'];
      function tile(p) { return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/uk-trip/warwick-castle/'+p+'\')"><img src="media/uk-trip/warwick-castle/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>'; }
      return '<div style="color:#ccc;line-height:1.8;max-width:960px">'+
        '<h2 style="color:#ffca28;font-size:20px;margin-bottom:4px">Warwick Castle</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:8px">Medieval History Brought to Life</p>'+
        '<p style="font-size:11px;color:#555;margin-bottom:8px">Click any image to enlarge</p>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px">'+topPhotos.map(tile).join('')+'</div>'+
        '<p style="font-size:13px;margin-bottom:10px">Warwick Castle, originally built by William the Conqueror in 1068, is one of England\u2019s most complete medieval fortresses. Students step into a world of knights, battles, and royal intrigue, exploring a site that has been at the centre of English history for nearly a thousand years.</p>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Castle Towers & Ramparts</b><p style="font-size:13px;color:#aaa;margin-top:2px">Climbing the towers and walking the ramparts, students gain a visceral understanding of medieval defensive architecture. They see arrow slits, murder holes, and the strategic positioning that made Warwick nearly impregnable. The views from the top offer a commanding perspective of the surrounding landscape.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">The Great Hall & State Rooms</b><p style="font-size:13px;color:#aaa;margin-top:2px">Inside the castle, the Great Hall displays suits of armour, weapons, and artefacts from centuries of occupancy. Students learn about the daily life of the nobility, the role of castles in medieval society, and the evolution of warfare from the Norman period to the Tudor era.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Live Demonstrations</b><p style="font-size:13px;color:#aaa;margin-top:2px">The castle\u2019s live demonstrations \u2014 including falconry displays, trebuchet firings, and jousting tournaments \u2014 turn history into spectacle. Students witness the physics of siege engines and the skill of medieval combat, making abstract historical concepts tangible and thrilling.</p></div>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px;margin-top:16px">More Photos</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:8px">'+bottomPhotos.map(tile).join('')+'</div>'+
      '</div>';
    }
  },

  'uk-stratford': {
    title: 'Stratford-upon-Avon',
    icon: 'compass',
    content: function() {
      var topPhotos = ['processed_IMG_2830.JPG','processed_IMG_2836.JPG','processed_IMG_2844.JPG','processed_IMG_2849.JPG'];
      var bottomPhotos = ['processed_IMG_2890.JPG','processed_IMG_2897.JPG','processed_IMG_9070.jpg','processed_IMG_9082.jpg'];
      function tile(p) { return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/uk-trip/stratford/'+p+'\')"><img src="media/uk-trip/stratford/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>'; }
      return '<div style="color:#ccc;line-height:1.8;max-width:960px">'+
        '<h2 style="color:#ffca28;font-size:20px;margin-bottom:4px">Stratford-upon-Avon</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:8px">Shakespeare\u2019s Birthplace & Tudor England</p>'+
        '<p style="font-size:11px;color:#555;margin-bottom:8px">Click any image to enlarge</p>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px">'+topPhotos.map(tile).join('')+'</div>'+
        '<p style="font-size:13px;margin-bottom:10px">The market town of Stratford-upon-Avon is synonymous with William Shakespeare, the most celebrated playwright in the English language. Students walk the same streets the young Shakespeare walked, exploring the Tudor world that shaped his imagination and his work.</p>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Shakespeare\u2019s Birthplace</b><p style="font-size:13px;color:#aaa;margin-top:2px">The half-timbered house on Henley Street where Shakespeare was born in 1564 is now a beautifully preserved museum. Students see the glove-making workshop of his father, the bedroom where he was born, and exhibitions on his early life and legacy. Costumed guides bring Tudor Stratford to life.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Tudor Stratford</b><p style="font-size:13px;color:#aaa;margin-top:2px">Beyond the birthplace, students explore Anne Hathaway\u2019s Cottage, Hall\u2019s Croft, and the Grammar School where Shakespeare was educated. The town itself \u2014 with its timber-framed buildings, bustling markets, and riverside setting \u2014 offers an immersive experience of Elizabethan England.</p></div>'+
        '<div style="margin-bottom:10px"><b style="color:#ffca28;font-size:13px">Connecting Literature to Place</b><p style="font-size:13px;color:#aaa;margin-top:2px">For students studying Shakespeare in English, visiting Stratford transforms their understanding of the texts. They see how the rural Warwickshire landscape, the rigid Tudor social hierarchy, and the rhythms of market town life are woven into the plays themselves. Discussions on the coach ride home are always some of the richest of the trip.</p></div>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px;margin-top:16px">More Photos</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:8px">'+bottomPhotos.map(tile).join('')+'</div>'+
      '</div>';
    }
  },

  'chemistry-folder': {
    title: 'Chemistry',
    icon: 'folder',
    content: function() {
      return '<div style="color:#ccc;text-align:center;padding:40px 20px">' +
        '<div style="margin-bottom:16px">' + iconSVG('flask', 64) + '</div>' +
        '<h2 style="color:#00f0ff;font-size:18px;margin-bottom:8px">Chemistry</h2>' +
        '<p style="color:#888;font-size:13px">Content coming soon.</p>' +
      '</div>';
    }
  },

  'physics-folder': {
    title: 'Physics',
    icon: 'folder',
    content: function() {
      return '<div style="color:#ccc">' +
        '<h2 style="color:#ff7043;font-size:18px;margin-bottom:14px">Physics</h2>' +
        '<div onclick="WindowManager.open(\'physics-pinewood-derby\',\'Forces PBL \u2014 Pinewood Derby\')" style="display:flex;align-items:center;gap:14px;padding:16px;background:#111827;border-radius:8px;cursor:default;border:1px solid #1e2a3a;transition:background .2s" onmouseover="this.style.background=\'#1a2340\'" onmouseout="this.style.background=\'#111827\'">' +
          '<div style="flex-shrink:0">' + iconSVG('atom', 48) + '</div>' +
          '<div style="min-width:0">' +
            '<div style="color:#fff;font-size:14px;font-weight:600">Forces PBL \u2014 Pinewood Derby</div>' +
            '<div style="color:#888;font-size:11px;margin-top:3px">KS3 Forces \u2014 Re-Engineering Speed Through Iterative Design</div>' +
          '</div>' +
          '<div style="color:#555;font-size:16px;margin-left:auto">\u203A</div>' +
        '</div>' +
      '</div>';
    }
  },

  'cs-folder': {
    title: 'Computer Science',
    icon: 'folder',
    content: function() {
      return '<div style="color:#ccc;text-align:center;padding:40px 20px">' +
        '<div style="margin-bottom:16px">' + iconSVG('terminal', 64) + '</div>' +
        '<h2 style="color:#00f0ff;font-size:18px;margin-bottom:8px">Computer Science</h2>' +
        '<p style="color:#888;font-size:13px">Content coming soon.</p>' +
      '</div>';
    }
  },

  chemistry: {
    title: 'Chemistry',
    icon: 'flask',
    content: `<div style="color:#ccc;line-height:2;max-width:600px">
      <h2 style="color:#00f0ff;font-size:18px;margin-bottom:8px">Chemistry</h2>
      <p style="margin-bottom:12px;font-size:13px">Chemistry is the study of matter—what substances are made of, how they interact, and how they change. My classroom explores everything from atomic structure to organic reactions through theory and hands-on experimentation.</p>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Key Topics</h3>
      <ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">
        <li>Atomic structure and the periodic table</li>
        <li>Chemical bonding and molecular geometry</li>
        <li>Stoichiometry and reaction balancing</li>
        <li>Acids, bases, and pH</li>
        <li>Thermochemistry and reaction rates</li>
        <li>Introduction to organic chemistry</li>
      </ul>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Lab Highlights</h3>
      <p style="font-size:13px;font-style:italic;color:#aaa;margin-bottom:8px">"Tell me and I forget. Teach me and I remember. Involve me and I learn." — Benjamin Franklin</p>
      <ul style="list-style:disc;padding-left:20px;font-size:13px">
        <li><b>Titration labs</b> — determining unknown concentrations</li>
        <li><b>Flame tests</b> — identifying metal ions by color</li>
        <li><b>Synthesis of esters</b> — making pleasant-smelling compounds</li>
        <li><b>Electrolysis of water</b> — splitting water into hydrogen and oxygen</li>
      </ul>
    </div>`
  },

  biology: {
    title: 'Biology - Frog Dissection',
    icon: 'dna',
    content: function() {
      var steps = [
        {num:1, src:'media/biology/frog-dissection/1.png', desc:'<b>Preparing the specimen.</b> Students begin by laying out their dissection tray, tools (scalpel, forceps, scissors, probe, dissecting pins), and the preserved frog specimen. Safety goggles and gloves are worn throughout. The frog is rinsed and placed on the tray ready for examination.'},
        {num:2, src:'media/biology/frog-dissection/2.png', desc:'<b>External anatomy observation.</b> Before making any incisions, students identify and record external features: the nictitating membrane over the eyes, tympanic membranes (eardrums), nostrils, mouth, webbed feet, and the smooth moist skin characteristic of amphibians. Key adaptations for life both in water and on land are discussed.'},
        {num:3, src:'media/biology/frog-dissection/3.png', desc:'<b>Pinning and securing.</b> The frog is pinned to the dissection tray through the limbs to hold it securely in place. This step is crucial for safe and precise incision work. Students learn proper pin placement to avoid obstructing the area they will cut.'},
        {num:4, src:'media/biology/frog-dissection/4.png', desc:'<b>Making the first incision.</b> Using scissors, students make a careful midline incision through the skin and muscle layers of the ventral surface. The cut follows a specific pattern: a vertical line up the centre of the abdomen, then horizontal cuts at the top and bottom to create flaps of skin that can be pinned back, exposing the internal body cavity.'},
        {num:5, src:'media/biology/frog-dissection/5.png', desc:'<b>Revealing the internal organs.</b> With the skin and muscle flaps pinned back, the internal organ systems become visible. Students can now see the layout of organs within the coelom (body cavity). This is the moment of discovery that students find most exciting—textbook diagrams become real, three-dimensional structures in front of them.'},
        {num:6, src:'media/biology/frog-dissection/6.jpg', desc:'<b>Identifying major organs.</b> Working methodically, students identify and label each organ system:<br>â€¢ <b>Digestive system:</b> liver (large, dark, three-lobed), stomach (curved, muscular), small and large intestines<br>â€¢ <b>Circulatory system:</b> heart (small, three-chambered, still visible near the centre)<br>â€¢ <b>Respiratory system:</b> lungs (paired, spongy sacs on either side)<br>â€¢ <b>Excretory system:</b> kidneys (flat, bean-shaped against the dorsal body wall)<br>â€¢ <b>Reproductive system:</b> ovaries or testes (depending on sex of specimen)<br>Each organ is gently lifted with the probe so students can trace its connections to other structures.'},
        {num:7, src:'media/biology/frog-dissection/7.png', desc:'<b>Close-up examination and discussion.</b> Once all major organs are identified, students take detailed notes and draw labelled diagrams in their lab books. The teacher circulates, quizzing groups on structure-function relationships: <i>"Why is the frog liver so much larger relative to body size than a human liver?" "What does the three-chambered heart tell us about amphibian circulation versus our four-chambered heart?"</i> Students clean their stations, dispose of specimens according to school protocol, and complete a written reflection on what they learned.'}
      ];
      var stepHTML = steps.map(function(s){
        var safeSrc = s.src.replace(/'/g, "\\'");
        return '<div style="display:flex;gap:12px;margin-bottom:16px;padding:10px;background:#2a2a3e;border-radius:6px;border-left:3px solid #66bb6a;align-items:flex-start">'+
          '<div style="flex-shrink:0;width:160px;cursor:pointer;border-radius:4px;overflow:hidden;border:1px solid #444" onclick="window._showLightbox(\''+safeSrc+'\')">'+
            '<img src="'+safeSrc+'" style="width:100%;display:block;aspect-ratio:4/3;object-fit:cover" loading="lazy">'+
            '<div style="text-align:center;font-size:11px;color:#888;padding:2px;background:#1a1a2e">Step '+s.num+'</div>'+
          '</div>'+
          '<div style="flex:1;min-width:0"><div style="font-size:12px;color:#66bb6a;font-weight:700;margin-bottom:4px">Step '+s.num+'</div><div style="font-size:12px;color:#ccc;line-height:1.6">'+s.desc+'</div></div>'+
        '</div>';
      }).join('');

      return '<div style="color:#ccc;line-height:2">'+
        '<h2 style="color:#66bb6a;font-size:20px;margin-bottom:4px">Biology — Frog Dissection</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:12px">A KS3 Science Curriculum Practical Investigation</p>'+
        '<div style="padding:10px 12px;background:#1a3a1a;border-radius:6px;border:1px solid #2e7d32;margin-bottom:14px">'+
          '<b style="color:#66bb6a;font-size:13px">Curriculum Links</b>'+
          '<p style="font-size:12px;color:#a5d6a7;margin-top:4px">KS3 Science — Working Scientifically; Biology: Structure and Function of Living Organisms; Cells and Organisation. This dissection supports students in developing practical skills, making careful observations, and understanding how an organism\'s structure relates to its function — a core theme across the entire Key Stage 3 programme of study.</p>'+
        '</div>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">About This Practical</h3>'+
        '<p style="font-size:13px;margin-bottom:8px">The frog dissection is one of the most memorable and impactful practical experiments embedded in my <b>KS3 science curriculum</b>. Held during the summer term of Year 8, it forms part of the unit on <i>Structure and Function of Living Organisms</i>. Over a double period (100 minutes), students work in pairs under close supervision to carry out a full dissection, following the step-by-step method below. The session builds on prior learning about cells, tissues, and organ systems from Year 7, and lays the foundation for the more detailed coverage of comparative anatomy and physiology at KS4.</p>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Learning Objectives</h3>'+
        '<ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">'+
          '<li>Use dissection tools safely and correctly to explore biological specimens</li>'+
          '<li>Identify the major organs and organ systems of a vertebrate animal</li>'+
          '<li>Compare amphibian anatomy with human organ systems studied in class</li>'+
          '<li>Apply the concept that structure is related to function at every level of organisation</li>'+
          '<li>Record observations accurately using biological drawings and written notes</li>'+
        '</ul>'+
        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Step-by-Step Process</h3>'+
        '<p style="font-size:12px;color:#aaa;margin-bottom:8px">Click on any image to view it full-size.</p>'+
        stepHTML+
        '<div style="padding:10px 12px;background:#2a2a3e;border-radius:6px;margin-top:8px">'+
          '<b style="color:#ffd700;font-size:12px">Assessment</b>'+
          '<p style="font-size:12px;color:#aaa;margin-top:4px">Students are assessed on their practical technique, quality of biological drawings and labels, and a written reflection answering the question: <i>"How does the structure of the frog\'s organs help it survive in both aquatic and terrestrial environments?"</i> This tasks links directly to the KS3 Working Scientifically strand of presenting observations and data using scientific conventions.</p>'+
        '</div>'+
      '</div>';
    }
  },

  'biology-ecology': {
    title: 'Ecology — Pennyhooks Farm',
    icon: 'dna',
    content: function() {
      var topPhotos = [
        'processed_IMG_0097.JPG','processed_IMG_0100.JPG','processed_IMG_8534.jpg',
        'processed_IMG_8842.jpg','processed_IMG_8929.jpg'
      ];
      var bottomPhotos = [
        'processed_IMG_0104.JPG','processed_IMG_8834.jpg','processed_IMG_8855.jpg',
        'processed_IMG_8867.jpg','processed_IMG_8880.jpg','processed_IMG_8902.jpg',
        'processed_IMG_8950.jpg','processed_IMG_8960.jpg','processed_IMG_8965.jpg'
      ];
      function photoTile(p) {
        return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/biology/pennyhooks-ecology/'+p+'\')"><img src="media/biology/pennyhooks-ecology/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>';
      }
      var topRow = topPhotos.map(photoTile).join('');
      var bottomGrid = bottomPhotos.map(photoTile).join('');

      return '<div style="color:#ccc;line-height:1.8;max-width:960px">'+

        '<h2 style="color:#66bb6a;font-size:20px;margin-bottom:4px">Ecology \u2014 Pennyhooks Farm Biodiversity Study</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:10px">KS3 Field Study \u2014 Hands-On Ecology at a Working Farm</p>'+

        '<p style="font-size:11px;color:#555;margin-bottom:8px">Click any image to enlarge</p>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:18px">'+topRow+'</div>'+

        '<div style="padding:10px 12px;background:#1a3a1a;border-radius:6px;border:1px solid #2e7d32;margin-bottom:14px">'+
          '<b style="color:#66bb6a;font-size:13px">Curriculum Links</b>'+
          '<p style="font-size:12px;color:#a5d6a7;margin-top:4px">KS3 Science \u2014 Working Scientifically; Biology: Relationships in an Ecosystem, Biodiversity, Sampling Techniques. This field trip gives students hands-on experience with ecological survey methods including quadrat sampling, pitfall traps, transect lines, and species identification, connecting classroom theory to real-world environmental science.</p>'+
        '</div>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:6px">The Field Trip: Pennyhooks Farm</h3>'+
        '<p style="font-size:13px;margin-bottom:10px">I co-led a field trip to <b>Pennyhooks Farm</b>, a working farm that provided a rich outdoor laboratory for our KS3 students to conduct authentic ecological investigations. The trip was designed to give students practical experience with the sampling techniques they had studied in class, while also fostering a sense of connection to the natural world and an understanding of sustainable land use.</p>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Ecological Survey Techniques</h3>'+
        '<p style="font-size:13px;margin-bottom:10px">Students rotated through stations, each focusing on a different ecological sampling method:</p>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">Quadrat Sampling</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Students placed quadrats at random coordinates across the grassland, recording plant species presence, percentage cover, and abundance. This allowed them to estimate biodiversity and population density using a standardised, repeatable scientific method. Back in class, we calculated species richness and discussed limitations of the technique.</p>'+
        '</div>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">Transect Lines</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Working along a line transect from the field edge into a hedgerow, students recorded how species composition changed across the gradient. They observed the dramatic shift from open grassland flora to shade-tolerant woodland species, graphing their results to visualise the ecological transition zone \u2014 a powerful demonstration of habitat boundaries and microclimates.</p>'+
        '</div>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">Pitfall Traps</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Students set pitfall traps in different microhabitats (open field, hedgerow base, near the pond) to compare invertebrate populations. The next day\'s collection and identification session was a highlight \u2014 students used magnifying glasses, identification keys, and dichotomous keys to classify beetles, spiders, woodlice, and centipedes, learning that different species occupy distinct ecological niches.</p>'+
        '</div>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">Hedge Analysis</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Using established hedge survey methodology, students measured hedge dimensions, estimated age using Hooper\'s Rule, counted woody species in 30-metre sections, and assessed hedge structure and connectivity. They evaluated the hedge\'s role as a wildlife corridor, linking their findings to broader conservation principles and the importance of hedgerow networks in British farmland ecology.</p>'+
        '</div>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">Species Identification & Recording</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Equipped with field guides and identification keys, students documented every species they encountered \u2014 plants, invertebrates, birds, and fungi. They recorded data in field notebooks using scientific conventions, noting location, abundance, and habitat type. This systematic approach built core skills in observation, classification, and data recording that underpin all biological fieldwork.</p>'+
        '</div>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:6px">Farm Animal Care</h3>'+
        '<p style="font-size:13px;margin-bottom:10px">Beyond the ecological surveys, students contributed to the daily running of the farm by helping to care for the animals. Under supervision, they fed goats, groomed ponies, and learned about animal husbandry, nutrition, and health monitoring. This experience broadened the trip\'s scope beyond pure ecology, giving students insight into agricultural science and the interdependence of farming and biodiversity.</p>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Evidence of Learning</h3>'+
        '<ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">'+
          '<li><b>Applied Sampling Skills:</b> Students demonstrated competence in using quadrats, transects, and pitfall traps \u2014 techniques that form part of the GCSE required practicals. Many students referenced the farm trip in their end-of-unit assessments, citing specific data they collected themselves.</li>'+
          '<li><b>Data Analysis & Interpretation:</b> Back in the classroom, students graphed species distribution along transect lines, compared biodiversity indices between habitats, and wrote conclusions supported by their own evidence \u2014 bridging the gap between fieldwork and scientific reasoning.</li>'+
          '<li><b>Environmental Awareness:</b> Students gained a tangible understanding of biodiversity, conservation, and sustainable farming. Several reported that the trip changed how they viewed farmland and hedgerows, seeing them not just as scenery but as complex, interconnected ecosystems worth protecting.</li>'+
          '<li><b>Teamwork & Responsibility:</b> Working in small field teams and caring for farm animals fostered collaboration, communication, and a sense of responsibility. Students who were less confident in the classroom often thrived in this outdoor, hands-on environment.</li>'+
        '</ul>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Reflection</h3>'+
        '<p style="font-size:13px;margin-bottom:0;font-style:italic;color:#aaa">Pennyhooks Farm exemplified the power of place-based learning. When students measure biodiversity with their own hands \u2014 placing a quadrat, counting species, recording data \u2014 ecology transforms from a textbook abstraction into something they have genuinely experienced. The combination of rigorous survey methodology and the simple act of caring for animals created a memorable, holistic science education experience that I am keen to repeat and expand.</p>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px;margin-top:18px">More Photos</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:8px">'+bottomGrid+'</div>'+
      '</div>';
    }
  },

  'biology-lung-dissection': {
    title: 'Lung Dissection',
    icon: 'dna',
    content: function() {
      var topPhotos = ['processed_IMG_3265.jpg','processed_IMG_3273.jpg','processed_IMG_3279.jpg','processed_IMG_3282.jpg'];
      var bottomPhotos = ['processed_IMG_3260.jpg','processed_IMG_3266.jpg','processed_IMG_3274.jpg','processed_IMG_3285.jpg','processed_IMG_3292.jpg','processed_IMG_3297.jpg','processed_IMG_3304.jpg','processed_IMG_8279.jpg'];
      function tile(p) { return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/biology/lung-dissection/'+p+'\')"><img src="media/biology/lung-dissection/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>'; }
      return '<div style="color:#ccc;line-height:1.8;max-width:960px">'+
        '<h2 style="color:#66bb6a;font-size:20px;margin-bottom:4px">Lung Dissection</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:8px">KS3 Science \u2014 Respiratory System Practical Investigation</p>'+
        '<p style="font-size:11px;color:#555;margin-bottom:8px">Click any image to enlarge</p>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px">'+topPhotos.map(tile).join('')+'</div>'+

        '<div style="padding:10px 12px;background:#1a3a1a;border-radius:6px;border:1px solid #2e7d32;margin-bottom:14px">'+
          '<b style="color:#66bb6a;font-size:13px">Curriculum Links</b>'+
          '<p style="font-size:12px;color:#a5d6a7;margin-top:4px">KS3 Science \u2014 Working Scientifically; Biology: Structure and Function of Living Organisms, Gas Exchange and the Respiratory System. This dissection helps students visualise the anatomy of the lungs, understand the mechanism of ventilation, and connect structure to function \u2014 a core theme across Key Stage 3.</p>'+
        '</div>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:6px">About This Practical</h3>'+
        '<p style="font-size:13px;margin-bottom:10px">The lung dissection is a cornerstone practical in my KS3 biology curriculum, embedded within the unit on <i>Structure and Function of Living Organisms</i>. Students examine a complete pluck \u2014 the lungs, heart, trachea, and diaphragm \u2014 to see how the respiratory and circulatory systems work together. Unlike diagrams in a textbook, the dissection reveals the spongy texture of lung tissue, the rigid cartilage rings of the trachea, and the muscular strength of the heart, giving students a tangible, three-dimensional understanding of anatomy.</p>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Learning Objectives</h3>'+
        '<ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">'+
          '<li>Identify the major structures of the respiratory system: trachea, bronchi, bronchioles, lungs, and diaphragm</li>'+
          '<li>Trace the path of air from the mouth to the alveoli</li>'+
          '<li>Understand how cartilage rings keep the trachea open and how the diaphragm facilitates breathing</li>'+
          '<li>Compare the texture and appearance of healthy lung tissue with the effects of lifestyle factors such as smoking</li>'+
          '<li>Use dissection tools safely and record observations using scientific drawings and terminology</li>'+
        '</ul>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Step-by-Step Process</h3>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">1. External Examination</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Students begin by observing the intact pluck on the dissection tray. They identify the trachea at the top \u2014 a firm, ribbed tube \u2014 and run their fingers along it to feel the cartilage rings. The spongy, pink lungs sit on either side of the darker, more compact heart. Students note the diaphragm attached at the base and discuss its role in breathing before any cuts are made.</p>'+
        '</div>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">2. Exploring the Trachea & Bronchi</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Using scissors, students make a longitudinal incision along the trachea, revealing the C-shaped cartilage rings that prevent it from collapsing. They follow the trachea as it splits into the left and right bronchi, noting how the cartilage rings become smaller and less frequent as the airways branch deeper into the lungs.</p>'+
        '</div>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">3. Examining Lung Tissue</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Students cut a section of lung tissue and observe its sponge-like, highly vascularised structure. They feel the difference between the dense, muscular heart tissue and the light, air-filled lung parenchyma. A small piece of lung is placed in water \u2014 if it floats, it confirms the presence of residual air in the alveoli, a memorable demonstration of the lung\u2019s function.</p>'+
        '</div>'+

        '<div style="margin-bottom:10px">'+
          '<b style="color:#66bb6a;font-size:13px">4. Inflation Demonstration</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">A tube is inserted into the trachea, and the lungs are gently inflated using a pump. Students watch as the lungs expand \u2014 a striking visual of how air fills the alveoli and how the diaphragm\u2019s movement drives ventilation. This demonstration consistently draws gasps and is one of the most talked-about moments of the year.</p>'+
        '</div>'+

        '<div style="margin-bottom:16px">'+
          '<b style="color:#66bb6a;font-size:13px">5. Heart & Circulatory Connection</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">With the lungs opened, students examine the heart nestled between them. They identify the atria, ventricles, and major blood vessels, reinforcing the connection between the respiratory and circulatory systems \u2014 oxygen enters the blood via the lungs, and the heart pumps it around the body. This integrated view helps students move beyond seeing systems in isolation.</p>'+
        '</div>'+

        '<div style="padding:10px 12px;background:#2a2a3e;border-radius:6px;margin-top:8px;margin-bottom:16px">'+
          '<b style="color:#ffd700;font-size:12px">Assessment</b>'+
          '<p style="font-size:12px;color:#aaa;margin-top:4px">Students are assessed on safe dissection technique, accurate biological drawings with labels, and a written reflection answering: <i>"How does the structure of the respiratory system enable efficient gas exchange?"</i> This connects directly to the KS3 Working Scientifically strand and lays strong foundations for the more detailed coverage of gas exchange and ventilation at IGCSE.</p>'+
        '</div>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">More Photos</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:8px">'+bottomPhotos.map(tile).join('')+'</div>'+
      '</div>';
    }
  },

  physics: {
    title: 'Physics',
    icon: 'atom',
    content: `<div style="color:#ccc;line-height:2;max-width:600px">
      <h2 style="color:#ff7043;font-size:18px;margin-bottom:8px">Physics</h2>
      <p style="margin-bottom:12px;font-size:13px">Physics explores the fundamental principles that govern the universe—from the smallest particles to the largest galaxies. My classroom develops problem-solving skills and deep understanding of how the world works.</p>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Curriculum</h3>
      <ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">
        <li><b>Mechanics</b> — motion, forces, energy, and momentum</li>
        <li><b>Waves and optics</b> — sound, light, reflection, and refraction</li>
        <li><b>Electricity and magnetism</b> — circuits, fields, and electromagnetism</li>
        <li><b>Thermodynamics</b> — heat, temperature, and energy transfer</li>
        <li><b>Modern physics</b> — relativity and quantum concepts (introductory)</li>
      </ul>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Demonstration Highlights</h3>
      <ul style="list-style:disc;padding-left:20px;font-size:13px">
        <li>Egg drop challenge — applying impulse and momentum concepts</li>
        <li>Standing wave demonstrations — using ropes and Chladni plates</li>
        <li>Van de Graaff generator — exploring static electricity</li>
        <li>Pendulum and projectile motion — timing and predicting trajectories</li>
      </ul>
    </div>`
  },

  'physics-pinewood-derby': {
    title: 'Forces PBL — Pinewood Derby',
    icon: 'atom',
    content: function() {
      var photos = [
        'processed_IMG_0711.jpg','processed_IMG_4822.jpg','processed_IMG_4823.jpg',
        'processed_IMG_5557.jpg','processed_IMG_5558.jpg','processed_IMG_5559.jpg'
      ];
      var photoSidebar = photos.map(function(p) {
        return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444;margin-bottom:8px" onclick="window._showLightbox(\'media/physics/pinewood-derby/'+p+'\')"><img src="media/physics/pinewood-derby/'+p+'" style="width:100%;display:block;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>';
      }).join('');

      var textColumn = ''+
        '<h2 style="color:#ff7043;font-size:20px;margin-bottom:4px">Forces PBL \u2014 Pinewood Derby</h2>'+
        '<p style="color:#888;font-size:13px;margin-bottom:14px">KS3 Forces \u2014 Re-Engineering Speed Through Iterative Design</p>'+

        '<div style="padding:10px 12px;background:#1a2a1a;border-radius:6px;border:1px solid #2e7d32;margin-bottom:14px">'+
          '<b style="color:#ff7043;font-size:13px">Curriculum Links</b>'+
          '<p style="font-size:12px;color:#a5d6a7;margin-top:4px">KS3 Science \u2014 Forces unit: gravity, friction, air resistance, unbalanced forces, centre of mass. This project bridges theoretical understanding with hands-on engineering, requiring students to apply physics concepts as design constraints in a competitive, inclusive build challenge.</p>'+
        '</div>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:6px">Context & Rationale</h3>'+
        '<p style="font-size:13px;margin-bottom:10px">During my KS3 \u2018Forces\u2019 unit, I identified a gap between students\u2019 theoretical understanding of concepts like friction, air resistance, and unbalanced forces, and their ability to apply this knowledge as engineers. To bridge this gap, I moved beyond worksheets and traditional practicals by recreating a classic \u2018Pinewood Derby\u2019 project, redesigned for a modern classroom with a focus on equity and iterative design.</p>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:6px">The Challenge</h3>'+
        '<p style="font-size:13px;margin-bottom:10px">Students were presented with a single, non-negotiable constraint: they would each receive an <b>identical block of wood</b> and a set of <b>uniform 3D-printed wheels</b>. This ensured that success was not determined by who had the most materials at home, but purely by their understanding of the science and the ingenuity of their modifications.</p>'+
        '<p style="font-size:13px;margin-bottom:16px">Their mission was to design, modify, and race a vehicle that would travel the furthest distance down a ramp, applying the forces content they had just learned.</p>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">My Role: From Lecturer to Design Coach</h3>'+
        '<div style="margin-bottom:10px">'+
          '<b style="color:#ff7043;font-size:13px">Scaffolding the Science</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">After teaching core theory (gravity, normal reaction, thrust, friction/drag), I facilitated a <b>"Force Mapping" workshop</b>. Students annotated their blank wooden blocks, predicting where friction would be highest and how shape would affect air resistance.</p>'+
        '</div>'+
        '<div style="margin-bottom:10px">'+
          '<b style="color:#ff7043;font-size:13px">Democratising Design with 3D Printing</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">To level the playing field, I designed and printed all wheels using standard PLA filament. This removed the variable of wobbly, poorly attached craft wheels and allowed students to focus on the body of the car. I taught students how the axles\u2019 surface finish and the wheel\u2019s contact patch would directly influence their results.</p>'+
        '</div>'+
        '<div style="margin-bottom:10px">'+
          '<b style="color:#ff7043;font-size:13px">Prototyping & Critical Testing</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">Students were given access to sandpaper, modelling clay (for added mass/balance), and low-friction tape. I circulated with probing questions, not answers:</p>'+
          '<ul style="list-style:disc;padding-left:20px;font-size:13px;color:#aaa">'+
            '<li><i>\u201CYou\u2019ve sanded the front into a wedge. How does that change the airflow compared to a square front?\u201D</i></li>'+
            '<li><i>\u201CWhere should you place the clay to lower the centre of mass? What does that prevent?\u201D</i></li>'+
          '</ul>'+
        '</div>'+
        '<div style="margin-bottom:16px">'+
          '<b style="color:#ff7043;font-size:13px">The Race & Retrospective</b>'+
          '<p style="font-size:13px;color:#aaa;margin-top:2px">The final derby was a data-rich event. We measured distance and time, then plotted results. Students were asked to explain a failure (e.g., <i>\u201CMy car wobbled because the axles weren\u2019t aligned\u201D</i>) just as rigorously as a success.</p>'+
        '</div>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Evidence of Impact</h3>'+
        '<ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">'+
          '<li><b>Deepened Application:</b> In post-project written assessments, student explanations of \u2018friction\u2019 were no longer abstract definitions. They referenced "axle drag" and "wheel-grip balance," showing a tangible grasp of applied physics.</li>'+
          '<li><b>Inclusive Engagement:</b> By providing identical starting materials and 3D-printed components, I removed the socioeconomic barrier often present in \u2018build-at-home\u2019 projects. The quietest student in the class, who struggles with written tests, emerged as a leader in aerodynamic sanding techniques.</li>'+
          '<li><b>Iterative Mindset:</b> The most significant outcome was the shift from "getting it right first time" to "test, tweak, and test again." Students celebrated modifications\u2014adding a teardrop clay fairing, lubricating axles with pencil graphite\u2014as much as winning the race.</li>'+
        '</ul>'+

        '<h3 style="color:#ffd700;font-size:15px;margin-bottom:8px">Reflection</h3>'+
        '<p style="font-size:13px;margin-bottom:16px;font-style:italic;color:#aaa">This project reaffirmed my belief that the teacher\u2019s role is not to provide answers, but to design constraints that provoke curiosity. By controlling the variables (identical wood, 3D-printed wheels), I forced the scientific thinking into the foreground. Moving forward, I would like to introduce a \u2018worst design\u2019 category to explicitly teach the effects of high drag and high friction, turning failure into an even more powerful learning tool.</p>';

      var mediaColumn = ''+
        '<div style="position:sticky;top:12px">'+
          '<h3 style="color:#ffd700;font-size:14px;margin-bottom:8px">Photo Gallery</h3>'+
          '<p style="font-size:11px;color:#777;margin-bottom:8px">Click any image to enlarge</p>'+
          photoSidebar+
          '<h3 style="color:#ffd700;font-size:14px;margin-bottom:8px;margin-top:16px">Video</h3>'+
          '<div style="background:#2a2a3e;border-radius:6px;padding:10px">'+
            '<b style="color:#ff7043;font-size:12px">The Pinewood Derby Race</b>'+
            '<video controls style="width:100%;border-radius:4px;margin-top:6px" preload="none"><source src="media/physics/pinewood-derby/processed_Pinewood derby.MP4" type="video/mp4">Your browser does not support video playback.</video>'+
          '</div>'+
        '</div>';

      return '<div style="color:#ccc;line-height:1.8;max-width:960px;display:flex;gap:28px;align-items:flex-start">'+
        '<div style="flex:1;min-width:0">'+textColumn+'</div>'+
        '<div style="width:260px;flex-shrink:0">'+mediaColumn+'</div>'+
      '</div>';
    }
  },

  'field-trips': {
    title: 'Field Trips',
    icon: 'compass',
    content: `<div style="color:#ccc;line-height:2;max-width:600px">
      <h2 style="color:#ffca28;font-size:18px;margin-bottom:8px">Field Trips</h2>
      <p style="margin-bottom:12px;font-size:13px">Field trips transform abstract concepts into tangible experiences. Taking students beyond the classroom walls allows them to see science in action.</p>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Recent Trips</h3>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:8px">
        <b style="color:#ffca28">Natural History Museum</b>
        <p style="font-size:12px;color:#aaa">Students explored exhibits on evolution, geology, and biodiversity. The fossil hall connected directly to our biology unit on natural selection.</p>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:8px">
        <b style="color:#ffca28">Water Treatment Plant</b>
        <p style="font-size:12px;color:#aaa">Chemistry and environmental science students toured the municipal water treatment facility, observing filtration and quality testing procedures firsthand.</p>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:8px">
        <b style="color:#ffca28">University Physics Lab</b>
        <p style="font-size:12px;color:#aaa">Advanced students visited the university physics department, seeing research-grade equipment and speaking with graduate students about careers in science.</p>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:8px">
        <b style="color:#ffca28">Botanical Gardens</b>
        <p style="font-size:12px;color:#aaa">Biology students documented plant adaptations and learned about conservation efforts at the regional botanical garden.</p>
      </div>
    </div>`
  },

  'lab-activities': {
    title: 'Lab Activities',
    icon: 'microscope',
    content: `<div style="color:#ccc;line-height:2;max-width:600px">
      <h2 style="color:#ce93d8;font-size:18px;margin-bottom:8px">Lab Activities</h2>
      <p style="margin-bottom:12px;font-size:13px">The laboratory is where science comes alive. Lab activities are designed to build practical skills, reinforce theoretical concepts, and cultivate a spirit of inquiry and discovery.</p>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Safety First</h3>
      <ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">
        <li>Proper use of PPE (goggles, gloves, lab coats)</li>
        <li>Safe handling of glassware, chemicals, and heating equipment</li>
        <li>Emergency procedures and first-aid locations</li>
        <li>Waste disposal guidelines</li>
      </ul>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Featured Labs</h3>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:6px">
        <b style="color:#ce93d8">Chemistry: Acid-Base Titration</b>
        <p style="font-size:12px;color:#aaa">Determining unknown acid concentration using a standardized base and phenolphthalein indicator.</p>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:6px">
        <b style="color:#ce93d8">Biology: Enzyme Activity</b>
        <p style="font-size:12px;color:#aaa">Investigating the effect of temperature and pH on catalase activity using potato extracts.</p>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:6px">
        <b style="color:#ce93d8">Physics: Ohm's Law Investigation</b>
        <p style="font-size:12px;color:#aaa">Building circuits with resistors, measuring voltage and current, verifying Ohm's law through graphical analysis.</p>
      </div>
      <div style="padding:8px;background:#2a2a3e;border-radius:4px;margin-bottom:6px">
        <b style="color:#ce93d8">Cross-Disciplinary: Water Quality Analysis</b>
        <p style="font-size:12px;color:#aaa">Testing local water samples for pH, dissolved oxygen, nitrates, and turbidity—combining chemistry, biology, and environmental science.</p>
      </div>
    </div>`
  },

  'science-club': {
    title: 'Science Club',
    icon: 'rocket',
    content: `<div style="color:#ccc;line-height:2;max-width:600px">
      <h2 style="color:#ef5350;font-size:18px;margin-bottom:8px">Science Club</h2>
      <p style="margin-bottom:12px;font-size:13px">The Science Club is an after-school program for students who want to explore science beyond the curriculum. It's a space for creativity, competition, and collaboration.</p>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Mission</h3>
      <p style="margin-bottom:12px;font-size:13px">To provide a welcoming environment where any student, regardless of background, can discover the joy of scientific exploration and develop teamwork and leadership skills.</p>
      <h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Activities</h3>
      <ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">
        <li><b>Science Fair Preparation</b> — Mentoring for project development and presentation skills</li>
        <li><b>STEM Challenges</b> — Bridge building, water rockets, solar ovens, egg drop vehicles</li>
        <li><b>Guest Speakers</b> — Marine biologist, chemical engineer, science journalist</li>
        <li><b>Citizen Science</b> — Bird population surveys, light pollution monitoring</li>
      </ul>
      <div style="padding:8px;background:#3a1a1a;border-radius:4px;border:1px solid #c62828;text-align:center">
        <b style="color:#ef5350">Join us every Thursday after school in Room 204!</b>
        <p style="font-size:12px;color:#e57373">All students welcome — no prior experience needed, just curiosity.</p>
      </div>
    </div>`
  },

  archaeology: {
    title: 'Archaeology',
    icon: 'trowel',
    content: function() {
      var photos = [
        'processed_IMG_3121.jpg','processed_IMG_8451.jpg','processed_IMG_8462.jpg','processed_IMG_8469.jpg',
        'processed_IMG_8752.jpg','processed_IMG_8753.jpg','processed_IMG_8754.jpg','processed_IMG_8755.jpg',
        'processed_IMG_8756.jpg','processed_IMG_8757.jpg','processed_IMG_8778.jpg','processed_IMG_8779.jpg',
        'processed_IMG_8780.jpg','processed_IMG_8783.jpg','processed_IMG_8784.jpg','processed_IMG_8785.jpg',
        'processed_IMG_8786.jpg','processed_IMG_8908.jpg','processed_IMG_8909.jpg','processed_IMG_8910.jpg',
        'processed_IMG_8911.jpg','processed_IMG_8912.jpg','processed_IMG_8913.jpg','processed_IMG_8914.jpg',
        'processed_IMG_8915.jpg','processed_IMG_8916.jpg','processed_IMG_8917.jpg'
      ];
      var videos = [
        {file:'IMG_8781.MOV',label:'Excavation in Progress'},
        {file:'IMG_8782.MOV',label:'Site Surveying'},
        {file:'IMG_8787.MOV',label:'Trowel Work'},
        {file:'IMG_8788.MOV',label:'Artefact Recovery'},
        {file:'IMG_8789.MOV',label:'Recording Finds'},
        {file:'IMG_8790.MOV',label:'Post-Excavation Analysis'},
        {file:'IMG_8918.MOV',label:'Team at Work'},
        {file:'IMG_8919.MOV',label:'Digging Techniques'},
        {file:'IMG_8920.MOV',label:'Wrap-Up'}
      ];
      var photoGrid = photos.map(function(p, i) {
        return '<div style="cursor:pointer;border-radius:4px;overflow:hidden;background:#2a2a3e;border:1px solid #444" onclick="window._showLightbox(\'media/archaeology/'+p+'\')"><img src="media/archaeology/'+p+'" style="width:100%;height:100%;object-fit:cover;aspect-ratio:4/3" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>';
      }).join('');
      var videoList = videos.map(function(v) {
        return '<div style="margin-bottom:12px;background:#2a2a3e;border-radius:4px;padding:8px"><b style="color:#bcaaa4;font-size:13px">'+v.label+'</b><video controls style="width:100%;max-height:360px;border-radius:4px;margin-top:6px" preload="none"><source src="media/archaeology/'+v.file+'" type="video/mp4"><source src="media/archaeology/'+v.file+'" type="video/quicktime">Your browser does not support video playback.</video></div>';
      }).join('');
      return '<div style="color:#ccc;line-height:2">'+
        '<h2 style="color:#bcaaa4;font-size:18px;margin-bottom:8px">Archaeology</h2>'+
        '<p style="margin-bottom:12px;font-size:13px">Archaeology brings history to life by uncovering the physical traces of past civilizations. Through hands-on fieldwork, students learn how scientists piece together human history.</p>'+
        '<h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Pennyhooks Archaeology</h3>'+
        '<p style="font-size:13px;margin-bottom:8px">Students participated in real archaeological investigation at Pennyhooks, working alongside professional archaeologists:</p>'+
        '<ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px">'+
          '<li><b>Site surveying</b> — mapping and documenting the excavation area</li>'+
          '<li><b>Stratigraphy observation</b> — reading soil layers for chronological sequences</li>'+
          '<li><b>Artefact recovery</b> — careful excavation, recording, and preservation</li>'+
          '<li><b>Post-excavation analysis</b> — cleaning, cataloguing, and interpreting finds</li>'+
        '</ul>'+
        '<h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Photo Gallery</h3>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin-bottom:16px">'+photoGrid+'</div>'+
        '<h3 style="color:#ffd700;font-size:14px;margin-bottom:6px">Videos</h3>'+videoList+
        '<h3 style="color:#ffd700;font-size:14px;margin-bottom:6px;margin-top:16px">What Students Learned</h3>'+
        '<ul style="list-style:disc;padding-left:20px;font-size:13px">'+
          '<li>Scientific method in practice — hypotheses about site usage</li>'+
          '<li>Interdisciplinary connections — chemistry, biology, and physics in archaeology</li>'+
          '<li>Patience and precision — meticulous attention to detail</li>'+
          '<li>Teamwork — collaborative efforts where every role matters</li>'+
        '</ul>'+
      '</div>';
    }
  },

  cv: {
    title: 'CV',
    icon: 'cv',
    content: `<div style="color:#ccc;line-height:1.8;max-width:650px">
      <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #222">
        <div style="flex:1">
          <h2 style="color:#fff;font-size:22px;margin:0 0 2px 0;font-weight:700">Michael Chan</h2>
          <p style="color:#00f0ff;font-size:14px;margin:0;font-weight:500">STEM Teacher & Curriculum Coordinator</p>
          <p style="color:#888;font-size:12px;margin:6px 0 0 0;font-style:italic">Dedicated STEM educator with 5+ years of experience leading IGCSE and High School Diploma curricula. Skilled in curriculum development, cross-curricular fieldwork, and team leadership. Passionate about hands-on, real-world science education.</p>
        </div>
        <div style="flex-shrink:0;text-align:right;font-size:12px;color:#888;line-height:1.8">
          <div style="color:#00f0ff">&#9993; mtlchan13892@gmail.com</div>
          <div style="color:#ff00aa">&#x1F517; LinkedIn: <a href="https://www.linkedin.com/in/michael-chan-22a4b71aa/" style="color:#ff00aa" target="_blank">Michael Chan</a></div>
        </div>
      </div>

      <h3 style="color:#00f0ff;font-size:14px;margin-bottom:8px;border-bottom:1px solid #222;padding-bottom:4px">&#x25B6; CURRENT ROLE</h3>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <b style="color:#fff;font-size:13px">Saint Too Bloom Academy</b>
        <span style="color:#00f0ff;font-size:11px;font-family:Consolas,monospace">AUG 2023 — PRESENT</span>
      </div>
      <p style="color:#ccc;font-size:12px;margin:0 0 6px 0;font-weight:600">Science and Makerspace Coordinator</p>
      <p style="color:#aaa;font-size:12px;margin:0 0 4px 0"><b style="color:#888">Teaching:</b> IGCSE Co-ordinated Science (0654) \u00b7 IGCSE Computer Science (0478) \u00b7 HSD Makerspace Engineering</p>
      <p style="color:#aaa;font-size:12px;margin:0 0 12px 0"><b style="color:#888">Duties:</b> Head the Science and Makerspace Departments, managing a team of 3 Teachers and 1 Lab Technician. Lead curriculum development for Science and Computer Science, ensuring alignment with IGCSE and High School Diploma standards.</p>

      <h3 style="color:#00f0ff;font-size:14px;margin-bottom:8px;border-bottom:1px solid #222;padding-bottom:4px">&#x25B6; QUALIFICATIONS</h3>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <b style="color:#fff;font-size:13px">Newcastle University</b>
        <span style="color:#00f0ff;font-size:11px;font-family:Consolas,monospace">2018 — 2019</span>
      </div>
      <p style="color:#aaa;font-size:12px;margin:0 0 10px 0">PGCE in Science (with Biology Specialism)</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <b style="color:#fff;font-size:13px">University of Hull</b>
        <span style="color:#00f0ff;font-size:11px;font-family:Consolas,monospace">2012 — 2015</span>
      </div>
      <p style="color:#aaa;font-size:12px;margin:0 0 12px 0">Biomedical Science BSc (Honours)</p>

      <h3 style="color:#00f0ff;font-size:14px;margin-bottom:8px;border-bottom:1px solid #222;padding-bottom:4px">&#x25B6; OTHER EXPERIENCE</h3>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <b style="color:#fff;font-size:13px">MG Tutors</b>
        <span style="color:#00f0ff;font-size:11px;font-family:Consolas,monospace">2022 — 2023</span>
      </div>
      <p style="color:#aaa;font-size:12px;margin:0 0 8px 0">Freelance tutor — one-on-one online tutoring in math, science, and humanities for high-achieving students grades 9\u201412. Monitored progress and adjusted teaching approaches for optimal outcomes.</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <b style="color:#fff;font-size:13px">Genius Development</b>
        <span style="color:#00f0ff;font-size:11px;font-family:Consolas,monospace">2019 — 2022</span>
      </div>
      <p style="color:#aaa;font-size:12px;margin:0 0 8px 0">Centre Manager / Lead Teacher — oversaw academic and operational aspects including curriculum development, instructional quality, and resource allocation. Recruited, trained, and managed subject-matter expert teachers.</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <b style="color:#fff;font-size:13px">ProPharma Group</b>
        <span style="color:#00f0ff;font-size:11px;font-family:Consolas,monospace">2017 — 2018</span>
      </div>
      <p style="color:#aaa;font-size:12px;margin:0 0 12px 0">Medical Information Officer — provided accurate medical information to healthcare professionals, ensured regulatory compliance of medical communications.</p>

      <h3 style="color:#00f0ff;font-size:14px;margin-bottom:8px;border-bottom:1px solid #222;padding-bottom:4px">&#x25B6; EXTRA-CURRICULAR</h3>
      <div style="margin-bottom:10px;padding:8px 10px;background:#111827;border-radius:4px;border-left:2px solid #00f0ff">
        <b style="color:#00f0ff;font-size:13px">STEM Club</b><span style="color:#888;font-size:11px;margin-left:8px">2023 — Present</span>
        <p style="color:#aaa;font-size:12px;margin:4px 0 0 0">Guide students through design and prototyping for international STEM competitions. Notable wins: <b style="color:#ffd700">Grand Prize — PolyU Design Hatch Competition</b>, <b style="color:#ffd700">Top 10 (CS Section) — HKAGE Young SEAM Award</b>.</p>
      </div>
      <div style="margin-bottom:12px;padding:8px 10px;background:#111827;border-radius:4px;border-left:2px solid #ff00aa">
        <b style="color:#ff00aa;font-size:13px">Volunteering Club</b><span style="color:#888;font-size:11px;margin-left:8px">2025 — Present</span>
        <p style="color:#aaa;font-size:12px;margin:4px 0 0 0">Organise student-led volunteering events for STEM outreach. Notable: STEM workshops for underprivileged children with the Changing Young Lives Foundation, Box of Hope charity gift drive.</p>
      </div>

      <div style="margin-top:16px;padding:10px 12px;background:#111827;border-radius:6px;border:1px solid #222;font-size:12px">
        <span style="color:#00f0ff">&#9993;</span> <a href="mailto:mtlchan13892@gmail.com" style="color:#00f0ff">mtlchan13892@gmail.com</a>
        <span style="color:#ff00aa;margin-left:20px">&#x1F517;</span> <span style="color:#ccc">LinkedIn: <a href="https://www.linkedin.com/in/michael-chan-22a4b71aa/" style="color:#ff00aa" target="_blank">Michael Chan</a></span>
      </div>
    </div>`
  },

  cursors: {
    title: 'Cursor Changer',
    icon: 'cursor',
    content: function() {
      var data = window.CURSOR_DATA || [];
      var grid = data.map(function(c) {
        var preview = c.svg ?
          '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:#111827;border-radius:6px;border:1px solid #333">' + c.svg + '</div>' :
          '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:#111827;border-radius:6px;border:1px solid #333;font-size:24px;color:#888">&#x21E8;</div>';
        return '<div style="text-align:center;cursor:default;padding:8px;border-radius:6px;background:#1a2340;transition:background .2s" ' +
          'onmouseover="this.style.background=\'#222840\'" onmouseout="this.style.background=\'#1a2340\'" ' +
          'onmousedown="window._setCursor(\'' + c.id + '\')">' +
          preview +
          '<div style="color:#ccc;font-size:11px;margin-top:6px">' + c.name + '</div></div>';
      }).join('');

      return '<div style="color:#ccc">' +
        '<h2 style="color:#00f0ff;font-size:16px;margin-bottom:4px">Cursor Changer</h2>' +
        '<p style="color:#888;font-size:12px;margin-bottom:12px">Click a cursor below to change it across the entire desktop.</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px">' + grid + '</div>' +
        '<p id="cursor-label" style="color:#00f0ff;font-size:12px;margin-top:10px;text-align:center">Current: Default</p>' +
      '</div>';
    }
  },

  binaryGame: {
    title: "Mr Chan's Binary Game",
    icon: 'binaryGame',
    content: function() {
      var uid = 'bg' + Math.random().toString(36).substr(2,6);
      return '<div id="binary-game-' + uid + '" style="display:flex;flex-direction:column;align-items:center;height:100%;font-family:\'Segoe UI\',system-ui,sans-serif;color:#ccc;padding:20px">' +
        '<h1 style="color:#00f0ff;font-size:24px;margin-bottom:6px;text-shadow:0 0 12px rgba(0,240,255,.3)">Mr Chan\'s Binary Game</h1>' +
        '<p style="color:#888;font-size:12px;margin-bottom:16px">Click the bits to toggle them — match the binary to the decimal number</p>' +
        '<div style="background:#111827;border:1px solid #1e2a3a;border-radius:12px;padding:20px 32px;text-align:center;min-width:280px">' +
          '<div style="margin-bottom:8px">' +
            '<span style="color:#888;font-size:11px">TARGET</span>' +
            '<div id="bg-target-' + uid + '" style="font-size:48px;font-weight:900;color:#ffd700;margin:4px 0">0</div>' +
            '<span id="bg-hint-' + uid + '" style="color:#ffd700;font-size:11px;display:none">0 = 0</span>' +
          '</div>' +
          '<div id="bg-bits-' + uid + '" style="display:flex;justify-content:center;gap:8px;margin:16px 0;flex-wrap:wrap"></div>' +
          '<button id="bg-check-' + uid + '" style="margin-top:8px;padding:10px 32px;background:linear-gradient(135deg,#00f0ff,#0088aa);border:none;border-radius:8px;color:#000;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:1px">CHECK</button>' +
        '</div>' +
        '<div style="display:flex;gap:32px;margin-top:16px;font-size:13px">' +
          '<div style="text-align:center"><div style="color:#888;font-size:10px">SCORE</div><div id="bg-score-' + uid + '" style="color:#00f0ff;font-weight:700;font-size:22px">0</div></div>' +
          '<div style="text-align:center"><div style="color:#888;font-size:10px">TIME</div><div id="bg-time-' + uid + '" style="color:#ff00aa;font-weight:700;font-size:22px">60</div></div>' +
          '<div style="text-align:center"><div style="color:#888;font-size:10px">LEVEL</div><div id="bg-level-' + uid + '" style="color:#ffd700;font-weight:700;font-size:22px">1</div></div>' +
        '</div>' +
        '<div id="bg-feedback-' + uid + '" style="margin-top:12px;font-size:14px;height:20px"></div>' +
      '</div>' +
      '<style>' +
        '#binary-game-' + uid + ' .bit-box{width:44px;height:52px;background:#1a1a2e;border:2px solid #333;border-radius:6px;color:#aaa;font-size:22px;font-weight:900;font-family:Consolas,monospace;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}' +
        '#binary-game-' + uid + ' .bit-box:hover{background:#2a2a4e;border-color:#00f0ff;color:#fff}' +
        '#binary-game-' + uid + ' .bit-box.on{background:#0a2a2a;border-color:#00f0ff;color:#00f0ff;box-shadow:0 0 10px rgba(0,240,255,.2)}' +
        '#binary-game-' + uid + ' .bit-box.correct{background:#0a2a0a!important;border-color:#4caf50!important;color:#4caf50!important;box-shadow:0 0 12px rgba(76,175,80,.4)!important}' +
        '#binary-game-' + uid + ' .bit-box.wrong{background:#2a0a0a!important;border-color:#f44336!important;color:#f44336!important;animation:bg-shake 0.4s}' +
        '@keyframes bg-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}' +
      '</style>';
    }
  }
};
