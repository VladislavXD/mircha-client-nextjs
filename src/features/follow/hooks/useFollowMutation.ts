// client-next/src/features/follow/hooks/useFollowMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { followService } from '../services/follow.service'
import { addToast } from '@heroui/react'


export function useFollowMutation() {
  const queryClient = useQueryClient()


  return useMutation({
    mutationFn: (followingId: string) => followService.followUser(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['followers'] })
      queryClient.invalidateQueries({ queryKey: ['following'] })
    },
    onError: (error: any) => {
      addToast({ 
        title: error?.message || 'Ошибка при подписке', 
        color: 'danger' 
      })
    }
  })
}