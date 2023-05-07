import { HttpClient } from './http.client'

export abstract class Client {
  constructor(protected readonly httpClient: HttpClient) {}
}
