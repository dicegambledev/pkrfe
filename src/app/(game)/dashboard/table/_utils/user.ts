import { PlayerWithUser } from '@/types'

export const getPlayerIdByUserId = (
  userId: string,
  players: PlayerWithUser[]
) => {
  return players.find(player => player.user.id === userId)?.id
}
