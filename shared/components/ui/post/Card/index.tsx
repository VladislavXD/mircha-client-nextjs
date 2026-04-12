import React, { useState } from "react";
import {
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextCard,
  useDisclosure,
  Image,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
// TODO: Migrate to React Query - useDeletePost already exists in features/post?

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRegComment } from "react-icons/fa";
import { Eye } from "lucide-react";
import { useEffect, useRef } from "react";
import { Heart } from "lucide-react";

import User from "../../User";
import MetaInfo from "../../MetaInfo";
import ErrorMessage from "../../ErrorMessage";
import PostDropdown from "../PostDropdown/PostDropdown";
import { EmojiText } from "../../EmojiText";
import EditPostModal from "../PostModals/EditPost";
import DeletePost from "../PostModals/DeletePost";

import { useViewsManager } from "@/app/utils/viewsManager";
import { hasErrorField } from "@/app/utils/hasErrorField";
import { formatToClientDate } from "@/app/utils/formatToClientDate";
import { useThrottle } from "@/src/hooks/useAntiSpam";
import { useDeleteComment } from "@/src/features/post/comment/hooks/useComment";
import { useLikePost, useUnlikePost } from "@/src/features/post/like";
import { postKeys } from "@/src/features/post/hooks/usePostQueries";
import { useOnlineStatus } from "@/src/features/chat";

type Props = {
  avatarUrl: string;
  name: string;
  authorId: string;
  content: string;
  commentId?: string;
  likesCount?: number;
  commentsCount?: number;
  createdAt?: string;
  id?: string;
  cardFor: "comment" | "post" | "current-post";
  likeByUser?: boolean;
  views?: number;
  usernameFrameUrl?: string;
  imageUrl?: string; // URL изображения поста
  emojiUrls?: string[]; // Массив URL emoji
  avatarFrameUrl?: string; // Добавлено для соответствия с типами
  backgroundUrl?: string; // Добавлено для соответствия с типами
  dateOfBirth?: Date; // Добавлено для соответствия с типами
  bio?: string; // Биография пользователя
  authorCreatedAt?: Date; // Дата регистрации автора
  followersCount?: number; // Количество подписчиков
  followingCount?: number; // Количество подписок
  isFollowing?: boolean; // Подписан ли текущий пользователь
  onFollowToggle?: () => void; // Функция для подписки/отписки
};
type ViewProps = {
  isVisible?: boolean;
  postId: number | string;
};

