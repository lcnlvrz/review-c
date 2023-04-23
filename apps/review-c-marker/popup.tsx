import "./styles.css"

import { Edit } from "lucide-react"

import { WaitForHost } from "~components/WaitForHost"
import { Button } from "~components/button/button"
import { useIsReviewing } from "~hooks/useIsReviewing"

const ToggleReview = (props: { host: string }) => {
  const { isReviewing, toggleReview } = useIsReviewing(props.host)

  return (
    <div className="flex items-center  justify-center w-[15rem] h-[15rem]">
      <Button className="w-lg" onClick={toggleReview}>
        <Edit className="w-[1rem] h-[1rem] mr-[10px]" />
        {isReviewing ? "Stop" : "Start"} reviewing
      </Button>
    </div>
  )
}

function IndexPopup() {
  return <WaitForHost>{({ host }) => <ToggleReview host={host} />}</WaitForHost>
}

export default IndexPopup
