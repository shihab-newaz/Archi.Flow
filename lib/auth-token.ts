export const AUTH_COOKIE_NAME = 'lms.auth.token'
export const REFRESH_COOKIE_NAME = 'lms.auth.refresh'
const TOKEN_STORAGE_KEY = 'lms.auth.token'
const REFRESH_STORAGE_KEY = 'lms.auth.refresh'

const readCookie = (name: string): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))

  if (!cookie) {
    return null
  }

  return decodeURIComponent(cookie.slice(name.length + 1))
}

export const getClientToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? readCookie(AUTH_COOKIE_NAME)
}

export const getClientRefreshToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(REFRESH_STORAGE_KEY) ?? readCookie(REFRESH_COOKIE_NAME)
}

export const persistClientToken = (
  token: string | null,
  maxAgeSeconds = 60 * 60 * 24 * 7
) => {
  if (typeof window === 'undefined') {
    return
  }

  const isSecure = window.location.protocol === 'https:'
  const secure = isSecure ? '; secure' : ''

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure}`
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0${secure}`
  }
}

export const persistClientRefreshToken = (
  token: string | null,
  maxAgeSeconds = 60 * 60 * 24 * 7
) => {
  if (typeof window === 'undefined') {
    return
  }

  const isSecure = window.location.protocol === 'https:'
  const secure = isSecure ? '; secure' : ''

  if (token) {
    window.localStorage.setItem(REFRESH_STORAGE_KEY, token)
    document.cookie = `${REFRESH_COOKIE_NAME}=${token}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure}`
  } else {
    window.localStorage.removeItem(REFRESH_STORAGE_KEY)
    document.cookie = `${REFRESH_COOKIE_NAME}=; path=/; max-age=0${secure}`
  }
}

export const persistClientAuthTokens = (
  tokens: { accessToken: string; refreshToken: string },
  maxAgeSeconds = 60 * 60 * 24 * 7
) => {
  persistClientToken(tokens.accessToken, maxAgeSeconds)
  persistClientRefreshToken(tokens.refreshToken, maxAgeSeconds)
}

export const clearClientToken = () => persistClientToken(null)

export const clearClientRefreshToken = () => persistClientRefreshToken(null)

export const clearClientAuthState = () => {
  clearClientToken()
  clearClientRefreshToken()
}
