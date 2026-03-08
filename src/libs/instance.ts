import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import toast from 'react-hot-toast'
import qs from 'qs'
import { getCookie, deleteCookie, setCookie } from 'cookies-next'
import { getAccessTokenClient } from '../utils/auth/token'
import { getLanguage } from '../utils'

console.log('ENV ==>', process.env.NEXT_PUBLIC_API_BASE_URL)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://mbsc-be.yaaqin.xyz'
const isBrowser = typeof window !== 'undefined'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const getCSRFToken = (): string | null => {
  if (!isBrowser) return null
  return localStorage.getItem('csrfToken')
}

const getRefreshToken = (): string | null => {
  return getCookie('refreshToken') as string | null
}

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken()
    const csrfToken = getCSRFToken()

    if (!refreshToken || !csrfToken) {
      throw new Error('No refresh token or CSRF token available')
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-refresh-token': refreshToken,
          'x-csrf-token': csrfToken,
        },
      }
    )

    const newAccessToken = response.data?.accessToken
    const newRefreshToken = response.data?.refreshToken

    if (newAccessToken) {
      setCookie('accessToken', newAccessToken)
      if (newRefreshToken) {
        setCookie('refreshToken', newRefreshToken)
      }
      return newAccessToken
    }

    return null
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}

export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

axiosPrivate.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessTokenClient()
    const lang = getLanguage()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['x-lang'] = lang

    return config
  },
  (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status
    const message = (error.response?.data as { message?: string })?.message || 'Terjadi kesalahan'

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosPrivate(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()

        if (newToken) {
          processQueue(null, newToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }

          return axiosPrivate(originalRequest)
        } else {
          processQueue(error, null)

          deleteCookie('accessToken')
          deleteCookie('refreshToken')
          if (isBrowser) {
            localStorage.removeItem('csrfToken')
          }

          toast.error('Sesi kamu sudah habis, silakan login ulang')

          if (isBrowser) {
            setTimeout(() => {
              window.location.href = '/login'
            }, 1500)
          }

          return Promise.reject(error)
        }
      } catch (refreshError) {
        processQueue(error, null)

        deleteCookie('accessToken')
        deleteCookie('refreshToken')
        if (isBrowser) {
          localStorage.removeItem('csrfToken')
        }

        toast.error('Sesi kamu sudah habis, silakan login ulang')

        if (isBrowser) {
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ─── Handle 400-500 errors ────────────────────────────────────────
    if (status && status >= 400 && status !== 401) {
      if (status >= 500) {
        toast.error(`Server error: ${message}`)
      } else {
        toast.error(`${message}`)
      }
    }
    // ──────────────────────────────────────────────────────────────────

    return Promise.reject(error)
  }
)

export const axiosPublic: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

axiosPublic.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const lang = getLanguage()
    config.headers['x-lang'] = lang
    return config
  },
  (error) => Promise.reject(error)
)

axiosPublic.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const message = (error.response?.data as { message?: string })?.message || 'Terjadi kesalahan'

    if (status && status >= 400) {
      if (status >= 500) {
        toast.error(`Server error: ${message}`)
      } else {
        toast.error(`${message}`)
      }
    }

    return Promise.reject(error)
  }
)

/**
 * ===============================
 * Axios Upload / Dev API
 * ===============================
 */
const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_API_UPLOAD_IMAGE
const UPLOAD_API_KEY = process.env.NEXT_PUBLIC_KEY_IMAGE_ACCESS

export const axiosUpload: AxiosInstance = axios.create({
  baseURL: UPLOAD_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': UPLOAD_API_KEY,
  },
  timeout: 60_000,
})

axiosUpload.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const message = (error.response?.data as { message?: string })?.message || 'Upload gagal'

    toast.error(`Error ${status}: ${message}`)
    return Promise.reject(error)
  }
)

// src/libs/instance.ts — tambah di bawah axiosPublic

export const axiosUser: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

axiosUser.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const lang = getLanguage()

    // Baca backendToken dari cookie
    const token = getCookie('userToken') as string | null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['x-lang'] = lang
    return config
  },
  (error) => Promise.reject(error)
)

axiosUser.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const message = (error.response?.data as { message?: string })?.message || 'Terjadi kesalahan'

    if (status === 401) {
      // Token user expired — arahkan ke login
      toast.error('Sesi kamu sudah habis, silakan login ulang')
      if (isBrowser) {
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)
      }
      return Promise.reject(error)
    }

    if (status && status >= 400) {
      toast.error(status >= 500 ? `Server error: ${message}` : message)
    }

    return Promise.reject(error)
  }
)

/**
 * ===============================
 * Helper: build query string
 * ===============================
 */
export const buildQuery = <T extends Record<string, unknown>>(
  params?: T
): string => (params ? `?${qs.stringify(params)}` : '')