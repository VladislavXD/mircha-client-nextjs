import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@/shared/components/ui/Input/Input";
import { addToast, Button, InputOtp, Link } from "@heroui/react";
import ErrorMessage from "@/shared/components/ui/ErrorMessage";

import { useLogin } from "@/src/hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, TypeLoginSchema } from "../schemes";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "next-themes";
import { useLoginMutation } from "../hooks";
import { AuthSocial } from "./AuthSocial";
import { useTranslations } from "next-intl";

const ReCAPTCHAComponent = ReCAPTCHA as any;

type Login = {
  email: string;
  password: string;
  code?: string;
};

type Props = {
  setSelected: (value: string) => void;
  setIsShowFactor: React.Dispatch<React.SetStateAction<boolean>>;
  isShowTwoFactor: boolean;
};

const Login = ({ setSelected, setIsShowFactor, isShowTwoFactor }: Props) => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const t = useTranslations('Auth.login');
  const { theme } = useTheme();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Login>({
    resolver: isShowTwoFactor ? undefined : zodResolver(LoginSchema), // Отключаем валидацию на экране 2FA
    mode: "onSubmit",
    shouldUnregister: false, // Сохраняем значения полей при размонтировании
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const [error, setError] = useState("");


  // React Query mutation для логина

  const { login, isLoadingLogin } = useLoginMutation(setIsShowFactor);
  const onSubmit = async (values: TypeLoginSchema) => {
    
    // Для 2FA проверяем код
    if (isShowTwoFactor) {
      if (!values.code || values.code.length !== 6) {
        addToast({
          title: t('enterCode'),
          color: "danger",
        });
        return;
      }
      // Отправляем email, password и code
      login({ values, recaptcha: recaptchaValue || "" });
      return;
    }
    
    // Для обычного логина проверяем recaptcha
    if (recaptchaValue) {
      login({ values, recaptcha: recaptchaValue });
    } else {
      addToast({
        title: "Пожалуйста, завершите проверку reCAPTCHA",
        color: "danger",
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className={`flex flex-col items-center gap-2 ${!isShowTwoFactor ? 'hidden' : ''}`}>
        <p className="text-small text-default-500">{t('twoFactorDesc')}</p>
        <Controller
          control={control}
          name="code"
          render={({ field }) => {
            console.log("InputOtp field value:", field.value);
            return (
              <InputOtp
                length={6}
                placeholder='123456'
                disabled={isLoadingLogin}
                errorMessage={errors.code?.message}
                isInvalid={!!errors.code}
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
            );
          }}
        />
      </div>
      <div className={`flex flex-col gap-4 ${isShowTwoFactor ? 'hidden' : ''}`}>
        <Input
          control={control}
          name="email"
          label={t('email')}
          type="email"
          required="Обязательное поле"
        />
        <Input
          control={control}
          name="password"
          label={t('password')}
          type="password"
          required="Обязательное поле"
        />
        <div className="flex items-center justify-between">
          <Link
            href="/auth/reset-password"
            className="ml-auto inline-block text-sm underline"
          >
            {t('forgotPassword')}
          </Link>
        </div>
        {/* @ts-ignore */}
        <ReCAPTCHA
          sitekey={process.env.RECAPTCHA_SITE_KEY as string}
          onChange={setRecaptchaValue}
          theme={theme === "dark" ? "dark" : "light"}
        />
        <ErrorMessage error={error} />
        <p className="text-center text-small">
          {t('noAccount')}{" "}
          <Link
            size="sm"
            className="cursor-pointer"
            onPress={() => setSelected("register")}
          >
            {t('register')}
          </Link>
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          disabled={isLoadingLogin}
          fullWidth
          color="primary"
          type="submit"
          isLoading={isLoadingLogin}
        >
          {t('submit')}
        </Button>
      </div>
    </form>
  );
};

export default Login;
