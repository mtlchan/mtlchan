function createDialogueNode(speaker, text, choices) {
  var node = { text: text };
  if (speaker) node.speaker = speaker;
  if (choices) node.choices = choices;
  return node;
}

function roomLayout(bgColor, floorY, floorColor, wallColor, nameY) {
  return [
    { x: 0, y: floorY, w: 960, h: 640 - floorY, color: floorColor, type: 'ground', label: '' },
    { x: 0, y: floorY - 3, w: 960, h: 4, color: '#5C4033', type: 'ground', label: '' },
    { x: 80, y: nameY || 30, w: 800, h: floorY - (nameY || 30) - 4, color: wallColor || 'rgba(255,255,255,0.04)', type: 'ground', label: '' }
  ];
}

var AREAS = {
  downtown: {
    name: 'Downtown',
    backgroundColor: '#87CEEB',
    buildings: [
      { x: 0, y: 490, w: 960, h: 150, color: '#6B8E6B', label: '', type: 'ground' },
      { x: 0, y: 178, w: 960, h: 62, color: '#555555', label: '', type: 'ground' },
      { x: 580, y: 180, w: 2, h: 58, color: '#CCCC00', label: '', type: 'ground' },
      { x: 380, y: 180, w: 2, h: 58, color: '#CCCC00', label: '', type: 'ground' },

      { x: 46, y: 10, w: 144, h: 120, wallColor: '#A0522D', roofColor: '#6B3410', label: 'HOME', type: 'house', doorW: 28, doorH: 28, doorColor: '#4A2510' },
      { x: 250, y: 14, w: 158, h: 106, wallColor: '#DEB887', roofColor: '#B8860B', label: 'UNIVERSITY', type: 'office', doorW: 34, doorH: 30, doorColor: '#8B6914', awningColor: '#A0522D' },
      { x: 468, y: 14, w: 134, h: 106, wallColor: '#778899', roofColor: '#4A5A6A', label: 'GYM', type: 'gym', doorW: 42, doorH: 32, doorColor: '#3A4A5A' },
      { x: 660, y: 14, w: 148, h: 106, wallColor: '#2E7D32', roofColor: '#1B5E20', label: 'PARK', type: 'landmark', symbol: 'tree', doorW: 30, doorH: 28, doorColor: '#1B5E20' },

      { x: 46, y: 310, w: 144, h: 100, wallColor: '#4E342E', roofColor: '#3E2723', label: 'BAR', type: 'bar', doorW: 26, doorH: 28, doorColor: '#2E1A10' },
      { x: 250, y: 310, w: 158, h: 100, wallColor: '#C8A84E', roofColor: '#A08830', label: 'SHOP', type: 'shop', doorW: 34, doorH: 30, doorColor: '#8B7332', awningColor: '#E8A84E' },
      { x: 470, y: 310, w: 148, h: 100, wallColor: '#F5F5DC', roofColor: '#DCDCC8', label: 'HOSPITAL', type: 'hospital', doorW: 36, doorH: 30, doorColor: '#C8C8B4' },
      { x: 680, y: 310, w: 138, h: 100, wallColor: '#607D8B', roofColor: '#455A64', label: 'OFFICE', type: 'office', doorW: 32, doorH: 30, doorColor: '#37474F' }
    ],
    collidables: [],
    portals: [
      { x: 98, y: 112, w: 48, h: 18, targetArea: 'home', targetX: 470, targetY: 590 },
      { x: 306, y: 104, w: 48, h: 18, targetArea: 'university', targetX: 470, targetY: 590 },
      { x: 510, y: 104, w: 48, h: 18, targetArea: 'gym', targetX: 470, targetY: 590 },
      { x: 710, y: 104, w: 48, h: 18, targetArea: 'park', targetX: 470, targetY: 590 },
      { x: 92, y: 392, w: 52, h: 18, targetArea: 'bar', targetX: 470, targetY: 590 },
      { x: 306, y: 392, w: 52, h: 18, targetArea: 'shop', targetX: 470, targetY: 590 },
      { x: 518, y: 392, w: 52, h: 18, targetArea: 'hospital', targetX: 470, targetY: 590 },
      { x: 724, y: 392, w: 52, h: 18, targetArea: 'office', targetX: 470, targetY: 590 }
    ],
    interactables: [],
    npcs: [
      { name: 'Citizen', feetX: 200, feetY: 540, color: '#66ccff',
        dialogues: [
          createDialogueNode('Citizen', 'Welcome to town! Lots of places to explore here.'),
          createDialogueNode('Citizen', 'The university is great for boosting your intelligence. The gym builds strength.')
        ] },
      { name: 'Shady Guy', feetX: 750, feetY: 530, color: '#ff6666',
        dialogues: [
          createDialogueNode('Shady Guy', 'Psst... the bar has some interesting characters.'),
          createDialogueNode('Shady Guy', 'And if you want real action, check out the gym\'s back room.'),
          createDialogueNode('Shady Guy', 'I hear there\'s a fight club down there. But you didn\'t hear it from me.')
        ] }
    ],
    playerSpawn: { x: 460, y: 560 }
  },

  // ── HOME ──
  home: {
    name: 'Home',
    backgroundColor: '#D2B48C',
    buildings: [
      { x: 0, y: 0, w: 960, h: 360, color: '#C4A880', type: 'ground', label: '' },
      { x: 0, y: 356, w: 960, h: 4, color: '#6B4A30', type: 'ground', label: '' },
      { x: 0, y: 360, w: 960, h: 280, color: '#8B6B4A', type: 'ground', label: '' },
      { x: 300, y: 80, w: 360, h: 36, color: 'rgba(255,255,255,0.1)', type: 'ground', label: 'HOME' },
      { x: 100, y: 400, w: 180, h: 70, color: '#8B6914', type: 'furniture', furnType: 'bed', label: '' },
      { x: 296, y: 420, w: 50, h: 40, color: '#6B4226', type: 'furniture', furnType: 'nightstand', label: '' },
      { x: 430, y: 400, w: 260, h: 120, color: '#8B4513', type: 'furniture', furnType: 'rug', label: '' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#6B4A30', doorColor: '#3A1F0A', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 0, y: 0, w: 960, h: 360 },
      { x: 0, y: 360, w: 50, h: 280 },
      { x: 910, y: 360, w: 50, h: 280 },
      { x: 100, y: 400, w: 180, h: 70 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 110, targetY: 160 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  },

  // ── UNIVERSITY ──
  university: {
    name: 'University',
    backgroundColor: '#DEB887',
    buildings: [
      { x: 0, y: 0, w: 960, h: 380, color: '#C8A870', type: 'ground', label: '' },
      { x: 0, y: 376, w: 960, h: 4, color: '#8B6914', type: 'ground', label: '' },
      { x: 0, y: 380, w: 960, h: 260, color: '#6B5230', type: 'ground', label: '' },
      { x: 240, y: 40, w: 480, h: 32, color: 'rgba(255,255,255,0.1)', type: 'ground', label: 'UNIVERSITY' },
      { x: 80, y: 110, w: 500, h: 200, color: '#2E5A2E', type: 'furniture', furnType: 'board', detail: 'E = mc\u00B2', label: '' },
      { x: 640, y: 180, w: 120, h: 80, color: '#6B4226', type: 'furniture', furnType: 'desk', label: '' },
      { x: 140, y: 440, w: 80, h: 50, color: '#6B4226', type: 'furniture', furnType: 'desk', label: '' },
      { x: 280, y: 440, w: 80, h: 50, color: '#6B4226', type: 'furniture', furnType: 'desk', label: '' },
      { x: 680, y: 360, w: 70, h: 150, color: '#5B3216', type: 'furniture', furnType: 'shelf', shelves: 4, books: 12, label: '' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#8B6914', doorColor: '#5D3A1A', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 0, y: 0, w: 960, h: 380 },
      { x: 0, y: 380, w: 50, h: 260 },
      { x: 910, y: 380, w: 50, h: 260 },
      { x: 640, y: 148, w: 120, h: 112 },
      { x: 680, y: 360, w: 70, h: 150 },
      { x: 80, y: 110, w: 500, h: 200 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 340, targetY: 155 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  },

  // ── GYM ──
  gym: {
    name: 'Gym',
    backgroundColor: '#788898',
    buildings: [
      { x: 0, y: 0, w: 960, h: 370, color: '#667686', type: 'ground', label: '' },
      { x: 0, y: 366, w: 960, h: 4, color: '#4A5A6A', type: 'ground', label: '' },
      { x: 0, y: 370, w: 960, h: 270, color: '#5A5A5A', type: 'ground', label: '' },
      { x: 310, y: 40, w: 340, h: 32, color: 'rgba(255,255,255,0.1)', type: 'ground', label: 'GYM' },
      { x: 100, y: 140, w: 200, h: 120, color: '#3A5A3A', type: 'furniture', furnType: 'mat', label: '' },
      { x: 600, y: 160, w: 100, h: 140, color: '#8B0000', type: 'furniture', furnType: 'bag', label: '' },
      { x: 100, y: 420, w: 80, h: 70, color: '#666', type: 'furniture', furnType: 'rack', detail: 'weights', label: '' },
      { x: 600, y: 400, w: 200, h: 70, color: '#C8C8C8', type: 'ground', label: 'MIRROR' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#5A6A7A', doorColor: '#3A4A5A', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 0, y: 0, w: 960, h: 370 },
      { x: 0, y: 370, w: 50, h: 270 },
      { x: 910, y: 370, w: 50, h: 270 },
      { x: 100, y: 420, w: 80, h: 70 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 530, targetY: 155 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  },

  // ── PARK ──
  park: {
    name: 'Park',
    backgroundColor: '#87CEEB',
    buildings: [
      { x: 0, y: 0, w: 960, h: 290, color: '#87CEEB', type: 'ground', label: '' },
      { x: 0, y: 280, w: 960, h: 360, color: '#4A8C3A', type: 'ground', label: '' },
      { x: 200, y: 290, w: 560, h: 32, color: 'rgba(255,255,255,0.15)', type: 'ground', label: 'PARK' },
      { x: 320, y: 310, w: 320, h: 220, color: '#8B7A5A', type: 'ground', label: '' },
      { x: 120, y: 200, w: 80, h: 100, color: '#2E7D32', type: 'landmark', symbol: 'tree', label: '' },
      { x: 740, y: 180, w: 80, h: 110, color: '#2E7D32', type: 'landmark', symbol: 'tree', label: '' },
      { x: 80, y: 380, w: 140, h: 40, color: '#6B4226', type: 'furniture', furnType: 'bench', label: '' },
      { x: 740, y: 400, w: 140, h: 40, color: '#6B4226', type: 'furniture', furnType: 'bench', label: '' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#5D3A1A', doorColor: '#3A1F0A', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 120, y: 200, w: 80, h: 100 },
      { x: 740, y: 180, w: 80, h: 110 },
      { x: 80, y: 380, w: 140, h: 40 },
      { x: 740, y: 400, w: 140, h: 40 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 750, targetY: 155 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  },

  // ── BAR ──
  bar: {
    name: 'Bar',
    backgroundColor: '#3E2723',
    buildings: [
      { x: 0, y: 0, w: 960, h: 370, color: '#2E1A10', type: 'ground', label: '' },
      { x: 0, y: 366, w: 960, h: 4, color: '#1A0A00', type: 'ground', label: '' },
      { x: 0, y: 370, w: 960, h: 270, color: '#4A2A1A', type: 'ground', label: '' },
      { x: 320, y: 40, w: 320, h: 32, color: 'rgba(255,255,255,0.1)', type: 'ground', label: 'BAR' },
      { x: 120, y: 100, w: 720, h: 70, color: '#5D3A1A', type: 'furniture', furnType: 'counter', detail: 'bottles', label: '' },
      { x: 180, y: 440, w: 90, h: 50, color: '#6B4226', type: 'furniture', furnType: 'table', label: '' },
      { x: 500, y: 440, w: 90, h: 50, color: '#6B4226', type: 'furniture', furnType: 'table', label: '' },
      { x: 750, y: 140, w: 60, h: 130, color: '#5B3216', type: 'furniture', furnType: 'shelf', shelves: 4, books: 0, label: '' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#4A2A1A', doorColor: '#2E1A0A', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 0, y: 0, w: 960, h: 370 },
      { x: 0, y: 370, w: 50, h: 270 },
      { x: 910, y: 370, w: 50, h: 270 },
      { x: 120, y: 100, w: 720, h: 70 },
      { x: 750, y: 140, w: 60, h: 130 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 110, targetY: 435 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  },

  // ── SHOP ──
  shop: {
    name: 'Shop',
    backgroundColor: '#D4B84E',
    buildings: [
      { x: 0, y: 0, w: 960, h: 370, color: '#C4A83E', type: 'ground', label: '' },
      { x: 0, y: 366, w: 960, h: 4, color: '#8B7332', type: 'ground', label: '' },
      { x: 0, y: 370, w: 960, h: 270, color: '#A08830', type: 'ground', label: '' },
      { x: 320, y: 40, w: 320, h: 32, color: 'rgba(255,255,255,0.15)', type: 'ground', label: 'SHOP' },
      { x: 80, y: 120, w: 70, h: 180, color: '#6B4226', type: 'furniture', furnType: 'shelf', shelves: 5, books: 15, label: 'ITEMS' },
      { x: 210, y: 120, w: 70, h: 180, color: '#6B4226', type: 'furniture', furnType: 'shelf', shelves: 5, books: 12, label: 'GEAR' },
      { x: 640, y: 160, w: 140, h: 80, color: '#6B4226', type: 'furniture', furnType: 'counter', label: '' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#8B7332', doorColor: '#5D3A1A', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 0, y: 0, w: 960, h: 370 },
      { x: 0, y: 370, w: 50, h: 270 },
      { x: 910, y: 370, w: 50, h: 270 },
      { x: 80, y: 120, w: 70, h: 180 },
      { x: 210, y: 120, w: 70, h: 180 },
      { x: 640, y: 160, w: 140, h: 80 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 340, targetY: 435 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  },

  // ── HOSPITAL ──
  hospital: {
    name: 'Hospital',
    backgroundColor: '#F5F5DC',
    buildings: [
      { x: 0, y: 0, w: 960, h: 370, color: '#E8E8D0', type: 'ground', label: '' },
      { x: 0, y: 366, w: 960, h: 4, color: '#C8C8B4', type: 'ground', label: '' },
      { x: 0, y: 370, w: 960, h: 270, color: '#E0E0E0', type: 'ground', label: '' },
      { x: 280, y: 30, w: 400, h: 32, color: 'rgba(0,0,0,0.08)', type: 'ground', label: 'HOSPITAL' },
      { x: 760, y: 140, w: 70, h: 160, color: '#F0F0F0', type: 'furniture', furnType: 'cabinet', label: '' },
      { x: 100, y: 420, w: 120, h: 60, color: '#FFFFFF', type: 'furniture', furnType: 'bed', label: '' },
      { x: 300, y: 420, w: 120, h: 60, color: '#FFFFFF', type: 'furniture', furnType: 'bed', label: '' },
      { x: 560, y: 420, w: 100, h: 55, color: '#D8D8C8', type: 'furniture', furnType: 'desk', label: 'NURSE' },
      { x: 160, y: 110, w: 16, h: 30, color: '#FF4444', type: 'ground', label: '' },
      { x: 160, y: 122, w: 40, h: 6, color: '#FF4444', type: 'ground', label: '' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#C8C8B4', doorColor: '#A0A090', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 0, y: 0, w: 960, h: 370 },
      { x: 0, y: 370, w: 50, h: 270 },
      { x: 910, y: 370, w: 50, h: 270 },
      { x: 760, y: 140, w: 70, h: 160 },
      { x: 100, y: 420, w: 120, h: 60 },
      { x: 300, y: 420, w: 120, h: 60 },
      { x: 560, y: 420, w: 100, h: 55 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 560, targetY: 435 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  },

  // ── OFFICE ──
  office: {
    name: 'Office',
    backgroundColor: '#607D8B',
    buildings: [
      { x: 0, y: 0, w: 960, h: 370, color: '#546E7A', type: 'ground', label: '' },
      { x: 0, y: 366, w: 960, h: 4, color: '#37474F', type: 'ground', label: '' },
      { x: 0, y: 370, w: 960, h: 270, color: '#455A64', type: 'ground', label: '' },
      { x: 320, y: 30, w: 320, h: 32, color: 'rgba(255,255,255,0.1)', type: 'ground', label: 'OFFICE' },
      { x: 100, y: 420, w: 100, h: 55, color: '#5D3A1A', type: 'furniture', furnType: 'desk', label: '' },
      { x: 400, y: 380, w: 160, h: 70, color: '#4A2A10', type: 'furniture', furnType: 'desk', label: 'BOSS' },
      { x: 620, y: 420, w: 100, h: 55, color: '#5D3A1A', type: 'furniture', furnType: 'desk', label: '' },
      { x: 780, y: 160, w: 50, h: 140, color: '#78909C', type: 'furniture', furnType: 'cabinet', label: '' },
      { x: 780, y: 190, w: 50, h: 110, color: '#78909C', type: 'furniture', furnType: 'cabinet', label: '' },
      { x: 820, y: 370, w: 40, h: 70, color: '#64B5F6', type: 'ground', label: '' },
      { x: 820, y: 360, w: 40, h: 10, color: '#42A5F5', type: 'ground', label: '' },
      { x: 430, y: 470, w: 100, h: 70, wallColor: '#455A64', doorColor: '#37474F', type: 'doorway', label: 'EXIT' }
    ],
    collidables: [
      { x: 0, y: 0, w: 960, h: 370 },
      { x: 0, y: 370, w: 50, h: 270 },
      { x: 910, y: 370, w: 50, h: 270 },
      { x: 100, y: 420, w: 100, h: 55 },
      { x: 400, y: 380, w: 160, h: 70 },
      { x: 620, y: 420, w: 100, h: 55 },
      { x: 780, y: 160, w: 100, h: 140 }
    ],
    portals: [{ x: 440, y: 522, w: 80, h: 20, targetArea: 'downtown', targetX: 760, targetY: 435 }],
    interactables: [],
    npcs: [],
    playerSpawn: { x: 470, y: 590 }
  }
};

// ── NPCs ──
AREAS.home.npcs = [
  { name: 'Bed', feetX: 190, feetY: 455, color: '#6666ff',
    dialogues: [
      createDialogueNode('', 'Your comfortable bed. A good night\'s sleep restores all your energy and HP.'),
      createDialogueNode('', 'Go to sleep until morning?', [
        { text: 'Sleep (restore fully)', action: 'sleep' },
        { text: 'Not yet.', action: 'exit' }
      ])
    ] }
];

AREAS.university.npcs = [
  { name: 'Professor', feetX: 680, feetY: 450, color: '#4488ff',
    dialogues: [
      createDialogueNode('Professor', 'Welcome, young scholar! I can help sharpen your mind.'),
      createDialogueNode('Professor', 'Studying costs 20 energy per session. Ready to hit the books?', [
        { text: 'Yes, let\'s study!', action: 'study' },
        { text: 'Not right now.', action: 'exit' }
      ])
    ] }
];

AREAS.gym.npcs = [
  { name: 'Trainer', feetX: 200, feetY: 500, color: '#ff8844',
    dialogues: [
      createDialogueNode('Trainer', 'Hey there, string bean! Welcome to the gym!'),
      createDialogueNode('Trainer', 'Training costs 25 energy and $20. Worth every penny!', [
        { text: 'Let\'s do this!', action: 'train' },
        { text: 'Maybe later.', action: 'exit' }
      ])
    ] },
  { name: 'Fight Promoter', feetX: 700, feetY: 500, color: '#ccaa44',
    dialogues: [
      createDialogueNode('Fight Promoter', 'Psst... want to earn some real money?'),
      createDialogueNode('Fight Promoter', 'Fight club starts in 5. Tough opponents, big rewards.', [
        { text: 'Sign me up! (Fight Bouncer)', action: 'fight_bouncer' },
        { text: 'Too dangerous.', action: 'exit' }
      ])
    ] }
];

AREAS.bar.npcs = [
  { name: 'Bartender', feetX: 480, feetY: 460, color: '#cc8844',
    dialogues: [
      createDialogueNode('Bartender', 'Evenin\', stranger. What\'ll it be?'),
      createDialogueNode('Bartender', 'A drink\'ll boost your charisma for $15.', [
        { text: 'I\'ll take a drink!', action: 'drink' },
        { text: 'Heard any good rumors?', action: 'rumor' },
        { text: 'Just browsing.', action: 'exit' }
      ])
    ] },
  { name: 'Brawler', feetX: 200, feetY: 500, color: '#cc4444',
    dialogues: [
      createDialogueNode('Brawler', 'You lookin\' at me funny, pal?'),
      createDialogueNode('Brawler', 'Put \'em up!', [
        { text: 'Let\'s fight!', action: 'fight_bar' },
        { text: 'Not worth it.', action: 'exit' }
      ])
    ] }
];

AREAS.park.npcs = [
  { name: 'Old Man', feetX: 150, feetY: 440, color: '#88cc88',
    dialogues: [
      createDialogueNode('Old Man', 'Beautiful day in the park, isn\'t it?'),
      createDialogueNode('Old Man', 'I\'ve lived here 40 years. Seen it all. The hospital over there saved my life twice.')
    ] },
  { name: 'Thug', feetX: 700, feetY: 460, color: '#cc5555',
    dialogues: [
      createDialogueNode('Thug', 'Hand over your wallet, punk!'),
      createDialogueNode('Thug', 'This park ain\'t big enough for both of us.', [
        { text: 'Fight!', action: 'fight_thug' },
        { text: 'Run away!', action: 'exit' }
      ])
    ] }
];

AREAS.shop.npcs = [
  { name: 'Shopkeeper', feetX: 690, feetY: 470, color: '#ffcc44',
    dialogues: [
      createDialogueNode('Shopkeeper', 'Welcome to my shop! Finest goods in town.'),
      createDialogueNode('Shopkeeper', 'I sell weapons, potions, and equipment. Also buying if you need cash.', [
        { text: 'Show me your wares!', action: 'shop_open' },
        { text: 'Just browsing.', action: 'exit' }
      ])
    ] }
];

AREAS.hospital.npcs = [
  { name: 'Doctor', feetX: 600, feetY: 490, color: '#ffffff',
    dialogues: [
      createDialogueNode('Doctor', 'Welcome to the hospital. How can I help?'),
      createDialogueNode('Doctor', 'Full treatment: $50 (full heal). Basic: $10 (+30 HP).', [
        { text: 'Full treatment ($50)', action: 'heal' },
        { text: 'I\'m fine, thanks.', action: 'exit' }
      ])
    ] }
];

AREAS.office.npcs = [
  { name: 'Boss', feetX: 480, feetY: 480, color: '#B0BEC5',
    dialogues: [
      createDialogueNode('Boss', 'Looking for work? We have shifts available.'),
      createDialogueNode('Boss', 'A shift costs 30 energy and takes 8 hours. Pay scales with Intelligence.', [
        { text: 'Work a shift!', action: 'work' },
        { text: 'Not today.', action: 'exit' }
      ])
    ] }
];
