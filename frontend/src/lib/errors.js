// Turns any thrown error into something a player can understand.
// Raw backend messages are never shown directly.
export function friendlyError(err, fallback = 'Something went wrong. Please try again.') {
  switch (err?.status) {
    case 0: return "Can't reach the Arcadia server. Check your connection and try again."
    case 401: return 'Please sign in to continue.'
    case 403: return "You don't have access to that."
    case 404: return "We couldn't find that."
    case 429: return 'Too many requests. Wait a moment and try again.'
    default:
      return err?.status >= 500 ? 'The server ran into a problem. Please try again shortly.' : fallback
  }
}

export function authErrorMessage(err, mode) {
  if (err?.status === 0) return friendlyError(err)
  if (mode === 'login' && (err?.status === 400 || err?.status === 401)) return 'Email or password is incorrect.'
  if (mode === 'register' && err?.status === 409) return 'An account with that email or username already exists.'
  if (err?.status === 422 || err?.status === 400) return 'Some details look invalid. Check them and try again.'
  return friendlyError(err, 'We could not sign you in. Please try again.')
}
