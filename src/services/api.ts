import { createApi, fetchBaseQuery, retry, type FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "@/src/constants/api.url"
import type { RootState } from "@/src/store/store"

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers: Headers, {getState}: { getState: () => unknown }) => {
      const token = (getState() as RootState).user.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)
      if (token){
          headers.set('authorization', `Bearer ${token}`)
      }
      return headers
  }
})

const baseQueryRetry = retry(baseQuery, { maxRetries: 1 })

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryRetry,
  refetchOnMountOrArgChange: true,
  tagTypes: ['User', 'Post'],
  endpoints: () => ({}),
})
