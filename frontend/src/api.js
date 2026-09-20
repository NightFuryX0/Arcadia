const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')

async function request(path, options = {}) {
  const token = localStorage.getItem('arcadia_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch (err) {
    if (err.name === 'AbortError') throw err // cancelled on purpose, callers ignore this
    const networkError = new Error('Network request failed')
    networkError.status = 0 // 0 = backend unreachable
    throw networkError
  }

  const text = await response.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  if (!response.ok) {
    const detail = data?.detail || data?.message
    const error = new Error(typeof detail === 'string' ? detail : `Request failed (${response.status})`)
    error.status = response.status // the UI maps this to a friendly message, see lib/errors.js
    throw error
  }
  return data
}

// Same endpoints as before. `options` is optional and lets callers pass { signal } to cancel a request.
export const api = {
  baseUrl: API_BASE,
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: (options) => request('/users/me', options),
  searchGames: (q, limit = 12, options) => request(`/games/search?q=${encodeURIComponent(q)}&limit=${limit}`, options),
  gameDetails: (externalId, options) => request(`/games/${encodeURIComponent(externalId)}`, options),
  addExternalGame: (externalId) => request(`/library/external/${encodeURIComponent(externalId)}`, { method: 'POST' }),
  updateLibrary: (gameId, payload) => request(`/library/${gameId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
}
