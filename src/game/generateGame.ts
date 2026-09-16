import { characters as allCharacters } from '../data/characters'
import { creators as allCreators } from '../data/creators'
import { teachers as allTeachers } from '../data/teachers'
import {
  CREATOR_COUNT,
  SEAT_COUNT,
  STUDENT_COUNT,
  YOU_SEAT_INDEX,
  type Character,
  type Creator,
  type GameResult,
  type Student,
  type Teacher,
} from '../types/game'
import { pickN, type Rng } from '../utils/random'
import { displayHandle } from '../utils/telegram'

export interface GameSource {
  creators: Creator[]
  characters: Character[]
  teachers: Teacher[]
}

const defaultSource: GameSource = {
  creators: allCreators,
  characters: allCharacters,
  teachers: allTeachers,
}

const OTHER_SEATS = Array.from({ length: SEAT_COUNT }, (_, i) => i).filter(
  (i) => i !== YOU_SEAT_INDEX,
)

export function generateGame(
  rng: Rng = Math.random,
  source: GameSource = defaultSource,
): GameResult {
  const picked = pickN(source.creators, CREATOR_COUNT + 1, rng)
  const teacherCreator = picked[0]
  const selectedCreators = picked.slice(1)
  const selectedCharacters = pickN(source.characters, STUDENT_COUNT, rng)
  const [flavor] = pickN(source.teachers, 1, rng)
  const creatorSeats = pickN(OTHER_SEATS, CREATOR_COUNT, rng)

  const player: Student = {
    id: 'you',
    name: 'YOU',
    isPlayer: true,
    character: selectedCharacters[0],
  }

  const creatorStudents: Student[] = selectedCreators.map((creator, i) => ({
    id: creator.id,
    name: creator.name,
    isPlayer: false,
    creator,
    character: selectedCharacters[i + 1],
  }))

  const seats: Student[] = Array.from({ length: SEAT_COUNT }, () => player)
  seats[YOU_SEAT_INDEX] = player
  creatorStudents.forEach((student, i) => {
    seats[creatorSeats[i]] = student
  })

  const teacher: Teacher = {
    id: teacherCreator.id,
    name: teacherCreator.name,
    username: teacherCreator.username,
    avatar: teacherCreator.avatar,
    description: flavor.description,
  }

  return {
    students: [player, ...creatorStudents],
    teacher,
    seats,
  }
}

export function classmatesOf(game: GameResult): Student[] {
  return game.seats.filter((s) => !s.isPlayer)
}

export function shareText(game: GameResult): string {
  const player = game.students.find((s) => s.isPlayer)!
  const classmates = classmatesOf(game)
  const lines = [
    '🇪🇹 MY 2019 CLASS',
    '',
    `I am: ${[player.character.emoji, player.character.name].filter(Boolean).join(' ')}`,
    '',
    'Classmates:',
    ...classmates.map(
      (s) =>
        `${[s.character.emoji, displayHandle(s)].filter(Boolean).join(' ')} — ${s.character.name}`,
    ),
    '',
    `Teacher: ${game.teacher.username ? `@${game.teacher.username}` : game.teacher.name}`,
    game.teacher.description ? `"${game.teacher.description}"` : '',
    '',
    'Which class did YOU get?',
  ]
  return lines.join('\n')
}
