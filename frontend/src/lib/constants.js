// Library statuses. `value` is what we send to PATCH /library/:id, so if your
// backend uses different strings (e.g. "on-hold"), this is the one place to change.
export const STATUSES = [
  { value: 'backlog', label: 'Backlog', hint: 'Saved for later' },
  { value: 'playing', label: 'Playing', hint: 'Currently in progress' },
  { value: 'completed', label: 'Completed', hint: 'Finished the game' },
  { value: 'on_hold', label: 'On hold', hint: 'Paused for now' },
  { value: 'dropped', label: 'Dropped', hint: 'Not for me' },
]

export const STATUS_LABELS = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]))

export const RATING_MAX = 5
export const MIN_SEARCH_LENGTH = 2
export const SEARCH_DEBOUNCE_MS = 400

// Titles used to build the "Games worth playing" shelf from the real search API.
export const FEATURED_TITLES = [
  // Existing
  'Elden Ring',
  'Hollow Knight: Silksong',
  'Nier: Automata - Game of the Yorha Edition',
  'Hades',
  'Cyberpunk 2077',
  'Celeste',
  'The Witcher 3: Wild Hunt',
  'Red Dead Redemption 2',
  'Baldur’s Gate 3',
  'The Legend of Zelda: Tears of the Kingdom',
  'The Legend of Zelda: Breath of the Wild',
  'God of War',
  'God of War Ragnarök',
  'Marvel’s Spider-Man Remastered',
  'Marvel’s Spider-Man 2',
  'Ghost of Tsushima',
  'Sekiro: Shadows Die Twice',
  'Dark Souls III',
  'Bloodborne',
  'Demon’s Souls',
  'Lies of P',
  'Black Myth: Wukong',
  'Armored Core VI: Fires of Rubicon',
  'Resident Evil 4',
  'Resident Evil Village',
  'Alan Wake 2',
  'Control',
  'Death Stranding',
  'Death Stranding 2: On the Beach',
  'Disco Elysium',
  'Divinity: Original Sin 2',
  'Persona 5 Royal',
  'Persona 3 Reload',
  'Metaphor: ReFantazio',
  'Final Fantasy VII Rebirth',
  'Final Fantasy XVI',
  'Monster Hunter: World',
  'Monster Hunter Wilds',
  'Stardew Valley',
  'Terraria',
  'Minecraft',
  'Balatro',
  'Dave the Diver',
  'Dead Cells',
  'Ori and the Will of the Wisps',
  'Undertale',
  'Outer Wilds',
  'It Takes Two',
];
