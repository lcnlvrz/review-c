import { useCallback, useState } from 'react'
import { useToast } from './useToast'

export const useDropFile = <T extends boolean>(props: {
  multi: T
  maxFileSizeBytes: number
  onDropFile: (e: T extends true ? File[] : File) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = useCallback(
    (
      file: File
    ):
      | {
          valid: true
        }
      | {
          valid: false
          message: string
        } => {
      if (file.size > props.maxFileSizeBytes) {
        return {
          valid: false,
          message: `File size is too large. Max file size is ${
            props.maxFileSizeBytes / 1000000
          }MB`,
        }
      }

      return {
        valid: true,
      }
    },
    []
  )

  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLInputElement>) => setIsDragging(false),
    []
  )

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLInputElement>) => setIsDragging(true),
    []
  )

  const { toast } = useToast()

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDragging(false)

    if (e) {
      const files = e.target.files

      if (files && files.length) {
        //TODO: implement multi files validation and slice list with max file count limit
        if (props.multi) {
          const fileList = Array.from(files)
          props.onDropFile(fileList as any)
        }

        if (!props.multi) {
          const file = files.item(0)

          if (file) {
            const validation = validateFile(file)

            if (!validation.valid) {
              toast({
                title: 'File Error',
                description: validation.message,
              })
            }

            if (validation.valid) {
              props.onDropFile(file as any)
            }
          }
        }
      }
    }

    e.target.value = ''
  }, [])

  return {
    onChange,
    onDragEnter,
    onDragLeave,
    isDragging,
  }
}
