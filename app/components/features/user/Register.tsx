import React, { useState } from "react"
import Input from "../../ui/Input/Input"
import { useForm } from "react-hook-form"
import { Button, Link } from "@heroui/react"

import { useRegisterMutation } from "@/src/services/user/user.service"
import { hasErrorField } from "@/src/utils/hasErrorField"
import ErrorMessage from "../../ui/ErrorMessage"

type Register = {
  email: string
  name: string
  password: string
}

type Props = {
  setSelected: (value: string) => void
}

const Register = ({ setSelected }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Register>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const onSubmit = async (data: Register) => {
    try {
        await register(data).unwrap()
        setSelected('login')
    } catch (err: unknown) {
        if(hasErrorField(err)){
            setError(err.data.error)
        }
    }
  }


  const [register, {isLoading}] = useRegisterMutation();
  const [error, setError] = useState('')

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        name="name"
        label="Имя"
        type="text"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="email"
        label="email"
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
        <ErrorMessage error={error}/>
      <p className="text-center text-small">
        Уже есть аккаунт?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
        >
          Войдите
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Зарегестрироваться
        </Button>
      </div>
    </form>
  )
}

export default Register
