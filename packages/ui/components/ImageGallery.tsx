import { cn } from '../utils/cn'
import { Button } from './Button'
import { Dialog, DialogContent, DialogDescription } from './Dialog'
import { Progress } from './Progress'
import { Slider } from './Slider'
import { ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import Draggable from 'react-draggable'

interface Image {
  src: string
  isLoading?: boolean
  progress?: number
}

const ImagePreview = (
  props: Image & {
    onRemove?: () => void
    onFocusImage: () => void
  }
) => {
  return (
    <div className="relative shrink-0">
      {props.isLoading && (
        <div className="w-full absolute bottom-0">
          <Progress
            className="w-full h-2 rounded-none"
            value={props.progress}
          />
        </div>
      )}

      {props.onRemove && (
        <div className="absolute -top-3 -right-3">
          <Button
            onClick={() => {
              if (props.onRemove) {
                props.onRemove()
              }
            }}
            size="sm"
            className="bg-white group shadow-lg rounded-full border border-gray-100"
          >
            <X className="w-3 h-3 group-hover:fill-white group-hover:text-white" />
          </Button>
        </div>
      )}

      <img
        onClick={props.onFocusImage}
        className="w-20 h-20 shadow-lg rounded-lg object-cover cursor-pointer"
        src={props.src}
      />
    </div>
  )
}

interface ImageDimensions {
  width: number
  height: number
}

const ZOOM_STEP = 1.5
const MAX_ZOOM_FACTOR = 3

export const ImageGallery = (props: {
  portalRef?: HTMLElement
  images: Image[]
  onRemove?: (index: number) => void
}) => {
  const [imageFocusIndex, setImageFocusIndex] = useState<number>()

  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions>(
    {
      height: 0,
      width: 0,
    }
  )

  const [zoomFactor, setZoomFactor] = useState<number>(0)

  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    height: 0,
    width: 0,
  })

  const focusImage = useMemo(
    () =>
      typeof imageFocusIndex === 'number'
        ? props.images[imageFocusIndex]
        : undefined,
    [imageFocusIndex, props.images.length]
  )

  const applyZoom = useCallback(
    (zoomFactor: number) => {
      if (!zoomFactor) {
        setImageDimensions({
          width: originalDimensions.width,
          height: originalDimensions.height,
        })
        setZoomFactor(0)
        setImagePosition({
          x: 0,
          y: 0,
        })
        return
      }

      setZoomFactor(zoomFactor)
      setImageDimensions({
        width: originalDimensions.width * zoomFactor,
        height: originalDimensions.height * zoomFactor,
      })
    },
    [originalDimensions]
  )

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className="flex flex-row space-x-5 py-4 overflow-x-auto">
        {props.images.map((image, index) => {
          return (
            <ImagePreview
              {...image}
              key={index}
              onFocusImage={() => {
                setImageFocusIndex(index)
              }}
              {...(props.onRemove
                ? {
                    onRemove: () => {
                      if (props.onRemove) {
                        props.onRemove(index)
                      }
                    },
                  }
                : {})}
            />
          )
        })}
      </div>
      <Dialog
        open={!!focusImage}
        onOpenChange={(open) => {
          if (!open) {
            setImageFocusIndex(undefined)
          }
        }}
      >
        <DialogContent portalRef={props.portalRef} className="sm:max-w-4xl">
          {!!focusImage && (
            <DialogDescription className="overflow-hidden p-3">
              <div
                ref={containerRef}
                className="w-full overflow-hidden h-[40rem] flex items-center justify-center relative"
              >
                {imageFocusIndex !== 0 && (
                  <div className="absolute left-0 top-[50%] z-10">
                    <Button
                      onClick={() =>
                        setImageFocusIndex((imageFocusIndex || 0) - 1)
                      }
                      className="bg-white rounded-full"
                    >
                      <ChevronLeft />
                    </Button>
                  </div>
                )}

                <div className="px-5 relative">
                  <Draggable
                    onDrag={(e, data) => {
                      setImagePosition({
                        x: data.x,
                        y: data.y,
                      })
                    }}
                    scale={1}
                    position={imagePosition}
                  >
                    <div
                      className="cursor-grab flex items-center justify-center"
                      style={{
                        ...(imageDimensions
                          ? {
                              width: imageDimensions.width,
                              height: imageDimensions.height,
                            }
                          : {}),
                      }}
                    >
                      <div
                        {...(!zoomFactor
                          ? {
                              style: {
                                width: containerRef?.current?.clientWidth,
                                height: containerRef?.current?.clientHeight,
                              },
                            }
                          : {})}
                        className="h-full"
                      >
                        <img
                          draggable={false}
                          onLoad={(e) => {
                            const image = e.target as HTMLImageElement

                            const dimensions = {
                              width: image.width,
                              height: image.height,
                            }

                            setOriginalDimensions(dimensions)
                            setImageDimensions(dimensions)
                          }}
                          src={focusImage.src}
                          className={cn(
                            'w-full object-contain h-full rounded-lg'
                          )}
                        />
                      </div>
                    </div>
                  </Draggable>
                </div>

                {imageFocusIndex !== props.images.length - 1 && (
                  <div className="absolute right-0 top-[50%] z-10">
                    <Button
                      onClick={() =>
                        setImageFocusIndex((imageFocusIndex || 0) + 1)
                      }
                      className="bg-white rounded-full"
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                )}
              </div>
              <div className="w-[200px] mt-5 flex flex-row justify-between space-x-2">
                <button
                  className="p-3"
                  disabled={!zoomFactor}
                  onClick={() => {
                    const nextZoomFactor = zoomFactor - ZOOM_STEP
                    applyZoom(nextZoomFactor)
                  }}
                >
                  <Minus className="w-3 h-3 text-primary" />
                </button>

                <Slider
                  onValueChange={(value) => {
                    const [zoomFactor] = value

                    applyZoom(zoomFactor)
                  }}
                  value={[zoomFactor]}
                  defaultValue={[zoomFactor]}
                  step={ZOOM_STEP}
                  max={MAX_ZOOM_FACTOR}
                  className="w-[60%]"
                />

                <button
                  className="p-3"
                  disabled={zoomFactor === MAX_ZOOM_FACTOR}
                  onClick={() => {
                    const nextZoomFactor = zoomFactor + ZOOM_STEP
                    applyZoom(nextZoomFactor)
                  }}
                >
                  <Plus className="w-3 h-3 text-primary" />
                </button>
              </div>
            </DialogDescription>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