const Card = ({
  name = "",
  avatarUrl = "",
  authorId = "",
  content = "",
  commentId = "",
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  id = "",
  cardFor = "post",
  likeByUser = false,
  views = 0,
  usernameFrameUrl,
  imageUrl,
  emojiUrls = [],
  avatarFrameUrl,
  backgroundUrl,
  dateOfBirth,
  bio,
  authorCreatedAt,
  followersCount,
  followingCount,
  isFollowing,
  onFollowToggle,
}: Props) => {
  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const { mutate: unlikePost, isPending: isUnliking } = useUnlikePost();

  const { addView: addViewToQueue } = useViewsManager();
  const queryClient = useQueryClient();

  const { mutate: deleteComment, isPending: isDeleteCommentLoading } =
    useDeleteComment();

  const [error, setError] = useState("");

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
  // const [editValue, setEditValue] = useState(content);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      switch (cardFor) {
        case "post":
          // await deletePost(id).unwrap();
          // Инвалидируем кэш постов в React Query
          queryClient.invalidateQueries({ queryKey: postKeys.lists() });
          break;
        case "current-post":
          // await deletePost(id).unwrap();
          router.push("/");
          break;
        case "comment":
          // React Query хук - используем callback вместо unwrap
          deleteComment(
            { id: commentId, postId: id },
            {
              onSuccess: () => {
                // Инвалидируем кэш комментариев для текущего поста
                queryClient.invalidateQueries({
                  queryKey: postKeys.detail(id),
                });
                onDeleteClose();
              },
              onError: (err: any) => {
                setError(err.message || "Ошибка при удалении комментария");
                onDeleteClose();
              },
            },
          );

          return; // Выходим, т.к. callback обработает закрытие модалки
        default:
          throw new Error("Неверный аргумент cardFor");
      }
      onDeleteClose();
    } catch (err: any) {
      if (hasErrorField(err)) {
        setError(
          typeof err.data.error === "string"
            ? err.data.error
            : "Ошибка при удалении",
        );
      } else {
        setError(err.message || "Произошла ошибка");
      }
      onDeleteClose();
    }
  };

  const handleDeleteClick = () => {
    onDeleteOpen();
  };

  const handleEditClick = () => {
    onEditOpen();
  };

  // Обработчик лайка с React Query - оптимистичные обновления в useLike.ts
  const handleLike = () => {
    // Блокируем клики во время выполнения мутации
    if (isLiking || isUnliking) {
      return;
    }

    if (likeByUser) {
      unlikePost(id, {
        onError: (err: any) => {
          setError(err?.message || "Ошибка при снятии лайка");
        },
      });
    } else {
      likePost(id, {
        onError: (err: any) => {
          setError(err?.message || "Ошибка при постановке лайка");
        },
      });
    }
    // Функция завершается мгновенно, UI уже обновлён!
  };

  // ===== АНТИ-СПАМ ЗАЩИТА ДЛЯ ЛАЙКОВ =====
  // Throttle с задержкой 2000мс - предотвращает спам кликов
  const { throttledCallback: handleLikeWithThrottle, isThrottled } =
    useThrottle(handleLike, 2000);

  // Отправка просмотра через менеджер (батчинг)
  const handleView = ({ postId }: ViewProps) => {
    if (!postId || viewSent) return;

    try {
      addViewToQueue(postId as string);
      console.log("Просмотр добавлен в очередь для поста:", postId);
    } catch (err) {
      console.log("Ошибка при добавлении просмотра в очередь:", err);
    }
  };

  const inViewRef = useRef<HTMLDivElement | null>(null);
  const [viewSent, setViewSent] = useState(false);

  useEffect(() => {
    if (viewSent || !id || cardFor !== "post") return;

    const el = inViewRef.current;

    if (!el) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Добавляем задержку для более точного учета просмотра
            timeoutId = setTimeout(() => {
              if (entry.isIntersecting) {
                handleView({ postId: id });
                setViewSent(true);
                observer.disconnect();
              }
            }, 1000); // Пост должен быть виден 1 секунду
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
        rootMargin: "0px 0px -100px 0px", // Учитываем нижнюю часть экрана
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id, viewSent, cardFor]);

  const { isOnline } = useOnlineStatus(authorId);

  return (
    <NextCard className="mb-5">
      <CardHeader className="justify-between  items-center bg-transparent">
        <Link href={`/user/${authorId}`}>
          <User
            avatarFrameUrl={avatarFrameUrl}
            avatarUrl={avatarUrl}
            backgroundUrl={backgroundUrl}
            bio={bio}
            className="text-small font-semibold leading-none text-default-600"
            createdAt={authorCreatedAt}
            dateOfBirth={dateOfBirth}
            description={createdAt && formatToClientDate(createdAt)}
            followersCount={followersCount}
            followingCount={followingCount}
            isFollowing={isFollowing}
            isOnline={isOnline}
            name={name}
            usernameFrameUrl={usernameFrameUrl}
            onFollowToggle={onFollowToggle}
          />
        </Link>

        <PostDropdown
          authorId={authorId}
          isLoading={false}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
          onReport={onReportOpen}
        />
      </CardHeader>
      <CardBody className="px-3 py-2 mb-5">
        <div ref={inViewRef}>
          <EmojiText emojiUrls={emojiUrls} text={content} />

          {/* Отображение изображения поста */}
          {imageUrl && (
            <div className="mt-3 overflow-hidden">
              <Image
                isBlurred
                alt="Изображение поста"
                className="max-w-full h-auto rounded-lg object-cover "
                src={imageUrl}
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}
        </div>
      </CardBody>

      <div className="text-small text-default-400 pl-3 flex items-center g1000">
        <Eye size={16} />
        {views > 1000 ? `${(views / 1000).toFixed(1)}k` : views}{" "}
        {views === 1 ? "просмотр" : views < 5 ? "просмотра" : "просмотров"}
      </div>

      {cardFor !== "comment" && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 items-center">
            <div
              className={`cursor-pointer transition-opacity ${
                isThrottled || isLiking || isUnliking
                  ? "opacity-50"
                  : "opacity-100"
              }`}
              title={
                isThrottled ? "Подождите немного перед следующим лайком" : ""
              }
              onClick={handleLikeWithThrottle}
            >
              <MetaInfo
                {...(likeByUser ? { fill: "#d91002", color: "#d91002" } : {})}
                Icon={likeByUser ? Heart : Heart}
                count={likesCount}
                type="heart"
              />
            </div>

            <Link href={`/posts/${id}`}>
              <MetaInfo Icon={FaRegComment} count={commentsCount} />
            </Link>
          </div>
          <ErrorMessage error={error} />
        </CardFooter>
      )}

      {/* Модальное окно подтверждения удаления вынесено в отдельный компонент */}
      <DeletePost
        error={error}
        isOpen={isDeleteOpen}
        loading={false}
        onClose={onDeleteClose}
        onDelete={handleDelete}
      />

      {/* Модалка редактирования поста вынесена в отдельный компонент */}
      <EditPostModal
        initialContent={content}
        initialEmojiUrls={emojiUrls}
        isOpen={isEditOpen}
        postId={id}
        onClose={onEditClose}
        onUpdated={() => {
          // Инвалидируем кэш постов после редактирования
          queryClient.invalidateQueries({ queryKey: ["posts"] });
          queryClient.invalidateQueries({ queryKey: ["post", id] });
        }}
      />
    </NextCard>
  );
};

export default Card;
