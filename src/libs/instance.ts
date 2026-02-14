import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import toast from 'react-hot-toast'
import qs from 'qs'
import { getCookie, deleteCookie, setCookie } from 'cookies-next'
import { getAccessTokenClient } from '../utils/auth/token'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'
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
      // Update tokens in storage
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

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status

    // Only handle 401 errors
    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
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
          // Token refresh successful
          processQueue(null, newToken)
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          
          return axiosPrivate(originalRequest)
        } else {
          // Refresh token expired or invalid
          processQueue(error, null)
          
          // Clear all tokens
          deleteCookie('accessToken')
          deleteCookie('refreshToken')
          if (isBrowser) {
            localStorage.removeItem('csrfToken')
          }

          toast.error('Sesi kamu sudah habis, silakan login ulang')

          if (isBrowser) {
            // Redirect to login after a short delay
            setTimeout(() => {
              window.location.href = '/login'
            }, 1500)
          }

          return Promise.reject(error)
        }
      } catch (refreshError) {
        processQueue(error, null)
        
        // Clear all tokens
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

    // For other errors, just reject
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

axiosPublic.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const message = (error.response?.data as { message?: string })?.message || 'Terjadi kesalahan'

    if (status) {
      toast.error(`Error ${status}: ${message}`)
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

/**
 * ===============================
 * Helper: build query string
 * ===============================
 */
export const buildQuery = <T extends Record<string, unknown>>(
  params?: T
): string => (params ? `?${qs.stringify(params)}` : '')