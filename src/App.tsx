import { useCallback, useEffect, useState } from 'react'
import { Classroom } from './components/Classroom'
import { LandingScreen } from './components/LandingScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { ResultScreen } from './components/ResultScreen'
import { generateGame } from './game/generateGame'
import type { GameResult } from './types/game'

type Phase = 'landing' | 'loading' | 'class'

export default function App() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [game, setGame] = useState<GameResult | null>(null)
  const [runId, setRunId] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const start = () => {
    setGame(generateGame())
    setRevealed(false)
    setRunId((n) => n + 1)
    setPhase('loading')
  }

  const onRevealed = useCallback(() => setRevealed(true), [])

  useEffect(() => {
    if (phase !== 'loading') return
    const timer = window.setTimeout(() => setPhase('class'), 1700)
    return () => window.clearTimeout(timer)
  }, [phase, runId])

  return (
    <main className={`app${phase === 'class' ? ' playing' : ''}`}>
      {phase === 'landing' ? <LandingScreen onEnter={start} /> : null}
      {phase === 'loading' ? <LoadingScreen /> : null}
      {phase === 'class' && game ? (
        <>
          <header className="topbar">
            <p>🇪🇹 2019</p>
            <h1>YOUR CLASS</h1>
          </header>
          <div className="class-layout">
            <Classroom key={runId} game={game} onRevealed={onRevealed} />
            <ResultScreen game={game} visible={revealed} onPlayAgain={start} />
          </div>
        </>
      ) : null}
    </main>
  )
}
