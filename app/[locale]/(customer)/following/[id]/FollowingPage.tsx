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
import { useFollowing, isFollowsStructure } from "@/src/features/follow";

const Following = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<any>(["profile"]);

  const { data, isLoading, error } = useFollowing(id ?? "", 1, 100);

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
  if (!data?.following || !Array.isArray(data.following))
    return (
      <div className="text-center py-8 text-neutral-500">
        Список подписок недоступен
      </div>
    );

  const isMe = currentUser?.id === id;

  return (
    <div className="flex flex-col gap-4">
      <GoBack />

      {data.following.length > 0 ? (
        <div className="bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.5rem] overflow-hidden">
          {data.following
            .map((item, index) => {
              const user = isFollowsStructure(item) ? item.following : item;
              const itemId = isFollowsStructure(item) ? item.id : user.id;

              if (!user?.id) return null;

              return (
                <Link
                  key={itemId}
                  className={`block transition-colors hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] p-4 ${
                    index !== data.following.length - 1
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
            {isMe ? "У вас нет подписок" : "У пользователя нет подписок"}
          </EmptyTitle>
          <EmptyDescription>
            {isMe
              ? "Вы еще ни на кого не подписались. Найдите интересных людей в поиске!"
              : "Этот пользователь еще ни за кем не следит."}
          </EmptyDescription>
        </Empty>
      )}
    </div>
  );
};

export default Following;
