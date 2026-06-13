import type { Post } from "../../types";

import React from "react";
import { Heart, Eye, Send, MessageCircle, Pencil } from "lucide-react";

import { getEditedText } from "../../utils/editedText.utils";
import { RepostButton } from "../PostCardActions/RepostButton";

import MetaInfo from "@/shared/components/ui/MetaInfo";
import Link from "next/link";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { useDispatch } from "react-redux";
import { openCreatePostModal } from "@/src/store/CreatePostModal/CreatePostModal.slice";
import { useModals } from "@/src/hooks/useModals";
import AuthDialog from "@/shared/components/ui/Modals/IsAuthModal";
import { useRouter } from "next/navigation";
import { openAuthModal } from "@/src/store/authModal/authModal.slice";

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
  isAuthenticated: boolean;
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
  isAuthenticated,
  handleLike,
  onCommentsOpen,
  onShareOpen,
  cardFor,
  onActionsClick,
}: Props) => {
  const { id } = post;
  const dispatch = useDispatch();
  const { isAuthModal } = useModals();
  const router = useRouter();

  const isDesktop = useMediaQuery("(min-width: 768px)");
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
            if (isAuthenticated) handleLike();
            else
              dispatch(
                openAuthModal({
                  title: "Понравился пост?",
                  description: "Войдите, чтобы ставить лайки.",
                  icon: "Heart"
                }),
              );
          }}
        >
          <MetaInfo
            {...(likeByUser ? { fill: "#d91002", color: "#d91002" } : {})}
            Icon={Heart}
            count={likesCount}
            type="heart"
          />
        </div>
        <Link
          href={isDesktop ? `/posts/${id}` : ""}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            !isDesktop && onCommentsOpen();
          }}
        >
          <MetaInfo Icon={MessageCircle} count={commentsCount} />
        </Link>
        <RepostButton
          author={post.author}
          post={post}
          postId={post.id}
          repostCount={repostCount}
          repostedByUser={repostedByUser}
          isAtuhenticated={isAuthenticated}
        />

        <div
          className=" flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            if (isAuthenticated) onShareOpen();
            else dispatch(openAuthModal({
              title: "Войдите, чтобы делиться постами",
              description: "присоединяйтесь, чтобы делиться идеями и общаться.",
              icon: "Send"
            }));
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
