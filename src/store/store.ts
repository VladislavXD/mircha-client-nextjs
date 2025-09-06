import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { api } from "@/src/services/api"
import { adminApi } from "@/src/services/admin.service"
import user from '@/src/store/user/user.slice'
import { listenerMiddleware } from "@/app/middleware/auth"
import { chatApi } from "../services/caht.service"
import { newsApi } from "../services/news.service"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    user,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
    .concat(api.middleware)
    .concat(adminApi.middleware)
    .concat(chatApi.middleware)
    .concat(newsApi.middleware)
    .prepend(listenerMiddleware.middleware)
  },
})
// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
