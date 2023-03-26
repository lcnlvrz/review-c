export interface IAppError {
  status: number
  description: string
  code: string
}

export class AppError<T extends object = object>
  extends Error
  implements IAppError
{
  status: number
  description: string
  code: string

  constructor(input: IAppError & T) {
    super(input.description)

    Object.assign(this, input)
  }
}
