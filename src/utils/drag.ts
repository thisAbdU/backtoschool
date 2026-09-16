import { useRef, useState, type PointerEvent } from 'react'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function useRoomDrag(onTap?: () => void, onMoved?: () => void) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ dx: number; dy: number; x: number; y: number; moved: boolean } | null>(null)
  const tap = useRef(onTap)
  const moved = useRef(onMoved)
  tap.current = onTap
  moved.current = onMoved

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    const room = e.currentTarget.closest('.classroom')?.getBoundingClientRect()
    const el = e.currentTarget.getBoundingClientRect()
    if (!room) return
    const cx = ((el.left + el.width / 2) - room.left) / room.width * 100
    const cy = ((el.top + el.height / 2) - room.top) / room.height * 100
    const px = (e.clientX - room.left) / room.width * 100
    const py = (e.clientY - room.top) / room.height * 100
    drag.current = { dx: cx - px, dy: cy - py, x: e.clientX, y: e.clientY, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d) return
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return
    if (!d.moved) moved.current?.()
    d.moved = true
    setDragging(true)
    const room = e.currentTarget.closest('.classroom')?.getBoundingClientRect()
    if (!room) return
    setPos({
      left: clamp((e.clientX - room.left) / room.width * 100 + d.dx, 8, 92),
      top: clamp((e.clientY - room.top) / room.height * 100 + d.dy, 10, 90),
    })
  }

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current
    drag.current = null
    setDragging(false)
    if (d && !d.moved) tap.current?.()
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  return {
    pos,
    dragging,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  }
}
