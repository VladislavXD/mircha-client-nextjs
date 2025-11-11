import { createSlice, type PayloadAction, type ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { User } from "@/src/types/types";
import { userApi } from "@/src/services/user/user.service";
import type { RootState } from "@/src/store/store";
import { socketService } from "@/app/utils/socketService";

interface InitialState {
		user: User | null;
		isAuthenticated: boolean;
		users: User[] | null;
		current: User | null;
		token?: string 
}

const getInitialToken = () => {
		try {
				return typeof localStorage !== 'undefined' ? localStorage.getItem('token') || undefined : undefined
		} catch (error) {
				console.error('Error accessing localStorage:', error)
				return undefined
		}
}

const initialState: InitialState = {
		user: null,
		isAuthenticated: false,
		users: null,
		current: null,
		token: getInitialToken()
}

const slice = createSlice({
		name: 'user',
		initialState,
		reducers: {
				logout: (state: InitialState) => {
						try {
								if (typeof localStorage !== 'undefined') localStorage.removeItem('token')
								socketService.disconnect()
								// Удаляем cookie через js-cookie в компоненте
								if (typeof window !== 'undefined') {
									// Удаляем cookie
									document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
								}
						} catch (error) {
								console.error('Error during logout:', error)
						}
						return {
								user: null,
								isAuthenticated: false,
								users: null,
								current: null,
								token: undefined
						}
				},
				resetUser: (state: InitialState) => {
						state.user = null
				},
				setUser: (state: InitialState, action: PayloadAction<User>) => {
						state.current = action.payload
						state.isAuthenticated = true
				},
				setToken: (state: InitialState, action: PayloadAction<string | undefined>) => {
						state.token = action.payload
						// Если токен есть, считаем что пользователь авторизован (пока не подтвердится обратное)
						if (action.payload) {
								state.isAuthenticated = true
						}
				}
		},
		extraReducers: (builder: ActionReducerMapBuilder<InitialState>) => {
				builder
						.addMatcher(userApi.endpoints.login.matchFulfilled, (state: InitialState, action: PayloadAction<{ token: string }>) => {
								state.token = action.payload.token
								state.isAuthenticated = true
								try {
										if (typeof localStorage !== 'undefined') localStorage.setItem('token', action.payload.token)
										// Сохраняем в cookie для middleware
										if (typeof window !== 'undefined') {
											// Устанавливаем cookie на 7 дней
											const expires = new Date()
											expires.setDate(expires.getDate() + 7)
											document.cookie = `token=${action.payload.token}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`
										}
								} catch (error) {
										console.error('Error saving token:', error)
								}
						})
						.addMatcher(userApi.endpoints.current.matchFulfilled, (state: InitialState, action: PayloadAction<User>) => {
								state.isAuthenticated = true
								state.current = action.payload
						})
						.addMatcher(userApi.endpoints.current.matchRejected, (state: InitialState) => {
								// Если запрос профиля упал - токен невалиден, разлогиниваем
								state.isAuthenticated = false
								state.current = null
								state.token = undefined
								try {
									if (typeof localStorage !== 'undefined') localStorage.removeItem('token')
									if (typeof window !== 'undefined') {
										document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
									}
								} catch (error) {
									console.error('Error clearing invalid token:', error)
								}
						})
						.addMatcher(userApi.endpoints.getUserById.matchFulfilled, (state: InitialState, action: PayloadAction<User>) => {
								state.user = action.payload
						})
						
		}
})

export const {logout, resetUser, setUser, setToken} = slice.actions;
export default slice.reducer

export const  selectIsAuthenticated = (state: RootState) => 
		state.user.isAuthenticated

export const selectCurrent = (state: RootState) => state.user.current

export const selectUser = (state: RootState) => state.user.user