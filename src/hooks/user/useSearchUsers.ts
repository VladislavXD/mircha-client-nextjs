/**
 * ═══════════════════════════════════════════════════════════════
 *  useSearchUsers - React Query Hook
 * ═══════════════════════════════════════════════════════════════
 */

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { searchUsers } from '@/src/services/user/user.api'
// import { userKeys } from '@/src/services/user/user.keys'

// export function useSearchUsers(query: string) {
//   return useQuery({
//     queryKey: userKeys.search(query),
//     queryFn: () => searchUsers(query),
//     enabled: query.length >= 2, // Запускать только если введено минимум 2 символа
//     staleTime: 30 * 1000, // Кеш на 30 секунд
//   })
// }
