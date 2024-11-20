import privateClient from '@/services/api/client/private-client'
import publicClient from '@/services/api/client/public-client'

const userEndpoints = {
  getUserById: ({ userId }: { userId: string }) => `users/${userId}`,
  getUserByUsername: ({ username }: { username: string }) =>
    `users/username/${username}`,
  getUserByEmail: ({ email }: { email: string }) =>
    `users/detail/${email}`,
  register: `auth/register`,
  login: `auth/login`,
  logout: `auth/logout`,
  newPassword: ({ userId }: { userId: string }) =>
    `auth/new-password/${userId}`,
  update: ({ userId }: { userId: string }) => `users/${userId}`,
}

const userApi = {
  login: async (data: any) => {
    try {
      const response = await publicClient.post(userEndpoints.login, data)

      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error: 'Something went wrong' }
    }
  },
  logout: async () => {
    try {
      const response = await publicClient.post(userEndpoints.logout, {})

      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error: 'Something went wrong' }
    }
  },
  register: async (data: {
    email: string
    username: string
    password: string
  }) => {
    try {
      const response = await publicClient.post(userEndpoints.register, data)

      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error: 'Something went wrong' }
    }
  },
  getUserById: async ({ userId }: { userId: string }) => {
    try {
      const response = await privateClient.get(
        userEndpoints.getUserById({ userId })
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getUserByUsername: async ({ username }: { username: string }) => {
    try {
      const response = await publicClient.get(
        userEndpoints.getUserByUsername({ username })
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getUserByEmail: async ({ email }: { email: string }) => {
    try {
      const response = await publicClient.get(
        userEndpoints.getUserByEmail({ email })
      )
      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      console.log('error: ', error)
      return { error }
    }
  },
  updateUser: async (data: any, userId: string) => {
    try {
      const response = await privateClient.put(
        userEndpoints.update({ userId }),
        data
      )

      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error }
    }
  },
  newPassword: async (data: any, userId: string) => {
    try {
      const response = await privateClient.post(
        userEndpoints.newPassword({ userId }),
        data
      )

      if (response && response.data) return { response: response.data }
      return { response }
    } catch (error) {
      return { error: 'Something went wrong' }
    }
  },
}

export default userApi
