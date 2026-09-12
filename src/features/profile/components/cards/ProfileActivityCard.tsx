"use client";
import type { Post } from "@/src/features/post/types";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

import RepostCard from "./RepostCard";

import { useProfile, useUserProfile } from "@/src/features/profile";
import { useUserReposts } from "@/src/features/post/hooks/useRepost";
import PostCard from "@/src/features/post/components/PostCard";
import CardSkeleton from "@/src/features/post/components/Skeleton";

// Табы сделаны на чистой разметке (без @/components/ui/tabs), чтобы избежать
// конфликтов со внутренними классами шадсn-компонента (inline-flex, rounded-md,
// data-[state=active]:bg-background и т.п.), которые не всегда перебиваются
// через className и портят вид (см. скрин с "таблеткой" на активном табе).
const TABS = [
  { key: "posts", label: "Посты" },
  { key: "replies", label: "Ответы" },
  { key: "media", label: "Медиа" },
  { key: "reposts", label: "Репосты" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export const ProfileActivityCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ref, inView } = useInView();
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  const { user: currentUser } = useProfile();
  const { data, isLoading } = useUserProfile(id);
  const {
    data: repostsData,
    isLoading: isRepostsLoading,
  } = useUserReposts(id, 20);

  const posts = useMemo(
    () => (Array.isArray(data?.post) ? data.post : []),
    [data?.post],
  );

  // Медиа-таб — фильтруем посты, у которых есть медиа-вложения
  const media = useMemo(
    () => posts.filter((p: any) => Array.isArray(p?.media) && p.media.length > 0),
    [posts],
  );

  // TODO: подключить реальный источник данных для ответов, когда появится в API
  const replies = useMemo(() => [], []);

  const reposts = useMemo(
    () => repostsData?.items || [],
    [repostsData?.items],
  );

  const likedPostIds = useMemo(() => {
    if (!currentUser?.id) return new Set<string>();
    const allPosts = [
      ...posts,
      ...reposts.map((r: any) => r.post).filter(Boolean),
    ];
    return new Set(
      allPosts.flatMap((p: any) =>
        (p?.likes || [])
          .filter((l: any) => l.userId === currentUser.id)
          .map((l: any) => l.postId ?? p?.id),
      ),
    );
  }, [posts, reposts, currentUser?.id]);

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
        <div className="h-11 border-b border-neutral-200 dark:border-neutral-800/70 animate-pulse" />
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
      {/* ── Табы: равные по ширине, подчёркивание только у активного ── */}
      <div className="flex w-full border-b border-neutral-200 dark:border-neutral-800/70 mb-3">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              className={`flex-1 -mb-px border-b-2 py-3 text-center text-[14px] transition-colors ${
                isActive
                  ? "border-black dark:border-white font-semibold text-black dark:text-white"
                  : "border-transparent font-medium text-neutral-500 dark:text-neutral-400"
              }`}
              type="button"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Контент таба ── */}
      {activeTab === "posts" &&
        (posts.length > 0
          ? listWrapper(
              posts.map((p: any) => (
                <PostCard key={p.id} cardFor="post" post={toPostData(p)} />
              )),
            )
          : emptyState("Постов пока нет"))}

      {activeTab === "replies" &&
        (replies.length > 0
          ? listWrapper(
              replies.map((p: any) => (
                <PostCard key={p.id} cardFor="post" post={toPostData(p)} />
              )),
            )
          : emptyState("Ответов пока нет"))}

      {activeTab === "media" &&
        (media.length > 0
          ? listWrapper(
              media.map((p: any) => (
                <PostCard key={p.id} cardFor="post" post={toPostData(p)} />
              )),
            )
          : emptyState("Медиа пока нет"))}

      {activeTab === "reposts" &&
        (isRepostsLoading ? (
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
            <div ref={ref} className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
            </div>
          </>
        ) : (
          emptyState("Репостов пока нет")
        ))}
    </div>
  );
};

export default ProfileActivityCard;