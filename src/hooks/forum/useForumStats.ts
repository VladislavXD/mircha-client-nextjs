// import { useQuery } from '@tanstack/react-query'

// import { forumKeys } from '@/src/services/forum/forum.keys'

// /**
//  * React Query хук для получения статистики форума
//  * 
//  * @example
//  * const { data, isLoading } = useForumStats()
//  */
// export function useForumStats() {
//   return useQuery({
//     queryKey: forumKeys.stats(),
//     queryFn: getForumStats,
//     staleTime: 5 * 60 * 1000, // 5 минут - статистика меняется не часто
//   })
// }
