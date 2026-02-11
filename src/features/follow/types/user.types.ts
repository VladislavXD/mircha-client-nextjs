import { Follows } from "@/src/types/types";
import { IUser } from "../../user/types";

export interface FollowResponse {
	message: string;
	isFollowing: boolean;
}

// Бэкенд может возвращать как полную структуру Follows, так и просто IUser
export type FollowerItem = Follows | IUser;
export type FollowingItem = Follows | IUser;

// Type guards для проверки формата данных
export function isFollowsStructure(item: FollowerItem | FollowingItem): item is Follows {
	return 'follower' in item && 'following' in item;
}

export function isUserStructure(item: FollowerItem | FollowingItem): item is IUser {
	return 'email' in item && !('follower' in item);
}

export interface FollowersResponse{
	followers: FollowerItem[]
	total: number
	page: number
	totalPages: number
}

export interface FollowingResponse{
	following: FollowingItem[]
	total: number
	page: number
	totalPages: number
}