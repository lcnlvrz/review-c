import cursor from 'data-base64:~assets/icon.png'

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
        <img className="w-[30px] h-[30px]" src={cursor} />
      </div>
    </div>
  )
}
