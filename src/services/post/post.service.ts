import { Post } from "@/src/types/types";
import { api } from "@/src/services/api";

export const postApi = api.injectEndpoints({
    endpoints: (builder)=> ({
        createPost: builder.mutation<Post, FormData>({
            query: (postData) => ({
                url: '/posts',
                method: 'POST',
                body: postData
            })
        }),

        getAllPosts: builder.query<Post[], void>({
            query: ()=> ({
                url: '/posts',
                method: 'GET'
            })
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
            })
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