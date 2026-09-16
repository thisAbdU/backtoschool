const LINES = [
  'Finding your classmates...',
  'Checking the attendance book...',
  'Sir is walking in...',
]

export function LoadingScreen() {
  return (
    <section className="loading">
      <div className="chalkboard mini">
        <p className="chalk-year">2019</p>
        <div className="loading-lines" aria-live="polite">
          {LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
