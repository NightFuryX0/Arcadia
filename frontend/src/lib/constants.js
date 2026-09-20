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
  'Elden Ring',
  'Hollow Knight',
  'Red Dead Redemption 2',
  'Hades',
  'Cyberpunk 2077',
  'Celeste',
]
