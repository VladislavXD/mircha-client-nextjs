import { useMutation } from "@tanstack/react-query";

import { TypeResetPasswordSchema } from "../schemes";
import { passwordRecoveryService } from "../services";

/**
 * Хук для выполнения мутации сброса пароля.
 */
export function useResetPasswordMutation() {
  const { mutateAsync: resetAsync, isPending: isLoadingReset } = useMutation({
    mutationKey: ["reset password"],
    mutationFn: ({
      values,
      recaptcha,
    }: {
      values: TypeResetPasswordSchema;
      recaptcha: string;
    }) => passwordRecoveryService.reset(values, recaptcha),
  });

  return { resetAsync, isLoadingReset };
}
