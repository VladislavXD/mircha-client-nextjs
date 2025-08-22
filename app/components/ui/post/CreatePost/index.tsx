import React, { useState, useEffect, useRef } from 'react'

import { Controller, useForm } from 'react-hook-form';
import { Button, Textarea } from '@heroui/react';
import ErrorMessage from '../../ErrorMessage';
import { IoMdCreate } from 'react-icons/io';
import { useCreatePostMutation, useLazyGetAllPostsQuery } from '@/src/services/post/post.service';
import ImageUpload from '../ImageUpload';
import EmojiPicker from '../EmojiPicker';
import { EmojiText } from '../../EmojiText';
import { createImagePreview, revokeImagePreview, createPostFormData } from '../ImageUpload/utils';

type Props = {}

const CreatePost = (props: Props) => {
    const [createPost, {isLoading}] = useCreatePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostsQuery();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        watch
    } = useForm();

    const currentText = watch('post', '');
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

    const handleEmojiSelect = (emojiUrl: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPosition = textarea.selectionStart || 0;
        const textBefore = currentText.substring(0, cursorPosition);
        const textAfter = currentText.substring(cursorPosition);
        
        // Создаем маркер для emoji с индексом
        const emojiIndex = selectedEmojis.length;
        const emojiMarker = `[emoji:${emojiIndex}]`;
        const newText = textBefore + emojiMarker + textAfter;
        
        // Обновляем текст и список emoji
        setValue('post', newText);
        setSelectedEmojis(prev => [...prev, emojiUrl]);

        // Восстанавливаем курсор после маркера
        setTimeout(() => {
            const newCursorPosition = cursorPosition + emojiMarker.length;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
            textarea.focus();
        }, 0);
    };

    const removeEmoji = (indexToRemove: number) => {
        // Удаляем emoji из списка и обновляем маркеры в тексте
        const newEmojis = selectedEmojis.filter((_, index) => index !== indexToRemove);
        setSelectedEmojis(newEmojis);
        
        // Обновляем текст, перенумеровывая маркеры
        let updatedText = currentText;
        
        // Сначала удаляем маркер удаленного emoji
        const markerToRemove = `[emoji:${indexToRemove}]`;
        updatedText = updatedText.replace(markerToRemove, '');
        
        // Затем перенумеровываем все маркеры после удаленного
        for (let i = indexToRemove + 1; i < selectedEmojis.length; i++) {
            const oldMarker = `[emoji:${i}]`;
            const newMarker = `[emoji:${i - 1}]`;
            updatedText = updatedText.replace(oldMarker, newMarker);
        }
        
        setValue('post', updatedText);
    };

    const createPostFormDataWithEmojis = (content: string, image?: File) => {
        const formData = new FormData();
        formData.append('content', content);
        
        if (image) {
            formData.append('image', image);
        }
        
        if (selectedEmojis.length > 0) {
            formData.append('emojiUrls', JSON.stringify(selectedEmojis));
        }
        
        return formData;
    };

    const onSubmit = handleSubmit(async (data)=> {
        try{    
            const formData = createPostFormDataWithEmojis(data.post, selectedImage || undefined);
            await createPost(formData).unwrap();
            
            // Очистка формы
            setValue('post', '');
            setSelectedImage(null);
            setSelectedEmojis([]);
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
                        ref={textareaRef}
                        labelPlacement='outside'
                        placeholder='О чем думаете?'
                        className='mb-5'
                    />

                )}
            />
            
            <div className="mb-5 flex gap-3">
                <ImageUpload
                    onImageSelect={handleImageSelect}
                    preview={imagePreview}
                    disabled={isLoading}
                />
                <EmojiPicker
                    onEmojiSelect={handleEmojiSelect}
                    disabled={isLoading}
                />
            </div>

            {(selectedEmojis.length > 0 || currentText) && (
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-default-50 to-default-100 border border-default-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium text-default-600">Превью поста</span>
                    </div>
                    <div className="bg-background/70 backdrop-blur-sm rounded-lg p-3 border border-default-200/50">
                        <EmojiText 
                            text={currentText || 'Начните писать...'}
                            emojiUrls={selectedEmojis} 
                            className="text-default-700 leading-relaxed"
                        />
                        {currentText === '' && (
                            <div className="text-default-400 italic">Ваш пост будет отображаться здесь</div>
                        )}
                    </div>
                </div>
            )}

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