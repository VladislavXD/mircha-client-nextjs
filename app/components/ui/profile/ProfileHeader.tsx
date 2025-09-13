"use client";
import React from "react";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Image,
} from "@heroui/react";
import { CiEdit } from "react-icons/ci";
import defaultProfileBg from "@/public/images/default_profile_bg.png";
import ProfileInfo from "./ProfileInfo";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useParams } from "next/navigation";

interface ProfileHeaderProps {
  data: any;
  isOwner: boolean;
  onEditOpen: () => void;
  onOpenAppearance: (type: "frame" | "background") => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  data,
  isOwner,
  onEditOpen,
  onOpenAppearance,
}) => {
  const { id } = useParams<{ id: string }>();

  const {
    data: dataBio,
    currentUser,
    isFollowLoading,
    handleFollow,
  } = useUserProfile(id);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${data.backgroundUrl === "none" ? defaultProfileBg.src : ""})`,
        }}
        className={`relative rounded-2xl overflow-hidden mb-6 shadow-2xl`}
      >
        <div className="relative h-64 md:h-80">
          <video
            key={data.backgroundUrl}
            loop
            muted
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          >
            {data.backgroundUrl && (
              <source src={`${data.backgroundUrl}`} type="video/mp4" />
            )}
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {isOwner && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={onEditOpen}
                size="sm"
                variant="flat"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                endContent={<CiEdit />}
              >
                Редактировать
              </Button>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                  >
                    Оформление
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Appearance actions"
                  onAction={(key) =>
                    onOpenAppearance(key as "frame" | "background")
                  }
                >
                  <DropdownItem key="frame">Рамка аватара</DropdownItem>
                  <DropdownItem key="background">Фон профиля</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>

        <div className="relative bg-background/95 backdrop-blur-sm p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="relative shrink-0 mx-auto lg:mx-0">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 -mt-16  lg:-mt-20">
                <div className="absolute inset-0 flex items-center justify-center p-3 overflow-hidden">
                  <Image
                    isBlurred
                    src={data.avatarUrl || "/default-avatar.png"}
                    alt={data.name}
                    className={`w-full h-full object-cover rounded-2xl  shadow-lg ${
                      !data.avatarFrameUrl
                        ? "border-4 border-white dark:border-gray-700"
                        : ""
                    }`}
                    style={{
                      width: "150px",
                      maxHeight: "130px",
                    }}
                  />
                  
                  {data.avatarFrameUrl !== "none" ? (
                    <img
                      src={data.avatarFrameUrl}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full   pointer-events-none select-none z-100"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            

            {/* Slot для остальной информации */}
            <div className="flex-1">
              <ProfileInfo
                data={dataBio}
                isOwner={currentUser?.id === id}
                isFollowLoading={isFollowLoading}
                onFollow={handleFollow}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
