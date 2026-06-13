"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import GoBack from "@/shared/components/ui/GoBack";
import PostCard from "@/src/features/post/components/PostCard";
import { usePost } from "@/src/features/post";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CommentForm,
  CommentItem,
} from "@/src/features/post/components/comments";
import {
  useCreateComment,
  useCreateReply,
  useDeleteComment,
} from "@/src/features/post/comment/hooks/useComment";
import {
  usePostComments,
  CommentData,
} from "@/src/features/post/comment/hooks/usePostComments";
import {
  useLikeComment,
  useUnlikeComment,
} from "@/src/features/post/like/hooks";
import { CommentsSkeleton, PostSkeleton } from "@/src/features/post/components/currentPostSkeleton";

type SortKey = "newest" | "oldest" | "mostLiked";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Новые" },
  { key: "oldest", label: "Старые" },
  { key: "mostLiked", label: "Популярные" },
];

function sortComments(
  comments: CommentData[],
  sortKey: SortKey,
): CommentData[] {
  return [...comments].sort((a, b) => {
    if (sortKey === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortKey === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortKey === "mostLiked") {
      return (b.score ?? b.likeCount ?? 0) - (a.score ?? a.likeCount ?? 0);
    }

    return 0;
  });
}

const CurrentPost = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { data: post, isLoading, isFetching, fetchStatus } = usePost(postId);
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<any>(["profile"]);

  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const { mutate: createComment } = useCreateComment();
  const { mutate: createReply } = useCreateReply();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: likeComment } = useLikeComment(postId);
  const { mutate: unlikeComment } = useUnlikeComment(postId);

  const { data: commentsData, isLoading: isLoadingComments } = usePostComments(
    postId,
    currentUser?.id,
  );



  const comments = useMemo(()=> sortComments((commentsData || []).filter((c)=> !!c.user), sortKey), [commentsData, sortKey]);

  const onLike = useCallback((commentId: string, isLiked: boolean) => {
    if (isLiked) unlikeComment(commentId)
    else likeComment(commentId)
  
  }, [likeComment, unlikeComment]
)


  const onReply = useCallback((commentId: string, content: string) => {
    createReply({ postId, content, replyToId: commentId });
  }, [createReply, postId]);

  const onDelete = useCallback((commentId: string) => {
    
    if (window.confirm("Удалить комментарий?")) {
      deleteComment({ id: commentId, postId });
    }
  }, [deleteComment, postId]);



  return (
    <div className="space-y-4 overflow-hidden  flex flex-col h-[calc(100vh-100px)] sm:h-[calc(100vh-50px)]">
      <GoBack title="Пост" />

      <div className="flex flex-col  mb-10 overflow-hidden  border border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] rounded-[1.5rem] ">

      {/* скролл контента */}
        <div className="flex-1 overflow-x-auto overscroll-contain ">
          {/* ✅ Пост */}
          {isLoading || !post
            ? <PostSkeleton />
            : <PostCard cardFor="current-post" post={post} />
          }
          <div className="px-4 py-3 flex items-center justify-between gap-4 font-semibold border-b border-neutral-200 dark:border-neutral-800/70 bg-neutral-50 dark:bg-[#161616]">
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
              <MessageCircle size={18} strokeWidth={2} />
              <span className="text-[15px]">Комментарии</span>
              <span className="text-sm font-medium text-neutral-400">
                ({comments.length || post?.commentsCount || 0})
              </span>
            </div>

            <Select
              defaultValue="newest"
              onValueChange={(value) => setSortKey(value as SortKey)}
            >
              <SelectTrigger className="w-[160px] h-8 bg-transparent border-neutral-200 dark:border-neutral-800 focus:ring-0 focus:ring-offset-0 focus:bg-neutral-100 dark:focus:bg-[#202020] rounded-full text-xs font-medium cursor-pointer">
                <SelectValue placeholder="Сортировать по" />
              </SelectTrigger>
              <SelectContent className="rounded-[1rem] border-neutral-200 dark:border-neutral-800/70 shadow-lg">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.key}
                    className="cursor-pointer rounded-[0.75rem] text-sm focus:bg-neutral-100 dark:focus:bg-[#202020] focus:text-neutral-900 dark:focus:text-neutral-100"
                    value={option.key}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white dark:bg-[#101010]">
            {isLoadingComments ? (
              <CommentsSkeleton />
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MessageCircle className="text-neutral-300 dark:text-neutral-700 mb-4" size={40} strokeWidth={1} />
                <p className="text-neutral-600 dark:text-neutral-300 font-medium">Пока нет комментариев</p>
                <p className="text-neutral-400 text-sm mt-1">Станьте первым, кто оставит комментарий!</p>
              </div>
            ) : (
              <div className="space-y-1 p-2 sm:p-3">
                {comments.map((comment) => (
                  <CommentItem 
                  key={comment.id} 
                  {...comment} 
                  currentUser={currentUser} 
                  onDelete={onDelete}
                  onLike={onLike}
                  onReply={onReply}
                  /* ... */ />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className=" px-4 py-4 border-b border-neutral-200 dark:border-neutral-800/70 ">
          <CommentForm
            currentUser={currentUser}
            onSubmit={(content) => createComment({ postId, content })}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentPost;
