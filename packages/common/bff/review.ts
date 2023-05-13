import type { Thread, User } from 'db'

export interface StartThreadInput {
  windowHeight: number
  windowWidth: number
  xPath: string
  xPercentage: number
  yPercentage: number
  message: string
  files: string[]
}

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
  url?: string
}

export interface Review {
  title: string
  id: string
  type: 'FILE' | 'URL'
  url?: string
  file?: File
  users: ReviewUser[]
}

export interface Message {
  files: File[]
  id: number
  content: string
  createdAt: Date
  sentBy: User
}

export interface ListReviewsOutput {
  reviews: Review[]
}

export interface RetrieveReviewDetailOutput
  extends Omit<Review, 'users' | 'threads'> {
  threads: Thread[]
}
