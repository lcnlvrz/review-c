import { Client } from './client'
import { httpClient } from './http.client'
import type { IPresignedPostURL } from 'common'

export class FileClient extends Client {
  async presignedPostURL(input: {
    filename: string
    mimetype: string
  }): Promise<IPresignedPostURL> {
    return await httpClient
      .post('/file/presigned', input)
      .then((res) => res.data as IPresignedPostURL)
  }

  async uploadFile(file: File, params: IPresignedPostURL) {
    const form = new FormData()

    Object.entries(params.fields).forEach(([key, value]) => {
      form.append(key, value)
    })

    form.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', params.url, true)
    xhr.upload.onprogress = function (e) {}

    await fetch(params.url, {
      method: 'POST',
      body: form,
    })
  }
}
