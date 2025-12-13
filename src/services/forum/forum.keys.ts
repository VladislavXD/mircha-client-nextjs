/**
 * Query keys для React Query (форум)
 */
export const forumKeys = {
  all: ['forum'] as const,
  
  latestPosts: (params?: {
    page?: number
    limit?: number
    board?: string
    category?: string
    tag?: string
    nsfw?: string
  }) => [...forumKeys.all, 'latestPosts', params] as const,
  
  stats: () => [...forumKeys.all, 'stats'] as const,
}
