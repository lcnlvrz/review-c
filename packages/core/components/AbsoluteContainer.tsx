import React from 'react'
import { cn } from 'ui'

export const AbsoluteContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    point: {
      top: number
      left: number
    }
  }
>(({ className, point, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('absolute', className)}
      style={{
        ...style,
        transform: `translate(${point.left}px, ${point.top}px)`,
        top: 0,
        left: 0,
      }}
      {...props}
    />
  )
})
