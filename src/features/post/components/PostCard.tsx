"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextCard,
  useDisclosure,
  Image,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Eye } from "lucide-react";
import { FaRegComment } from "react-icons/fa";

import { useDeletePost } from "../hooks/usePostMutations";
import { useLikePost, useUnlikePost } from "../like/hooks";
import { useAddView } from "../hooks/usePostViews";
import type { Post, User } from "../types";

import UserComponent from "@/shared/components/ui/User";
import { formatToClientDate } from "@/app/utils/formatToClientDate";
import Typography from "@/shared/components/ui/typography";
import MetaInfo from "@/shared/components/ui/MetaInfo";
import PostDropdown from "@/shared/components/ui/post/PostDropdown/PostDropdown";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import EditPostModal from "@/shared/components/ui/post/PostModals/EditPost";
import DeletePost from "@/shared/components/ui/post/PostModals/DeletePost";
import { useThrottle } from "@/src/hooks/useAntiSpam";
import ReportPostModal from "../modals/report";

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
    imageUrl,
    emojiUrls = [],
    createdAt,
    likes = [],
    comments = [],
    likesCount: serverLikesCount,
    commentsCount: serverCommentsCount,
    likeByUser = false,
    views = [],
    viewsCount: serverViewsCount,
  } = post;
  console.log('likedByUser:', likeByUser);

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
  const { throttledCallback: handleLikeWithThrottle, isThrottled } = useThrottle(
    handleLike,
    2000
  );

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
      }
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

  return (
    <NextCard className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link href={`/user/${authorId}`}>
          <UserComponent
            userId={authorId}
            usernameFrameUrl={usernameFrameUrl}
            avatarFrameUrl={avatarFrameUrl}
            backgroundUrl={backgroundUrl}
            dateOfBirth={dateOfBirth}
            name={name}
            bio={bio}
            createdAt={authorCreatedAt}
            followersCount={followersCount}
            followingCount={followingCount}
            isFollowing={isFollowing}
            onFollowToggle={onFollowToggle}
            className="text-small font-semibold leading-none text-default-600"
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>

        <PostDropdown
          isLoading={isDeleteLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
					onReport={onReportOpen}
          authorId={authorId}
        />
      </CardHeader>

      <CardBody className="px-3 py-2 mb-5">
        <div ref={inViewRef}>
          <EmojiText text={content} emojiUrls={emojiUrls} />

          {imageUrl && (
            <div className="mt-3 overflow-hidden">
              <Image
                isBlurred
                src={imageUrl}
                alt="Изображение поста"
                className="max-w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}
        </div>
      </CardBody>

      <div className="text-small text-default-400 pl-3 flex items-center gap-1">
        <Eye size={16} />
        {viewsCount > 1000 ? `${(viewsCount / 1000).toFixed(1)}k` : viewsCount}{" "}
        {viewsCount === 1
          ? "просмотр"
          : viewsCount < 5
          ? "просмотра"
          : "просмотров"}
      </div>

      {cardFor !== "comment" && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 items-center">
            <div
              onClick={handleLikeWithThrottle}
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
            >
              <MetaInfo
                {...(likeByUser ? { fill: "#d91002", color: "#d91002" } : {})}
                count={likesCount}
                type="heart"
                Icon={Heart}
              />
            </div>

            <Link href={`/posts/${id}`}>
              <MetaInfo count={commentsCount} Icon={FaRegComment} />
            </Link>
          </div>
          
          {error && (
            <p className="text-red-500 text-small mt-2">{error}</p>
          )}
        </CardFooter>
      )}

      {/* Delete confirmation modal */}
      <DeletePost
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={handleDelete}
        loading={isDeleteLoading}
        error={error}
      />

      {/* Edit post modal */}
      <EditPostModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        postId={id}
        initialContent={content}
        initialEmojiUrls={emojiUrls}
        onUpdated={() => {
          // React Query will auto-refetch on close
          onEditClose();
        }}
      />

			<ReportPostModal
				isOpen={isReportOpen}
				onClose={onReportClose}
				post={post}
			/>
    </NextCard>
  );
};

export default PostCard;
