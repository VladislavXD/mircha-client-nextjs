import React, { useState, useEffect } from 'react'

import { Controller, useForm } from 'react-hook-form';
import { Button, Textarea } from '@heroui/react';
import ErrorMessage from '../../ErrorMessage';
import { IoMdCreate } from 'react-icons/io';
import { useCreatePostMutation, useLazyGetAllPostsQuery } from '@/src/services/post/post.service';
import ImageUpload from '../ImageUpload';
import { createImagePreview, revokeImagePreview, createPostFormData } from '../ImageUpload/utils';

type Props = {}

const CreatePost = (props: Props) => {
    const [createPost, {isLoading}] = useCreatePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostsQuery();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue
    } = useForm();

    const error = errors?.post?.message as string

    // Очистка URL предпросмотра при размонтировании компонента
    useEffect(() => {
        return () => {
            if (imagePreview) {
                revokeImagePreview(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageSelect = (file: File | null) => {
        // Очистка предыдущего предпросмотра
        if (imagePreview) {
            revokeImagePreview(imagePreview);
            setImagePreview(null);
        }

        setSelectedImage(file);
        
        if (file) {
            const preview = createImagePreview(file);
            setImagePreview(preview);
        }
    };

    const onSubmit = handleSubmit(async (data)=> {
        try{    
            const formData = createPostFormData(data.post, selectedImage || undefined);
            await createPost(formData).unwrap();
            
            // Очистка формы
            setValue('post', '');
            setSelectedImage(null);
            if (imagePreview) {
                revokeImagePreview(imagePreview);
                setImagePreview(null);
            }
            
            await triggerAllPosts().unwrap()
        }catch(err){
            console.log(err);
        }
    })

    return (
        <form className='flex-grow' onSubmit={onSubmit}>
            <Controller
                name='post'
                control={control}
                defaultValue=''
                render={({field})=> (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='О чем думаете?'
                        className='mb-5'
                    />

                )}
            />
            
            <div className="mb-5">
                <ImageUpload
                    onImageSelect={handleImageSelect}
                    preview={imagePreview}
                    disabled={isLoading}
                />
            </div>

            {error && <ErrorMessage error={error}/>}

            <Button 
                color='success'
                isLoading={isLoading}
                className=" flex-end relative  rounded-full hover:-translate-y-1 px-12 shadow-xl  after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
                endContent={<IoMdCreate/>}
                type='submit'
            >
                Добавить
            </Button>
        </form>
    )
}

export default CreatePost