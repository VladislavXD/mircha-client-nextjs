"use client";

import { Button } from "@heroui/react";
import confetti from "canvas-confetti";

import { useFollow, useUnfollow } from "../hooks/useFollowMutations";
import { useIsFollowing } from "../hooks/useFollowQueries";

import { useProfile } from "@/src/features/profile/hooks/useProfile";

interface FollowButtonProps {
  userId: string;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  followText?: string;
  unfollowText?: string;
}

/**
 * Кнопка подписки/отписки от пользователя.
 */
export function FollowButton({
  userId,
  variant = "solid",
  color = "primary",
  size = "md",
  className = "",
  followText = "Подписаться",
  unfollowText = "Отписаться",
}: FollowButtonProps) {
  const { user: currentUser, isAuthenticated } = useProfile();
  const { data: followData, isLoading: isCheckLoading } =
    useIsFollowing(userId);
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  const isFollowing = followData?.isFollowing || false;
  const isOwnProfile = currentUser?.id === userId;
  const isLoading =
    followMutation.isPending || unfollowMutation.isPending || isCheckLoading;

  const handleClick = async () => {
    if (!isAuthenticated || isOwnProfile) return;

    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(userId);
      } else {
        await followMutation.mutateAsync(userId);
        // Конфетти при подписке
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.6 },
        });
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
    }
  };

  // Не показываем кнопку для собственного профиля
  if (isOwnProfile || !isAuthenticated) {
    return null;
  }

  return (
    <Button
      className={className}
      color={isFollowing ? "default" : color}
      disabled={isLoading}
      isLoading={isLoading}
      size={size}
      variant={isFollowing ? "bordered" : variant}
      onPress={handleClick}
    >
      {isFollowing ? unfollowText : followText}
    </Button>
  );
}
