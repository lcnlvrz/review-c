export interface CreateReviewInput {
  type: 'FILE' | 'URL'
  file?: string | undefined | null
  url?: string | undefined | null
}

export interface CreateReviewOutput {
  reviewId: string
}

export interface ReviewUser {
  id: number
  userId: number
  role: 'OWNER' | 'REVIEWER' | 'VIEWER'
  inviteToken: string | null
  inviteEmail: string | null
  reviewId: string | null
}

export interface File {
  storedKey: string
  originalFilename: string
  size: number
}

export interface Review {
  title: string
  id: string
  type: 'FILE' | 'URL'
  url?: string
  file?: File
  users: ReviewUser[]
}

export interface ListReviewsOutput {
  reviews: Review[]
}
