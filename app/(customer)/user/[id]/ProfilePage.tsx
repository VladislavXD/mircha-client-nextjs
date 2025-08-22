"use client";
import {
  Button,
  Card,
  Image,
  Spinner,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";
import { resetUser, selectCurrent } from "@/src/store/user/user.slice";
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
  useUpdateAppearanceMutation,
} from "@/src/services/user/user.service";
import {
  useFollowUserMutation,
  useUnFollowUserMutation,
} from "@/src/services/user/follow.service";
import GoBack from "@/app/components/ui/GoBack";
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { formatToClientDate } from "../../../utils/formatToClientDate";
import confetti from "canvas-confetti";
import EditProfile from "@/app/components/ui/profile/EditProfile";
import { SendHorizontal } from "lucide-react";
import { ProfileBackground, ProfileFrames } from "./ProfileData";

// Типы пресетов
interface FramePreset {
  id: string;
  url: string;
  label: string;
}
interface BackgroundPreset {
  id: string;
  url: string;
  label: string;
  type: "video" | "image";
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useSelector(selectCurrent);
  const { data, refetch } = useGetUserByIdQuery(id ?? "");
  const [followUser, { isLoading }] = useFollowUserMutation();
  const [unfollowUser] = useUnFollowUserMutation();
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
  const [triggerCurrentQuery] = useLazyCurrentQuery();
  const [updateAppearance, { isLoading: isUpdating }] =
    useUpdateAppearanceMutation();

