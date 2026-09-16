import { characters } from '../data/characters'
import { CREATOR_COUNT, STUDENT_COUNT } from '../types/game'
import { pickN, shuffle, mulberry32 } from './random'
import { describe, expect, it } from 'vitest'

describe('shuffle / pickN', () => {
  it('Fisher-Yates keeps unique items and the requested count', () => {
    const rng = mulberry32(7)
    const picked = pickN(characters, STUDENT_COUNT, rng)
    expect(picked).toHaveLength(STUDENT_COUNT)
    expect(new Set(picked.map((c) => c.id)).size).toBe(STUDENT_COUNT)

    const creators = ['a', 'b', 'c', 'd', 'e', 'f']
    expect(pickN(creators, CREATOR_COUNT, mulberry32(9))).toHaveLength(CREATOR_COUNT)
    expect(new Set(shuffle(creators, mulberry32(3))).size).toBe(creators.length)
  })
})
