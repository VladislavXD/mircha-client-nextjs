// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { getStoreLocal } from '@/src/utils/localStorage'
// import { IInitialState, IUserState } from '@/src/types/user.interface'


// const initialState: IInitialState = {
// 	user: getStoreLocal('user'),
// 	isAuthenticated: false,
	
// }

// export const userSlice = createSlice({
// 	name: 'user',
	
// 	initialState,
// 	reducers: {
// 		setToken: (state, action: PayloadAction<{ token: string; user: IUserState }>) => {
// 			state.user = action.payload.user
// 			state.isAuthenticated = true
// 		},
// 		logout: (state) => {
// 			state.user = null
// 			state.isAuthenticated = false
// 		}
// 	},
	
// 	})
// export const { setToken, logout: logoutAction } = userSlice.actions
// export default userSlice.reducer
