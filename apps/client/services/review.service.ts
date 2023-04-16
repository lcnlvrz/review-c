import { httpClient } from '@/http/client'
import type { CreateReviewInput, ListReviewsOutput } from 'common'
import type { CreateReviewOutput } from 'common'

export class ReviewService {
  static async createReview(
    workspaceId: string,
    input: CreateReviewInput
  ): Promise<CreateReviewOutput> {
    return await httpClient
      .post(`/workspace/${workspaceId}/review`, input)
      .then((res) => res.data)
  }

  static async listReviews(
    workspaceId: string,
    cookie?: string
  ): Promise<ListReviewsOutput> {
    return await httpClient
      .get(`/workspace/${workspaceId}/review`, {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data)
  }
}
