import React from "react";
import Link from "next/link";

import { timeAgo } from "@/src/utils/timeAgo";
import UserComponent from "@/shared/components/ui/User";
import PostDropdown from "@/shared/components/ui/post/PostDropdown/PostDropdown";
import { Repeat } from "lucide-react";

export const PostCardHeader = {
  Left: ({
    authorId,
    name,
    avatarUrl,
    usernameFrameUrl,
    avatarFrameUrl,
    backgroundUrl,
    bio,
    authorCreatedAt,
    followersCount,
    followingCount,
    cardFor,
    isFollowing,
    isOnline,
    createdAt,
    onFollowToggle,
    currentUserId,
  }: any) => (
    <>
      <div className="flex flex-col items-center shrink-0">
        <div
          className="transition-transform duration-150 active:scale-90"
          onClick={(e) => e.stopPropagation()}
        >
          <UserComponent
            showFollowBadge={true}
            avatarClassName="!w-6 !h-6 sm:!w-7 sm:!h-7"
            avatarFrameUrl={avatarFrameUrl}
            avatarUrl={avatarUrl}
            backgroundUrl={backgroundUrl}
            bio={bio}
            createdAt={authorCreatedAt}
            currentUserId={currentUserId}
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
        {/* Вертикальная линия — растягивается на всю высоту правой колонки */}
        <div className="relative w-px flex-1 bg-neutral-200 dark:bg-neutral-800 mt-2 -mb-3 rounded-full min-h-[16px] overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-transparent via-neutral-400 dark:via-white/60 to-transparent animate-shimmer-vertical" />
        </div>
      </div>
    </>
  ),

  Right: ({
    authorId,
    name,
    avatarUrl,
    usernameFrameUrl,
    avatarFrameUrl,
    backgroundUrl,
    bio,
    authorCreatedAt,
    followersCount,
    followingCount,
    isFollowing,
    isOnline,
    createdAt,
    onFollowToggle,
    isDeleteLoading,
    onDelete,
    currentUserId,
    onEdit,
    onReport,
    cardFor,
  }: any) => (
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
          currentUserId={currentUserId}
          isOnline={isOnline}
          showFollowBadge={true}
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
      {cardFor !== "repost" && (
        <div className="shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
          <PostDropdown
            authorId={authorId}
            isLoading={isDeleteLoading}
            onDelete={onDelete}
            onEdit={onEdit}
            onReport={onReport}
          />
        </div>
      )}
    </div>
  ),

  Repost: ({
    authorId,
    name,
    avatarFrameUrl,
    avatarUrl,
    backgroundUrl,
    bio,
    authorCreatedAt,
    followersCount,
    followingCount,
    isFollowing,
    isOnline,
    createdAt,
    onFollowToggle,
    currentUserId,
    usernameFrameUrl,
  }: any) => (
    <div className="flex items-center gap-2 mb-1">
      <div
        className="transition-transform duration-150 active:scale-90 shrink-0 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        <Repeat size={15} />
        <UserComponent
          showFollowBadge={true}
          avatarClassName="!w-6 !h-6 sm:!w-7 sm:!h-7"
          avatarFrameUrl={avatarFrameUrl}
          avatarUrl={avatarUrl}
          backgroundUrl={backgroundUrl}
          bio={bio}
          createdAt={authorCreatedAt}
          currentUserId={currentUserId}
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
          className="text-neutral-500 dark:text-neutral-400 text-[11px] sm:text-xs shrink-0 ml-1"
          dateTime={createdAt}
        >
          {timeAgo(createdAt || "")}
        </time>
      </Link>
    </div>
  ),
};
