import { useEffect, useState, type CSSProperties } from 'react'
import type { Student } from '../types/game'
import { useRoomDrag } from '../utils/drag'
import { telegramAvatarUrl, telegramLink, displayHandle } from '../utils/telegram'

const SKIN = ['#6b3f2a', '#8d5524', '#a36b3e', '#5a3219', '#c68642']
const HAIR = ['#1a120c', '#2b1b12', '#3d2314', '#111']

function hash(value: string) {
  return [...value].reduce((n, ch) => n + ch.charCodeAt(0), 0)
}

interface StudentSeatProps {
  student: Student
  seatIndex: number
  revealed: boolean
  movable?: boolean
  onSelect?: (student: Student) => void
  onMoved?: () => void
}

export function StudentSeat({ student, seatIndex, revealed, movable = false, onSelect, onMoved }: StudentSeatProps) {
  const tone = SKIN[hash(student.id) % SKIN.length]
  const hair = HAIR[hash(student.name) % HAIR.length]
  const clickable = Boolean(student.creator && onSelect)
  const src = telegramAvatarUrl(student.creator?.username, student.creator?.avatar)
  const [broken, setBroken] = useState(false)
  const showPhoto = Boolean(src) && !broken && !student.isPlayer
  const { pos, dragging, bind } = useRoomDrag(
    clickable ? () => onSelect?.(student) : undefined,
    onMoved,
    movable,
  )

  return (
    <button
      type="button"
      className={`seat seat-${seatIndex} ${student.isPlayer ? 'you' : ''} ${revealed ? 'in' : ''} ${clickable ? 'clickable' : ''} ${dragging ? 'dragging' : ''} ${pos ? 'moved' : ''}`}
      style={pos ? { left: `${pos.left}%`, top: `${pos.top}%` } : undefined}
      {...bind}
      aria-label={
        student.isPlayer
          ? `You, ${student.character.name}`
          : `${student.name}, ${student.character.name}`
      }
    >
      <div className="figure" style={{ '--skin': tone, '--hair': hair } as CSSProperties}>
        <span className="char-emoji" aria-hidden="true">
          {student.character.emoji}
        </span>
        {showPhoto ? (
          <img className="pfp" src={src} alt="" crossOrigin="anonymous" onError={() => setBroken(true)} />
        ) : (
          <>
            <div className="head">
              <div className="hair" />
            </div>
            <div className="collar" />
            <div className="sweater" />
          </>
        )}
      </div>
      <p className="seat-name">
        <span className="seat-handle">{displayHandle(student)}</span>
        <span className="seat-nick">{student.character.name}</span>
      </p>
    </button>
  )
}

interface CreatorCardProps {
  student: Student
  onClose: () => void
}

export function CreatorCard({ student, onClose }: CreatorCardProps) {
  const [visible, setVisible] = useState(false)
  const [broken, setBroken] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const creator = student.creator
  if (!creator) return null
  const url = telegramLink(creator.username, creator.telegramUrl)
  const src = telegramAvatarUrl(creator.username, creator.avatar)

  return (
    <div className={`sheet-backdrop ${visible ? 'on' : ''}`} onClick={onClose} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-label={creator.name}
        onClick={(e) => e.stopPropagation()}
      >
        {src && !broken ? (
          <img className="sheet-pfp" src={src} alt="" onError={() => setBroken(true)} />
        ) : null}
        <p className="sheet-kicker">classmate</p>
        <h3>{displayHandle(student)}</h3>
        <p className="sheet-role">
          {student.character.emoji} {student.character.name}
        </p>
        <p className="sheet-desc">{student.character.description}</p>
        {url ? (
          <a className="telegram-link" href={url} target="_blank" rel="noreferrer">
            Open on Telegram
          </a>
        ) : null}
        <button type="button" className="sheet-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
