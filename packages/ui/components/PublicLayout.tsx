import { cn } from '../utils/cn'
import { Logo } from './Logo'

export const PublicLayout = (
  props: React.PropsWithChildren<{
    title?: string
    className?: string
  }>
) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center items-center flex justify-center flex-col">
        <Logo size="lg" />
        {props.title && (
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            {props.title}
          </h2>
        )}
      </div>

      <div
        className={cn('mt-8 sm:mx-auto sm:w-full sm:max-w-lg', props.className)}
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="w-full items-center flex justify-center">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}
