import type { GameResult } from '../types/game'
import { classmatesOf, shareText } from '../game/generateGame'
import { displayHandle } from '../utils/telegram'
import { ShareButton } from './ShareButton'

interface ResultScreenProps {
  game: GameResult
  visible: boolean
  onPlayAgain: () => void
}

export function ResultScreen({ game, visible, onPlayAgain }: ResultScreenProps) {
  if (!visible) return null
  const player = game.students.find((s) => s.isPlayer)!
  const classmates = classmatesOf(game)

  return (
    <section className="result">
      <div className="you-are">
        <p>You are</p>
        <h2>
          {player.character.emoji} {player.character.name}
        </h2>
        <p className="you-desc">{player.character.description}</p>
      </div>
      <div className="classmates">
        <h3>Classmates</h3>
        <ul>
          {classmates.map((mate) => (
            <li key={mate.id}>
              <div className="mate-copy">
                <strong>{displayHandle(mate)}</strong>
                <p className="mate-role">
                  {mate.character.emoji} {mate.character.name}
                </p>
                <p className="mate-desc">{mate.character.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="result-teacher">
        <h3>Teacher</h3>
        <p>
          👨‍🏫 {game.teacher.username ? `@${game.teacher.username}` : game.teacher.name}
          {game.teacher.description ? ` — ${game.teacher.description}` : ''}
        </p>
      </div>
      <div className="result-actions">
        <ShareButton text={shareText(game)} />
        <button type="button" className="again-btn" onClick={onPlayAgain}>
          PLAY AGAIN
        </button>
      </div>
    </section>
  )
}
