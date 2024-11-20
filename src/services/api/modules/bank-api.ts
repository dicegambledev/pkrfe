import publicClient from '@/services/api/client/private-client'

const bankEndpoints = {
  getBankByUserId: (userId: string) => `banks/user/${userId}`,
  create: 'banks',
  update: ({ bankId }: { bankId: string }) => `banks/${bankId}`,
}

const bankApi = {
  getBankByUserId: async ({ userId }: { userId: string }) => {
    try {
      const response = await publicClient.get(
        bankEndpoints.getBankByUserId(userId)
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  create: async (data: any) => {
    try {
      const response = await publicClient.post(bankEndpoints.create, data)
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },

  update: async (data: any, bankId: string) => {
    try {
      const response = await publicClient.put(
        bankEndpoints.update({ bankId }),
        data
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
}

export default bankApi
