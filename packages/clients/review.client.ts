import { Client } from './client'
import type {
  AddMessageToThreadInput,
  ListReviewsOutput,
  RetrieveReviewDetailOutput,
  StartThreadInput,
} from 'common'

export class ReviewClient extends Client {
  async listReviews(workspaceId: string) {
    return await this.httpClient
      .get(`/workspace/${workspaceId}/review`)
      .then((res) => res.data as ListReviewsOutput)
  }

  async retrieveReviewDetail(workspaceId: string, reviewId: string) {
    return await this.httpClient
      .get(`/workspace/${workspaceId}/review/${reviewId}`)
      .then((res) => res.data as RetrieveReviewDetailOutput)
  }

  async startThread(
    workspaceId: string,
    reviewId: string,
    data: StartThreadInput
  ) {
    return await this.httpClient
      .post(`/workspace/${workspaceId}/review/${reviewId}/thread`, data)
      .then((res) => res.data as ListReviewsOutput)
  }

  async addMessageToThread(
    workspaceId: string,
    reviewId: string,
    threadId: number,
    data: AddMessageToThreadInput
  ) {
    return await this.httpClient
      .post(
        `/workspace/${workspaceId}/review/${reviewId}/thread/${threadId}/message`,
        data
      )
      .then((res) => res.data as ListReviewsOutput)
  }
}
