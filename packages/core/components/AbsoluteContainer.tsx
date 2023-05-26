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
        top: point.top,
        left: point.left,
      }}
      {...props}
    />
  )
})
