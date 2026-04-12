import { useMutation } from "@tanstack/react-query";

// import { toastMessageHandler } from '@/shared/utils'

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { TypeRegisterSchema } from "../schemes";
import { authService } from "../services";

/**
 * Хук для выполнения мутации регистрации пользователя.
 */
export function useRegisterMutation() {
  const router = useRouter();
  const { mutateAsync: registerAsync, isPending: isLoadingRegister } =
    useMutation({
      mutationKey: ["register user"],
      mutationFn: ({
        values,
        recaptcha,
      }: {
        values: TypeRegisterSchema;
        recaptcha: string;
      }) => authService.register(values, recaptcha),
      onSuccess(data: any) {},
      onError(error) {
        toast.error("Ошибка регистрации", {
          description: (error as Error).message,
        });
      },
    });

  return { registerAsync, isLoadingRegister };
}
