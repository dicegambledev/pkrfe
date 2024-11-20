import publicClient from '@/services/api/client/private-client'

const historyEndpoints = {
  getAllByUserId: (userId: string) => `histories/user/${userId}`,
  getStatisticalByTableId: ({
    userId,
    tableId,
  }: {
    userId: string
    tableId: string
  }) => `histories/statistical/${userId}/${tableId}`,
}

const historyApi = {
  getAllByUserId: async ({ userId }: { userId: string }) => {
    try {
      const response = await publicClient.get(
        historyEndpoints.getAllByUserId(userId)
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getStatisticalByTableId: async ({
    userId,
    tableId,
  }: {
    userId: string
    tableId: string
  }) => {
    try {
      const response = await publicClient.get(
        historyEndpoints.getStatisticalByTableId({ userId, tableId })
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
}

export default historyApi
