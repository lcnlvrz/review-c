import { Plus } from 'lucide-react'
import React from 'react'
import { useCallback, useEffect, useState } from 'react'

export const Cursor = () => {
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setCursor({
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div>
      <div
        style={{
          pointerEvents: 'none',
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
        }}
        className="fixed"
      >
        <div className="p-1 bg-primary rounded-full">
          <Plus className="m-0 p-0 w-[20px] h-[20px] text-white fill-white" />
        </div>
      </div>
    </div>
  )
}
