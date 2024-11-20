import publicClient from '@/services/api/client/public-client'
import privateClient from '@/services/api/client/private-client'
import qs from 'query-string'

const messsageEndpoints = {
  getMessages: `messages/`,
  createMessage: `messages/`,
}

const messsageApi = {
  getMessages: async ({
    cursor,
    tableId,
  }: {
    cursor: string | undefined
    tableId: string
  }) => {
    try {
      const url = qs.stringifyUrl({
        url: `${messsageEndpoints.getMessages}`,
        query: {
          cursor,
          tableId,
        },
      })

      const response = await publicClient.get(url)
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  createMessage: async (data: any) => {
    try {
      const response = await privateClient.post(
        messsageEndpoints.createMessage,
        data
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
}

export default messsageApi
