"use client";
import React from "react";
import { useParams } from "next/navigation";
import GoBack from "@/shared/components/ui/GoBack";
import { 
  ProfileHeader, 
  ProfileActivityCard, 
  ProfileSkeleton,
  useUserProfile 
} from "@/src/features/profile";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();

  // ✅ Используем useUserProfile вместо getProfileById
  const { 
    data: user, 
    isLoading, 
    isAuthenticated, // Флаг для скрытия кнопок редактирования
    isOwnProfile      // Свой профиль или чужой
  } = useUserProfile(id);

  if (isLoading) {
    return (
      <>
        <GoBack />
        <ProfileSkeleton />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <GoBack />
        <div className="text-center py-8">
          <p className="text-default-500">Пользователь не найден</p>
        </div>
      </>
    );
  }

  return (
    <>
      <GoBack />
      <div className="max-w-4xl mx-auto px-0 sm:px-4">
        {/* ✅ Передаём флаги для скрытия кнопок редактирования */}
        <ProfileHeader 
          userId={id} 
          isAuthenticated={isAuthenticated}
          isOwnProfile={isOwnProfile}
        />

        <div className="mt-4 sm:mt-6 px-3 sm:px-0">
          <ProfileActivityCard />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
