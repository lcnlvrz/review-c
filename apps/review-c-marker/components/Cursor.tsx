import { Plus } from 'lucide-react'

export const Cursor = (props: { x: number; y: number }) => {
  return (
    <div>
      <div
        style={{
          pointerEvents: 'none',
          transform: `translate(${props.x}px, ${props.y}px)`,
        }}
        className="fixed"
      >
        <div className="p-1 bg-primary rounded-full">
          <Plus className="m-0 p-0 w-[20px] h-[20px] text-white fill-white" />
        </div>
      </div>
    </div>
  )
}
