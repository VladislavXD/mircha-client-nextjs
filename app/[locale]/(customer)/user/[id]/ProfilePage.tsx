"use client";
import React from "react";
import { useParams } from "next/navigation";
import GoBack from "@/shared/components/ui/GoBack";
import { 
  ProfileHeader, 
  ProfileAboutCard, 
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
      <div className="max-w-4xl mx-auto">
        {/* ✅ Передаём флаги для скрытия кнопок редактирования */}
        <ProfileHeader 
          userId={id} 
          isAuthenticated={isAuthenticated}
          isOwnProfile={isOwnProfile}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <ProfileAboutCard data={user} />
          </div>
          <div className="md:col-span-2">
            <ProfileActivityCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
