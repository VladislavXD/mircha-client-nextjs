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
    useLazyGetPostByIdQuery
} = postApi

export const {
    endpoints: {getAllPosts, getPostById,createPost, deletePost, getViews}
} = postApi