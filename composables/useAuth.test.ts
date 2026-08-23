import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useAuth } from './useAuth'

const { jwtVerify, isTokenExpired, permit } = useAuth

/** Build an unsigned JWT with the given payload. jwtDecode never verifies. */
function tokenWith(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.signature`
}

const HOUR = 3600
const now = () => Math.floor(Date.now() / 1000)

beforeEach(() => {
  localStorage.clear()
})

describe('jwtVerify', () => {
  it('accepts a token whose exp is in the future', () => {
    expect(jwtVerify(tokenWith({ exp: now() + HOUR }))).toBe(true)
  })

  it('rejects a token whose exp has passed', () => {
    expect(jwtVerify(tokenWith({ exp: now() - HOUR }))).toBe(false)
  })

  it('rejects a token with no exp claim', () => {
    // Regression: the original check was `decoded.exp < currentTime`, which is
    // false when exp is undefined, so a token that never expires was accepted
    // forever.
    expect(jwtVerify(tokenWith({ sub: '1' }))).toBe(false)
  })

  it('rejects a token whose exp is not a number', () => {
    expect(jwtVerify(tokenWith({ exp: 'soon' }))).toBe(false)
    expect(jwtVerify(tokenWith({ exp: null }))).toBe(false)
  })

  it('rejects an empty or malformed token without throwing', () => {
    // useAuth logs the decode failure; silence it so the suite output stays clean.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(jwtVerify('')).toBe(false)
    expect(jwtVerify('not-a-jwt')).toBe(false)
    expect(jwtVerify('a.b.c')).toBe(false)
    spy.mockRestore()
  })
})

describe('isTokenExpired', () => {
  afterEach(() => vi.useRealTimers())

  it('is true when no expiry is stored — absent means expired, not valid', () => {
    expect(isTokenExpired()).toBe(true)
  })

  it('is false while the stored expiry is in the future', () => {
    localStorage.setItem('expired', new Date(Date.now() + 60_000).toISOString())
    expect(isTokenExpired()).toBe(false)
  })

  it('is true once the stored expiry has passed', () => {
    localStorage.setItem('expired', new Date(Date.now() - 60_000).toISOString())
    expect(isTokenExpired()).toBe(true)
  })
})

describe('permit', () => {
  const setSession = (data: Record<string, unknown>) =>
    localStorage.setItem('AuthStore', JSON.stringify({ authUser: { data } }))

  it('grants a permission the user holds', () => {
    setSession({ permissions: ['user.read', 'user.write'], roles: ['staff'] })
    expect(permit('user.read')).toBe(true)
  })

  it('denies a permission the user does not hold', () => {
    setSession({ permissions: ['user.read'], roles: ['staff'] })
    expect(permit('user.delete')).toBe(false)
  })

  it('grants superadmin everything', () => {
    setSession({ permissions: [], roles: ['superadmin'] })
    expect(permit('anything.at.all')).toBe(true)
  })

  it('grants when any permission in the array matches', () => {
    setSession({ permissions: ['user.read'], roles: ['staff'] })
    expect(permit(['user.delete', 'user.read'])).toBe(true)
  })

  it('denies when no permission in the array matches', () => {
    setSession({ permissions: ['user.read'], roles: ['staff'] })
    expect(permit(['user.delete', 'user.write'])).toBe(false)
  })

  it('denies when there is no session at all', () => {
    expect(permit('user.read')).toBe(false)
  })

  it('denies when the session has no permissions list', () => {
    setSession({ roles: ['staff'] })
    expect(permit('user.read')).toBe(false)
  })
})
