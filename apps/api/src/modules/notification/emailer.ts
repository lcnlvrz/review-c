import { Injectable } from '@nestjs/common'

export interface IEmailsMap {}

export interface IEmailsBulk {
  workspaceInvitation: {
    url: string
    email: string
  }[]
}

@Injectable()
export class Emailer {
  async send<T extends keyof IEmailsMap>(template: T, data: IEmailsMap[T]) {}

  async sendBulk<T extends keyof IEmailsBulk>(
    template: T,
    data: IEmailsBulk[T]
  ) {}
}
