import { Comment } from "@/src/types/types";
import { api } from "@/src/services/api";

export const CommentApi = api.injectEndpoints({
  endpoints: builder => ({
    createComment: builder.mutation<Comment, Partial<Comment>>({
      query: newComment => ({
        url: "/comments",
        method: "POST",
        body: newComment,
      }),
    }),

    deleteComment: builder.mutation<void, String>({
      query: commentId => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useCreateCommentMutation, useDeleteCommentMutation } = CommentApi

export const {
  endpoints: { createComment, deleteComment },
} = CommentApi
