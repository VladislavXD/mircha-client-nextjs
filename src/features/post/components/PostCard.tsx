"use client";

import type { Post, User } from "../types";

import React, { useState, useRef, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Eye } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { useDeletePost } from "../hooks/usePostMutations";
import { useLikePost, useUnlikePost } from "../like/hooks";
import { useAddView } from "../hooks/usePostViews";
import ReportPostModal from "../modals/report";
import { useOnlineStatus } from "../../chat";
import { getEditedText } from "../utils/editedText.utils";

import PostMediaSlider, { type PostMedia } from "./PostMediaSlider/index";
import { RepostButton } from "./RepostButton";
import { CommentsModal } from "./comments";
import ShareDropdown from "./shareDropdown";

import UserComponent from "@/shared/components/ui/User";
import MetaInfo from "@/shared/components/ui/MetaInfo";
import PostDropdown from "@/shared/components/ui/post/PostDropdown/PostDropdown";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import EditPostModal from "@/shared/components/ui/post/PostModals/EditPost";
import DeletePost from "@/shared/components/ui/post/PostModals/DeletePost";
import { useThrottle } from "@/src/hooks/useAntiSpam";
import { timeAgo } from "@/src/utils/timeAgo";
import { Card } from "@/components/ui/card";

type Props = {
  post: Post;
  cardFor?: "comment" | "post" | "current-post";
  commentId?: string;
  onFollowToggle?: () => void;
};

/**
 * PostCard - компонент для отображения поста
 *
 * Features:
 * - Optimistic like/unlike with React Query
 * - View tracking with Intersection Observer
 * - Delete post with confirmation modal
 * - Edit post with modal
 * - Anti-spam throttling for likes (2s)
 * - Image display with blur effect
 * - Emoji support in content
 */
