import DateFnsAdapter from '@date-io/date-fns'
// import jwt from 'jsonwebtoken'
import type { AuthUserType } from '~/types/AuthType'
import { jwtDecode } from 'jwt-decode';

const { getDiff, isAfter } = new DateFnsAdapter()
const route = useRoute()
const router = useRouter()

const isTokenExpired = (): boolean => {
  const expirationTime = localStorage.getItem('expired')
  if (expirationTime) {
    return isAfter(new Date(), new Date(expirationTime))
  }
  return true
}

const getExpired = () => {
  return localStorage.getItem('expired')
}

const jwtVerify = (token: string): boolean => {
  let isValid = false
  if (!token) {
    return isValid
  }

  try {
    const decoded: any = jwtDecode(token); // Decode JWT token
    const currentTime = Math.floor(Date.now() / 1000)


    if (decoded.exp < currentTime) {
      // localStorage.removeItem('auth_token')
      return isValid
    }
  } catch (error) {
    console.error('Invalid token', error)
    return isValid
  }

  return true
}

const getAuth = () => {
  const data = localStorage.getItem('_token')
  if (data) {
    return JSON.parse(data)
  }
  return {}
}

const removeAuth = () => {
  localStorage.removeItem('_token')
  localStorage.removeItem('expired')
}

const getStatusLogin = () => {
  const data = getAuth()
  if (data) {
    if (getDiff(new Date(), new Date(data)) <= 0) {
      return data.loginStatus
    }
    removeAuth()
    return false
  }
  return false
}

const checkAuth = () => {
  const data = localStorage.getItem('_token')
  return data
}

const permit = (permissions: string | any[]): boolean => {
  let authStore = JSON.parse(localStorage.getItem('AuthStore') || '{}') as { authUser: AuthUserType }
  if (!authStore) return false

  let abilities: string[] = authStore?.authUser?.data?.permissions || []
  let isSuperAdmin = authStore?.authUser?.data?.roles?.find((role) => role === 'superadmin')
  if (isSuperAdmin === 'superadmin') {
    return true
  }

  if (typeof permissions === 'string') {
    return abilities.includes(permissions)
  }

  if (Array.isArray(permissions)) {
    function containsAny(source: string[], target: string[]) {
      var result = source.filter(function (item) {
        return target.indexOf(item) > -1
      })
      return result.length > 0
    }

    return containsAny(abilities, permissions)
  }

  return false
}

const handlePermission = async (
  permissionName: string | any[],
  action: string = 'warn'
) => {
  const isAllowed = ref<boolean>(true)
  isAllowed.value = permit(permissionName)

  // const backUrlName = () => {
  //   if (!!window.history.state.back) {
  //     return window.history.state.back;
  //   } else {
  //     return '/';
  //   }
  // };

  let previousRoute = route.query.back?.toString() || '/dashboard'

  const hasHistory = () => {
    return window.history.length > 2
  }

  if (action == 'redirect' && !isAllowed.value) {
    hasHistory() ? window.history.back() : navigateTo(previousRoute)
  }

  if (action == 'warn' && !isAllowed.value) {
    const confirmRedirect = await useAlert.showPopupConfirmation(
      '404',
      'Page not found, click to redirect',
      'Redirect',
      false,
      {
        allowOutsideClick: false,
        allowEscapeKey: false
      }
    )

    if (confirmRedirect) {
      hasHistory() ? window.history.back() : navigateTo(previousRoute)
    }
  }

  return isAllowed.value
}

export const useAuth = {
  checkAuth,
  getStatusLogin,
  removeAuth,
  getAuth,
  isTokenExpired,
  permit,
  handlePermission,
  jwtVerify
}