  const [appearanceType, setAppearanceType] = useState<
    "frame" | "background" | null
  >(null);
  const appearanceModal = useDisclosure();
  const confirmModal = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    url: string;
    type: "frame" | "background";
  } | null>(null);

  // Перенесено выше раннего return чтобы порядок хуков не менялся
  const FRAME_PRESETS = useMemo(
    () =>
      ProfileFrames.map((f) => ({
        id: String(f.id),
        url: f.url,
        label: f.name,
      })),
    []
  );
  const BACKGROUND_PRESETS = useMemo(
    () =>
      ProfileBackground.map((b) => ({
        id: String(b.id),
        url: b.url,
        label: b.name,
        type: "video" as const,
      })),
    []
  );

  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetUser());
    },
    [dispatch]
  );

  if (!data) return <Spinner className="flex h-full" />;

  const handleFollow = async () => {
    try {
      if (id) {
        if (data?.isFolow) {
          await unfollowUser(id).unwrap();
        } else {
          await followUser({ followingId: id }).unwrap();
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.35, y: 0.8 },
          });
        }
        await triggerGetUserByIdQuery(id);
        await triggerCurrentQuery();
      }
    } catch (err) {}
  };

  const openAppearance = (type: "frame" | "background") => {
    setAppearanceType(type);
    appearanceModal.onOpen();
  };

  const handleSelectAppearance = (item: {
    id: string;
    url: string;
    type: "frame" | "background";
  }) => {
    setSelectedItem(item);
    confirmModal.onOpen();
  };

  const handleConfirm = async () => {
    if (!selectedItem || !id) return;
    try {
      await updateAppearance({
        id,
        avatarFrameUrl:
          selectedItem.type === "frame" ? selectedItem.url : undefined,
        backgroundUrl:
          selectedItem.type === "background" ? selectedItem.url : undefined,
      }).unwrap();
      // Принудительно обновляем данные пользователя несколькими способами
      await Promise.all([
        refetch(), // Используем refetch из основного хука
        triggerGetUserByIdQuery(id, true), // Дополнительный запрос с принудительным обновлением
        triggerCurrentQuery() // Обновляем текущего пользователя
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      confirmModal.onClose();
      appearanceModal.onClose();
      setSelectedItem(null);
      setAppearanceType(null);
    }
  };

  const handleClose = async () => {
    try {
      if (id) {
        await triggerGetUserByIdQuery(id);
        await triggerCurrentQuery();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <GoBack />
      <div className="max-w-4xl mx-auto">
        {/* Верхняя секция с фоном */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl">
          {/* Фоновое видео */}
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
            
            {/* Кнопки управления профилем в правом верхнем углу */}
            {currentUser?.id === id && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  onClick={() => onOpen()} 
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
                      openAppearance(key as "frame" | "background")
                    }
                  >
                    <DropdownItem key="frame">Рамка аватара</DropdownItem>
                    <DropdownItem key="background">Фон профиля</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
          
          {/* Основная информация профиля */}
          <div className="relative bg-background/95 backdrop-blur-sm p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Аватар с рамкой */}
              <div className="relative shrink-0 mx-auto lg:mx-0">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 -mt-16 lg:-mt-20">
                  {data.avatarFrameUrl && (
                    <img
                      src={data.avatarFrameUrl}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <Image
                      isBlurred
                      src={data.avatarUrl || "/default-avatar.png"}
                      alt={data.name}
                      className={`w-full h-full object-cover rounded-2xl shadow-lg ${!data.avatarFrameUrl ? "border-4 border-white dark:border-gray-700" : ""}`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Информация пользователя */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <div className="relative inline-block mb-2">
                    {data.usernameFrameUrl && (
                      <div 
                        className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                        style={{
                          backgroundImage: `url(${data.usernameFrameUrl})`,
                          backgroundRepeat: 'repeat-x',
                          backgroundSize: 'auto 100%',
                          backgroundPosition: 'left center'
                        }}
                      />
                    )}
                    <h1 className="relative z-0 text-3xl lg:text-4xl font-bold px-2">
                      {data.name}
                    </h1>
                  </div>
                  <p className="text-default-500 text-lg">
                    @{data.email.split("@")[0]}
                  </p>
                </div>
                
                {/* Биография */}
                {data.bio && (
                  <p className="text-default-600 mb-4 max-w-2xl leading-relaxed">
                    {data.bio}
                  </p>
                )}
                
                {/* Дополнительная информация в горизонтальном расположении */}
                <div className="flex flex-wrap gap-4 text-sm text-default-500 mb-4 justify-center lg:justify-start">
                  {data.dateOfBirth && (
                    <div className="flex items-center gap-2">
                      <span>🎂</span>
                      <span>{formatToClientDate(data.dateOfBirth)}</span>
                    </div>
                  )}
                  {data.location && (
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{data.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Присоединился {formatToClientDate(data.createdAt)}</span>
                  </div>
                </div>
                
                {/* Статистика подписчиков */}
                <div className="flex gap-6 mb-4 justify-center lg:justify-start">
                  <Link href={`/following/${data.id}`} className="group">
                    <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                      <span className="font-bold text-lg">{data.following.length}</span>
                      <span className="text-default-500">Подписки</span>
                    </div>
                  </Link>
                  <Link href={`/followers/${data.id}`} className="group">
                    <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                      <span className="font-bold text-lg">{data.followers.length}</span>
                      <span className="text-default-500">Подписчики</span>
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* Кнопки действий */}
              {currentUser?.id !== id ? (
                <div className="flex flex-col gap-3 shrink-0">
                  <Button
                    color={data.isFolow ? "default" : "primary"}
                    variant={data.isFolow ? "flat" : "solid"}
                    isLoading={isLoading}
                    size="lg"
                    className="min-w-[140px] font-semibold"
                    onClick={handleFollow}
                    endContent={
                      data.isFolow ? (
                        <MdOutlinePersonAddDisabled />
                      ) : (
                        <MdOutlinePersonAddAlt1 />
                      )
                    }
                  >
                    {data.isFolow ? "Отписаться" : "Подписаться"}
                  </Button>

                  <Button
                    variant="flat"
                    size="lg"
                    className="min-w-[140px]"
                    endContent={<SendHorizontal size={16} />}
                  >
                    <Link href={`/chat/${data.id}`}>Сообщение</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        
        {/* Дополнительный контент профиля (посты, активность и т.д.) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Левая колонка - краткая информация */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">О пользователе</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-500">Подписчики:</span>
                  <span className="font-medium">{data.followers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-500">Подписки:</span>
                  <span className="font-medium">{data.following.length}</span>
                </div>
                {data.location && (
                  <div className="flex justify-between">
                    <span className="text-default-500">Локация:</span>
                    <span className="font-medium">{data.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-default-500">Регистрация:</span>
                  <span className="font-medium">{formatToClientDate(data.createdAt)}</span>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Правая колонка - основной контент */}
          <div className="md:col-span-2">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Активность</h3>
              <div className="text-center text-default-500 py-8">
                <p>Здесь будут отображаться посты и активность пользователя</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <EditProfile isOpen={isOpen} onClose={handleClose} user={data} />

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
                  ).map((item) => (
                    <div
                      key={item.id}
                      className="group relative border rounded-lg p-2 bg-background/40 hover:bg-background/60 transition cursor-pointer"
                    >
                      <div className="aspect-square relative flex items-center justify-center overflow-hidden rounded">
                        {appearanceType === "frame" ? (
                          <>
                            <img
                              src={item.url}
                              alt={item.label}
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                            />
                            <Image
                              src={data.avatarUrl || "/default-avatar.png"}
                              alt="preview"
                              className="w-2/3 h-2/3 object-cover rounded"
                            />
                          </>
                        ) : (item as BackgroundPreset).type === "video" ? (
                          <video
                            autoPlay
                            loop
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                          >
                            <source src={item.url} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.label}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
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
                  Закрыть
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
                  {selectedItem?.type === "frame" ? "рамку" : "оформление фона"}
                  ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  isLoading={isUpdating}
                  onClick={handleConfirm}
                >
                  Применить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserProfile;
