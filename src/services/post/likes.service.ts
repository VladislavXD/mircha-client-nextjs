import { Like, Post } from '@/src/types/types'
import { api } from '@/src/services/api'
import { postApi } from './post.service'

export const likesApi = api.injectEndpoints({
  endpoints: builder => ({
    LikePost: builder.mutation<Like, {postId: string}>({
      query: body => ({
        url: "/likes",
        method: "POST",
        body
      }),
      
      // Оптимистичное обновление - МГНОВЕННОЕ
      onQueryStarted({ postId }, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any
        const currentUserId = state.user?.current?.id
        
        // Создаём временный лайк
        const optimisticLike = {
          id: `temp-${Date.now()}`,
          userId: currentUserId,
          postId: postId,
          createdAt: new Date().toISOString(),
        }

        // СИНХРОННЫЙ патч кэша getAllPosts (мгновенный!)
        const patchAllPosts = dispatch(
          postApi.util.updateQueryData('getAllPosts', undefined, (draft: Post[]) => {
            const post = draft.find(p => p.id === postId)
            if (post) {
              post.likeByUser = true
              post.likes = [...post.likes, optimisticLike as any]
            }
          })
        )

        // СИНХРОННЫЙ патч кэша getPostById (мгновенный!)
        const patchPostById = dispatch(
          postApi.util.updateQueryData('getPostById', postId, (draft: Post) => {
            draft.likeByUser = true
            draft.likes = [...draft.likes, optimisticLike as any]
          })
        )

        // АСИНХРОННАЯ часть - ждём ответ сервера для отката при ошибке
        queryFulfilled.catch(() => {
          patchAllPosts.undo()
          patchPostById.undo()
        })
      },
    }),

    unLikePost: builder.mutation<void, string>({
      query: postId => ({
        url: `/likes/${postId}`,
        method: "DELETE",
      }),
      
      // Оптимистичное обновление - МГНОВЕННОЕ
      onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any
        const currentUserId = state.user?.current?.id

        // СИНХРОННЫЙ патч кэша getAllPosts (мгновенный!)
        const patchAllPosts = dispatch(
          postApi.util.updateQueryData('getAllPosts', undefined, (draft: Post[]) => {
            const post = draft.find(p => p.id === postId)
            if (post) {
              post.likeByUser = false
              post.likes = post.likes.filter(like => like.userId !== currentUserId)
            }
          })
        )

        // СИНХРОННЫЙ патч кэша getPostById (мгновенный!)
        const patchPostById = dispatch(
          postApi.util.updateQueryData('getPostById', postId, (draft: Post) => {
            draft.likeByUser = false
            draft.likes = draft.likes.filter(like => like.userId !== currentUserId)
          })
        )

        // АСИНХРОННАЯ часть - ждём ответ сервера для отката при ошибке
        queryFulfilled.catch(() => {
          patchAllPosts.undo()
          patchPostById.undo()
        })
      },
    }),
  }),
})

export const { useLikePostMutation, useUnLikePostMutation } = likesApi

export const {
  endpoints: { LikePost, unLikePost },
} = likesApi
