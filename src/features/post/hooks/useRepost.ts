import { useMutation, useQuery, useQueryClient, UseMutationOptions, InfiniteData } from '@tanstack/react-query'
import { repostService, type Repost, type RepostResponse } from '../services/repost.service'
import { postKeys } from './usePostQueries'
import type { Post, PostsResponse } from '../types'
import toast from 'react-hot-toast'

/**
 * Query keys для репостов
 */
export const repostKeys = {
  all: ['reposts'] as const,
  userReposts: (userId: string) => [...repostKeys.all, 'user', userId] as const,
  postReposters: (postId: string) => [...repostKeys.all, 'post', postId] as const,
  check: (postId: string) => [...repostKeys.all, 'check', postId] as const,
}

type RepostContext = {
  previousPosts?: InfiniteData<PostsResponse, unknown>
}

/**
 * Хук для создания репоста с оптимистичным обновлением.
 * 
 * Optimistic Updates:
 * - Мгновенно обновляет UI (repostedByUser, repostCount)
 * - Откат при ошибке
 * 
 * Usage:
 * ```tsx
 * const { mutate: createRepost } = useCreateRepost()
 * 
 * // Fire-and-forget (НЕ используй async/await!)
 * createRepost({ postId: 'post-id', comment: 'Nice post!' })
 * ```
 */
export function useCreateRepost(
  options?: Omit<UseMutationOptions<Repost, Error, { postId: string; comment?: string }, RepostContext>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation<Repost, Error, { postId: string; comment?: string }, RepostContext>({
    mutationFn: async ({ postId, comment }) => {
      return repostService.createRepost(postId, comment)
    },

    onMutate: async ({ postId }) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: postKeys.lists() })

      // Сохраняем предыдущее состояние
      const previousPosts = queryClient.getQueryData<InfiniteData<PostsResponse, unknown>>(postKeys.lists())

      // Оптимистично обновляем UI
      queryClient.setQueryData<InfiniteData<PostsResponse, unknown>>(postKeys.lists(), (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  repostedByUser: true,
                  repostCount: (post.repostCount || 0) + 1,
                }
              }
              return post
            })
          })),
        }
      })

      return { previousPosts }
    },

    onError: (error, { postId }, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts)
      }

      toast.error('Не удалось создать репост')
      console.error('Create repost error:', error)
    },

    onSuccess: (data, { postId }) => {
      // Инвалидируем связанные queries
      queryClient.invalidateQueries({ queryKey: repostKeys.postReposters(postId) })
      queryClient.invalidateQueries({ queryKey: repostKeys.check(postId) })

      toast.success('Репост создан!')
    },

    ...options,
  })
}

/**
 * Хук для удаления репоста с оптимистичным обновлением.
 * 
 * Optimistic Updates:
 * - Мгновенно убирает репост из UI
 * - Обновляет счетчик репостов
 * - Откат при ошибке
 * 
 * Usage:
 * ```tsx
 * const { mutate: deleteRepost } = useDeleteRepost()
 * 
 * // Fire-and-forget (НЕ используй async/await!)
 * deleteRepost('post-id')
 * ```
 */
export function useDeleteRepost(
  options?: Omit<UseMutationOptions<{ message: string }, Error, string, RepostContext>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string, RepostContext>({
    mutationFn: (postId: string) => repostService.deleteRepost(postId),

    onMutate: async (postId) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: postKeys.lists() })

      // Сохраняем предыдущее состояние
      const previousPosts = queryClient.getQueryData<InfiniteData<PostsResponse, unknown>>(postKeys.lists())

      // Оптимистично обновляем UI
      queryClient.setQueryData<InfiniteData<PostsResponse, unknown>>(postKeys.lists(), (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  repostedByUser: false,
                  repostCount: Math.max(0, (post.repostCount || 0) - 1),
                }
              }
              return post
            })
          })),
        }
      })

      return { previousPosts }
    },

    onError: (error, postId, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts)
      }

      toast.error('Не удалось удалить репост')
      console.error('Delete repost error:', error)
    },

    onSuccess: (data, postId) => {
      // Инвалидируем связанные queries
      queryClient.invalidateQueries({ queryKey: repostKeys.postReposters(postId) })
      queryClient.invalidateQueries({ queryKey: repostKeys.check(postId) })

      toast.success('Репост удалён')
    },

    ...options,
  })
}

/**
 * Хук для получения репостов пользователя.
 * 
 * @param userId - ID пользователя
 * @param limit - Лимит результатов
 * @param cursor - Курсор для пагинации
 * @returns Репосты пользователя с пагинацией
 */
export function useUserReposts(userId: string, limit = 20, cursor?: string) {
  return useQuery<RepostResponse, Error>({
    queryKey: [...repostKeys.userReposts(userId), { limit, cursor }],
    queryFn: () => repostService.getUserReposts(userId, limit, cursor),
    enabled: !!userId,
  })
}

/**
 * Хук для получения пользователей, которые репостили пост.
 * 
 * @param postId - ID поста
 * @param limit - Лимит результатов
 * @returns Массив пользователей с информацией о репосте
 */
export function usePostReposters(postId: string, limit = 20) {
  return useQuery({
    queryKey: [...repostKeys.postReposters(postId), { limit }],
    queryFn: () => repostService.getPostReposters(postId, limit),
    enabled: !!postId,
  })
}

/**
 * Хук для проверки, репостил ли текущий пользователь пост.
 * 
 * @param postId - ID поста
 * @returns Объект с флагом hasReposted
 */
export function useCheckRepost(postId: string) {
  return useQuery<{ hasReposted: boolean }, Error>({
    queryKey: repostKeys.check(postId),
    queryFn: () => repostService.checkRepost(postId),
    enabled: !!postId,
  })
}
