import type { ThreadPopulated } from './thread'
import type { User, Review, MarkerType, Point, Selection } from 'database'

export interface StartThreadInput {
  pathname: string
  windowHeight: number
  windowWidth: number
  type: MarkerType
  point?: Omit<Point, 'id'>
  selection?: Omit<Selection, 'id'>
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

export interface PaginationMetadata {
  total: number
  page: number
  pages: number
}

export interface PaginationParams {
  search?: string
  page: number
  limit: number
}

export interface PaginateReviewsInput extends PaginationParams {}

export interface PaginateReviewsOutput extends PaginationMetadata {
  reviews: Review[]
}

export interface RetrieveReviewDetailOutput
  extends Omit<Review, 'users' | 'threads'> {
  file?: File
  threads: ThreadPopulated[]
}
