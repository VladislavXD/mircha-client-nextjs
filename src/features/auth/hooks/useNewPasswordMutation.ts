import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { TypeNewPasswordSchema } from "../schemes";
import { passwordRecoveryService } from "../services";

/**
 * Хук для выполнения мутации установки нового пароля.
 */
export function useNewPasswordMutation() {
  const searchParams = useSearchParams();

  const { mutateAsync: newPasswordAsync, isPending: isLoadingNew } =
    useMutation({
      mutationKey: ["new password"],
      mutationFn: ({
        values,
        recaptcha,
      }: {
        values: TypeNewPasswordSchema;
        recaptcha: string;
      }) =>
        passwordRecoveryService.new(
          values,
          searchParams?.get("token"),
          recaptcha,
        ),
    });

  return { newPasswordAsync, isLoadingNew };
}
