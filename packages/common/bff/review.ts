export interface CreateReviewInput {
  type: 'FILE' | 'URL'
  file?: string | undefined | null
  url?: string | undefined | null
}

export interface CreateReviewOutput {
  reviewId: string
}

export interface ListReviewsOutput {
  reviews: {
    type: 'FILE' | 'URL'
    url?: string
    file?: {
      storedKey: string
      originalFilename: string
      size: number
    }
    users: {
      id: number
      userId: number
      role: 'OWNER' | 'REVIEWER' | 'VIEWER'
      inviteToken: string | null
      inviteEmail: string | null
      reviewId: string | null
    }[]
  }[]
}
