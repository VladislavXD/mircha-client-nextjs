import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { api } from "@/src/services/api"
import user from '@/src/store/user/user.slice'
import { listenerMiddleware } from "@/app/middleware/auth"
import { chatApi } from "../services/caht.service"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    user,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
    .concat(api.middleware)
    .concat(chatApi.middleware)
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
