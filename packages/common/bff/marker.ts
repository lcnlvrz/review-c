import { Marker, Point, User, Selection } from 'database'

export interface MarkerPopulated extends Marker {
  point: Point
  selection: Selection
  createdBy: User
}
