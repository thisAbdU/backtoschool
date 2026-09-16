import { useState } from 'react'
import type { Teacher as TeacherType } from '../types/game'
import { useRoomDrag } from '../utils/drag'
import { telegramAvatarUrl, telegramLink } from '../utils/telegram'

interface TeacherProps {
  teacher: TeacherType
  revealed: boolean
  movable?: boolean
  onMoved?: () => void
}

export function Teacher({ teacher, revealed, movable = false, onMoved }: TeacherProps) {
  const [broken, setBroken] = useState(false)
  const src = telegramAvatarUrl(teacher.username, teacher.avatar)
  const url = telegramLink(teacher.username)
  const handle = teacher.username ? `@${teacher.username}` : teacher.name
  const { pos, dragging, bind } = useRoomDrag(
    url ? () => window.open(url, '_blank', 'noreferrer') : undefined,
    onMoved,
    movable,
  )
  const showPhoto = Boolean(src) && !broken

  return (
    <div
      className={`teacher ${revealed ? 'in' : ''} ${dragging ? 'dragging' : ''} ${pos ? 'moved' : ''} ${url ? 'clickable' : ''}`}
      style={pos ? { left: `${pos.left}%`, top: `${pos.top}%` } : undefined}
      {...bind}
    >
      <div className="teacher-figure">
        {showPhoto ? (
          <img className="pfp" src={src} alt="" crossOrigin="anonymous" onError={() => setBroken(true)} />
        ) : (
          <>
            <div className="teacher-head" />
            <div className="teacher-body" />
            <div className="chalk" />
          </>
        )}
      </div>
      <p className="teacher-name">
        <span className="teacher-handle">👨‍🏫 {handle}</span>
        {teacher.description ? <span className="teacher-desc">{teacher.description}</span> : null}
      </p>
    </div>
  )
}
