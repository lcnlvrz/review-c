type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  method: Method
  headers?: Record<string, string>
  body?: string
}

interface FetchResponse<T> {
  data?: T
  status: number
  statusText: string
  headers: Headers
  ok: boolean
}

type FetchError<T = unknown> = {
  data?: T
  status: number
  statusText: string
  headers: Headers
}

class HttpClient {
  constructor(private baseUrl: string) {}

  private async request<T>(
    path: string,
    options: RequestOptions = { method: 'GET' }
  ): Promise<FetchResponse<T>> {
    const url = `${this.baseUrl}${path}`

    const response = await fetch(url, {
      method: options.method,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
      body: options.body,
    })

    console.log('response.ok', response.ok)

    if (!response.ok) {
      const error: FetchError = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }
      try {
        error.data = await response.json()
      } catch (e) {}
      throw error
    }

    const headers = response.headers
    const contentType = headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
        ok: response.ok,
      }
    } else {
      return {
        data: undefined,
        status: response.status,
        statusText: response.statusText,
        headers,
        ok: response.ok,
      }
    }
  }

  async get<T>(
    path: string,
    headers?: Record<string, string>
  ): Promise<FetchResponse<T>> {
    const options = {
      method: 'GET',
      headers,
    } as const

    return this.request<T>(path, options)
  }

  async post<T>(
    path: string,
    body?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<FetchResponse<T>> {
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    } as const

    return this.request<T>(path, options)
  }

  async put<T>(
    path: string,
    body?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<FetchResponse<T>> {
    const options = {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    } as const

    return this.request<T>(path, options)
  }

  async delete<T>(
    path: string,
    headers?: Record<string, string>
  ): Promise<FetchResponse<T>> {
    const options = {
      method: 'DELETE',
      headers,
    } as const

    return this.request<T>(path, options)
  }
}

export const httpClient = new HttpClient(
  process.env.NEXT_PUBLIC_API_URL || process.env.PLASMO_PUBLIC_API_URL
)
