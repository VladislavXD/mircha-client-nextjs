"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { z } from "zod";
import { Shield, Key, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useUpdateProfileMutation } from "../hooks";

import { ChangePasswordModal } from "./ChangePasswordModal";

import { useProfile } from "@/src/features/profile/hooks";

const securitySchema = z.object({
  isTwoFactorEnabled: z.boolean(),
});

type SecurityFormData = z.infer<typeof securitySchema>;

export function SecuritySettings() {
  const { user, isLoading } = useProfile();
  const { updateAsync, isLoadingUpdate } = useUpdateProfileMutation();
  const t = useTranslations("Settings.security");
  const tToasts = useTranslations("Toasts");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const form = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    values: {
      isTwoFactorEnabled: (user as any)?.isTwoFactorEnabled ?? false,
    },
  });

  const onSubmit = (values: SecurityFormData) => {
    toast.promise(updateAsync({ values }), {
      loading: tToasts("sending"),
      success: {
        message: tToasts("securityUpdateSuccess"),
        description: tToasts("securityUpdateDesc"),
      },
      error: tToasts("securityUpdateError"),
    });
  };

  if (isLoading) {
    return (
      <Card className="rounded-none shadow-none md:rounded-xl md:shadow-medium">
        <CardBody className="p-4 sm:p-6">
          <div className="py-8 text-center text-default-500">
            {t("loading")}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-none shadow-none md:rounded-xl md:shadow-medium">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">{t("title")}</h2>
            <p className="text-small text-default-500">{t("description")}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Смена пароля */}
          <div className="flex items-start justify-between gap-4 p-4 border border-default-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-default-500 mt-1" />
              <div>
                <h3 className="text-medium font-semibold">{t("password")}</h3>
                <p className="text-small text-default-500 mt-1">
                  {t("passwordDesc")}
                </p>
              </div>
            </div>
            <Button color="primary" size="sm" variant="flat" onPress={onOpen}>
              {t("changePassword")}
            </Button>
          </div>

          <Divider />

          {/* Двухфакторная аутентификация */}
          <div className="flex items-start justify-between gap-4 p-4 border border-default-200 rounded-lg">
            <div className="flex items-start gap-3 flex-1">
              <Smartphone className="w-5 h-5 text-default-500 mt-1" />
              <div className="flex-1">
                <h3 className="text-medium font-semibold">{t("twoFactor")}</h3>
                <p className="text-small text-default-500 mt-1">
                  {t("twoFactorDesc")}
                </p>
              </div>
            </div>
            <Controller
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <Switch
                  isDisabled={isLoadingUpdate}
                  isSelected={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>

          <Divider />

          {/* Активные сессии */}
          <div className="p-4 border border-default-200 rounded-lg">
            <h3 className="text-medium font-semibold mb-3">Активные сессии</h3>
            <p className="text-small text-default-500 mb-4">
              Здесь будут отображаться ваши активные сеансы на разных
              устройствах
            </p>
            <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
              <div>
                <p className="text-small font-medium">Текущее устройство</p>
                <p className="text-tiny text-default-400">
                  {typeof window !== "undefined"
                    ? navigator.userAgent.substring(0, 50) + "..."
                    : "Browser"}
                </p>
              </div>
              <span className="text-tiny text-success">Активна</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              color="primary"
              isDisabled={isLoadingUpdate}
              isLoading={isLoadingUpdate}
              type="submit"
            >
              {t("saveChanges")}
            </Button>
          </div>
        </form>

        {/* Модалка смены пароля */}
        <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
      </CardBody>
    </Card>
  );
}
