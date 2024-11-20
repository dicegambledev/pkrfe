import publicClient from '@/services/api/client/private-client'
import { Participant } from '@/types'

const matchEndpoints = {
  getMatchById: ({ matchId }: { matchId: string }) => `matches/${matchId}`,
  getMatches: 'matches/',
  createMatche: 'matches/',
  getCurrentMatchByTableId: ({ tableId }: { tableId: string }) =>
    `matches/table/${tableId}`,
}

const matchApi = {
  getMatchById: async (data: { matchId: string }) => {
    try {
      const response = await publicClient.get(matchEndpoints.getMatchById(data))
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getCurrentMatchByTableId: async (data: { tableId: string }) => {
    try {
      const response = await publicClient.get(
        matchEndpoints.getCurrentMatchByTableId(data)
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },

  getMatches: async () => {
    try {
      const response = await publicClient.get(matchEndpoints.getMatches)
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  createMatch: async (data: {
    tableId: string
    numberPlayers: number
    participants: string[]
  }) => {
    try {
      const response = await publicClient.post(
        matchEndpoints.createMatche,
        data
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
}

export default matchApi
