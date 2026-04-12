import type { TypeSettingsSchema } from "../schemes";

import { useMutation } from "@tanstack/react-query";

import { userService } from "../services";

import { queryClient } from "@/lib/queryClient";

/**
 * Хук для выполнения мутации обновления профиля пользователя.
 */
export function useUpdateProfileMutation() {
  const { mutateAsync: updateAsync, isPending: isLoadingUpdate } = useMutation({
    mutationKey: ["update profile"],
    mutationFn: ({ values }: { values: TypeSettingsSchema | FormData }) =>
      userService.updateProfile(values),
    onSuccess() {
      // Инвалидируем кеш профиля, чтобы данные перезагрузились
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { updateAsync, isLoadingUpdate };
}
