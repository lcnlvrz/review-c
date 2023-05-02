import { HttpClient } from './http.client'
import type { ListReviewsOutput } from 'common'

export class ReviewClient {
  constructor(private readonly httpClient: HttpClient) {}

  async listReviews(workspaceId: string) {
    return await this.httpClient
      .get(`/workspace/${workspaceId}/review`)
      .then((res) => res.data as ListReviewsOutput)
  }
}
