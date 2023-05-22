import { cn } from '@/utils/cn'
import { VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
}

const variants = cva(
  'flex w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
  {
    variants: {
      size: {
        xs: 'h-8',
        md: 'h-10',
        lg: 'h-12',
        xl: 'h-1',
      },
      hasLeftIcon: {
        true: 'pl-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const Input = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'size'> & VariantProps<typeof variants>
>(({ className, leftIcon, size, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(variants({ size, hasLeftIcon: !!leftIcon }))}
        ref={ref}
        {...props}
      />
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
