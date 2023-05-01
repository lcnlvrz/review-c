import { Button } from './button/button'
import { Edit } from 'lucide-react'
import { useIsReviewing } from '~hooks/useIsReviewing'

export const ReviewSelector = (props: { host: string }) => {
  const { isReviewing, toggleReview } = useIsReviewing(props.host)

  return (
    <Button className="w-lg text-white" onClick={toggleReview}>
      <Edit className="w-[1rem] h-[1rem] mr-[10px]" />
      {isReviewing ? 'Stop' : 'Start'} reviewing
    </Button>
  )
}
