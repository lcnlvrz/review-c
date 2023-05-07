import { MessageCircle } from 'lucide-react'
import { useAuth } from '~hooks/useAuth'

export const MarkerAvatar = () => {
  const auth = useAuth()

  return (
    <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
      <MessageCircle className="-scale-x-1 text-primary" />
    </div>
  )
}
