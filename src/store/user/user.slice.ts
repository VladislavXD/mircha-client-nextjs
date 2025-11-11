import { createSlice, type PayloadAction, type ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { User } from "@/src/types/types";
import { userApi } from "@/src/services/user/user.service";
import type { RootState } from "@/src/store/store";

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
				}
		},
		extraReducers: (builder: ActionReducerMapBuilder<InitialState>) => {
				builder
						.addMatcher(userApi.endpoints.login.matchFulfilled, (state: InitialState, action: PayloadAction<{ token: string }>) => {
								state.token = action.payload.token
								state.isAuthenticated = true
								try {
										if (typeof localStorage !== 'undefined') localStorage.setItem('token', action.payload.token)
								} catch (error) {
										console.error('Error saving token:', error)
								}
						})
						.addMatcher(userApi.endpoints.current.matchFulfilled, (state: InitialState, action: PayloadAction<User>) => {
								state.isAuthenticated = true
								state.current = action.payload
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