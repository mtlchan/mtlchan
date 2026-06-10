var ENEMIES = {
  rat: {
    name: 'Giant Rat',
    hp: 25,
    attack: 6,
    defense: 1,
    reward: 10,
    color: '#996633',
    scale: 0.9,
    attacks: ['jab'],
    telegraphSpeed: 1.0,
    patternSequence: ['jab', 'jab'],
    vulnerableAfter: [1],
    taunt: 'Squeak!',
    attackDefs: {
      jab: { tellFrames: 20, activeFrames: 6, recoveryFrames: 25, dodgeWindow: 14, damage: 6, blockDamage: 2 }
    }
  },
  thug: {
    name: 'Street Thug',
    hp: 45,
    attack: 10,
    defense: 2,
    reward: 30,
    color: '#cc4444',
    scale: 1.05,
    attacks: ['jab', 'hook'],
    telegraphSpeed: 0.9,
    patternSequence: ['jab', 'jab', 'hook'],
    vulnerableAfter: [2],
    taunt: 'You think you can box?',
    attackDefs: {
      jab: { tellFrames: 16, activeFrames: 6, recoveryFrames: 22, dodgeWindow: 12, damage: 8, blockDamage: 3 },
      hook: { tellFrames: 24, activeFrames: 8, recoveryFrames: 28, dodgeWindow: 10, damage: 14, blockDamage: 6 }
    }
  },
  brawler: {
    name: 'Bar Brawler',
    hp: 60,
    attack: 13,
    defense: 3,
    reward: 45,
    color: '#cc6644',
    scale: 1.15,
    attacks: ['jab', 'hook', 'uppercut'],
    telegraphSpeed: 0.8,
    patternSequence: ['jab', 'hook', 'jab', 'uppercut'],
    vulnerableAfter: [3],
    taunt: "I'll break your jaw!",
    attackDefs: {
      jab: { tellFrames: 14, activeFrames: 6, recoveryFrames: 20, dodgeWindow: 10, damage: 10, blockDamage: 4 },
      hook: { tellFrames: 20, activeFrames: 8, recoveryFrames: 26, dodgeWindow: 9, damage: 17, blockDamage: 7 },
      uppercut: { tellFrames: 28, activeFrames: 7, recoveryFrames: 32, dodgeWindow: 8, damage: 22, blockDamage: 10 }
    }
  },
  bouncer: {
    name: 'Club Bouncer',
    hp: 85,
    attack: 16,
    defense: 5,
    reward: 80,
    color: '#4444cc',
    scale: 1.25,
    attacks: ['jab', 'hook', 'uppercut', 'body_blow'],
    telegraphSpeed: 0.7,
    patternSequence: ['jab', 'hook', 'uppercut', 'body_blow', 'hook'],
    vulnerableAfter: [3, 4],
    taunt: "You're not on the list.",
    attackDefs: {
      jab: { tellFrames: 12, activeFrames: 5, recoveryFrames: 18, dodgeWindow: 9, damage: 12, blockDamage: 5 },
      hook: { tellFrames: 18, activeFrames: 7, recoveryFrames: 24, dodgeWindow: 8, damage: 19, blockDamage: 8 },
      uppercut: { tellFrames: 26, activeFrames: 6, recoveryFrames: 30, dodgeWindow: 7, damage: 25, blockDamage: 11 },
      body_blow: { tellFrames: 20, activeFrames: 8, recoveryFrames: 28, dodgeWindow: 8, damage: 18, blockDamage: 7 }
    }
  },
  boss: {
    name: 'Crime Boss',
    hp: 120,
    attack: 22,
    defense: 8,
    reward: 200,
    color: '#cc3344',
    scale: 1.45,
    attacks: ['jab', 'hook', 'uppercut', 'body_blow', 'special'],
    telegraphSpeed: 0.55,
    patternSequence: ['jab', 'hook', 'uppercut', 'special', 'hook', 'body_blow'],
    vulnerableAfter: [3, 5],
    taunt: "You're out of your league, kid.",
    attackDefs: {
      jab: { tellFrames: 10, activeFrames: 4, recoveryFrames: 15, dodgeWindow: 8, damage: 15, blockDamage: 6 },
      hook: { tellFrames: 15, activeFrames: 6, recoveryFrames: 20, dodgeWindow: 7, damage: 24, blockDamage: 10 },
      uppercut: { tellFrames: 22, activeFrames: 5, recoveryFrames: 26, dodgeWindow: 6, damage: 31, blockDamage: 14 },
      body_blow: { tellFrames: 16, activeFrames: 7, recoveryFrames: 24, dodgeWindow: 8, damage: 22, blockDamage: 9 },
      special: { tellFrames: 30, activeFrames: 5, recoveryFrames: 35, dodgeWindow: 6, damage: 35, blockDamage: 18 }
    }
  }
};
