import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import { MAX_FILE_SIZE_IN_BYTES } from 'common'
import {
  AWS_ACCESS_KEY_ID,
  AWS_S3_BUCKET_NAME,
  AWS_S3_ENDPOINT,
  AWS_S3_REGION,
  AWS_SECRET_ACCESS_KEY,
} from 'src/constants/secrets'

export interface IObjectMetadata {
  key: string
  size: number
  contentType: string
}

@Injectable()
export class S3Provider {
  private readonly s3: S3
  private readonly bucket: string

  constructor(private readonly configService: ConfigService) {
    this.bucket = configService.get(AWS_S3_BUCKET_NAME)

    this.s3 = new S3({
      s3ForcePathStyle: true,
      region: configService.get(AWS_S3_REGION),
      endpoint: configService.get(AWS_S3_ENDPOINT),
      credentials: {
        accessKeyId: configService.get(AWS_ACCESS_KEY_ID),
        secretAccessKey: configService.get(AWS_SECRET_ACCESS_KEY),
      },
    })
  }

  async generatePresignedPostURL(input: {
    contentType: string
    key: string
    expirationInSeconds: number
  }) {
    return await this.s3.createPresignedPost({
      Fields: {
        'Content-Type': input.contentType,
        key: input.key,
      },
      Conditions: [['content-length-range', 100, MAX_FILE_SIZE_IN_BYTES]],
      Bucket: this.bucket,
      Expires: input.expirationInSeconds,
    })
  }

  async getMetadataObject(storedKey: string): Promise<
    | {
        exists: true
        metadata: IObjectMetadata
      }
    | {
        exists: false
      }
  > {
    try {
      return await this.s3
        .headObject({
          Key: storedKey,
          Bucket: this.bucket,
        })
        .promise()
        .then((res) => {
          console.log('res', res)
          if (res.$response.data) {
            return {
              exists: true,
              metadata: {
                key: storedKey,
                size: res.$response.data.ContentLength,
                contentType: res.$response.data.ContentType,
              },
            }
          }

          return {
            exists: false,
          }
        })
    } catch (err) {
      return {
        exists: false,
      }
    }
  }
}
