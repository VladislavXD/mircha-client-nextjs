"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle, FaYandex } from "react-icons/fa";
import { toast } from "sonner";

import { authService } from "../services";

import { Button } from "@/components/ui/button";

/**
 * Компонент для аутентификации через социальные сети.
 */
export function AuthSocial() {
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationKey: ["oauth by provider"],
    mutationFn: async (provider: "google" | "yandex" | "github") =>
      await authService.oauthByProvider(provider),
  });

  const onClick = async (provider: "google" | "yandex" | "github") => {
    if (provider === "github") {
      return toast.warning("Аутентификация через GitHub в разработке");
    }
    const response = await mutateAsync(provider);

    if (response) {
      router.push(response.url);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        {/* Row 1 - центр */}
        <div className="flex justify-center w-full">
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => onClick("google")}
          >
            <FaGoogle className="size-4" />
            Google
          </Button>
        </div>

        {/* Row 2 - треугольник */}
        <div className="flex justify-center gap-3 w-full">
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => onClick("yandex")}
          >
            <FaYandex className="size-4" />
            Яндекс
          </Button>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() => onClick("github")}
          >
            <FaGithub className="size-4" />
            GitHub
          </Button>
        </div>
      </div>
    </>
  );
}
