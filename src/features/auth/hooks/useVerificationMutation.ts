import { useMutation } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

import { verificationService } from "../services";

/**
 * Хук для выполнения мутации подтверждения электронной почты.
 */
export function useVerificationMutation() {
  const router = useRouter();
  const pathname = usePathname();
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];

  const { mutate: verification, mutateAsync: verificationAsync } = useMutation({
    mutationKey: ["new verification"],
    mutationFn: (token: string | null) =>
      verificationService.newVerification(token),
    onSuccess() {
      toast.success("Почта успешно подтверждена");
      const prefix = locale ? `/${locale}` : "";

      router.push(`${prefix}/dashboard/settings`);
    },
    onError(error) {
      toast.error("Ошибка подтверждения почты");
      const prefix = locale ? `/${locale}` : "";

      router.push(`${prefix}/auth`);
    },
  });

  return { verification, verificationAsync };
}
