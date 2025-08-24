import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrent, resetUser } from '@/src/store/user/user.slice';
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
  useUpdateAppearanceMutation,
} from '@/src/services/user/user.service';
import {
  useFollowUserMutation,
  useUnFollowUserMutation,
} from '@/src/services/user/follow.service';
import confetti from 'canvas-confetti';
import { useDisclosure } from '@heroui/react';
import { ProfileBackground, ProfileFrames } from '@/app/(customer)/user/[id]/ProfileData';

export type AppearanceType = 'frame' | 'background' | null;

export interface SelectedAppearanceItem {
  id: string;
  url: string;
  type: 'frame' | 'background';
}

type BackgroundPreset = { id: string; url: string; label: string; type: 'video' | 'image' | 'none' };

export const useUserProfile = (id?: string) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrent);

  const { data, refetch } = useGetUserByIdQuery(id ?? '', { skip: !id });
  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation();
  const [unfollowUser] = useUnFollowUserMutation();
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
  const [triggerCurrentQuery] = useLazyCurrentQuery();
  const [updateAppearance, { isLoading: isUpdating }] = useUpdateAppearanceMutation();

  const [appearanceType, setAppearanceType] = useState<AppearanceType>(null);
  const appearanceModal = useDisclosure();
  const confirmModal = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<SelectedAppearanceItem | null>(null);

  const FRAME_PRESETS = useMemo(
    () =>
      ProfileFrames.map((f) => ({
        id: String(f.id),
        url: f.url,
        label: f.name,
      })),
    []
  );

  const BACKGROUND_PRESETS: BackgroundPreset[] = useMemo(
    () =>
      ProfileBackground.map((b) => ({
        id: String(b.id),
        url: b.url,
        label: b.name,
        type: (b as any).type ?? 'video',
      })),
    []
  );

  useEffect(
    () => () => {
      dispatch(resetUser());
    },
    [dispatch]
  );

  const handleFollow = async () => {
    if (!id) return;
    try {
      if (data?.isFolow) {
        await unfollowUser(id).unwrap();
      } else {
        await followUser({ followingId: id }).unwrap();
        confetti({ particleCount: 100, spread: 70, origin: { x: 0.35, y: 0.8 } });
      }
      await triggerGetUserByIdQuery(id);
      await triggerCurrentQuery();
    } catch (err) {
      // no-op
    }
  };

  const openAppearance = (type: 'frame' | 'background') => {
    setAppearanceType(type);
    appearanceModal.onOpen();
  };

  const handleSelectAppearance = (item: SelectedAppearanceItem) => {
    setSelectedItem(item);
    confirmModal.onOpen();
  };

  const handleConfirmAppearance = async () => {
    if (!selectedItem || !id) return;
    try {
      await updateAppearance({
        id,
        avatarFrameUrl: selectedItem.type === 'frame' ? selectedItem.url : undefined,
        backgroundUrl: selectedItem.type === 'background' ? selectedItem.url : undefined,
      }).unwrap();

      await Promise.all([
        refetch(),
        triggerGetUserByIdQuery(id, true),
        triggerCurrentQuery(),
      ]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      confirmModal.onClose();
      appearanceModal.onClose();
      setSelectedItem(null);
      setAppearanceType(null);
    }
  };

  const refreshUserAfterEdit = async () => {
    if (!id) return;
    try {
      await triggerGetUserByIdQuery(id);
      await triggerCurrentQuery();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return {
    // data
    data,
    currentUser,

    // loading flags
    isFollowLoading,
    isUpdating,

    // appearance state
    appearanceType,
    setAppearanceType,
    appearanceModal,
    confirmModal,
    selectedItem,
    setSelectedItem,

    // presets
    FRAME_PRESETS,
    BACKGROUND_PRESETS,

    // actions
    handleFollow,
    openAppearance,
    handleSelectAppearance,
    handleConfirmAppearance,
    refreshUserAfterEdit,
  };
};