const PostCard = ({
  post,
  cardFor = "post",
  commentId = "",
  onFollowToggle,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);

  // Destructure post props
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
    repostedByUser = false,
  } = post;

  // Backend может использовать image или imageUrl
  const imageUrl = (post as any)?.image ?? (post as any)?.imageUrl;
  const safeContent = typeof content === "string" ? content : "";

  // Обработка медиа: если есть массив media, используем его, иначе создаём из одиночного image
  const postMedia: PostMedia[] = React.useMemo(() => {
    const mediaArray = (post as any)?.media;

    if (Array.isArray(mediaArray) && mediaArray.length > 0) {
      return mediaArray.map((m: any) => {
        // Определяем тип: бэкенд возвращает "IMAGE", "VIDEO", "GIF"
        let mediaType: "image" | "video" = "image";

        if (m.type) {
          const typeUpper = String(m.type).toUpperCase();

          mediaType = typeUpper === "VIDEO" ? "video" : "image";
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
      return [
        {
          url: imageUrl,
          type: "image" as const,
          spoiler: false,
        },
      ];
    }

    return [];
  }, [post, imageUrl]);

  const {
    id: authorId = "",
    name = "",
    avatarUrl = "",
    usernameFrameUrl,
    avatarFrameUrl,
    backgroundUrl,
    dateOfBirth,
    bio,
    createdAt: authorCreatedAt,
    followers = [],
    following = [],
  } = author || {};

  // Mutations
  const { mutate: likePost, isPending: isLikeLoading } = useLikePost();
  const { mutate: unlikePost, isPending: isUnlikeLoading } = useUnlikePost();
  const { mutate: deletePost, isPending: isDeleteLoading } = useDeletePost();
  const { mutate: addView } = useAddView();

  // Local state
  const [error, setError] = useState("");
  const [viewSent, setViewSent] = useState(false);

  // Visibility state for the animated line
  const { ref: lineRef, inView: isLineVisible } = useInView({
    rootMargin: "100px 0px",
    triggerOnce: false,
  });

  // Modals
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();

  const {
    isOpen: isCommentsOpen,
    onOpen: onCommentsOpen,
    onClose: onCommentsClose,
  } = useDisclosure();

  // Refs
  const inViewRef = useRef<HTMLDivElement | null>(null);

  // Handlers
  const handleLike = () => {
    if (!currentUser) {
      setError("Вы не авторизованы");

      return;
    }

    // Блокируем клики во время выполнения мутации
    if (isLikeLoading || isUnlikeLoading) {
      return;
    }

    // Fire-and-forget (оптимистичное обновление)
    if (likeByUser) {
      unlikePost(id, {
        onError: (err) => {
          setError(err.message || "Ошибка при снятии лайка");
        },
      });
    } else {
      likePost(id, {
        onError: (err) => {
          setError(err.message || "Ошибка при добавлении лайка");
        },
      });
    }
  };

  // Anti-spam throttling для лайков
  const { throttledCallback: handleLikeWithThrottle, isThrottled } =
    useThrottle(handleLike, 2000);

  const handleDeleteClick = () => {
    onDeleteOpen();
  };

  const handleEditClick = () => {
    onEditOpen();
  };

  const handleDelete = () => {
    deletePost(id, {
      onSuccess: () => {
        onDeleteClose();
        if (cardFor === "current-post") {
          router.push("/");
        }
      },
      onError: (err) => {
        setError(err.message || "Ошибка при удалении поста");
        onDeleteClose();
      },
    });
  };

  // View tracking with Intersection Observer
  useEffect(() => {
    if (viewSent || !id || cardFor !== "post" || !currentUser) return;

    const el = inViewRef.current;

    if (!el) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Пост должен быть виден 1 секунду
            timeoutId = setTimeout(() => {
              if (entry.isIntersecting) {
                addView(id, {
                  onSuccess: () => {
                    console.log("View added for post:", id);
                  },
                  onError: (err) => {
                    console.log("View add error:", err);
                  },
                });
                setViewSent(true);
                observer.disconnect();
              }
            }, 1000);
          } else {
            // Очищаем таймер если пост ушел из зоны видимости
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          }
        });
      },
      {
        threshold: 0.5, // 50% поста должно быть видно
        rootMargin: "0px 0px -100px 0px",
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id, viewSent, cardFor, currentUser, addView]);

  // Calculate counts - используем счетчики с сервера, если доступны (оптимизация)
  const likesCount = serverLikesCount ?? likes.length;
  const commentsCount = serverCommentsCount ?? comments.length;
  // Используем viewsCount с сервера (из Redis/БД), если есть, иначе локальный массив
  const viewsCount = serverViewsCount ?? views.length;
  const followersCount = followers.length;
  const followingCount = following.length;
  const isFollowing = currentUser
    ? followers.some((f) => f.followerId === currentUser.id)
    : false;

  const { isOnline } = useOnlineStatus(authorId);

  // Обработчик клика на карточку для перехода на страницу поста
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

  // Средняя кнопка — открыть в новой вкладке
  const handleCardAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1 && cardFor !== "current-post") {
      e.preventDefault();
      window.open(`/posts/${id}`, "_blank");
    }
  };

  return (
    <Card
      className="mb-0 relative cursor-pointer transition-all rounded-none shadow-none border-x-0 border-t-0 border-b last:border-b-0 border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] sm:hover:bg-neutral-50 sm:dark:hover:bg-[#181818]"
      onAuxClick={handleCardAuxClick}
      onClick={handleCardClick}
    >
      <div className="flex gap-3.5 px-4 sm:px-5 pt-4 pb-3">
        {/* LEFT: Аватар */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className="transition-transform duration-150 active:scale-90"
            onClick={(e) => e.stopPropagation()}
          >
            <UserComponent
              showFollowBadge
              avatarClassName="!w-9 !h-9 sm:!w-11 sm:!h-11"
              avatarFrameUrl={avatarFrameUrl}
              avatarUrl={avatarUrl}
              backgroundUrl={backgroundUrl}
              bio={bio}
              createdAt={authorCreatedAt}
              currentUserId={currentUser?.id}
              followersCount={followersCount}
              followingCount={followingCount}
              isFollowing={isFollowing}
              isOnline={isOnline}
              name={name}
              userId={authorId}
              usernameFrameUrl={usernameFrameUrl}
              variant="avatar-only"
              onFollowToggle={onFollowToggle}
            />
          </div>
          {/* Вертикальная линия потока */}
          <div className="relative w-px flex-1 bg-neutral-200 dark:bg-neutral-800 mt-2 -mb-3 rounded-full min-h-[16px] overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-transparent via-neutral-400 dark:via-white/60 to-transparent animate-shimmer-vertical" />
          </div>
        </div>

        {/* RIGHT: Контент */}
        <div className="flex-1 min-w-0 pb-3">
          {/* Имя + время + дропдаун */}
          <div className="flex items-start justify-between mb-1">
            <Link
              className="flex items-center gap-1.5 min-w-0 flex-1"
              href={`/user/${authorId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <UserComponent
                avatarFrameUrl={avatarFrameUrl}
                avatarUrl={avatarUrl}
                backgroundUrl={backgroundUrl}
                bio={bio}
                createdAt={authorCreatedAt}
                followersCount={followersCount}
                followingCount={followingCount}
                isFollowing={isFollowing}
                isOnline={isOnline}
                name={name}
                nameClassName="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                userId={authorId}
                usernameFrameUrl={usernameFrameUrl}
                variant="name-only"
                onFollowToggle={onFollowToggle}
              />
              <time
                className="text-neutral-500 dark:text-neutral-400 text-[11px] sm:text-xs shrink-0 ml-2"
                dateTime={createdAt}
              >
                {timeAgo(createdAt || "")}
              </time>
            </Link>
            <div className="shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
              <PostDropdown
                authorId={authorId}
                isLoading={isDeleteLoading}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                onReport={onReportOpen}
              />
            </div>
          </div>

          {/* Текст поста */}
          <div
            ref={inViewRef}
            className="cursor-pointer"
            onClick={
              cardFor !== "current-post"
                ? () => router.push(`/posts/${id}`)
                : undefined
            }
          >
            <EmojiText
              className="font-serif text-[13px] sm:text-[15px] md:text-[16px] leading-relaxed tracking-wide break-words"
              emojiUrls={emojiUrls}
              text={safeContent}
            />
          </div>

          {/* Медиа */}
          {postMedia.length > 0 && (
            <div
              className="mt-2 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <PostMediaSlider media={postMedia} />
            </div>
          )}

          {/* Действия */}
          {cardFor !== "comment" && (
            <div
              className="flex items-center justify-between mt-1"
              onClick={
                cardFor !== "current-post"
                  ? () => router.push(`/posts/${id}`)
                  : undefined
              }
            >
              <div className="flex items-center -ml-1.5 gap-2">
                <div
                  className={`cursor-pointer transition-opacity ${
                    isThrottled || isLikeLoading || isUnlikeLoading
                      ? "opacity-50"
                      : "opacity-100"
                  }`}
                  title={
                    isThrottled
                      ? "Подождите немного перед следующим лайком"
                      : ""
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeWithThrottle();
                  }}
                >
                  <MetaInfo
                    {...(likeByUser
                      ? { fill: "#d91002", color: "#d91002" }
                      : {})}
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
                  post={post}
                  postId={id}
                  repostCount={repostCount}
                  repostedByUser={repostedByUser}
                />

                <ShareDropdown
                  linkToCopy={`https://mirchan.site/posts/${id}`}
                />
              </div>
              {/* Просмотры */}
              <div className="flex items-center gap-2">
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
          )}

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeletePost
        error={error}
        isOpen={isDeleteOpen}
        loading={isDeleteLoading}
        onClose={onDeleteClose}
        onDelete={handleDelete}
      />

      {/* Edit post modal */}
      <EditPostModal
        initialContent={safeContent}
        initialEmojiUrls={emojiUrls}
        isOpen={isEditOpen}
        postId={id}
        onClose={onEditClose}
        onUpdated={() => {
          // React Query will auto-refetch on close
          onEditClose();
        }}
      />

      <ReportPostModal
        isOpen={isReportOpen}
        post={post}
        onClose={onReportClose}
      />

      {/* Comments modal */}
      <CommentsModal
        isOpen={isCommentsOpen}
        post={post}
        onClose={onCommentsClose}
      />
    </Card>
  );
};

export default PostCard;
