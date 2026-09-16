export function telegramAvatarUrl(username?: string, avatar?: string) {
  if (avatar) return avatar
  if (!username) return undefined
  return `https://unavatar.io/telegram/${username}`
}

export function telegramLink(username?: string, telegramUrl?: string) {
  return telegramUrl ?? (username ? `https://t.me/${username}` : undefined)
}

export function displayHandle(student: {
  isPlayer: boolean
  name: string
  creator?: { username?: string }
}) {
  if (student.isPlayer) return 'YOU'
  return student.creator?.username ? `@${student.creator.username}` : student.name
}
