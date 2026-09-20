const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')

async function request(path, options = {}) {
  const token = localStorage.getItem('arcadia_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const text = await response.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}

export const api = {
  baseUrl: API_BASE,
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/users/me'),
  searchGames: (q, limit = 12) => request(`/games/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  gameDetails: (externalId) => request(`/games/${encodeURIComponent(externalId)}`),
  addExternalGame: (externalId) => request(`/library/external/${encodeURIComponent(externalId)}`, { method: 'POST' }),
  updateLibrary: (gameId, payload) => request(`/library/${gameId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
}