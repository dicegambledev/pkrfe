import queryString, { ParsedQuery } from 'query-string'
import axios, { AxiosRequestConfig, AxiosHeaders } from 'axios'
import { getStorageToken } from '@/utils/storage'

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`

const privateClient = axios.create({
  baseURL,
  paramsSerializer: (params: ParsedQuery<string>) =>
    queryString.stringify(params),
})

privateClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const accessToken = getStorageToken()

  return {
    ...config,
    headers: new AxiosHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken ? `${accessToken}` : '',
    }),
  }
})

privateClient.interceptors.response.use(
  response => {
    if (response && response.data) return response.data

    return response.data
  },
  err => {
    throw err.response.data
  }
)

export default privateClient
