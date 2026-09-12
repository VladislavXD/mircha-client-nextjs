"use client";
import React from "react";
import { useParams } from "next/navigation";

import GoBack from "@/shared/components/ui/GoBack";
import {
  ProfileHeader,
  ProfileActivityCard,
  ProfileSkeleton,
  useUserProfile,
} from "@/src/features/profile";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isLoading,
    isAuthenticated,
    isOwnProfile,
  } = useUserProfile(id);

  if (isLoading) {
    return (
      <>
        <GoBack title={user?.name || "Назад"} />
        <ProfileSkeleton />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <GoBack title={"Назад"} />
        <div className="text-center py-8">
          <p className="text-default-500">Пользователь не найден</p>
        </div>
      </>
    );
  }

  return (
    <>
      <GoBack title={user?.name || "Назад"} />
      <div className="max-w-4xl mx-auto px-0 sm:px-4">
        {/* ProfileActivityCard теперь передаётся как children — это нужно,
            чтобы табы и лента постов жили в том же sticky-контейнере,
            что и фон (иначе фон "отклеится" сразу после блока с био) */}
        <ProfileHeader
          isAuthenticated={isAuthenticated}
          isOwnProfile={isOwnProfile}
          userId={id}
        >
          <ProfileActivityCard />
        </ProfileHeader>
      </div>
    </>
  );
};

export default UserProfile;