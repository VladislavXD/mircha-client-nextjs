import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/app/components/ui/Input/Input";
import { addToast, Button, Link } from "@heroui/react";
import {
  useLazyCurrentQuery,
  useLoginMutation,
} from "@/src/services/user/user.service";
import { useRouter } from "next/navigation";
import { hasErrorField } from "@/src/utils/hasErrorField";
import ErrorMessage from "@/app/components/ui/ErrorMessage";
import { useReCaptcha } from "@/src/hooks/useReCapcha";

type Login = {
  email: string;
  password: string;
  recaptchaToken?: string;
};

type Props = {
  setSelected: (value: string) => void;
};

const Login = ({ setSelected }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Login>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      recaptchaToken: "",
    },
  });

  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const [error, setError] = useState("");
  const [triggerCurrentCuery] = useLazyCurrentQuery();
  const { verifyRecaptcha, isVerifying } = useReCaptcha();

  const onSubmit = async (data: Login) => {
    const recaptchaToken = await verifyRecaptcha("login");

    if (!recaptchaToken) {
      addToast({
        title: "Ошибка верификации",
        description:
          "Не удалось пройти проверку reCAPTCHA. Пожалуйста, попробуйте еще раз.",
        color: "danger",
      });
      return;
    }
    console.log({ ...data, recaptchaToken });
    try {
      await login({ ...data, recaptchaToken }).unwrap();
      await triggerCurrentCuery().unwrap();
      router.push("/");
    } catch (err: unknown) {
      if (hasErrorField(err)) {
        const errors = err.data.errors || [err.data.error];

        errors.forEach((errMsg: string, index: number) => {
          setTimeout(() => {
            addToast({
              title: "Ошибка регистрации",
              description: errMsg,
              color: "danger",
            });
          }, index * 1000);
        });
        setError(errors.join(", "));
      }
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="password"
        label="Пароль"
        type="password"
        required="Обязательное поле"
      />
      <ErrorMessage error={error} />

      <p className="text-center text-small">
        Нет аккаунта?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("sign-up")}
        >
          Зарегестриуйтесь
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button
          disabled={isVerifying}
          fullWidth
          color="primary"
          type="submit"
          isLoading={isLoading}
        >
          {isVerifying ? "Проверка..." : "Войти"}
        </Button>
      </div>
    </form>
  );
};

export default Login;
