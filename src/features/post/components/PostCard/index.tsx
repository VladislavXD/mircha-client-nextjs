"use client";

import type { Post, User } from "../../types";
import type { PostMedia } from "../PostMediaSlider/index";

import React, { useState, useRef, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useDeletePost } from "../../hooks/usePostMutations";
import { useLikePost, useUnlikePost } from "../../like/hooks";
import { useAddView } from "../../hooks/usePostViews";
import { useOnlineStatus } from "../../../chat";
import { usePost } from "../../hooks/usePostQueries";

// Import broken-down components
import { PostCardHeader } from "./PostCardHeader";
import { PostCardContent } from "./PostCardContent";
import { PostCardActions } from "./PostCardActions";
import { PostCardModals } from "./PostCardModals";
import { useModals } from "../../../../hooks/useModals";

import { Card } from "@/components/ui/card";
import { useFollowToggle } from "@/src/features/follow/hooks/useFollowToggle";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";

type Props = {
  post?: Post;
  repostId?: string;
  cardFor?: "comment" | "post" | "current-post" | "repost";
  commentId?: string;
  onFollowToggle?: () => void;
};

const PostCard = ({
  post: postProp,
  repostId,
  cardFor = "post",
  onFollowToggle,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: fetchedPost, isLoading: isRepostLoading } = usePost(
    repostId ?? "",
    { enabled: !postProp && !!repostId },
  );

  const post = postProp ?? fetchedPost;

  const {
    id = "",
    author,
    content,
    emojiUrls = [],
    createdAt,
    likes = [],
    comments = [],
    likesCount: serverLikesCount,
    commentsCount: serverCommentsCount,
    likeByUser = false,
    views = [],
    viewsCount: serverViewsCount,
    repostCount = 0,
    originalPost,
    repostedByUser = false,
    poll,
  } = post ?? {};

  const {
    id: authorId = "",
    name = "",
    avatarUrl = "",
    usernameFrameUrl,
    avatarFrameUrl,
    backgroundUrl,
    bio,
    createdAt: authorCreatedAt,
    _count,
  } = author || {};
  const imageUrl = (post as any)?.image ?? (post as any)?.imageUrl;

  const postMedia: PostMedia[] = React.useMemo(() => {
    const mediaArray = (post as any)?.media;

    if (Array.isArray(mediaArray) && mediaArray.length > 0) {
      return mediaArray.map((m: any) => {
        let mediaType: "image" | "video" = "image";

        if (m.type) {
          mediaType =
            String(m.type).toUpperCase() === "VIDEO" ? "video" : "image";
        } else if (m.mimeType) {
          mediaType = m.mimeType.startsWith("video/") ? "video" : "image";
        }

        return {
          url: m.url || m,
          type: mediaType,
          spoiler: m.spoiler || false,
        };
      });
    }
    if (imageUrl) {
      return [{ url: imageUrl, type: "image" as const, spoiler: false }];
    }

    return [];
  }, [post, imageUrl]);

  const { mutate: likePost, isPending: isLikeLoading } = useLikePost();
  const { mutate: unlikePost, isPending: isUnlikeLoading } = useUnlikePost();
  const { mutate: deletePost, isPending: isDeleteLoading } = useDeletePost();
  const { mutate: addView } = useAddView();

  const { handleFollow, isFollowing } = useFollowToggle(authorId);

  const [error, setError] = useState("");
  const [viewSent, setViewSent] = useState(false);

  // Modals hook
  const modals = useModals();

  const inViewRef = useRef<HTMLDivElement | null>(null);

  // PostCard.tsx

  const handleLike = () => {
    if (!currentUser) return setError("Вы не авторизованы");
    if (isLikeLoading || isUnlikeLoading) return;

    if (likeByUser) {
      unlikePost(id, {
        onError: (err) => setError(err.message || "Ошибка при снятии лайка"),
      });
    } else {
      likePost(id, {
        onError: (err) =>
          setError(err.message || "Ошибка при добавлении лайка"),
      });
    }
  };

  const handleDelete = () => {
    deletePost(id, {
      onSuccess: () => {
        modals.deleteModal.onClose();
        if (cardFor === "current-post") router.push("/");
      },
      onError: (err) => {
        setError(err.message || "Ошибка при удалении поста");
        modals.deleteModal.onClose();
      },
    });
  };

  useEffect(() => {
    if (viewSent || !id || cardFor !== "post" || !currentUser) return;
    const el = inViewRef.current;

    if (!el) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            timeoutId = setTimeout(() => {
              if (entry.isIntersecting) {
                addView(id, {});
                setViewSent(true);
                observer.disconnect();
              }
            }, 1000);
          } else {
            if (timeoutId) clearTimeout(timeoutId);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -100px 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id, viewSent, cardFor, currentUser, addView]);

  const likesCount = serverLikesCount ?? likes.length;
  const commentsCount = serverCommentsCount ?? comments.length;
  const viewsCount = serverViewsCount ?? views.length;
  const followersCount = _count?.followers ?? 0;
  const followingCount = _count?.following ?? 0;

  const { isOnline } = useOnlineStatus(authorId);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

   


    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest('[role="button"]') ||
      target.closest(".swiper-button-next") ||
      target.closest(".swiper-button-prev") ||
      target.closest(".swiper-pagination")
    ) {
      return;
    }
    if (cardFor !== "current-post") {
      router.push(`/posts/${id}`);
    }
  };

  const handleCardAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1 && cardFor !== "current-post") {
      e.preventDefault();
      window.open(`/posts/${id}`, "_blank");
    }
  };

  if (!post) {
    if (isRepostLoading) {
      return (
        <div className="px-4 py-3 animate-pulse space-y-2">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
        </div>
      );
    }

    return null;
  }

  return (
    <Card
      className={`mb-0 relative cursor-pointer transition-all shadow-none bg-white dark:bg-[#101010]  ${
        cardFor === "repost"
          ? "border-0 rounded-none dark:bg-[#0a0a0a] "
          : "rounded-none border-x-0 border-t-0 border-b last:border-b-0 border-neutral-200 dark:border-neutral-800/70  "
      }`}
      onAuxClick={handleCardAuxClick}
      onClick={isDesktop ? handleCardClick : modals.commentsModal.onOpen}
    >
      <div
        className={`flex gap-3.5 px-4 sm:px-5 pt-4 pb-3 ${cardFor === "repost" ? "sm:px-2 px-2 !pt-2 !pb-0" : ""}`}
      >
        {/* LEFT COLUMN: Avatar and vertical line */}
        {cardFor !== "repost" && (
          <PostCardHeader.Left
            authorCreatedAt={authorCreatedAt}
            authorId={authorId}
            avatarFrameUrl={avatarFrameUrl}
            avatarUrl={avatarUrl}
            backgroundUrl={backgroundUrl}
            bio={bio}
            cardFor={cardFor}
            currentUserId={currentUser?.id}
            followersCount={followersCount}
            followingCount={followingCount}
            isFollowing={isFollowing}
            isOnline={isOnline}
            name={name}
            usernameFrameUrl={usernameFrameUrl}
            onFollowToggle={onFollowToggle}
          />
        )}

        {/* RIGHT COLUMN: Header, Content, Actions */}
        <div className="flex-1 min-w-0 pb-3">
          {/* Для репоста: аватар + имя + время в одну строку */}
          {cardFor === "repost" ? (
            <PostCardHeader.Repost
              authorCreatedAt={authorCreatedAt}
              authorId={authorId}
              avatarFrameUrl={avatarFrameUrl}
              avatarUrl={avatarUrl}
              backgroundUrl={backgroundUrl}
              bio={bio}
              cardFor={cardFor}
              createdAt={createdAt}
              currentUserId={currentUser?.id}
              followersCount={followersCount}
              followingCount={followingCount}
              isDeleteLoading={isDeleteLoading}
              isFollowing={isFollowing}
              isOnline={isOnline}
              name={name}
              usernameFrameUrl={usernameFrameUrl}
              onDelete={modals.deleteModal.onOpen}
              onEdit={modals.editModal.onOpen}
              onFollowToggle={handleFollow}
              onReport={modals.reportModal.onOpen}
            />
          ) : (
            /* Для обычного поста: только имя + время + дропдаун */
            <PostCardHeader.Right
              authorCreatedAt={authorCreatedAt}
              authorId={authorId}
              avatarFrameUrl={avatarFrameUrl}
              avatarUrl={avatarUrl}
              backgroundUrl={backgroundUrl}
              bio={bio}
              cardFor={cardFor}
              createdAt={createdAt}
              followersCount={followersCount}
              followingCount={followingCount}
              isDeleteLoading={isDeleteLoading}
              isFollowing={isFollowing}
              currentUserId={currentUser?.id}
              isOnline={isOnline}
              name={name}
              usernameFrameUrl={usernameFrameUrl}
              onDelete={modals.deleteModal.onOpen}
              onEdit={modals.editModal.onOpen}
              onFollowToggle={handleFollow}
              onReport={modals.reportModal.onOpen}
            />
          )}

          <PostCardContent
            cardFor={cardFor}
            content={content as string}
            emojiUrls={emojiUrls}
            hasOriginalPost={!!originalPost}
            inViewRef={inViewRef}
            poll={poll}
            postId={id}
            originalPostElement={
              originalPost ? (
                <PostCard
                  cardFor="repost"
                  repostId={originalPost.id}
                  onFollowToggle={handleFollow}
                />
              ) : null
            }
            postMedia={postMedia}
            // onContentClick={
            //   cardFor !== "current-post" && isDesktop
            //     ? () => router.push(`/posts/${id}`)
            //     : undefined
            // }
          />

          <PostCardActions
            cardFor={cardFor}
            commentsCount={commentsCount}
            handleLike={handleLike}
            isLikeLoading={isLikeLoading}
            isUnlikeLoading={isUnlikeLoading}
            isAuthenticated={!!currentUser}
            likeByUser={likeByUser}
            likesCount={likesCount}
            post={post}
            repostCount={repostCount}
            repostedByUser={repostedByUser}
            viewsCount={viewsCount}
            onActionsClick={
              cardFor !== "current-post"
                ? () => router.push(`/posts/${id}`)
                : undefined
            }
            onCommentsOpen={modals.commentsModal.onOpen}
            onShareOpen={modals.shareModal.onOpen}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>

      <PostCardModals
        deleteError={error}
        isDeleteLoading={isDeleteLoading}
        modals={modals}
        post={post}
        onDelete={handleDelete}
      />
    </Card>
  );
};

export default memo(PostCard);
