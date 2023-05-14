import { useAPI } from './useAPI'
import html2canvas from 'html2canvas'
import { useCallback, useState } from 'react'

interface Screenshot {
  name: string
  progress: number
  isLoading: boolean
  src: string
  token: string
}

export const useScreenshot = () => {
  const fileAPI = useAPI('file')

  const [screenshots, setScreenshots] = useState<Screenshot[]>([])

  const uploadScreenshot = useCallback((file: File) => {
    fileAPI
      .presignedPostURL({
        filename: file.name,
        mimetype: file.type,
      })
      .then((res) => {
        const form = new FormData()

        Object.entries(res.fields).forEach(([key, value]) => {
          form.append(key, value)
        })

        form.append('file', file)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', res.url, true)

        xhr.upload.onprogress = (e) => {
          const progress = Math.ceil((e.loaded / e.total) * 100)

          setScreenshots((screenshots) =>
            screenshots.map((screenshot) => {
              if (screenshot.name === file.name) {
                screenshot.progress = progress
                return screenshot
              }

              return screenshot
            })
          )
        }

        xhr.send(form)

        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            setScreenshots((screenshots) =>
              screenshots.map((screenshot) => {
                if (screenshot.name === file.name) {
                  screenshot.isLoading = false
                  screenshot.token = res.token
                  return screenshot
                }

                return screenshot
              })
            )
          }
        }
      })
  }, [])

  const takeScreenshot = useCallback((element: HTMLElement) => {
    html2canvas(element).then((canvas) => {
      const name = `screenshot-${new Date().getTime()}.png`

      setScreenshots((screenshots) =>
        screenshots.concat([
          {
            token: '',
            src: canvas.toDataURL(),
            isLoading: true,
            progress: 0,
            name,
          },
        ])
      )

      canvas.toBlob((blob) => {
        const file = new File([blob], name, {
          type: 'image/png',
        })

        uploadScreenshot(file)
      })
    })
  }, [])

  const removeScreenshot = useCallback((index) => {
    setScreenshots((screenshots) => screenshots.filter((_, i) => i !== index))
  }, [])

  const addScreenshot = useCallback((screenshot: Screenshot) => {
    setScreenshots((screenshots) => screenshots.concat([screenshot]))
  }, [])

  const clearScreenshots = useCallback(() => setScreenshots([]), [])

  return {
    screenshots,
    takeScreenshot,
    removeScreenshot,
    uploadScreenshot,
    addScreenshot,
    clearScreenshots,
  }
}
