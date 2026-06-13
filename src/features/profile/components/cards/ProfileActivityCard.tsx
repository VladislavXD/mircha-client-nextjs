"use client";
import type { Post } from "@/src/features/post/types";

import React, { useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { Repeat } from "lucide-react";
import { MdOutlineContentPaste } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

import RepostCard from "./RepostCard";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfile, useUserProfile } from "@/src/features/profile";
import { useUserReposts } from "@/src/features/post/hooks/useRepost";
import PostCard from "@/src/features/post/components/PostCard";
import CardSkeleton from "@/src/features/post/components/Skeleton";
import CreatePost from "@/src/features/post/components/CreatePost";

export const ProfileActivityCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ref, inView } = useInView();

  const { user: currentUser } = useProfile();
  const { data, isLoading, isOwnProfile } = useUserProfile(id);
  const {
    data: repostsData,
    isLoading: isRepostsLoading,
  
  } = useUserReposts(id, 20);

  const posts = useMemo(
    () => (Array.isArray(data?.post) ? data.post : []),
    [data?.post],
  );
  const likes = useMemo(
    () => (Array.isArray(data?.likes) ? data.likes : []),
    [data?.likes],
  );
  const reposts = useMemo(
    () => repostsData?.items || [],
    [repostsData?.items],
  );

  const likedPostIds = useMemo(() => {
    if (!currentUser?.id) return new Set<string>();
    const allPosts = [
      ...posts,
      ...likes.map((l: any) => l.post).filter(Boolean),
      ...reposts.map((r: any) => r.post).filter(Boolean),
    ];
    return new Set(
      allPosts.flatMap((p: any) =>
        (p?.likes || [])
          .filter((l: any) => l.userId === currentUser.id)
          .map((l: any) => l.postId ?? p?.id),
      ),
    );
  }, [posts, likes, reposts, currentUser?.id]);

  // useEffect(() => {
  //   if (inView && hasNextPage) fetchNextPage();
  // }, [inView, hasNextPage, fetchNextPage]);

  const toPostData = (p: any): Post =>
    ({
      ...p,
      contentSpoiler: false,
      media: p?.media || [],
      likeByUser: likedPostIds.has(p?.id),
    }) as unknown as Post;

  const listWrapper = (children: React.ReactNode) => (
    <div className="rounded-[1.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800/70">
      {children}
    </div>
  );

  const emptyState = (label: string) => (
    <div className="py-10 text-center text-neutral-500 text-sm">{label}</div>
  );

  const skeletonList = listWrapper(
    [...Array(3)].map((_, i) => <CardSkeleton key={i} />),
  );

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <div className="h-[52px] rounded-[1.5rem] bg-neutral-100 dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 animate-pulse" />
        {skeletonList}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-neutral-500">
        Профиль не найден
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs className="w-full" defaultValue="posts">

        <TabsList className="grid w-full grid-cols-3 rounded-[1.5rem] bg-neutral-100 dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 auto-rows-fr h-auto p-1 mb-3">
          <TabsTrigger
            value="posts"
            className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <MdOutlineContentPaste className="w-[18px] h-[18px] shrink-0" />
            <span className="font-medium text-[14px]">Посты</span>
            <span className="text-xs opacity-60">({posts.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <FcLike className="w-[18px] h-[18px] shrink-0" />
            <span className="font-medium text-[14px]">Лайки</span>
            <span className="text-xs opacity-60">({likes.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="reposts"
            className="rounded-[1.25rem] h-full py-3 text-neutral-500 dark:text-neutral-400 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1c1c] data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Repeat className="w-[18px] h-[18px] shrink-0 text-blue-500" />
            <span className="font-medium text-[14px]">Репосты</span>
            <span className="text-xs opacity-60">({reposts.length})</span>
          </TabsTrigger>
        </TabsList>


        {
          isOwnProfile && (
            <CreatePost />
          )
        }


        <TabsContent value="posts" className="focus-visible:outline-none focus-visible:ring-0">
          {posts.length > 0
            ? listWrapper(
                posts.map((p: any) => (
                  <PostCard key={p.id} cardFor="post" post={toPostData(p)} />
                )),
              )
            : emptyState("Постов пока нет")}
        </TabsContent>

        <TabsContent value="likes" className="focus-visible:outline-none focus-visible:ring-0">
          {likes.length > 0
            ? listWrapper(
                likes.map((l: any) => {
                  const likedPost =
                    l.post || posts.find((p: any) => p.id === l.postId);
                  if (!likedPost) return null;
                  return (
                    <PostCard
                      key={l.id}
                      cardFor="post"
                      post={toPostData(likedPost)}
                    />
                  );
                }),
              )
            : emptyState("Лайков пока нет")}
        </TabsContent>

        <TabsContent value="reposts" className="focus-visible:outline-none focus-visible:ring-0">
          {isRepostsLoading ? (
            skeletonList
          ) : reposts.length > 0 ? (
            <>
              {listWrapper(
                reposts.map((repost: any) => {
                  if (!repost.post) return null;
                  return (
                    <RepostCard
                      key={repost.id}
                      post={toPostData(repost.post)}
                      repostComment={repost.repostComment}
                      repostCreatedAt={repost.createdAt}
                      repostId={repost.id}
                    />
                  );
                }),
              )}
              {/* {hasNextPage && ( */}
                <div ref={ref} className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                </div>
              {/* )} */}
            </>
          ) : (
            emptyState("Репостов пока нет")
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileActivityCard;