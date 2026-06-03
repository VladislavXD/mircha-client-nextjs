import type { Post } from "../../types";

import React from "react";
import { Heart, Eye, Send, MessageCircle } from "lucide-react";

import { getEditedText } from "../../utils/editedText.utils";
import { RepostButton } from "../PostCardActions/RepostButton";

import MetaInfo from "@/shared/components/ui/MetaInfo";

type Props = {
  post: Post;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  likeByUser: boolean;
  repostCount: number;
  repostedByUser: boolean;

  isLikeLoading: boolean;
  isUnlikeLoading: boolean;
  handleLike: () => void;
  onCommentsOpen: () => void;
  onShareOpen: () => void;
  cardFor?: "comment" | "post" | "current-post" | "repost";
  onActionsClick?: () => void;
};

export const PostCardActions = ({
  post,
  likesCount,
  commentsCount,
  viewsCount,
  likeByUser,
  repostCount,
  repostedByUser,
  isLikeLoading,
  isUnlikeLoading,
  handleLike,
  onCommentsOpen,
  onShareOpen,
  cardFor,
  onActionsClick,
}: Props) => {
  if (cardFor === "comment" || cardFor === "repost") {
    return null;
  }

  return (
    <div
      className="flex items-center justify-between mt-1"
      onClick={onActionsClick}
    >
      <div className="flex items-center -ml-1.5 gap-2">
        <div
          className={`cursor-pointer transition-opacity `}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <MetaInfo
            {...(likeByUser ? { fill: "#d91002", color: "#d91002" } : {})}
            Icon={Heart}
            count={likesCount}
            type="heart"
          />
        </div>
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onCommentsOpen();
          }}
        >
          <MetaInfo Icon={MessageCircle} count={commentsCount} />
        </div>
        <RepostButton
          author={post.author}
          post={post}
          postId={post.id}
          repostCount={repostCount}
          repostedByUser={repostedByUser}
        />

        <div
          className=" flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            onShareOpen();
          }}
        >
          <MetaInfo Icon={Send} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Просмотры */}
        {getEditedText({
          isEdited: post.isEdited,
          updatedAt: post.updatedAt,
        }) && (
          <p className="text-[9px] text-default-500">
            {getEditedText({
              isEdited: post.isEdited,
              updatedAt: post.updatedAt,
            })}
          </p>
        )}
        {cardFor === "current-post" && (
          <div className="text-xs text-default-400 flex items-center gap-1">
            <Eye size={13} />
            {viewsCount > 1000
              ? `${(viewsCount / 1000).toFixed(1)}k`
              : viewsCount}
          </div>
        )}
      </div>
    </div>
  );
};
