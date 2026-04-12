"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useVerificationMutation } from "../hooks";

import { AuthWrapper } from "./AuthWrapper";

import { Button } from "@/components/ui/button";

/**
 * Компонент для подтверждения электронной почты.
 */
export function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const t = useTranslations("Auth.verification");

  const { verificationAsync } = useVerificationMutation();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Токен подтверждения не найден");

      return;
    }

    const verifyEmail = async () => {
      try {
        await verificationAsync(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage((err as Error).message || "Ошибка подтверждения почты");
      }
    };

    verifyEmail();
  }, [token, verificationAsync]);

  return (
    <AuthWrapper
      description={status === "loading" ? t("description") : undefined}
      heading={t("title")}
    >
      <div className="flex flex-col items-center gap-4 py-6">
        {status === "loading" && (
          <>
            <div className="text-4xl animate-spin">⏳</div>
            <p className="text-sm text-gray-500">{t("description")}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl">✅</div>
            <p className="text-lg font-semibold text-green-600">{t("title")}</p>
            <Button asChild className="mt-2">
              <a href="/auth">{t("submit")}</a>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-6xl">❌</div>
            <p className="text-lg font-semibold text-red-600">{message}</p>
            <Button asChild className="mt-2">
              <a href="/auth">Вернуться к входу</a>
            </Button>
          </>
        )}
      </div>
    </AuthWrapper>
  );
}
