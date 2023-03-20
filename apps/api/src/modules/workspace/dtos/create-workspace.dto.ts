import { Exclude, Expose } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

@Exclude()
export class CreateWorkspaceDTO {
  @Expose()
  @IsString()
  @IsOptional()
  name: string

  @Expose()
  @IsString()
  @IsOptional()
  description?: string
}
