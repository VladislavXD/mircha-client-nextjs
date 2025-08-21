"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import ProfileInfo from "@/app/components/ui/profile/ProfileInfo";
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
      <div className="items-center gap-4 relative">
        <video
          key={data.backgroundUrl} // Добавляем key для принудительного пересоздания
          loop
          muted
          autoPlay
          id="myVideo"
          className="absolute rounded-2xl inset-0 w-full h-full object-cover z-0 brightness-[0.75]"
        >
          {data.backgroundUrl && (
            <source src={`${data.backgroundUrl}`} type="video/mp4" />
          )}
        </video>
        <div className="absolute inset-0 bg-black/20 z-0" aria-hidden="true" />

        <Card
          className={`space-y-4 p-5 relative z-10 backdrop-blur-xs ${data.backgroundUrl ? "bg-background/30" : ""}`}
        >
          <CardHeader>
            <div className="w-full flex justify-between flex-col xs:flex-row ">
              <div className="img mb-5 xs:mb-0">
                <div className="relative w-[200px] h-[200px]">
                  <img
                    src={data.avatarFrameUrl || ""}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none select-none z-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Image
                      isBlurred
                      src={data.avatarUrl || "/default-avatar.png"}
                      alt={data.name}
                      width={160}
                      height={160}
                      className={`w-full h-full object-cover rounded-xl shadow-sm ${!data.avatarFrameUrl ? "border-3 border-white" : ""}`}
                    />
                  </div>
                </div>
                <div className="pt-3 ps-0">
                  <div className="relative inline-block">
                    {/* Анимация рамки для никнейма поверх текста */}
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
                    <h4 className="relative flex-col mb-1 z-0 text-2xl font-bold gap-4 items-center px-2">
                      {data.name}
                    </h4>
                  </div>
                  <h5 className="text-small tracking-tight text-default-400">
                    @ {data.email.split("@")[0]}
                  </h5>
                </div>
              </div>

              {currentUser?.id !== id ? (
                <span className="flex flex-col gap-2">
                  <Button
                    color={data.isFolow ? "default" : "primary"}
                    variant="flat"
                    isLoading={isLoading}
                    disableRipple
                    className="relative  overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-background/30 after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
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
                    color={"default"}
                    variant="flat"
                    disableRipple
                    className="relative  overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-background/30 after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
                    endContent={
                      <SendHorizontal
                        className="dark:text-white text-black"
                        size={15}
                      />
                    }
                  >
                    <Link href={`/chat/${data.id}`}>Сообщение</Link>
                  </Button>
                </span>
              ) : (
                <div className="flex flex-col gap-2 items-start">
                  <Button onClick={() => onOpen()} endContent={<CiEdit />}>
                    Редактировать
                  </Button>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="flat" size="sm">
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
          </CardHeader>
          <CardBody className="gap-2">
            <p className="font-semibold text-sm max-w-[400px] w-full text-slate-200  ">
              {data.bio}
            </p>
            <ProfileInfo
              title="Дата Рождения: "
              info={formatToClientDate(data.dateOfBirth)}
            />
            <ProfileInfo title="Местоположение: " info={data.location} />
          </CardBody>

          <CardFooter>
            <div className="flex gap-5">
              <Link href={`/followers/${data.id}`} className="flex gap-1">
                <p className="font-semibold  text-small">
                  {data.followers.length}
                </p>
                <p className="text-default-400 text-small">Подписчики</p>
              </Link>
              <Link href={`/following/${data.id}`} className="flex gap-1">
                <p className="font-semibold text-small">
                  {data.following.length}
                </p>
                <p className=" text-default-400 text-small">Подписки</p>
              </Link>
            </div>
          </CardFooter>
        </Card>
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
