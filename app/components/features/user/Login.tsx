import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '@/app/components/ui/Input/Input'
import { Button, Link } from '@heroui/react'
import { useLazyCurrentQuery, useLoginMutation } from '@/src/services/user/user.service'
import { useRouter } from 'next/navigation'
import { hasErrorField } from '@/src/utils/hasErrorField'
import ErrorMessage from '@/app/components/ui/ErrorMessage'

type Login = {
    email: string;
    password: string;
}

type Props = {
    setSelected: (value: string)=> void;
}

const Login = ({setSelected}:Props) => {
    const {handleSubmit, control, formState: {errors}} = useForm<Login>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const [login, {isLoading}] = useLoginMutation();
    const router = useRouter()
    const [error, setError] = useState('');
    const [triggerCurrentCuery] = useLazyCurrentQuery();

    const onSubmit = async (data: Login) => {
        try{
            await login(data).unwrap()
            await triggerCurrentCuery().unwrap()
            router.push('/')
        }catch(err: unknown){
            if(hasErrorField(err)){
                setError(err.data.error)
            }
        }
    }


  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
        <Input
            control={control}
            name='email'
            label='Email'
            type='email'
            required='Обязательное поле'
        />  
        <Input
            control={control}
            name='password'
            label='Пароль'
            type='password'
            required='Обязательное поле'
        />  
        <ErrorMessage error={error}/>   

        <p className="text-center text-small">
            Нет аккаунта?{' '}
            <Link
                size='sm'
                className='cursor-pointer'
                onPress={()=> setSelected("sign-up")}
            >
                Зарегестриуйтесь
            </Link>
        </p>
        <div className="flex gap-2 justify-end">
            <Button fullWidth color='primary' type='submit' isLoading={isLoading}>
                Войти
            </Button>
        </div>

    </form>
  )
}

export default Login