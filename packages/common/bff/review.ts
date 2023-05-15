import type { Thread, User } from 'db'

export interface StartThreadInput {
  pathname: string
  windowHeight: number
  windowWidth: number
  xPath: string
  xPercentage: number
  yPercentage: number
  message: string
  files: string[]
}

export interface AddMessageToThreadInput {
  message: string
  files: string[]
}

export interface CreateReviewInput {
  type: 'FILE' | 'WEBSITE'
  file?: string | undefined | null
  website?: string | undefined | null
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
  type: 'FILE' | 'WEBSITE'
  website?: string
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
