import { Post } from "@/src/types/types";
import { api } from "@/src/services/api";

export const postApi = api.injectEndpoints({
    endpoints: (builder)=> ({
        createPost: builder.mutation<Post, FormData>({
            query: (postData) => ({
                url: '/posts',
                method: 'POST',
                body: postData
            }),

            async onQueryStarted(formData, { dispatch, queryFulfilled, getState }) {
                const state = getState() as any
                const currentUser = state.user?.current || state.api?.queries?.['current(undefined)']?.data

                if(!currentUser) return

                const tempPost: Post = {
                    id: `temp-${Date.now()}`,
                    content: formData.get('content') as string,
                    authorId: currentUser.id,
                    imageUrl: formData.get('image') ? URL.createObjectURL(formData.get('image') as Blob) : undefined,
                    likeByUser: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    views: [],
                    author: {
                        id: currentUser.id,
                        post: [],
                        likes: [],
                        comments: [],
                        followers: [],
                        following: [],
                        name: currentUser.name,
                        email: currentUser.email,
                        avatarUrl: currentUser.avatarUrl,
                        bio: currentUser.bio,
                        createdAt: currentUser.createdAt,
                        updatedAt: currentUser.updatedAt,
                    },
                    likes: [],
                    comments: [],
                    
                }

                const patchresult = dispatch(
                    postApi.util.updateQueryData('getAllPosts', undefined,(draft)=> {
                        draft.unshift(tempPost)
                    })
                )
                try{
                    const {data: newPOst} = await queryFulfilled

                    // Заменяем временный пост на пост с сервера
                    dispatch(
                        postApi.util.updateQueryData('getAllPosts', undefined, (draft)=> {
                            const index = draft.findIndex(p => p.id === tempPost.id)
                            if(index !== -1) {
                                draft[index] = newPOst
                            }
                        })
                    )
                }catch{
                    patchresult.undo()
                }
            }
        }),

        getAllPosts: builder.query<Post[], void>({
            query: ()=> ({
                url: '/posts',
                method: 'GET'
            }),

        }),

        getPostById: builder.query<Post, string>({
            query: (id)=> ({
                url: `/posts/${id}`,
                method: 'GET'
            })
        }),
        getViews: builder.query<Post, string>({
            query: (id)=> ({
                url: `/posts/${id}/views`,
                method: 'POST'
            })
        }),

        addView: builder.mutation<
            { message: string; viewsCount: number },
            { postId: string }
        >({
            query: (data) => ({
                url: "/posts/view",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Post'],
        }),

        addViewsBatch: builder.mutation<
            { message: string; processedCount: number; postIds: string[] },
            { postIds: string[] }
        >({
            query: (data) => ({
                url: "/posts/views/batch",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Post'],
        }),

        updatePost: builder.mutation<Post, { id: string; content: string; emojiUrls?: string[] }>({
            query: ({ id, ...patch }) => ({
                url: `/posts/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Post']
        }),

        deletePost: builder.mutation<void, string>({
            query: (id)=> ({
                url: `/posts/${id}`,
                method: 'DELETE'
            }),

         onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
                
                let deletedPost: Post | undefined

                const patchResult = dispatch(
                    postApi.util.updateQueryData('getAllPosts', undefined, (draft) => {
                        const index = draft.findIndex(post => post.id === id)
                        if (index !== -1) {
                            // Сохраняем пост перед удалением
                            deletedPost = draft[index]
                            // Удаляем из массива
                            draft.splice(index, 1)
                        }
                    })
                )
                const singlePostPatch = dispatch(
                    postApi.util.updateQueryData('getPostById', id, () => {
                        return undefined as any // Помечаем как удалённый
                    })
                )
                try {

                    await queryFulfilled
                    console.log(`✅ Пост ${id} успешно удалён на сервере`)
                } catch (error) {
                    // 5. При ошибке откатываем изменения
                    console.error(`❌ Ошибка удаления поста ${id}, откатываем:`, error)
                    
                    patchResult.undo()
                    singlePostPatch.undo()

                    // Опционально: показываем уведомление об ошибке
                    // toast.error('Не удалось удалить пост')
                }
           }
                
           
        })
    })
})

export const {
    useCreatePostMutation,
    useGetViewsQuery,
    useLazyGetViewsQuery,
    useGetAllPostsQuery,
    useDeletePostMutation,
    useGetPostByIdQuery,
    useLazyGetAllPostsQuery,
    useLazyGetPostByIdQuery,
    useAddViewMutation,
    useAddViewsBatchMutation,
    useUpdatePostMutation,
} = postApi

export const {
    endpoints: {getAllPosts, getPostById,createPost, deletePost, getViews, addView, addViewsBatch, updatePost}
} = postApi