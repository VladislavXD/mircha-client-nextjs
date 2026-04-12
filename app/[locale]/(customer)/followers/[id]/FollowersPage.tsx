"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Users, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import User from "@/shared/components/ui/User";
import GoBack from "@/shared/components/ui/GoBack";
import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { useFollowers, isFollowsStructure } from "@/src/features/follow";

const Followers = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<any>(["profile"]);

  const { data, isLoading, error } = useFollowers(id ?? "", 1, 100);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-neutral-500" size={32} />
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center py-8 text-neutral-500">
        Ошибка загрузки данных
      </div>
    );
  if (!data?.followers || !Array.isArray(data.followers))
    return (
      <div className="text-center py-8 text-neutral-500">
        Список подписчиков недоступен
      </div>
    );

  const isMe = currentUser?.id === id;

  return (
    <div className="flex flex-col gap-4">
      <GoBack />

      {data.followers.length > 0 ? (
        <div className="bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.5rem] overflow-hidden">
          {data.followers
            .map((item, index) => {
              const user = isFollowsStructure(item) ? item.follower : item;
              const itemId = isFollowsStructure(item) ? item.id : user.id;

              if (!user?.id) return null;

              return (
                <Link
                  key={itemId}
                  className={`block transition-colors hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] p-4 ${
                    index !== data.followers.length - 1
                      ? "border-b border-neutral-200 dark:border-neutral-800/70"
                      : ""
                  }`}
                  href={`/profile/${user.id}`}
                >
                  <User
                    avatarFrameUrl={user.avatarFrameUrl}
                    avatarUrl={user.avatarUrl ?? ""}
                    backgroundUrl={user.backgroundUrl}
                    bio={user.bio}
                    description={
                      user.username ? `@${user.username}` : (user.email ?? "")
                    }
                    name={user.name ?? ""}
                    usernameFrameUrl={user.usernameFrameUrl}
                  />
                </Link>
              );
            })
            .filter(Boolean)}
        </div>
      ) : (
        <Empty>
          <EmptyIcon icon={Users} />
          <EmptyTitle>
            {isMe ? "У вас нет подписчиков" : "У пользователя нет подписчиков"}
          </EmptyTitle>
          <EmptyDescription>
            {isMe
              ? "Пишите интересные посты и оставляйте комментарии, чтобы люди начали подписываться на вас."
              : "Будьте первым, кто подпишется на обновления этого пользователя!"}
          </EmptyDescription>
        </Empty>
      )}
    </div>
  );
};

export default Followers;
