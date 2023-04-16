import { MAX_FILE_SIZE_IN_BYTES } from 'common'
import { useDropFile } from '@/hooks/useDropFile'
import { useError } from '@/hooks/useError'
import type { ReviewSchema } from '@/schemas/review.schema'
import { FileService } from '@/services/file.service'
import axios from 'axios'
import clsx from 'clsx'
import { Paperclip, Trash2, UploadCloud } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Spinner } from './Spinner'
import { Button } from './Button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'

export const UploadFile = (props: {
  onUploadedFile: (fileToken: string) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File>()

  const { handleError } = useError()

  const onDropFile = useCallback((file: File) => {
    setFile(file)
    setIsLoading(true)

    FileService.presignedPostURL({
      filename: file.name,
      mimetype: file.type,
    }).then((res) => {
      const { fields, ...rest } = res

      const formData = new FormData()

      formData.append('file', file)

      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value)
      })

      axios
        .post(rest.url, formData)
        .then(() => props.onUploadedFile(rest.token))
        .catch(handleError)
        .finally(() => {
          setIsLoading(false)
        })
    })
  }, [])

  const { isDragging, ...eventHandlers } = useDropFile({
    onDropFile,
    multi: false,
    maxFileSizeBytes: MAX_FILE_SIZE_IN_BYTES,
  })

  return (
    <>
      <div className="relative">
        <div className="absolute w-full h-full">
          <input
            {...eventHandlers}
            disabled={isLoading || !!file}
            type="file"
            className="opacity-0 w-full h-full"
          />
        </div>
        <div
          className={clsx(
            'border  p-3 rounded-lg  flex flex-col items-center justify-center border-dashed transition-all',
            {
              'bg-gray-10 border-gray-500': !isDragging,
              'bg-gray-100 border-black': isDragging,
            }
          )}
        >
          <UploadCloud className="gray-500 w-12 h-12" />
          <div className="text-center">
            <div>
              <p className="font-bold">Search for a file</p>
              <p className="text-sm"> or drop a file</p>
            </div>

            <p className="text-xs mt-2">
              Max file size: <span className="font-bold">50MB</span>
            </p>
          </div>
        </div>
      </div>
      {file && (
        <div className="flex flex-col items-center justify-center mt-3">
          <div className="w-full h-10 justify-between flex flex-row items-center bg-gray-200 px-3 py-1 rounded-lg">
            <div className="flex flex-row items-center">
              <Paperclip className="w-3 h-3 mr-2" />
              <p className="text-xs truncate max-w-[15rem]">{file.name}</p>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setFile(undefined)}
                      variant={'ghost'}
                      size={'sm'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
    </>
  )
}
