import { User } from "@/src/types/types";
import { createSlice } from "@reduxjs/toolkit";


interface InitialState {
		user: User | null;
		isAuthenticated: boolean;
		users: User[] | null;
		current: User | null;
		token?: string 
}

const initialState: InitialState = {
	user: null,
	isAuthenticated: false,
	users: null,
	current: null
}

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers:{},
	extraReducers: ()
})