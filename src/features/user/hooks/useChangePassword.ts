"use client";
import { useMutation } from "@tanstack/react-query";

import { userService } from "../services";

/**
 * Хук для смены пароля пользователя
 */
export function useChangePassword() {
  const {
    mutateAsync: changePasswordAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userService.changePassword(data),
  });

  return {
    changePasswordAsync,
    isLoading,
    isSuccess,
    error,
  };
}
