export interface Creator {
  id: string
  name: string
  username?: string
  avatar?: string
  telegramUrl?: string
}

export interface Character {
  id: string
  name: string
  emoji?: string
  description: string
}

export interface Student {
  id: string
  name: string
  isPlayer: boolean
  creator?: Creator
  character: Character
}

export interface Teacher {
  id: string
  name: string
  username?: string
  avatar?: string
  description?: string
}

export interface GameResult {
  students: Student[]
  teacher: Teacher
  seats: Student[]
}

export const SEAT_COUNT = 5
export const YOU_SEAT_INDEX = 2
export const CREATOR_COUNT = 4
export const STUDENT_COUNT = 5
