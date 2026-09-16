interface LandingScreenProps {
  onEnter: () => void
}

export function LandingScreen({ onEnter }: LandingScreenProps) {
  return (
    <section className="landing">
      <div className="landing-bg" />
      <div className="landing-card">
        <img className="landing-sweater" src="/uniform.png" alt="" />
        <p className="year-flag">🇪🇹 2019 ዓ.ል.</p>
        <h1>BACK TO SCHOOL</h1>
        <p className="landing-sub">Which class did you get?</p>
        <p className="landing-amh">እንኳን ደረሰባችሁ 😊 new year, new classmates</p>
        <button type="button" className="enter-btn" onClick={onEnter}>
          ENTER CLASS
        </button>
      </div>
    </section>
  )
}
