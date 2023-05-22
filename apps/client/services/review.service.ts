import { REVIEWS_PAGINATION_DEFAULT_VALUE } from '@/components/ReviewsTable'
import { httpClient } from '@/http/client'
import type {
  CreateReviewInput,
  ListReviewsOutput,
  PaginateReviewsInput,
  PaginateReviewsOutput,
  RetrieveReviewDetailOutput,
} from 'common'
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

  static async detail(
    workspaceId: string,
    reviewId: string,
    cookie?: string
  ): Promise<RetrieveReviewDetailOutput> {
    return await httpClient
      .get(`/workspace/${workspaceId}/review/${reviewId}`, {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data)
  }

  static async listReviews(
    workspaceId: string,
    params: {
      scope: 'all'
    } = {
      scope: 'all',
    },
    cookie?: string
  ): Promise<ListReviewsOutput> {
    return await httpClient
      .get(`/workspace/${workspaceId}/review`, {
        headers: {
          cookie,
        },
        params,
      })
      .then((res) => res.data)
  }

  static async paginateReviews(
    workspaceId: string,
    params: PaginateReviewsInput = {
      page: REVIEWS_PAGINATION_DEFAULT_VALUE.pageIndex + 1,
      limit: REVIEWS_PAGINATION_DEFAULT_VALUE.pageSize,
    },
    cookie?: string
  ) {
    return await httpClient
      .get(`/workspace/${workspaceId}/review/paginate`, {
        headers: {
          cookie,
        },
        params,
      })
      .then((res) => res.data as PaginateReviewsOutput)
  }
}
