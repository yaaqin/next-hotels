import axios, { AxiosInstance, AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://mbsc-be.yaaqin.xyz'

const getServerTokens = async () => {
  const cookieStore = await cookies() // ✅ await di sini

  return {
    accessToken: cookieStore.get('access_token')?.value ?? null,
    // refreshToken: cookieStore.get('refreshToken')?.value ?? null,
    // csrfToken: cookieStore.get('csrfToken')?.value ?? null,
    lang: cookieStore.get('lang')?.value ?? 'id',
  }
}

const attemptTokenRefresh = async (
  refreshToken: string,
  csrfToken: string
): Promise<string | null> => {
  try {
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

    return response.data?.accessToken ?? null
  } catch {
    return null
  }
}

export const createServerPrivate = async (): Promise<AxiosInstance> => {
  const { accessToken, lang } = await getServerTokens() 
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-lang': lang,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    timeout: 30_000,
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status
      const originalRequest = error.config

      if (status === 401 && originalRequest) {
        // if (refreshToken && csrfToken) {
        //   const newAccessToken = await attemptTokenRefresh(refreshToken, csrfToken)

        //   if (newAccessToken) {
        //     originalRequest.headers = originalRequest.headers ?? {}
        //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        //     return axios(originalRequest)
        //   }
        // }

        // redirect('/login')
        console.log('status ==>', status)
      }

      return Promise.reject(error)
    }
  )

  return instance
}

export const createServerPublic = async (): Promise<AxiosInstance> => {
  const { lang } = await getServerTokens() // ✅ await

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-lang': lang,
    },
    timeout: 30_000,
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status
      const message =
        (error.response?.data as { message?: string })?.message ?? 'Terjadi kesalahan'

      const serverError = new Error(`[${status}] ${message}`)
      ;(serverError as Error & { status?: number }).status = status

      return Promise.reject(serverError)
    }
  )

  return instance
}