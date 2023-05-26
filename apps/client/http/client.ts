import axios from 'axios'

export const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL

export const httpClient = axios.create({
  baseURL: BASE_URL_API,
})

httpClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        '[AXIOS INTERCEPTOR ERROR] PATH:',
        error.request.path,
        'METHOD',
        error.request.method,
        'RESPONSE:',
        error.response?.data
      )
    }

    return Promise.reject(error)
  }
)
