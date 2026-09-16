export type Rng = () => number

export function mulberry32(seed: number): Rng {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function pickN<T>(items: T[], count: number, rng: Rng = Math.random): T[] {
  if (count > items.length) {
    throw new Error(`Need ${count} items, only ${items.length} available`)
  }
  return shuffle(items, rng).slice(0, count)
}
