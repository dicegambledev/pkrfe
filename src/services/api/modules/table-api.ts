import publicClient from '@/services/api/client/private-client'

const tableEndpoints = {
  getTableById: ({ tableId }: { tableId: string }) => `tables/${tableId}`,
  getTables: ({ page }: { page: string }) => `tables?page=${page}`,
  switchTable: ({ tableId }: { tableId: string }) => `tables/switch/${tableId}`,
}

const tableApi = {
  getTableById: async (data: { tableId: string }) => {
    try {
      const response = await publicClient.get(tableEndpoints.getTableById(data))
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getTables: async ({ page }: { page: string }) => {
    try {
      const response = await publicClient.get(
        tableEndpoints.getTables({ page })
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  switchTable: async ({
    tableId,
    playerId,
  }: {
    tableId: string
    playerId: string
  }) => {
    try {
      const response = await publicClient.post(
        tableEndpoints.switchTable({ tableId }),
        { playerId }
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
}

export default tableApi
