import { describe, expect, it } from 'vitest'
import { characters } from '../data/characters'
import { creators } from '../data/creators'
import { teachers } from '../data/teachers'
import {
  CREATOR_COUNT,
  SEAT_COUNT,
  STUDENT_COUNT,
  YOU_SEAT_INDEX,
  type Character,
  type Creator,
  type GameResult,
  type Teacher,
} from '../types/game'
import { mulberry32 } from '../utils/random'
import { generateGame } from './generateGame'

function assertValid(game: GameResult) {
  expect(game.students).toHaveLength(STUDENT_COUNT)
  expect(game.seats).toHaveLength(SEAT_COUNT)
  expect(game.seats.every(Boolean)).toBe(true)

  const player = game.students.find((s) => s.isPlayer)
  expect(player).toBeDefined()
  expect(player?.id).toBe('you')
  expect(player?.name).toBe('YOU')
  expect(player?.isPlayer).toBe(true)
  expect(player?.creator).toBeUndefined()
  expect(game.seats[YOU_SEAT_INDEX]).toEqual(player)

  const youInCreators = creators.some((c) => c.id === 'you' || c.name === 'YOU')
  expect(youInCreators).toBe(false)

  const seated = game.seats
  expect(seated).toHaveLength(STUDENT_COUNT)
  expect(seated.filter((s) => s.isPlayer)).toHaveLength(1)

  const creatorStudents = game.students.filter((s) => !s.isPlayer)
  expect(creatorStudents).toHaveLength(CREATOR_COUNT)
  expect(new Set(creatorStudents.map((s) => s.id)).size).toBe(CREATOR_COUNT)
  expect(new Set(creatorStudents.map((s) => s.creator?.id)).size).toBe(CREATOR_COUNT)
  for (const student of creatorStudents) {
    expect(student.creator).toBeDefined()
    expect(student.id).toBe(student.creator!.id)
    expect(creators.some((c) => c.id === student.id)).toBe(true)
  }

  const characterIds = game.students.map((s) => s.character.id)
  expect(characterIds).toHaveLength(STUDENT_COUNT)
  expect(new Set(characterIds).size).toBe(STUDENT_COUNT)

  expect(game.students.some((s) => s.id === game.teacher.id)).toBe(false)
  expect(game.students.some((s) => s.name === game.teacher.name)).toBe(false)
  expect(creatorStudents.some((s) => s.creator?.id === game.teacher.id)).toBe(false)
  expect(creators.some((c) => c.id === game.teacher.id)).toBe(true)
  expect(game.teacher.username).toBeTruthy()
}

describe('generateGame', () => {
  it('creates a valid class: 5 students, YOU in the center-middle seat, 4 unique creators, 5 unique characters, separate teacher', () => {
    assertValid(generateGame(mulberry32(2019)))
  })

  it('does not pull YOU from the creator pool', () => {
    const game = generateGame(mulberry32(42))
    const player = game.students.find((s) => s.isPlayer)!
    expect(player.creator).toBeUndefined()
    expect(creators.map((c) => c.id)).not.toContain('you')
  })

  it('PLAY AGAIN generates a new valid result', () => {
    const first = generateGame(mulberry32(1))
    const second = generateGame(mulberry32(2))
    assertValid(first)
    assertValid(second)
    expect(JSON.stringify(first)).not.toEqual(JSON.stringify(second))
  })

  it('does not permanently tie creators to characters', () => {
    const tinyCreators: Creator[] = creators.slice(0, 5)
    const tinyCharacters: Character[] = characters.slice(0, 12)
    const tinyTeachers: Teacher[] = teachers.slice(0, 3)
    const source = {
      creators: tinyCreators,
      characters: tinyCharacters,
      teachers: tinyTeachers,
    }

    const assignments = new Map<string, Set<string>>()
    for (let seed = 1; seed <= 20; seed++) {
      const game = generateGame(mulberry32(seed), source)
      assertValid(game)
      for (const student of game.students.filter((s) => !s.isPlayer)) {
        const set = assignments.get(student.id) ?? new Set<string>()
        set.add(student.character.id)
        assignments.set(student.id, set)
      }
    }

    const switchedPersonality = [...assignments.values()].some((set) => set.size > 1)
    expect(switchedPersonality).toBe(true)
  })

  it('keeps YOU in the center-middle seat across many games', () => {
    for (let seed = 0; seed < 25; seed++) {
      const game = generateGame(mulberry32(seed + 100))
      const seatedYou = game.seats[YOU_SEAT_INDEX]
      expect(seatedYou?.isPlayer).toBe(true)
      expect(seatedYou?.id).toBe('you')
      expect(game.seats.filter((s) => s.isPlayer).length).toBe(1)
    }
  })
})
