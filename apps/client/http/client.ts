import axios from 'axios'

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

httpClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    console.log('error', error)

    if (axios.isAxiosError(error)) {
      console.log(
        '[AXIOS INTERCEPTOR ERROR] PATH:',
        error.request.path,
        'RESPONSE:',
        error.response?.data
      )
    }

    return Promise.reject(error)
  }
)
