import { HttpClient } from './http.client'
import type { Workspace } from '.prisma/client'

export class WorkspacesClient {
  constructor(private readonly httpClient: HttpClient) {}

  async list() {
    return await this.httpClient.get('/workspace/me').then(
      (res) =>
        res.data as {
          workspaces: Workspace[]
        }
    )
  }
}
