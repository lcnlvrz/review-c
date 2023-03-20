import { HttpStatus, Injectable } from '@nestjs/common'
import { Provider } from 'database'
import { AppError } from 'src/common/error'
import { MethodOutput } from 'src/common/output'
import { GoogleIDP } from './google'

export interface IDPOutput {
  idpID: string
  email: string
  firstName: string
  lastName: string
  avatar: string
}

//IDP stands for Identity Provider
export interface IDP {
  auth(token: string): Promise<IDPOutput>
}

@Injectable()
export class IdentityProvider {
  constructor(private readonly googleIDP: GoogleIDP) {}

  async auth(idp: Provider, token: string): Promise<MethodOutput<IDPOutput>> {
    try {
      const data = await (async () => {
        switch (idp) {
          case Provider.GOOGLE:
            return await this.googleIDP.auth(token)
        }
      })()

      return {
        data,
        success: true,
      }
    } catch (err) {
      return {
        error: new AppError({
          code: 'idp_auth_failed',
          description: 'Failed to authenticate with IDP',
          status: HttpStatus.UNAUTHORIZED,
        }),
        success: false,
      }
    }
  }
}
