import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// AuthStore reaches the network through useAuthFetch and shows toasts through
// useAlert. Both are stubbed: these tests are about refreshAuth's control flow,
// which is security-relevant (see the refreshPromise note in AuthStore.ts).
const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }))

vi.mock('~/composables/useAuthFetch', () => ({
  useAuthFetch: () => ({ post: mockPost })
}))
vi.mock('~/composables/useMyFetch', () => ({
  useMyFetch: () => ({ post: vi.fn(), get: vi.fn(), put: vi.fn(), delete: vi.fn() })
}))
vi.mock('~/composables/useAlert', () => ({
  useAlert: { alertError: vi.fn(), alertSuccess: vi.fn(), showPopupConfirmation: vi.fn() }
}))

let useAuthStore: any

beforeAll(async () => {
  // defineStore and navigateTo are Nuxt/Pinia auto-imports at runtime. They are
  // referenced while AuthStore's module body evaluates, so they must exist as
  // globals BEFORE it is imported — hence the dynamic import here rather than a
  // static one at the top of the file.
  const pinia = await import('pinia')
  ;(globalThis as any).defineStore = pinia.defineStore
  ;(globalThis as any).navigateTo = vi.fn()
  // LayoutsStore (imported transitively) registers a Pinia HMR handler, and
  // import.meta.hot is truthy under vitest, so this auto-import is reached too.
  ;(globalThis as any).acceptHMRUpdate = pinia.acceptHMRUpdate
  useAuthStore = (await import('~/stores/AuthStore')).default
})

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  mockPost.mockReset()
})

const okResponse = (token: string) => ({
  data: {
    data: { permissions: ['user.read'], roles: ['staff'] },
    optional: { token, expired_at: '2999-01-01T00:00:00Z' }
  }
})

describe('refreshAuth — success', () => {
  it('returns the new access token', async () => {
    mockPost.mockResolvedValue(okResponse('new-token'))
    const store = useAuthStore()
    await expect(store.refreshAuth()).resolves.toBe('new-token')
  })

  it('persists the token and expiry for the next page load', async () => {
    mockPost.mockResolvedValue(okResponse('new-token'))
    await useAuthStore().refreshAuth()
    expect(localStorage.getItem('_token')).toBe('new-token')
    expect(localStorage.getItem('expired')).toBe('2999-01-01T00:00:00Z')
  })
})

describe('refreshAuth — failure', () => {
  it('resolves to null instead of throwing when the request rejects', async () => {
    // The route middleware awaits refreshAuth() and branches on a falsy result.
    // If this rejected instead, the rejection would escape the middleware and
    // abort navigation, so "returns null" is the contract being locked in.
    mockPost.mockRejectedValue(new Error('network down'))
    const store = useAuthStore()
    await expect(store.refreshAuth()).resolves.toBeNull()
  })

  it('resolves to null when the response shape is unusable', async () => {
    mockPost.mockResolvedValue({ data: {} })
    await expect(useAuthStore().refreshAuth()).resolves.toBeNull()
  })

  it('does not leave a poisoned in-flight promise behind after a failure', async () => {
    mockPost.mockRejectedValueOnce(new Error('network down'))
    const store = useAuthStore()
    await expect(store.refreshAuth()).resolves.toBeNull()

    mockPost.mockResolvedValue(okResponse('recovered'))
    await expect(store.refreshAuth()).resolves.toBe('recovered')
  })
})

describe('refreshAuth — concurrency', () => {
  it('coalesces concurrent callers into a single request', async () => {
    // Critical: the auth service rotates the refresh token and revokes the
    // previous one. Two concurrent refreshes would replay an already-rotated
    // token, trip reuse-detection, and revoke the whole session.
    let release: (v: unknown) => void = () => {}
    mockPost.mockReturnValue(new Promise((res) => { release = res }))

    const store = useAuthStore()
    const all = Promise.all([store.refreshAuth(), store.refreshAuth(), store.refreshAuth()])

    release(okResponse('shared-token'))
    const results = await all

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(results).toEqual(['shared-token', 'shared-token', 'shared-token'])
  })

  it('issues a fresh request once the previous one has settled', async () => {
    mockPost.mockResolvedValue(okResponse('t1'))
    const store = useAuthStore()
    await store.refreshAuth()
    await store.refreshAuth()
    expect(mockPost).toHaveBeenCalledTimes(2)
  })
})
