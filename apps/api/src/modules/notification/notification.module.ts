import { Module } from '@nestjs/common'
import { Emailer } from './emailer'

@Module({
  imports: [],
  providers: [Emailer],
  exports: [Emailer],
})
export class NotificationModule {}
