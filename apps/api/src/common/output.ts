import { AppError } from './error'

export type MethodOutput<D extends object> =
  | {
      data: D
      success: true
      error?: null
    }
  | {
      success: false
      error: AppError
    }
