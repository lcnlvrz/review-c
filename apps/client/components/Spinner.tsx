import { cn } from '@/utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

const spinnerVariants = cva('mr-2 h-4 w-4 animate-spin', {
  variants: {
    size: {
      default: 'h-4 w-4',
      sm: 'h-3 w-3',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export const Spinner = (props: VariantProps<typeof spinnerVariants>) => {
  return <Loader2 className={cn(spinnerVariants(props))} />
}
