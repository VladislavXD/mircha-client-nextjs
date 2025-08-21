"use client"
import React from 'react'
import { useLazyGetPostByIdQuery } from '@/src/services/post/post.service';
import { Controller, useForm } from 'react-hook-form';
import { Button, Textarea } from '@heroui/react';
import ErrorMessage from '../../ErrorMessage';
import { IoMdCreate } from 'react-icons/io';
import { useRouter, useParams } from 'next/navigation';
import { useCreateCommentMutation } from '@/src/services/post/comments.service';

type Props = {}

const CreateComment = (props: Props) => {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [createComment, {isLoading}] = useCreateCommentMutation();
    const [getPostById] = useLazyGetPostByIdQuery();

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue
    } = useForm();

    const error = errors?.post?.message as string


    const onSubmit = handleSubmit(async (data)=> {
        try{    
            if (id){

                await createComment({content: data.comment, postId: id}).unwrap();
                setValue('comment', '');
                await getPostById(id).unwrap()
            }
        }catch(err){
            console.log(err);
        }
    })
  return (
    <form className='flex-grow' onSubmit={onSubmit}>
        <Controller
            name='comment'
            control={control}
            defaultValue=''
            rules={{
                required: 'Обязательное поле'
            }}
            render={({field})=> (
                <Textarea
                    {...field}
                    labelPlacement='outside'
                    placeholder='Напишите комментарий...'
                    className='mb-5'
                />

            )}
        />
        {error && <ErrorMessage error={error}/>}

        <Button 
            isLoading={isLoading}
            color='primary'
            className='flex-end'
            endContent={<IoMdCreate/>}
            type='submit'
        >
            Оставить комментарий
        </Button>
    </form>
  )
}

export default CreateComment