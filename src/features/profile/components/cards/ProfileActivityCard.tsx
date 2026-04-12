"use client";
import type { Post } from "@/src/features/post/types";

import React from "react";
import { useParams } from "next/navigation";
import { Repeat } from "lucide-react";
import { MdOutlineContentPaste } from "react-icons/md";
import { FcLike } from "react-icons/fc";

import RepostCard from "./RepostCard";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfile, useUserProfile } from "@/src/features/profile";
import { useUserReposts } from "@/src/features/post/hooks/useRepost";
import PostCard from "@/src/features/post/components/PostCard";

export const ProfileActivityCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Используем хук для асинхронной загрузки текущего пользователя
  const { user: currentUser } = useProfile();
  const { data, isLoading } = useUserProfile(id);
  const { data: repostsData, isLoading: isRepostsLoading } = useUserReposts(
    id,
    20,
  );

  // Если нет данных - показываем загрузку
  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="text-neutral-500">Загрузка профиля...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full py-8 text-center">
        <div className="text-neutral-500">Профиль не найден</div>
      </div>
    );
  }

  // Подготавливаем данные
  const posts = Array.isArray(data.post) ? data.post : [];
  const likes = Array.isArray(data.likes) ? data.likes : [];
  const reposts = repostsData?.items || [];

  return (
    <div className="w-full">
      <Tabs className="w-full" defaultValue="posts">
        <TabsList className="grid w-full grid-cols-3 rounded-[1.5rem] bg-neutral-100 dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 auto-rows-fr h-auto p-1">
          <TabsTrigger
            className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
            value="posts"
          >
            <MdOutlineContentPaste className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
            <span className="hidden sm:inline font-medium text-[14px]">
              Посты
            </span>
            <span className="sm:hidden font-medium text-[14px]">Посты</span>
            <span className="text-[10px] sm:text-xs opacity-60">
              ({posts.length})
            </span>
          </TabsTrigger>
          <TabsTrigger
            className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
            value="likes"
          >
            <FcLike className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
            <span className="hidden sm:inline font-medium text-[14px]">
              Лайки
            </span>
            <span className="sm:hidden font-medium text-[14px]">Лайки</span>
            <span className="text-[10px] sm:text-xs opacity-60">
              ({likes.length})
            </span>
          </TabsTrigger>
          <TabsTrigger
            className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
            value="reposts"
          >
            <Repeat className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 text-blue-500" />
            <span className="hidden sm:inline font-medium text-[14px]">
              Репосты
            </span>
            <span className="sm:hidden font-medium text-[14px]">Репосты</span>
            <span className="text-[10px] sm:text-xs opacity-60">
              ({reposts.length})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          className="mt-3 sm:mt-5 focus-visible:outline-none focus-visible:ring-0 space-y-3 sm:space-y-5"
          value="posts"
        >
          {posts.length > 0 ? (
            posts.map((p) => {
              // Вычисляем likeByUser на основе массива likes
              const likeByUser = currentUser?.id
                ? (p.likes || []).some(
                    (like: any) => like.userId === currentUser.id,
                  )
                : false;

              // Преобразуем данные профиля в формат Post для PostCard
              const postData = {
                ...p,
                contentSpoiler: false,
                media: (p as any)?.media || [],
                likeByUser, // Добавляем вычисленное поле
              } as unknown as Post;

              return <PostCard key={p.id} cardFor="post" post={postData} />;
            })
          ) : (
            <div className="text-neutral-500 py-6 sm:py-8 text-center text-sm sm:text-base">
              Постов пока нет
            </div>
          )}
        </TabsContent>

        <TabsContent
          className="mt-3 sm:mt-5 focus-visible:outline-none focus-visible:ring-0 space-y-3 sm:space-y-5"
          value="likes"
        >
          {likes.length > 0 ? (
            likes.map((l) => {
              const likedPost = l.post || posts.find((p) => p.id === l.postId);

              if (!likedPost) return null;

              // Вычисляем likeByUser на основе массива likes
              const likeByUser = currentUser?.id
                ? ((likedPost as any).likes || []).some(
                    (like: any) => like.userId === currentUser.id,
                  )
                : false;

              // Преобразуем данные в формат Post для PostCard
              const postData = {
                ...likedPost,
                contentSpoiler: false,
                media: (likedPost as any)?.media || [],
                likeByUser, // Добавляем вычисленное поле
              } as unknown as Post;

              return <PostCard key={l.id} cardFor="post" post={postData} />;
            })
          ) : (
            <div className="text-neutral-500 py-6 sm:py-8 text-center text-sm sm:text-base">
              Лайков пока нет
            </div>
          )}
        </TabsContent>

        <TabsContent
          className="mt-3 sm:mt-5 focus-visible:outline-none focus-visible:ring-0 space-y-3 sm:space-y-5"
          value="reposts"
        >
          {isRepostsLoading ? (
            <div className="text-neutral-500 py-6 sm:py-8 text-center text-sm sm:text-base">
              Загрузка...
            </div>
          ) : reposts.length > 0 ? (
            reposts.map((repost) => {
              if (!repost.post) return null;

              // Вычисляем likeByUser на основе массива likes
              const likeByUser = currentUser?.id
                ? ((repost.post as any).likes || []).some(
                    (like: any) => like.userId === currentUser.id,
                  )
                : false;

              // Преобразуем данные в формат Post для PostCard
              const postData = {
                ...repost.post,
                contentSpoiler: false,
                media: repost.post?.media || [],
                likeByUser, // Добавляем вычисленное поле
              } as unknown as Post;

              return (
                <RepostCard
                  key={repost.id}
                  post={postData}
                  repostComment={repost.repostComment}
                  repostCreatedAt={repost.createdAt}
                  repostId={repost.id}
                />
              );
            })
          ) : (
            <div className="text-neutral-500 py-6 sm:py-8 text-center text-sm sm:text-base">
              Репостов пока нет
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileActivityCard;
