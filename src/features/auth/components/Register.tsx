import React, { useState } from "react";
import Input from "../../../../shared/components/ui/Input/Input";
import { useForm } from "react-hook-form";
import { addToast, Button, Link } from "@heroui/react";
import ErrorMessage from "../../../../shared/components/ui/ErrorMessage";

import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "next-themes";
import { useRegisterMutation } from "../hooks";
import { RegisterSchema, TypeRegisterSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

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
  const t = useTranslations('Auth.register');

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: '',
			email: '',
			password: '',
			passwordRepeat: ''
    },
  });

  const [error, setError] = useState("");

  // React Query mutation для регистрации
  const {register, isLoadingRegister} = useRegisterMutation()

  const onSubmit = async (values: TypeRegisterSchema) => {
    if(recaptchaValue){
      register({values, recaptcha: recaptchaValue})
      control._resetDefaultValues()
    }else{
      addToast({
        title: "Пожалуйста, завершите проверку reCAPTCHA",
        color: "danger",
      })
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        name="name"
        label={t('name')}
        type="text"
        required="Обязательное поле"
      />
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
        placeholder="******"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="passwordRepeat"
        label={t('confirmPassword')}
        placeholder="******"
        type="password"
        required="Обязательное поле"
      />
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        onChange={setRecaptchaValue}
        theme={theme === "dark" ? "dark" : "light"}
      />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        {t('hasAccount')}{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
        >
          {t('login')}
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button
          fullWidth
          disabled={isLoadingRegister}
          color="primary"
          type="submit"
          isLoading={isLoadingRegister}
        >
          {t('submit')}
        </Button>
      </div>
    </form>
  );
};

export default Register;
