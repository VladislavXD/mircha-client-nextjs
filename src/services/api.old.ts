import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "@/src/constants/api.url"
import type { RootState } from "@/src/store/storeOld"

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  credentials: 'include', // ✅ Отправляем cookies для сессии (NestJS session-based auth)
  prepareHeaders: (headers: Headers, {getState}: { getState: () => unknown }) => {
      const state = getState() as RootState
      const tokenFromState = state.user.token
      const tokenFromLocalStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
      const token = tokenFromState || tokenFromLocalStorage
                                                

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
  refetchOnMountOrArgChange: 60, 
  keepUnusedDataFor: 600,
  tagTypes: ['User', 'Post', 'Board', 'Thread', 'Reply', 'Media', 'Category', 'Tag'], 
  
  endpoints: () => ({}),
})
