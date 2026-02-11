import { useMutation, useQueryClient } from "@tanstack/react-query"
import { noticeService } from "../services"
import { addToast } from "@heroui/react"

export function useDeleteNotice() {
	const queryClient = useQueryClient()
	const { mutate: deleteNotice, isPending} = useMutation({
		mutationFn: (noticeId: string) => noticeService.deleteNotice(noticeId),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['notices', 'active']})
			addToast({
				title: 'Уведомление успешно удалено',
				color: 'success'
			})
		},
		onError: (error) => {
			addToast({
				title: 'Ошибка при удалении уведомления',
				description: (error as Error).message,
				color: 'danger'
			})
		}
	})

	return { deleteNotice, isPending }
}
