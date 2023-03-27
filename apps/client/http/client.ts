import axios from 'axios'

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
