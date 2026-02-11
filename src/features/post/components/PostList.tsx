"use client";

import React, { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { usePosts } from "../hooks/usePostQueries";
import { useProfile } from "@/src/features/profile/hooks";
import type { User } from "../types";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import CardSkeleton from "@/shared/components/ui/post/Card/Skeleton";
import Notice from "../../notice/components/Notice";
import { useInView } from "react-intersection-observer";



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
  const {ref, inView} = useInView()
  // Инициализируем запрос профиля на главной, чтобы состояние авторизации было доступно
  useProfile();
  const currentUser = queryClient.getQueryData<User>(["profile"]);
  
  const { data: posts, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = usePosts();

  console.log(posts?.pages);
  useEffect(()=> {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView])
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
        <p className="text-red-500 text-lg">
          Ошибка при загрузке постов
        </p>
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
          <p className="text-default-500 text-lg">
            Пока нет постов
          </p>
          <p className="text-default-400 text-sm mt-2">
            Будьте первым, кто создаст пост!
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {currentUser && <span className=""><CreatePost /></span>}
      <Notice/>
      {posts.pages.map((page) => (
        page.items.map((post) => (
        <PostCard key={post.id} post={post} cardFor="post"  />
      )))
      )}

      {
        hasNextPage && (
           <div className="flex justify-center py-4">
            <Spinner size="md" ref={ref} />

        </div>
        )
      }
    </div>
  );
};

export default PostList;
