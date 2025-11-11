"use client";
import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useParams } from "next/navigation";
import GoBack from "@/app/components/ui/GoBack";
import EditProfile from "@/app/components/ui/profile/EditProfile";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import ProfileHeader from "@/app/components/ui/profile/ProfileHeader";
import ProfileInfo from "@/app/components/ui/profile/ProfileInfo";
import ProfileAboutCard from "@/app/components/ui/profile/ProfileAboutCard";
import ProfileActivityCard from "@/app/components/ui/profile/ProfileActivityCard";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data,
    currentUser,
    isFollowLoading,
    isUpdating,
    appearanceType,
    appearanceModal,
    confirmModal,
    FRAME_PRESETS,
    BACKGROUND_PRESETS,
    handleFollow,
    openAppearance,
    handleSelectAppearance,
    handleConfirmAppearance,
    refreshUserAfterEdit,
  } = useUserProfile(id);

  const editModal = useDisclosure();

  if (!data) return null;

  return (
    <>
      <GoBack />
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          data={data}
          isOwner={currentUser?.id === id}
          onEditOpen={editModal.onOpen}
          onOpenAppearance={openAppearance}
        />


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <ProfileAboutCard data={data} />
          </div>
          <div className="md:col-span-2">
            <ProfileActivityCard />
          </div>
        </div>
      </div>

      {/* Модальные окна оформления */}
    <Modal
        isOpen={appearanceModal.isOpen}
        onClose={appearanceModal.onClose}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {appearanceType === "frame" ? "Выбор рамки" : "Выбор фона"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(appearanceType === "frame"
                    ? FRAME_PRESETS
                    : BACKGROUND_PRESETS
                  ).map((item: any) => (
                    <div
                      key={item.id}
                      className="group relative rounded-lg p-2 bg-background/40 hover:bg-background/60 transition cursor-pointer overflow-hidden"
                    >
                      <div className="aspect-square relative flex items-center justify-center overflow-hidden rounded">
                        {appearanceType === "frame" ? (
                          <>
                            <img
                              src={item.url}
                              alt={item.label}
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none "
                            />
                            <img
                              src={data.avatarUrl || "/default-avatar.png"}
                              alt="preview"
                              className="w-2/3 h-2/3 object-cover rounded pointer-events-none "         />
                          </>
                        ) : item.type === "video" ? (
                          <video
                            autoPlay
                            loop
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                          >
                            <source src={item.url} type="video/mp4" />
                          </video>
                        ) : item.type === "image" ? (
                          <img
                            src={item.url}
                            alt={item.label}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-default-100 flex items-center justify-center text-xs text-default-500">
                            Без фона
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs truncate max-w-[70%]">
                          {item.label}
                        </span>
                        <Button
                          size="sm"
                          variant="flat"
                          onClick={() =>
                            handleSelectAppearance({
                              id: item.id,
                              url: item.url,
                              type: appearanceType!,
                            })
                          }
                        >
                          Выбрать
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Закрыть.
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.onClose}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Подтверждение</ModalHeader>
              <ModalBody>
                <p>
                  Вы точно хотите применить выбранное{" "}
                  {appearanceType === "frame" ? "рамку" : "оформление фона"}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  isLoading={isUpdating}
                  onClick={handleConfirmAppearance}
                >
                  Применить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Модал редактора профиля */}
      <EditProfile
        isOpen={editModal.isOpen}
        onClose={async () => {
          await refreshUserAfterEdit();
          editModal.onClose();
        }}
        user={data}
      />
    </>
  );
};

export default UserProfile;
