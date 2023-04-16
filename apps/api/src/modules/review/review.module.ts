import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { ReviewController } from './review.controller'
import { ReviewService } from './review.service'
import { AuthModule } from '../auth/auth.module'
import { FileModule } from '../file/file.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule.register({}), FileModule, AuthModule, DatabaseModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
