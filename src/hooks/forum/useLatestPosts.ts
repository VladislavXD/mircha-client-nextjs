// import { useQuery } from '@tanstack/react-query'
// import { getLatestPosts } from '@/src/services/forum/forum.api'
// import { forumKeys } from '@/src/services/forum/forum.keys'
// import type { LatestPostsQuery } from '@/src/types/forum.types'

// /**
//  * React Query хук для получения последних постов форума
//  * 
//  * @example
//  * const { data, isLoading } = useLatestPosts({ page: 1, limit: 8, nsfw: '0' })
//  */
// export function useLatestPosts(params: LatestPostsQuery = {}) {
//   return useQuery({
//     queryKey: forumKeys.latestPosts(params),
//     queryFn: () => getLatestPosts(params),
//     staleTime: 2 * 60 * 1000, // 2 минуты
//   })
// }
