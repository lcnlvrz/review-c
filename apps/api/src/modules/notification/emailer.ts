import { Injectable } from '@nestjs/common'

export interface IEmailsMap {
  workspaceInvitation: {
    url: string
  }
}

@Injectable()
export class Emailer {
  async send<T extends keyof IEmailsMap>(template: T, data: IEmailsMap[T]) {}
}
