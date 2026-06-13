"use client";

import type { User } from "../types";

import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HiOutlineSparkles, HiOutlineUserGroup } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { usePosts } from "../hooks/usePostQueries";
import Notice from "../../notice/components/Notice";

import PostCard from "./PostCard/index";
import CreatePost from "./CreatePost";
import { RecommendedUsersBlock } from "./RecommendedUsers/RecommendedUsersBlock";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/src/features/profile/hooks";
import CardSkeleton from "@/src/features/post/components/Skeleton";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";

/**
 * PostList - основной компонент для отображения ленты постов
 *
 * Features:
 * - Fetches all posts using usePosts hook
 * - Shows CreatePost form for authenticated users
 * - Renders PostCard for each post
 * - Loading skeleton states
 * - Error handling
 */
const PostList = () => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  // Инициализируем запрос профиля на главной, чтобы состояние авторизации было доступно
  const currentUser = queryClient.getQueryData<User>(["profile"]);


  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
  } = usePosts();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        {currentUser && <CreatePost />}
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">Ошибка при загрузке постов</p>
        <p className="text-default-500 text-sm mt-2">
          {error?.message || "Попробуйте обновить страницу"}
        </p>
      </div>
    );
  }

  if (!posts || posts.pages.length === 0) {
    return (
      <div className="space-y-5">
        {currentUser && <CreatePost />}
        <div className="text-center py-10">
          <p className="text-default-500 text-lg">Пока нет постов</p>
          <p className="text-default-400 text-sm mt-2">
            Будьте первым, кто создаст пост!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Notice />

      {currentUser && (
        <div className="flex flex-col gap-4">
          {
            isDesktop && (
              <CreatePost />
            )
          }
          
          <Tabs className="w-full" defaultValue="recommended">
            <TabsList className="grid w-full grid-cols-2 rounded-[1.5rem] bg-neutral-100 dark:bg-[#101010]  border border-neutral-200 dark:border-neutral-800/70  auto-rows-fr h-auto">
              <TabsTrigger
                className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
                value="recommended"
              >
                <HiOutlineSparkles
                  className="w-[18px] h-[18px] shrink-0"
                  strokeWidth={1.5}
                />
                <span className="font-medium text-[14px]">Рекомендуемые</span>
              </TabsTrigger>
              <TabsTrigger
                className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
                value="following"
              >
                <HiOutlineUserGroup
                  className="w-[18px] h-[18px] shrink-0"
                  strokeWidth={1.5}
                />
                <span className="font-medium text-[14px]">Подписки</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="rounded-[1.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] flex flex-col">
        {posts.pages.map((page, pageIndex) =>
          page.items.map((post, postIndex) => (
            <React.Fragment key={post.id}>
              <PostCard cardFor="post" post={post}  />
              {pageIndex === 0 && postIndex === 4 && (
                <div className=" bg-neutral-50 dark:bg-black/50 border-y border-neutral-200 dark:border-neutral-800/70">
                  <RecommendedUsersBlock />
                </div>
              )}
            </React.Fragment>
          )),
        )}
      </div>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        </div>
      )}
    </div>
  );
};

export default PostList;
