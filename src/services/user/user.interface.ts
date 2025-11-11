import { User } from "@/src/types/types"

export interface IAuthUser {
	email: string;
	password: string;
	name?: string;
}


export interface ITokens {
  accessToken: string;
  refreshToken: string;
  token: string;
}


export interface IAuthResponse extends ITokens {
	user: User;
}