import { useQuery } from "@tanstack/react-query";
import { noticeService } from "../services";


export function useGetAllNotices() {
	const { data: notices = [], isPending, error, refetch } = useQuery({
			queryKey: ['notices', 'admin'],
			queryFn: () => noticeService.getAllAdmin(),
			retry: false,
		});

		return { notices, isPending, error, refetch }
}