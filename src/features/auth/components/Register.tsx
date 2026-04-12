import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "next-themes";
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

const Register = ({ setSelected }: Props) => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const { theme } = useTheme();
  const t = useTranslations("Auth.register");

  const {
    handleSubmit,
    control,
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

  const onSubmit = async (values: TypeRegisterSchema) => {
    if (recaptchaValue) {
      toast.promise(registerAsync({ values, recaptcha: recaptchaValue }), {
        loading: t("verifying"),
        success: {
          message: t("success"),
          description: t("registerDescription"),
        },
        error: t("error"),
      });

      control._resetDefaultValues();
    } else {
      toast.error("Пожалуйста, завершите проверку reCAPTCHA");
    }
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
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        theme={theme === "dark" ? "dark" : "light"}
        onChange={setRecaptchaValue}
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
