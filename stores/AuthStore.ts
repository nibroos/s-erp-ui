import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import { useAuthFetch } from '~/composables/useAuthFetch'
import DateFnsAdapter from '@date-io/date-fns'
import type { AuthDataType, AuthUserType } from '~/types/AuthType'
import useLayoutsStore from './configs/LayoutsStore'
import type { Meta, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'

// Module-level guard so ALL callers of refreshAuth (route middleware, the API
// 401 interceptor, and the proactive scheduler) share ONE in-flight refresh.
// This is essential: the auth server rotates the refresh token and revokes the
// previous one, so two concurrent refreshes would replay an already-rotated
// token, trip reuse-detection, and revoke the whole session.
let refreshPromise: Promise<string | null> | null = null

const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    data: {} as AuthDataType,
    form: {
      first_name: '',
      email: '',
      password: '',
    },
    registerView: false,
    formState: {
      loading: false,
    },
    abilities: [] as string[],
    authUser: {
      data: {},
      meta: {
        total: 0,
        per_page: 0,
        current_page: 0,
        last_page: 0,
      },
      message: '',
      status: 0,
      errors: {},
      optional: {
        token: '',
        expired_at: '',
      },
    } as AuthUserType,
    roles: [] as string[],
    permission: [] as string[],
    company: {} as Record<string, any>,
    expired: '',
    _token: '',
    theme: 'light',
  }),

  getters: {},

  actions: {
    async loginAuth() {
      if (this.formState.loading) return
      this.formState.loading = true

      try {
        // Routed to the dedicated auth service (s-erp-auth). withCredentials
        // captures the httpOnly refresh cookie; only the access token is
        // returned in the body.
        const response = await useAuthFetch().post(`/v1/auth/login`, this.form)
        const data = response.data?.data
        this.data.token = data.token
        this.authUser = response.data
        this.permission = response.data.data.permissions
        this.roles = response.data.data.roles
        this.expired = this.authUser.optional?.expired_at || ''
        this._token = this.authUser.optional?.token || ''

        // set Token
        localStorage.setItem('_token', this._token)
        localStorage.setItem('expired', this.expired)

        // redirect
        // navigateTo('/')
        navigateTo(useLayoutsStore().lastVisitedRoute || '/dashboard/overview')

        useAlert.alertSuccess('Login successfully.')

        return response
      } catch (error: any) {
        useAlert.alertError(error?.response?.data?.message || 'Login Failed!')
        navigateTo('/login')
      } finally {
        this.formState.loading = false
      }
    },

    async registerAuth() {
      if (this.formState.loading) return
      this.formState.loading = true

      try {
        const response = await useMyFetch().post(`/v1/auth/signup`, this.form)
        // this.data.token = data.token
        this.authUser = response.data

        // set Token
        localStorage.setItem('_token', this.authUser.optional?.token || '')
        localStorage.setItem('expired', this.authUser.optional?.expired_at || '')
        // redirect
        navigateTo('/dashboard/overview')

        useAlert.alertSuccess('Register successfully.')

        return response
      } catch (error: any) {
        useAlert.alertError(error?.response?.data?.message || 'Register Failed!')
        navigateTo('/login')
      } finally {
        this.formState.loading = false
      }
    },

    // Exchange the httpOnly refresh cookie for a new access token. Returns the
    // new token string, or null if the session is no longer valid. Used both
    // on-demand and by the API 401 interceptor.
    async refreshAuth(): Promise<string | null> {
      // Coalesce concurrent refreshes into a single request (see refreshPromise).
      if (refreshPromise) return refreshPromise

      refreshPromise = (async () => {
        try {
          const response = await useAuthFetch().post('/v1/auth/refresh')
          this.authUser = response.data
          this.permission = response.data.data.permissions
          this.roles = response.data.data.roles
          this.expired = this.authUser.optional?.expired_at || ''
          this._token = this.authUser.optional?.token || ''
          localStorage.setItem('_token', this._token)
          localStorage.setItem('expired', this.expired)
          return this._token
        } catch (error) {
          return null
        }
      })()

      try {
        return await refreshPromise
      } finally {
        refreshPromise = null
      }
    },

    async logoutUser() {
      // Revoke the refresh token server-side before clearing local state.
      try {
        await useAuthFetch().post('/v1/auth/logout')
      } catch (error) {
        // Best-effort: proceed with local cleanup even if the call fails.
      }
      this.authUser.data = null
      if (this.authUser.optional) {
        this.authUser.optional.token = null
        this.authUser.optional.expired_at = null
      }
      localStorage.removeItem('_token')
      localStorage.removeItem('expired')
      localStorage.removeItem('AuthStore')
      useAlert.alertSuccess('Logout successfully.')
      navigateTo('/login')
    },

    async getProfile() {
      try {
        const response = await useMyFetch().post('/v1/auth/profile')
        if (response.status === 200) {
          this.data = response.data
        } else {
          this.data.token = null
          navigateTo('/login')
        }
      } catch (error) {
        this.data.token = null
        navigateTo('/login')
      }
    },

    // async getAbilities() {
    //   try {
    //     const response = await useMyFetch().post('/api/master/roles/abilities')
    //     if (response.status === 200) {
    //       this.abilities = response.data.data
    //     }
    //   } catch (error) {
    //     useAuth.removeAuth()
    //     console.log(error)
    //   }
    // },

    async getAbilities() {
      try {
        const response = await useMyFetch().post('/api/master/roles/abilities')
        if (response.status === 200) {
          this.abilities = response.data.data
        }
      } catch (error) {
        useAuth.removeAuth()
        console.log(error)
      }
    },

    async getCompanyProfile() {
      try {
        const response = await useMyFetch().post(
          '/v1/company-profiles/show-company-profile',
          {
            id: 1
          }
        )
        console.log("getCompanyProfile", response);

        if (response.status === 200) {
          this.company = response.data.data[0]
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  persist: [
    {
      paths: ['data', 'status', 'abilities', 'authUser', 'expired', '_token', 'theme'],
      storage: localStorage
    }
  ]
})

export default useAuthStore