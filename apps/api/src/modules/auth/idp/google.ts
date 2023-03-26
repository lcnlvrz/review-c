import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { IDP, IDPOutput } from './idp'

@Injectable()
export class GoogleIDP implements IDP {
  constructor(private readonly httpService: HttpService) {}

  async auth(accessToken: string): Promise<IDPOutput> {
    console.log('jwt token', accessToken)

    const response = await firstValueFrom(
      this.httpService.get<{
        sub: string
        email: string
        name: string
        picture: string
        given_name: string
        family_name: string
        locale: string
      }>(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )

    console.log('response', response.data)

    return {
      idpID: response.data.sub,
      avatar: response.data.picture,
      email: response.data.email,
      firstName: response.data.given_name,
      lastName: response.data.family_name,
    }
  }
}
