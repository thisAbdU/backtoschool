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
  const [hint, setHint] = useState(true)

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

  useEffect(() => {
    if (tick < 20) return
    const id = window.setTimeout(() => setHint(false), 8000)
    return () => window.clearTimeout(id)
  }, [tick])

  const hideHint = () => setHint(false)

  return (
    <div className="classroom-wrap">
      <div className="classroom">
        <img className="classroom-photo" src="/classroom.jpg" alt="" />
        {game.seats.map((student, seatIndex) => (
          <StudentSeat
            key={seatIndex}
            seatIndex={seatIndex}
            student={student}
            revealed={tick >= revealOrder.indexOf(seatIndex) + 1}
            onSelect={setSelected}
            onMoved={hideHint}
          />
        ))}
        <Teacher teacher={game.teacher} revealed={tick >= 20} onMoved={hideHint} />
        {tick >= 20 && hint ? (
          <p className="move-hint">Drag anyone if a name is hidden</p>
        ) : null}
      </div>
      {selected ? <CreatorCard student={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
