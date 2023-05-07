import { Client } from './client'
import type { ListReviewsOutput } from 'common'

export class ReviewClient extends Client {
  async listReviews(workspaceId: string) {
    return await this.httpClient
      .get(`/workspace/${workspaceId}/review`)
      .then((res) => res.data as ListReviewsOutput)
  }
}
