import { User } from "@/src/types/types"

export interface IUserState {
	email: string
	role?: 'ADMIN' | 'MODERATOR' | 'USER'
}

export interface ITokens {
  // accessToken: string;
  // refreshToken: string;
  token: string;
}

export interface IAuthUser {
	name?: string
	email: string
	password: string
	recaptchaToken?: string
}


export interface IInitialState {
	user: IUserState | null
	isAuthenticated?: boolean
}


export interface IAuthResponse extends ITokens {
	user: User
}
