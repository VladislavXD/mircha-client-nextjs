import React, { useState, useEffect } from "react";

import { useRecomededUsers } from "../../hooks/useRecomededUsers";

import { RecommendedUserCard } from "./RecommendedUserCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const RecommendedUsersBlock = () => {
  const { data, isLoading } = useRecomededUsers();
  const [users, setUsers] = useState<any[]>([]);

  // Инициализация при загрузке (максимум 15 юзеров)
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setUsers(data.slice(0, 15));
    }
  }, [data]);

  const handleRemove = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  if (isLoading) {
    return null; // Можно вернуть скелетон, если нужно, но по условию лучше просто скрыть пока грузится
  }

  // Если список пуст
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="py-4 md:py-5 mb-0 border-b border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] overflow-hidden">
      <div className="mb-3 px-4 sm:px-5">
        <h2 className="text-[17px] sm:text-[19px] font-bold text-neutral-900 dark:text-neutral-100">
          Возможно, вы знакомы
        </h2>
      </div>

      <Carousel
        className="w-full relative"
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="ml-0 pl-4 sm:pl-5">
          {users.map((user) => (
            <CarouselItem
              key={user.id}
              className="pl-0 pr-3 sm:pr-4 basis-auto w-[140px] max-w-[160px]"
            >
              <RecommendedUserCard user={user} onRemove={handleRemove} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
