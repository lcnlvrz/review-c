export interface IAppError {
  status: number
  description: string
  code: string
}

export class AppError extends Error implements IAppError {
  status: number
  description: string
  code: string

  constructor(input: IAppError) {
    super(input.description)

    Object.assign(this, input)
  }
}
