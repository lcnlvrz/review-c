import { AbsoluteContainer } from './AbsoluteContainer'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { cn } from 'ui'

export const CURSOR_ID = 'review-c-cursor'

export const Cursor = (props: { focus?: boolean }) => {
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setCursor({
      x: event.pageX,
      y: event.pageY,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <AbsoluteContainer
      point={{
        left: cursor.x,
        top: cursor.y,
      }}
      id={CURSOR_ID}
      style={{
        pointerEvents: 'none',
      }}
      className={cn('absolute', {
        hidden: !props.focus,
      })}
    >
      <div className="p-1 bg-primary rounded-full w-min">
        <Plus className="m-0 h-4 w-4 p-0 text-white fill-white" />
      </div>
    </AbsoluteContainer>
  )
}
