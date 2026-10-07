const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000/api/v1'
).replace(/\/$/, '')

async function request(path, options = {}) {
  const token = localStorage.getItem('arcadia_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err
    }

    const networkError = new Error('Network request failed')
    networkError.status = 0
    throw networkError
  }

  const text = await response.text()

  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    const detail = data?.detail || data?.message

    const error = new Error(
      typeof detail === 'string'
        ? detail
        : `Request failed (${response.status})`,
    )

    error.status = response.status
    throw error
  }

  return data
}

export const api = {
  baseUrl: API_BASE,

  // Authentication
  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    

  me: (options) =>
    request('/users/me', options),

  // Games
  searchGames: (q, limit = 12, options) =>
    request(
      `/games/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      options,
    ),

  gameDetails: (externalId, options) =>
    request(
      `/games/${encodeURIComponent(externalId)}`,
      options,
    ),

  // Library
  addExternalGame: (externalId) =>
    request(
      `/library/external/${encodeURIComponent(externalId)}`,
      {
        method: 'POST',
      },
    ),

  updateLibrary: (gameId, payload) =>
    request(`/library/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  // Community
  communityFeed: (limit = 20, offset = 0, options) =>
    request(
      `/community/feed?limit=${limit}&offset=${offset}`,
      options,
    ),

  communitySuggestions: (limit = 6, options) =>
    request(
      `/community/suggestions?limit=${limit}`,
      options,
    ),

  // Follows
  followUser: (userId) =>
    request(`/users/${userId}/follow`, {
      method: 'POST',
    }),

  unfollowUser: (userId) =>
    request(`/users/${userId}/follow`, {
      method: 'DELETE',
    }),

  // Reviews
  createReview: (payload) =>
    request('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateReview: (reviewId, payload) =>
    request(`/reviews/${reviewId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
      // Admin
  adminStats: (options) =>
    request('/admin/stats', options),

  adminActivity: (limit = 20, options) =>
    request(`/admin/activity?limit=${limit}`, options),

  adminLibraryStatus: (options) =>
    request('/admin/library-status', options),
}