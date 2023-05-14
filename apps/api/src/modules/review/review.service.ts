import { DatabaseService } from '../database/database.service'
import { S3Provider } from '../file/providers/s3.provider'
import { AddMessageDTO } from './dtos/add-message.dto'
import { CreateThreadDTO } from './dtos/start-thread.dto'
import { CreateReviewPipeOutput } from './pipes/create-review.pipe'
import { Injectable } from '@nestjs/common'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'
import {
  CreateReviewOutput,
  ListReviewsOutput,
  getUserAgentSpecs,
} from 'common'
import * as crypto from 'crypto'
import { Review, Thread, User, Workspace } from 'database'
import { FileTokenClaims } from 'src/common/guards/file-tokens.guard'
import { POST_PRESIGNED_URL_EXPIRATION_SECONDS } from 'src/constants/file'

const nanoid = require('nanoid')

@Injectable()
export class ReviewService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly s3: S3Provider
  ) {}

  async addMessageToThread(input: {
    user: User
    dto: AddMessageDTO
    thread: Thread
    files: FileTokenClaims[]
  }) {
    await this.dbService.thread.update({
      where: {
        id: input.thread.id,
      },
      data: {
        messages: {
          create: [
            {
              content: input.dto.message,
              sentById: input.user.id,
              files: {
                create: input.files.map((file) => ({
                  originalFilename: file.originalFilename,
                  size: file.size,
                  storedKey: file.storedKey,
                })),
              },
            },
          ],
        },
      },
    })
  }

  async startThread(input: {
    user: User
    workspace: Workspace
    review: Review
    dto: CreateThreadDTO
    userAgent: string
    files: FileTokenClaims[]
  }) {
    const specs = getUserAgentSpecs(input.userAgent)

    const thread = await this.dbService.thread.create({
      data: {
        point: {
          create: {
            isMobile: specs.isMobile,
            browser: specs.browser,
            os: specs.os,
            windowHeight: input.dto.windowHeight,
            windowWidth: input.dto.windowWidth,
            xPath: input.dto.xPath,
            xPercentage: input.dto.xPercentage,
            yPercentage: input.dto.yPercentage,
            createdById: input.user.id,
          },
        },
        startedBy: {
          connect: {
            id: input.user.id,
          },
        },
        review: {
          connect: {
            id: input.review.id,
          },
        },
        messages: {
          create: [
            {
              content: input.dto.message,
              sentById: input.user.id,
              files: {
                create: input.files.map((file) => ({
                  originalFilename: file.originalFilename,
                  size: file.size,
                  storedKey: file.storedKey,
                })),
              },
            },
          ],
        },
      },
    })

    return {
      threadId: thread.id,
    }
  }

  async createReview(
    workspace: Workspace,
    user: User,
    input: CreateReviewPipeOutput
  ): Promise<CreateReviewOutput> {
    let reviewId: string

    await this.dbService.$transaction(async (trx) => {
      const fields = await (async () => {
        switch (input.type) {
          case 'FILE': {
            const file = await trx.file.create({
              data: {
                originalFilename: input.file.claims.originalFilename,
                size: input.file.objectMetadata.size,
                storedKey: input.file.claims.storedKey,
              },
            })

            return {
              fileId: file.id,
              type: input.type,
            }
          }

          case 'URL':
            return {
              type: input.type,
              url: input.url,
            }
        }
      })()

      const token = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex')

      const review = await trx.review.create({
        data: {
          title: input.title,
          workspaceId: workspace.id,
          id: nanoid.nanoid(),
          fileId: fields.fileId,
          url: fields.url,
          type: fields.type,
          users: {
            create: {
              role: 'OWNER',
              userId: user.id,
            },
          },
          token,
        },
      })

      reviewId = review.id
    })

    return {
      reviewId,
    }
  }

  async listReviews(workspace: Workspace): Promise<ListReviewsOutput> {
    const reviews = await this.dbService.review.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        users: true,
      },
    })

    return {
      reviews,
    }
  }

  async retrieveReviewDetail(reviewId: string) {
    return await this.dbService.review
      .findFirst({
        where: {
          id: reviewId,
        },
        include: {
          threads: {
            include: {
              point: {
                include: {
                  createdBy: true,
                },
              },
              messages: {
                include: {
                  sentBy: true,
                  files: true,
                },
              },
            },
          },
        },
      })
      .then(async (review) => {
        review.threads = await Promise.all(
          review.threads.map(async (thread) => {
            thread.messages = await Promise.all(
              thread.messages.map(async (message) => {
                message.files = await Promise.all(
                  message.files.map(async (file) => {
                    console.log('file.storedKey', file.storedKey)
                    return {
                      ...file,
                      src: await this.s3.generatePresignedGetURL({
                        key: file.storedKey,
                        expirationInSeconds:
                          POST_PRESIGNED_URL_EXPIRATION_SECONDS,
                      }),
                    }
                  })
                )

                return message
              })
            )

            return thread
          })
        )

        return review
      })
  }
}
