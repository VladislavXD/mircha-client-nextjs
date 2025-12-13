import { IUser } from '@/src/features/user/types'

export type AppearanceType = 'frame' | 'background' | null

export interface SelectedAppearanceItem {
	id: string
	url: string
	type: 'frame' | 'background'
}

export interface BackgroundPreset {
	id: string
	url: string
	label: string
	type: 'video' | 'image' | 'none'
}

export interface FramePreset {
	id: string
	url: string
	label: string
}

export interface ProfileData extends IUser {
	followersCount?: number
	followingCount?: number
	postsCount?: number
	isFollowing?: boolean
	bio?: string
	_count?: {
		followers?: number
		following?: number
		post?: number
	}
}

export interface ProfileStats {
	followersCount: number
	followingCount: number
	postsCount: number
}
