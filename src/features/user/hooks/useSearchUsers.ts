import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user.service'

/**
 * Хук для поиска пользователей
 * 
 * Поддерживает:
 * - @упоминания (поиск начинается с @)
 * - Поиск по имени и email (case-insensitive)
 * - Нормализация Unicode диакритических знаков (ё→е, é→e)
 * - Ранжирование результатов для @-запросов
 * 
 * @param query - Поисковый запрос (может начинаться с @)
 * @param options - Опции React Query
 * 
 * @example
 * // Поиск с @упоминанием
 * const { data: users } = useSearchUsers('@john')
 * 
 * @example
 * // Обычный поиск
 * const { data: users } = useSearchUsers('иван')
 * 
 * @example
 * // С debounce через enabled
 * const [searchQuery, setSearchQuery] = useState('')
 * const debouncedQuery = useDebounce(searchQuery, 300)
 * const { data: users } = useSearchUsers(debouncedQuery, {
 *   enabled: debouncedQuery.length >= 2
 * })
 */
export function useSearchUsers(
  query: string,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
  }
) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => userService.searchUser(query),
    enabled: options?.enabled ?? (query.trim().length >= 2 || (query.startsWith('@') && query.length >= 2)),
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 минут кеш
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 минут в памяти
  })
}
