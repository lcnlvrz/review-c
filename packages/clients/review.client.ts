import { httpClient } from './http.client'
import type { ListReviewsOutput } from 'common'

export class ReviewClient {
  static async listReviews(workspaceId: string, cookie?: string) {
    return await httpClient
      .get<ListReviewsOutput>(`/workspace/${workspaceId}/review`, {
        cookie,
      })
      .then((res) => res.data)
  }
}
