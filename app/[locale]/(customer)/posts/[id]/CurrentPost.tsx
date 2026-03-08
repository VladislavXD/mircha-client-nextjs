"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Select, SelectItem, Spinner } from "@heroui/react";
import { MessageCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import GoBack from "@/shared/components/ui/GoBack";
import PostCard from "@/src/features/post/components/PostCard";
import { usePost } from "@/src/features/post";
import {
  CommentForm,
  CommentItem,
} from "@/src/features/post/components/comments";
import {
  useCreateComment,
  useCreateReply,
  useDeleteComment,
} from "@/src/features/post/comment/hooks/useComment";
import { usePostComments, CommentData } from "@/src/features/post/comment/hooks/usePostComments";
import { useLikeComment, useUnlikeComment } from "@/src/features/post/like/hooks";

type SortKey = "newest" | "oldest" | "mostLiked";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Новые" },
  { key: "oldest", label: "Старые" },
  { key: "mostLiked", label: "Популярные" },
];

function sortComments(comments: CommentData[], sortKey: SortKey): CommentData[] {
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
  const { data: post, isLoading } = usePost(postId);
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
    currentUser?.id
  );

  if (isLoading) return <Spinner className="flex justify-center h-full" />;
  if (!post) return <div className="text-center">Пост не найден</div>;

  const rawComments = (commentsData || []).filter((c) => !!c.user);
  const comments = sortComments(rawComments, sortKey);

  const handleCommentLike = (commentId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeComment(commentId);
    } else {
      likeComment(commentId);
    }
  };

  return (
    <div className="flex flex-col">
      <GoBack />

      <PostCard post={post} cardFor="current-post" />

      <div className="bg-transparent border-e border-divider">
        <CommentForm
          onSubmit={(content) => createComment({ postId, content })}
          currentUser={currentUser}
        />
      </div>

      <div className="px-3 py-3 flex items-center justify-between gap-2 font-semibold border-b border-divider w-full">
        <div className="flex items-center gap-1 text-default-600">
          <MessageCircle size={18} />
          <span>Комментарии</span>
          <span className="text-sm text-default-400">
            ({comments.length || post.commentsCount || 0})
          </span>
        </div>

        <Select
          className="max-w-[160px]"
          placeholder="Сортировать по"
          defaultSelectedKeys={["newest"]}
          disallowEmptySelection
          isRequired
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as SortKey;
            if (selected) setSortKey(selected);
          }}
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>
      </div>

      {isLoadingComments ? (
        <div className="flex justify-center py-12 text-default-500">
          Загрузка комментариев...
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <MessageCircle size={48} className="text-default-300 mb-4" />
          <p className="text-default-500 font-medium">Пока нет комментариев</p>
          <p className="text-default-400 text-sm mt-1">
            Станьте первым, кто оставит комментарий!
          </p>
        </div>
      ) : (
        <div className="space-y-1 px-3 py-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              {...comment}
              user={comment.user}
              onReply={(commentId, content) =>
                createReply({ postId, content, replyToId: commentId })
              }
              onLike={handleCommentLike}
              onDelete={(id) => {
                if (window.confirm("Удалить комментарий?"))
                  deleteComment({ id, postId });
              }}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentPost;
