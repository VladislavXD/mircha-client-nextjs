import confetti from "canvas-confetti";
import { useFollow, useUnfollow } from "./useFollowMutations";
import { useIsFollowing } from "./useFollowQueries";
import { useProfile } from "../../profile";
import { useQueryClient } from "@tanstack/react-query";

// useFollowToggle.ts
export function useFollowToggle(userId: string) {
  const queryClient = useQueryClient();
  const { user: currentUser, isAuthenticated } = useProfile();
  
  const { data: followData } = useIsFollowing(userId, {
    enabled: !!userId && isAuthenticated && currentUser?.id !== userId,
  });

  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  const isFollowing = followData?.isFollowing || false;

  const handleFollow = async () => {
    if (!userId || !isAuthenticated || currentUser?.id === userId) return;

    if (isFollowing) {
      await unfollowMutation.mutateAsync(userId);
    } else {
      await followMutation.mutateAsync(userId);
      confetti({ particleCount: 100, spread: 70, origin: { x: 0.35, y: 0.8 } });
    }

    await queryClient.invalidateQueries({ queryKey: ["isFollowing", userId] });
    await queryClient.invalidateQueries({ queryKey: ["followStats", userId] });
  };

  return { handleFollow, isFollowing }
}