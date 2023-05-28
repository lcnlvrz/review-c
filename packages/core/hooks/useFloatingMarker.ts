import { PointCoordinates } from '../components/MarkerElement'
import { useFloating, shift, autoPlacement } from '@floating-ui/react'
import { useEffect } from 'react'

export const useFloatingMarker = (point: PointCoordinates) => {
  const floating = useFloating({
    middleware: [shift()],
    placement: 'bottom',
  })

  useEffect(() => {
    floating.update()
  }, [point])

  return {
    floating,
  }
}
