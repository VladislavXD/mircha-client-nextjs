export type CreateNoticeDto = {
	content: string
	type?: 'default' | 'info' | 'warning' | 'error'
	expiredAt?: string // ISO date string
	active?: boolean
	title?: string
	emojiUrl?: string
	durationDays?: number
}