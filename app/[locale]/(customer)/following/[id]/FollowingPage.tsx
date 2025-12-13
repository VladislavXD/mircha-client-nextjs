"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@heroui/react";
import User from "@/shared/components/ui/User";
import GoBack from "@/shared/components/ui/GoBack";
import { useFollowing, isFollowsStructure } from "@/src/features/follow";

const Following = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useFollowing(id ?? "", 1, 100);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;
  if (!data?.following) return <div>Данные не найдены</div>;
  if (!Array.isArray(data.following))
    return <div>Список подписок недоступен</div>;

  return data.following.length > 0 ? (
    <div className="gap-5 flex flex-col">
      <GoBack />
      {
        data.following
          .map((item) => {
            // Бэкенд может возвращать данные в двух форматах:
            // 1. Полная структура Follows: { id, follower: User, following: User }
            // 2. Упрощенная структура: просто User
            
            // Определяем, какой формат пришел и извлекаем пользователя
            const user = isFollowsStructure(item) ? item.following : item;
            const itemId = isFollowsStructure(item) ? item.id : item.id;
            
            // Проверяем, что у нас есть все необходимые данные
            if (!user?.id) {
              console.warn("Invalid following data:", item);
              return null;
            }

            return (
              <Link href={`/user/${user.id}`} key={itemId}>
                <Card>
                  <CardBody className="block">
                    <User
                      name={user.name ?? ""}
                      avatarUrl={user.avatarUrl ?? ""}
                      description={user.username ? `@${user.username}` : user.email ?? ""}
                      bio={user.bio}
                      usernameFrameUrl={user.usernameFrameUrl}
                      avatarFrameUrl={user.avatarFrameUrl}
                      backgroundUrl={user.backgroundUrl}
                    />
                  </CardBody>
                </Card>
              </Link>
            );
          })
          .filter(Boolean) /* Убираем null элементы */
      }
    </div>
  ) : (
    <h2>Подписки отсутствуют</h2>
  );
};

export default Following;
