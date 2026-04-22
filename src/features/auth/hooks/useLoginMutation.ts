import type { Dispatch, SetStateAction } from "react";
import type { TypeLoginSchema } from "../schemes";

import { useMutation } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";

// import { toast } from 'sonner'

// import { toastMessageHandler } from '@/shared/utils'

import { toast } from "sonner";

import { authService } from "../services";

/**
 * Хук для выполнения мутации входа пользователя.
 */
export function useLoginMutation(
  setIsShowFactor: Dispatch<SetStateAction<boolean>>,
) {
  const router = useRouter();
  const pathname = usePathname();
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];

  const { mutateAsync: loginAsync, isPending: isLoadingLogin } = useMutation({
    mutationKey: ["login user"],
    mutationFn: ({
      values,
      recaptcha,
    }: {
      values: TypeLoginSchema;
      recaptcha: string;
    }) => authService.login(values, recaptcha),
    onSuccess(data: any) {
      if (data.message) {
        // toastMessageHandler(data)
        setIsShowFactor(true);
      } else {
        const prefix = locale ? `/${locale}` : "";

        router.push(`${prefix}/user/${data.user.id}`);
        // router.replace(`${prefix}/dashboard/settings`)
        // window.location.href = `${prefix}/dashboard/settings`
        // router.refresh()
        // window.location.reload()
        // toastMessageHandler({
        // 	type: 'success',
        // 	text: 'Успешный вход'
        //
      }
    },

    onError(error) {
      toast.error("Ошибка входа в систему", {
        description: (error as Error).message,
      });
    },
  });

  return { loginAsync, isLoadingLogin };
}
