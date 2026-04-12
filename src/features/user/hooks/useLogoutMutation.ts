import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";

import { authService } from "../../auth/services";

/**
 * Хук для выполнения мутации выхода из системы.
 */
export function useLogoutMutation() {
  const router = useRouter();
  const pathname = usePathname();
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];
  const queryClient = useQueryClient();
  const { mutateAsync: logoutAsync, isPending: isLoadingLogout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => authService.logout(),
    onSuccess() {
      const prefix = locale ? `/${locale}` : "";

      queryClient.clear();
      router.push(`${prefix}/auth`);
    },
  });

  return { logoutAsync, isLoadingLogout };
}
