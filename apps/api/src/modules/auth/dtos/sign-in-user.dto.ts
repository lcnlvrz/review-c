import { Exclude, Expose } from 'class-transformer'
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Provider } from 'database'

@Exclude()
export class SignInUserDTO {
  @Expose()
  @IsEnum(Provider)
  @IsString()
  provider: Provider

  @Expose()
  @IsString()
  @IsNotEmpty()
  token: string

  @Expose()
  @IsBoolean()
  force_ws: boolean = true
}
