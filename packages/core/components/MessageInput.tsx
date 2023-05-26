import { useScreenshot } from '../hooks/useScreenshot'
import { useInspectElements } from '../providers/InspectElementsProvider'
import type { MarkerPoint } from './PointMarker'
import { Camera, Plus, Send } from 'lucide-react'
import React, { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { ImageGallery, Textarea, cn } from 'ui'

export const MessageInput = <T extends object>(props: {
  height?: `h-${number}`
  className?: string
  formCtrl: UseFormReturn<T>
  screenshotsCtrl: ReturnType<typeof useScreenshot>
  point: Pick<Extract<MarkerPoint, { visible: true }>, 'left' | 'top'>
  onSubmit: (data: T) => void
}) => {
  const { inspectElements } = useInspectElements()

  const onUploadImage = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        const images = Array.from(event.target.files).filter((file) =>
          file.type.includes('image')
        )

        await Promise.all(
          images.map(async (image) => {
            props.screenshotsCtrl.addScreenshot({
              isLoading: true,
              progress: 0,
              name: image.name,
              src: URL.createObjectURL(image),
              token: '',
            })

            await props.screenshotsCtrl.uploadScreenshot(image)
          })
        )
      }
    },
    []
  )

  return (
    <div
      className={cn(
        '!pt-0 !pl-2 w-full h-full bg-gray-50 rounded-b-2xl',
        props.className
      )}
    >
      <Textarea
        {...props.formCtrl.register('message')}
        className={cn(
          'min-w-[15rem] h-28 border-none p-2 text-black focus:outline-0 text-sm focus:ring-0 focus:border-transparent resize-none',
          props.height
        )}
        placeholder="Reply..."
      />

      {props.screenshotsCtrl.screenshots.length > 0 && (
        <ImageGallery
          onRemove={props.screenshotsCtrl.removeScreenshot}
          images={props.screenshotsCtrl.screenshots}
        />
      )}

      <div className="w-full flex justify-between">
        <div className="flex flex-row items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="absolute top-0 cursor-pointer">
              <input
                accept="image/*"
                className="opacity-0 w-full cursor-pointer"
                id="file"
                type="file"
                multiple
                onChange={onUploadImage}
              />
            </div>

            <button
              title="Add files"
              className="group-hover:bg-primary group rounded-full p-1 transition-all"
            >
              <Plus className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
            </button>
          </div>

          <button
            onClick={() => {
              inspectElements().then((elementSelected) => {
                props.screenshotsCtrl.takeScreenshot(elementSelected)
              })
            }}
            title="Take a screenshot"
            className="hover:bg-primary group rounded-full p-1 transition-all"
          >
            <Camera className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
          </button>
        </div>

        <button
          onClick={() => props.onSubmit(props.formCtrl.getValues())}
          disabled={
            props.screenshotsCtrl.screenshots.some((s) => s.isLoading) ||
            props.formCtrl.formState.isSubmitting
          }
          title="Send comment"
          className="hover:bg-primary rounded-full group p-1 transition-all "
        >
          <Send className="text-gray-500 w-[20px] text-xs group-hover:text-white" />
        </button>
      </div>
    </div>
  )
}
