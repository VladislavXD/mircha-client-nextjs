import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistStore
} from 'redux-persist'
import { userSlice } from './user/user.slice'
import onlineStatusReducer from './onlineStatus/onlineStatus.slice'

// import { filtersSlice } from './filters/filters.slice'


//сохранять в store пользователя из поиска по которому кликнул
//сохранять статус nsfw пользователя для треда
//online status for user - DONE (Redux slice)
// а так же сохранять еще что то


const isClient = typeof window !== 'undefined'

const combinedReducers = combineReducers({
	user: userSlice.reducer,
	onlineStatus: onlineStatusReducer,
	// filters: filtersSlice.reducer
})

let mainReducer = combinedReducers

if (isClient) {
	const { persistReducer } = require('redux-persist')
	const storage = require('redux-persist/lib/storage').default

	const persistConfig = {
		key: 'mirchanRoot',
		storage,
		whitelist: ['user'] // onlineStatus НЕ сохраняем - он должен обновляться при каждом входе
	}

	mainReducer = persistReducer(persistConfig, combinedReducers)
}

export const store = configureStore({
	reducer: mainReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
})

export const persistor = persistStore(store)

export type TypeRootState = ReturnType<typeof mainReducer>
export type RootState = TypeRootState // Алиас для совместимости
export type AppDispatch = typeof store.dispatch
