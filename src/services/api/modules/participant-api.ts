import publicClient from '@/services/api/client/private-client'
import { Participant } from '@/types'

const participantEndpoints = {
  getParticipantById: ({ participantId }: { participantId: string }) =>
    `participants/${participantId}`,
  getParticipants: 'participants/',
  // createParticipant: 'participants/',
}

const participantApi = {
  // getParticipantById: async (data: { participantId: string }) => {
  //   try {
  //     const response = await publicClient.get(
  //       participantEndpoints.getParticipantById(data)
  //     )
  //     if (response && response.data) return { response: response.data }
  //     return { response }
  //   } catch (error) {
  //     return { error }
  //   }
  // },
  // getParticipants: async (data:{matchId: string}) => {
  //   try {
  //     const response = await publicClient.get(
  //       participantEndpoints.getParticipants,data
  //     )
  //     if (response && response.data) return { response: response.data }
  //     return { response }
  //   } catch (error) {
  //     return { error }
  //   }
  // },
  // createParticipant: async (data: {
  //   tableId: string
  //   numberPlayers: number
  //   participants: string[]
  // }) => {
  //   try {
  //     const response = await publicClient.post(
  //       participantEndpoints.createParticipant,
  //       data
  //     )
  //     if (response && response.data) return { response: response.data }
  //     return { response }
  //   } catch (error) {
  //     return { error }
  //   }
  // },
}

export default participantApi
