import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateNoticeDto } from "../types";
import { noticeService } from "../services";
import { addToast } from "@heroui/react";



export function useCreateNotice(){
	const queryClient = useQueryClient()
	const {mutate: createNotice, isPending} = useMutation({
		mutationKey: ['create notice'],
		mutationFn: (body: CreateNoticeDto) => noticeService.createNotice(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notices','active'] })
			addToast({
				title: 'Уведомление успешно создано',
				color: 'success'
			})
		},
		onError: (error) => {
			addToast({
				title: 'Ошибка при создании уведомления',
				description: (error as Error).message,
				color: 'danger'
			})
		}
	}) 

	return {createNotice, isPending}
}