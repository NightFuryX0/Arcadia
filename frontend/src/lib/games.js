// The one place that understands the shape of game objects coming from the API.
// If the backend field names differ from what is guessed here, adjust this file only.

const IGDB_IMAGE = /(\/igdb\/image\/upload\/)t_[a-z0-9_]+(\/)/i

function toNames(value) {
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'string' ? item : item?.name)).filter(Boolean)
  }
  if (typeof value === 'string') return value.split(/[•,/]/).map((s) => s.trim()).filter(Boolean)
  return []
}

// IGDB ratings are 0-100; the UI shows 0-10.
function toScore(value) {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return null
  return Number((n > 10 ? n / 10 : n).toFixed(1))
}

function parseRelease(value) {
  const empty = { releaseDate: null, year: null }
  if (value == null || value === '') return empty
  if (typeof value === 'number' && value >= 1900 && value <= 2200) return { releaseDate: null, year: value }
  const date = new Date(typeof value === 'number' && value < 1e11 ? value * 1000 : value)
  return Number.isNaN(date.getTime()) ? empty : { releaseDate: date, year: date.getUTCFullYear() }
}

export function normalizeGame(raw = {}) {
  const externalId = raw.external_id ?? raw.externalId ?? raw.id
  const { releaseDate, year } = parseRelease(
    raw.release_date ?? raw.released ?? raw.first_release_date ?? raw.release_year ?? raw.year,
  )
  return {
    id: externalId != null ? String(externalId) : null,
    title: raw.title || raw.name || 'Untitled game',
    cover: raw.cover_url || raw.cover || raw.image || null,
    genres: toNames(raw.genres ?? raw.genre),
    platforms: toNames(raw.platforms),
    score: toScore(raw.rating ?? raw.score ?? raw.total_rating),
    description: raw.description || raw.summary || raw.storyline || '',
    releaseDate,
    year,
  }
}

export function normalizeList(data) {
  const list = Array.isArray(data) ? data : data?.results || []
  const seen = new Set()
  return list.map(normalizeGame).filter((g) => g.id && !seen.has(g.id) && seen.add(g.id))
}

// Prefer non-empty values from `next` (so a details response fills gaps without blanking anything).
export function mergeGames(base, next) {
  const merged = { ...base }
  for (const [key, value] of Object.entries(next)) {
    const empty = value == null || value === '' || (Array.isArray(value) && value.length === 0)
    if (!empty) merged[key] = value
  }
  return merged
}

// IGDB serves many sizes from the same URL pattern. Cards get 1x/2x sources so
// high-DPI screens stay sharp; the details page gets the large version.
export function coverSources(url, large = false) {
  if (!url) return {}
  const clean = url.startsWith('//') ? `https:${url}` : url
  if (!IGDB_IMAGE.test(clean)) return { src: clean }
  const at = (size) => clean.replace(IGDB_IMAGE, `$1t_${size}$2`)
  return large
    ? { src: at('720p') }
    : { src: at('cover_big'), srcSet: `${at('cover_big')} 1x, ${at('cover_big_2x')} 2x` }
}

export function formatDate(date) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
