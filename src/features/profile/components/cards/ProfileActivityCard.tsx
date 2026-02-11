"use client";
import React from "react";
import { Tab, Tabs } from "@heroui/react";
import { useParams } from "next/navigation";
import { Repeat } from "lucide-react";
import { useProfile, useUserProfile } from "@/src/features/profile";
import { useUserReposts } from "@/src/features/post/hooks/useRepost";
import { MdOutlineContentPaste } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import PostCard from "@/src/features/post/components/PostCard";
import RepostCard from "./RepostCard";
import type { Post } from "@/src/features/post/types";

export const ProfileActivityCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Используем хук для асинхронной загрузки текущего пользователя
  const { user: currentUser } = useProfile();
  const { data, isLoading } = useUserProfile(id);
  const { data: repostsData, isLoading: isRepostsLoading } = useUserReposts(id, 20);

  // Если нет данных - показываем загрузку
  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="text-default-500">Загрузка профиля...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full py-8 text-center">
        <div className="text-default-500">Профиль не найден</div>
      </div>
    );
  }
  
  // Подготавливаем данные
  const posts = Array.isArray(data.post) ? data.post : [];
  const likes = Array.isArray(data.likes) ? data.likes : [];
  const reposts = repostsData?.items || [];
  
  return (
    <div className="w-full">
      <Tabs 
        aria-label="Profile tabs" 
        color="primary" 
        variant="underlined"
        classNames={{
          base: "w-full",
          tabList: "w-full gap-0 p-0 border-b border-divider overflow-x-auto",
          cursor: "w-full bg-primary",
          tab: "flex-1 px-2 sm:px-4 h-12 sm:h-14 min-w-[100px] sm:min-w-0",
          tabContent: "group-data-[selected=true]:text-primary text-xs sm:text-sm"
        }}
      >
        <Tab
          key="posts"
          title={
            <div className="flex items-center space-x-1 sm:space-x-2">
              <MdOutlineContentPaste className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Посты</span>
              <span className="sm:hidden">Посты</span>
              <span className="text-[10px] sm:text-xs text-default-400">({posts.length})</span>
            </div>
          }
        >
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-5">
            {posts.length > 0 ? (
              posts.map((p) => {
                // Вычисляем likeByUser на основе массива likes
                const likeByUser = currentUser?.id 
                  ? (p.likes || []).some((like: any) => like.userId === currentUser.id)
                  : false;
                
                // Преобразуем данные профиля в формат Post для PostCard
                const postData = {
                  ...p,
                  contentSpoiler: false,
                  media: (p as any)?.media || [],
                  likeByUser, // Добавляем вычисленное поле
                } as unknown as Post;
                
                return (
                  <PostCard
                    key={p.id}
                    post={postData}
                    cardFor="post"
                  />
                );
              })
            ) : (
              <div className="text-default-500 py-6 sm:py-8 text-center text-sm sm:text-base">Постов пока нет</div>
            )}
          </div>
        </Tab>

        <Tab
          key="likes"
          title={
            <div className="flex items-center space-x-1 sm:space-x-2">
              <FcLike className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Понравившиеся</span>
              <span className="sm:hidden">Лайки</span>
              <span className="text-[10px] sm:text-xs text-default-400">({likes.length})</span>
            </div>
          }
        >
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-5">
            {likes.length > 0 ? (
              likes.map((l) => {
                const likedPost = l.post || posts.find((p) => p.id === l.postId);
                
                if (!likedPost) return null;
                
                // Вычисляем likeByUser на основе массива likes
                const likeByUser = currentUser?.id 
                  ? ((likedPost as any).likes || []).some((like: any) => like.userId === currentUser.id)
                  : false;
                
                // Преобразуем данные в формат Post для PostCard
                const postData = {
                  ...likedPost,
                  contentSpoiler: false,
                  media: (likedPost as any)?.media || [],
                  likeByUser, // Добавляем вычисленное поле
                } as unknown as Post;
                
                return (
                  <PostCard
                    key={l.id}
                    post={postData}
                    cardFor="post"
                  />
                );
              })
            ) : (
              <div className="text-default-500 py-6 sm:py-8 text-center text-sm sm:text-base">Лайков пока нет</div>
            )}
          </div>
        </Tab>

        <Tab
          key="reposts"
          title={
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Repeat size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Репосты</span>
              <span className="sm:hidden">Репост</span>
              <span className="text-[10px] sm:text-xs text-default-400">({reposts.length})</span>
            </div>
          }
        >
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-5">
            {isRepostsLoading ? (
              <div className="text-default-500 py-6 sm:py-8 text-center text-sm sm:text-base">Загрузка...</div>
            ) : reposts.length > 0 ? (
              reposts.map((repost) => {
                if (!repost.post) return null;
                
                // Вычисляем likeByUser на основе массива likes
                const likeByUser = currentUser?.id 
                  ? ((repost.post as any).likes || []).some((like: any) => like.userId === currentUser.id)
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
              <div className="text-default-500 py-6 sm:py-8 text-center text-sm sm:text-base">Репостов пока нет</div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProfileActivityCard;
