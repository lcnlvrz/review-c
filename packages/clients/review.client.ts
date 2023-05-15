import { Client } from './client'
import type {
  AddMessageToThreadInput,
  ListReviewsOutput,
  RetrieveReviewDetailOutput,
  StartThreadInput,
} from 'common'

export class ReviewClient extends Client {
  async listReviews(workspaceId: string, host?: string) {
    return await this.httpClient
      .get(
        `/workspace/${workspaceId}/review${origin ? `?website=${host}` : ''}`
      )
      .then((res) => res.data as ListReviewsOutput)
  }

  async retrieveReviewDetail(
    workspaceId: string,
    reviewId: string,
    pathname: string
  ) {
    return await this.httpClient
      .get(`/workspace/${workspaceId}/review/${reviewId}?pathname=${pathname}`)
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

  async deleteThread(workspaceId: string, reviewId: string, threadId: number) {
    return await this.httpClient.delete(
      `/workspace/${workspaceId}/review/${reviewId}/thread/${threadId}`
    )
  }

  async deleteMessageFromThread(
    workspaceId: string,
    reviewId: string,
    threadId: number,
    messageId: number
  ) {
    return await this.httpClient.delete(
      `/workspace/${workspaceId}/review/${reviewId}/thread/${threadId}/message/${messageId}`
    )
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

  async updateMessage(
    workspaceId: string,
    reviewId: string,
    threadId: number,
    messageId: number,
    data: AddMessageToThreadInput
  ) {
    return await this.httpClient.put(
      `/workspace/${workspaceId}/review/${reviewId}/thread/${threadId}/message/${messageId}`,
      data
    )
  }
}
