import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "@wrksz/themes/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { useRegisterMutation } from "../hooks";
import { RegisterSchema, TypeRegisterSchema } from "../schemes";
import ErrorMessage from "../../../../shared/components/ui/ErrorMessage";
import Input from "../../../../shared/components/ui/Input/Input";

import { Button } from "@/components/ui/button";

type Register = {
  email: string;
  name: string;
  password: string;
};

type Props = {
  setSelected: (value: string) => void;
};

const RecaptchaWithRef = ReCAPTCHA as React.ComponentType<
  React.ComponentProps<typeof ReCAPTCHA> & { ref?: React.RefObject<any> }
>;
type ReCAPTCHAInstance = {
  reset: () => void;
  execute: () => void;
  executeAsync: () => Promise<string | null>;
};

const Register = ({ setSelected }: Props) => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHAInstance>(null);
  const recaptchaTimerRef = useRef<NodeJS.Timeout | null>(null); // 👈 таймер

  const { resolvedTheme } = useTheme();
  const t = useTranslations("Auth.register");

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
  });

  const [error, setError] = useState("");

  // React Query mutation для регистрации
  const { registerAsync, isLoadingRegister } = useRegisterMutation();

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);

    if (recaptchaTimerRef.current) {
      clearTimeout(recaptchaTimerRef.current);
    }

    if (value) {
      recaptchaTimerRef.current = setTimeout(
        () => {
          recaptchaRef.current?.reset();
          setRecaptchaValue(null);
          toast.info("reCAPTCHA сброшена, пожалуйста, подтвердите снова");
        },
        110 * 1000,
      ); // 1:50 (чуть меньше 2 минут, чтобы успеть подтвердить повторно до истечения срока действия токена)
    }
  };

  // чистим таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (recaptchaTimerRef.current) {
        clearTimeout(recaptchaTimerRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: TypeRegisterSchema) => {
    if (!recaptchaValue) {
      toast.error("Пожалуйста, завершите проверку reCAPTCHA");
      return;
    }

    toast.promise(registerAsync({ values, recaptcha: recaptchaValue }).finally(()=> {
      recaptchaRef.current?.reset();
      setRecaptchaValue(null);
      reset();

    }), {
      loading: t("verifying"),
      success: {
        message: t("success"),
        description: t("registerDescription"),
      },
      error: t("error"),
    });

  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        label={t("name")}
        name="name"
        required="Обязательное поле"
        type="text"
      />
      <Input
        control={control}
        label={t("email")}
        name="email"
        required="Обязательное поле"
        type="email"
      />
      <Input
        control={control}
        label={t("password")}
        name="password"
        placeholder="******"
        required="Обязательное поле"
        type="password"
      />
      <Input
        control={control}
        label={t("confirmPassword")}
        name="passwordRepeat"
        placeholder="******"
        required="Обязательное поле"
        type="password"
      />
      <RecaptchaWithRef
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleRecaptchaChange}
      />
      <ErrorMessage error={error} />
      <p className="text-center text-sm">
        {t("hasAccount")}{" "}
        <button
          className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          type="button"
          onClick={() => setSelected("login")}
        >
          {t("login")}
        </button>
      </p>
      <div className="flex gap-2 justify-end">
        <Button className="w-full" disabled={isLoadingRegister} type="submit">
          {isLoadingRegister ? "Загрузка..." : t("submit")}
        </Button>
      </div>
    </form>
  );
};

export default Register;
