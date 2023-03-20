import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Provider } from 'database'

export class SignInUserDTO {
  @IsEnum(Provider)
  @IsString()
  provider: Provider

  @IsString()
  @IsNotEmpty()
  token: string
}
