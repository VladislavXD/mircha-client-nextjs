"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { usePosts } from "../hooks/usePostQueries";
import { useProfile } from "@/src/features/profile/hooks";
import type { User } from "../types";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import CardSkeleton from "@/shared/components/ui/post/Card/Skeleton";
import Notice from "@/shared/components/ui/Notice";

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
  // Инициализируем запрос профиля на главной, чтобы состояние авторизации было доступно
  useProfile();
  const currentUser = queryClient.getQueryData<User>(["profile"]);
  
  const { data: posts, isLoading, isError, error } = usePosts();

  console.log(posts);

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

  if (!posts || posts.length === 0) {
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
  console.log(posts);
  return (
    <div className="space-y-5">
      {currentUser && <CreatePost />}
      <Notice/>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} cardFor="post"  />
      ))}
    </div>
  );
};

export default PostList;
