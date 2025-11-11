import { api } from "@/src/services/api";
import { Follows, User } from "@/src/types/types";

export const followApi = api.injectEndpoints({
  endpoints: builder => ({
    followUser: builder.mutation<void, { followingId: string }>({
      query: body => ({
        url: "/follow",
        method: "POST",
        body,
      }),
     
      async onQueryStarted({ followingId }, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any
        const currentUser = state.user?.current || state.api?.queries?.['current(undefined)']?.data

        if (!currentUser) {
          console.warn('Текущий пользователь не найден')
          return
        }

        const patches: any[] = []
        
        try { 
          // 1. Обновляем профиль пользователя на которого подписываемся
          const userByIdPatch = dispatch(
            (api.util.updateQueryData as any)('getUserById', followingId, (draft: User) => {
              if (draft) {
                draft.isFollow = true
                
                // ✅ Добавляем только ID без вложенных объектов
                if (draft.followers) {
                  draft.followers.push({
                    id: `temp-${Date.now()}`, 
                    followerId: currentUser.id,
                    followingId: followingId,
                  } as Follows) // ← Добавляем as Follows
                }
              }
            })
          )
          patches.push(userByIdPatch)

          // 2. Обновляем текущего пользователя
          const currentUserPatch = dispatch(
            (api.util.updateQueryData as any)(
              'current',
              undefined,
              (draft: User) => {
                if (draft && draft.following) {
                  draft.following.push({
                    id: `temp-${Date.now()}`,
                    followerId: currentUser.id,
                    followingId: followingId,
                  } as Follows) // ← Добавляем as Follows
                }
              }
            )
          )
          patches.push(currentUserPatch)

          // 3. Обновляем посты
          const allPostsPatch = dispatch(
            (api.util.updateQueryData as any)(
              'getAllPosts',
              undefined,
              (draft: any[]) => {
                draft.forEach((post: any) => { // ← Типизируем post
                  if (post.authorId === followingId) {
                    post.author.isFollow = true
                  }
                })
              }
            )
          )
          patches.push(allPostsPatch)
          
          await queryFulfilled
          console.log(`✅ Подписка на ${followingId} успешна`)

        } catch (error) {
          console.error(`❌ Ошибка подписки, откатываем:`, error)
          patches.forEach((patch: any) => patch.undo()) // ← Типизируем patch
        }
      }
    }),

    unFollowUser: builder.mutation<void, string>({
      query: userId => ({
        url: `/follow/${userId}`,
        method: "DELETE",
      }),

      async onQueryStarted(followingId, { dispatch, queryFulfilled, getState }) {
        const state = getState() as any
        const currentUser = state.user?.current || state.api?.queries?.['current(undefined)']?.data

        if (!currentUser) {
          console.warn('Текущий пользователь не найден')
          return
        }

        const patches: any[] = []

        try {
          // 1. Обновляем профиль пользователя
          const userByIdPatch = dispatch(
            (api.util.updateQueryData as any)(
              'getUserById',
              followingId,
              (draft: User) => {
                if (draft) {
                  draft.isFollow = false

                  if (draft.followers) {
                    draft.followers = draft.followers.filter(
                      (f: Follows) => f.followerId !== currentUser.id
                    )
                  }
                }
              }
            )
          )
          patches.push(userByIdPatch)

          // 2. Обновляем текущего пользователя
          const currentUserPatch = dispatch(
            (api.util.updateQueryData as any)(
              'current',
              undefined,
              (draft: User) => {
                if (draft && draft.following) {
                  draft.following = draft.following.filter(
                    (f: Follows) => f.followingId !== followingId
                  )
                }
              }
            )
          )
          patches.push(currentUserPatch)

          // 3. Обновляем посты
          const allPostsPatch = dispatch(
            (api.util.updateQueryData as any)(
              'getAllPosts',
              undefined,
              (draft: any[]) => {
                draft.forEach((post: any) => { // ← Типизируем post
                  if (post.authorId === followingId) {
                    post.author.isFollow = false
                  }
                })
              }
            )
          )
          patches.push(allPostsPatch)

          await queryFulfilled
          console.log(`✅ Отписка от ${followingId} успешна`)

        } catch (error) {
          console.error(`❌ Ошибка отписки, откатываем:`, error)
          patches.forEach((patch: any) => patch.undo()) // ← Типизируем patch
        }
      }
    }),
  }),
})

export const { useFollowUserMutation, useUnFollowUserMutation } = followApi

export const {
  endpoints: { followUser, unFollowUser },
} = followApi
