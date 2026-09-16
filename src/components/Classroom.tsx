import { useEffect, useMemo, useState } from 'react'
import type { GameResult, Student } from '../types/game'
import { CreatorCard, StudentSeat } from './Student'
import { Teacher } from './Teacher'

interface ClassroomProps {
  game: GameResult
  onRevealed: () => void
}

export function Classroom({ game, onRevealed }: ClassroomProps) {
  const [tick, setTick] = useState(0)
  const [selected, setSelected] = useState<Student | null>(null)
  const [movable, setMovable] = useState(false)

  const revealOrder = useMemo(() => {
    const order: number[] = []
    game.seats.forEach((student, index) => {
      if (student.isPlayer) order.unshift(index)
      else order.push(index)
    })
    return order
  }, [game])

  useEffect(() => {
    const timers = [
      ...revealOrder.map((_, i) => window.setTimeout(() => setTick(i + 1), 200 + i * 420)),
      window.setTimeout(() => setTick(20), 200 + revealOrder.length * 420 + 400),
      window.setTimeout(() => setTick(21), 200 + revealOrder.length * 420 + 800),
      window.setTimeout(onRevealed, 200 + revealOrder.length * 420 + 1000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [game, revealOrder, onRevealed])

  return (
    <div className="classroom-wrap">
      <div className={`classroom${movable ? ' unlocked' : ''}`}>
        <img className="classroom-photo" src="/classroom.jpg" alt="" />
        {game.seats.map((student, seatIndex) => (
          <StudentSeat
            key={seatIndex}
            seatIndex={seatIndex}
            student={student}
            revealed={tick >= revealOrder.indexOf(seatIndex) + 1}
            movable={movable}
            onSelect={setSelected}
          />
        ))}
        <Teacher teacher={game.teacher} revealed={tick >= 20} movable={movable} />
        {tick >= 20 ? (
          <button type="button" className="move-toggle" onClick={() => setMovable((on) => !on)}>
            {movable ? 'Done — lock seats' : 'Names hidden? Move seats'}
          </button>
        ) : null}
      </div>
      {selected ? <CreatorCard student={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
