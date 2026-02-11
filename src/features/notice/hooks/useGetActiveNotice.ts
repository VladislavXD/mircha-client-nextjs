import { useQuery } from '@tanstack/react-query'
import { noticeService } from '../services'

export function useGetActiveNotices() {
	const { data: notices, isLoading, refetch } = useQuery({
		queryKey: ['notices', 'active'],
		queryFn: () => noticeService.getActive(),
		retry: false,
		staleTime: 30 * 1000,
	})

	return { notices, isLoading, refetch }
}