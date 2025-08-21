"use client"
import React, { useState } from 'react'
import {Button, CardBody, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Card as NextCard, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Image} from '@heroui/react'
import { unLikePost, useLikePostMutation, useUnLikePostMutation } from '@/src/services/post/likes.service';
import { deletePost, useDeletePostMutation, useGetViewsQuery, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery, useLazyGetViewsQuery } from '@/src/services/post/post.service';

import { useDeleteCommentMutation } from '@/src/services/post/comments.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, UseSelector } from 'react-redux';
import { selectCurrent } from '@/src/store/user/user.slice';
import User from '../../User';
import { formatToClientDate } from '@/app/utils/formatToClientDate';
import { RiDeleteBinLine } from 'react-icons/ri';
import Typography from '../../typography';
import MetaInfo from '../../MetaInfo';
import { FcDislike } from 'react-icons/fc';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { FaRegComment } from 'react-icons/fa';
import ErrorMessage from '../../ErrorMessage';
import { hasErrorField } from '@/app/utils/hasErrorField';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/src/constants/api.url';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { SlOptions } from "react-icons/sl";


type Props = {
    avatarUrl: string;
    name: string;
    authorId: string;
    content: string;
    commentId?: string;
    likesCount?: number;
    commentsCount?: number;
    createdAt?: Date;
    id?: string;
    cardFor: 'comment' | 'post' | 'current-post';
    likeByUser?: boolean;
    views?: number
    usernameFrameUrl?: string;
    imageUrl?: string; // URL изображения поста
    avatarFrameUrl?: string; // Добавлено для соответствия с типами
    backgroundUrl?: string; // Добавлено для соответствия с типами
    dateOfBirth?: Date; // Добавлено для соответствия с типами
    bio?: string; // Биография пользователя
    authorCreatedAt?: Date; // Дата регистрации автора
    followersCount?: number; // Количество подписчиков
    followingCount?: number; // Количество подписок
    isFollowing?: boolean; // Подписан ли текущий пользователь
    onFollowToggle?: () => void; // Функция для подписки/отписки
}
type ViewProps = {
    isVisible?: boolean;
    postId: number | string;
}

const Card = ({
    name= '',
    avatarUrl = '',
    authorId= '',
    content= '',
    commentId= '',
    likesCount= 0,
    commentsCount= 0,
    createdAt,
    id= '',
    cardFor= 'post',
    likeByUser = false,
    views = 0,
    usernameFrameUrl,
    imageUrl,
    avatarFrameUrl,
    backgroundUrl,
    dateOfBirth,
    bio,
    authorCreatedAt,
    followersCount,
    followingCount,
    isFollowing,
    onFollowToggle,
}: Props) => {
    console.log('nameCard', name)
    const [likePost, {isLoading}] = useLikePostMutation();
    // TODO
    const [setView] = useLazyGetViewsQuery();
    const [unlikePost, {isLoading: unlikeLoading}] =useUnLikePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostsQuery();
    const [triggerGetPostById] = useLazyGetPostByIdQuery();
    const [deletePost, deletePostStatus] = useDeletePostMutation();
    const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
    const [error, setError] = useState('');
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
		const router = useRouter()
    const currentUser = useSelector(selectCurrent) 



    const refetchPost = async ()=> {
        switch(cardFor){
            case 'post':
                await triggerAllPosts().unwrap()
                break
            case 'current-post':
                await triggerAllPosts().unwrap()
                break
            case 'comment':
                await triggerGetPostById(id).unwrap()
                break
            default:
                throw new Error('Неверный аргумент cardFor')

        }
    }

    const handleDelete = async()=>{
        try{
            switch(cardFor){
                case 'post':
                    await deletePost(id).unwrap();
                    await refetchPost()
                    break
                case 'current-post':
                    await deletePost(id).unwrap();
										router.push('/')
                    break
                case 'comment':
                    await deleteComment(commentId).unwrap();
                    await refetchPost();
                    break
                default: 
                    throw new Error('Неверный аргумент cardFor')
                
            }
        }catch(err){
            if (hasErrorField(err)){
                setError(err.data.error)
            }else{
                setError(err as string)
            }
        } finally {
            onDeleteClose();
        }
    }

    const handleDeleteClick = () => {
        onDeleteOpen();
    }



    const handleLike = async ()=> {

        try{
            likeByUser 
                ? await unlikePost(id).unwrap() 
                : await likePost({postId: id}).unwrap();

                
            if(cardFor == 'current-post'){
                await triggerGetPostById(id).unwrap()

            }
            if(cardFor == 'post'){
                await triggerAllPosts().unwrap()

            }
        }catch(err){
            if (hasErrorField(err)){
                setError(err.data.error)
            }else{
                setError(err as string)
            }
        }
    }
    // Отправка просмотра (1 раз при появлении в зоне видимости)
    const handleView = async ({ postId }: ViewProps)=> {
        try{
            await axios.post(`${BASE_URL}/api/posts/${postId}/views`)
        }catch(err){
            console.log(err);
        }
    }

    const inViewRef = useRef<HTMLDivElement | null>(null)
    const [viewSent, setViewSent] = useState(false)

    useEffect(() => {
        if(viewSent) return
        const el = inViewRef.current
        if(!el || !id) return
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    handleView({postId: id})
                    setViewSent(true)
                    observer.disconnect()
                }
            })
        }, { threshold: 0.3 })
        observer.observe(el)
        return () => observer.disconnect()
    }, [id, viewSent])

  return (
    <NextCard className='mb-5'>
        <CardHeader className="justify-between items-center bg-transparent">
            <Link href={`/user/${authorId}`} >
                <User
                    usernameFrameUrl={usernameFrameUrl}
                    avatarFrameUrl={avatarFrameUrl}
                    backgroundUrl={backgroundUrl}
                    dateOfBirth={dateOfBirth}
                    name={name}
                    bio={bio}
                    createdAt={authorCreatedAt}
                    followersCount={followersCount}
                    followingCount={followingCount}
                    isFollowing={isFollowing}
                    onFollowToggle={onFollowToggle}
                    className="text-small font-semibold leading-none text-default-600"
                    avatarUrl={avatarUrl}
                    description={createdAt && formatToClientDate(createdAt)}
                />
            </Link>
                {
                    authorId === currentUser?.id && (
                        <>
                        <Dropdown>
                            <DropdownTrigger>
                                  <Button className="capitalize" isIconOnly color='default' variant='bordered'>

                            {
                                deletePostStatus.isLoading 
                                || 
                                deleteCommentStatus.isLoading 
                                ? 
                                (
                                    <Spinner/>
                                ) : 
                                (
                                    <SlOptions />

                                )
                            }

                                 </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dropdown Variants" color='default' variant='bordered' onAction={(key) => {
                                if (key === 'delete') {
                                    handleDeleteClick();
                                }
                            }}>
                                <DropdownItem key='edit'>Изменить</DropdownItem>
                                <DropdownItem key='delete' className='text-danger' color='danger'>Удалить</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                       
                        </>
                    )
                }
        </CardHeader>
        <CardBody className='px-3 py-2 mb-5'>
            <div ref={inViewRef}>
                <Typography>{content}</Typography>
                
                {/* Отображение изображения поста */}
                {imageUrl && (
                    <div className="mt-3 overflow-hidden">
                        <Image
                            isBlurred
                            src={imageUrl} 
                            alt="Изображение поста"
                            className="max-w-full h-auto rounded-lg object-cover "
                            style={{ maxHeight: '400px' }}
                        />
                    </div>
                )}
            </div>
            
        </CardBody>

                <div className='text-small text-default-400 pl-3 '> Views {views}</div>

        {
            cardFor !== 'comment' && (
                <CardFooter className='gap-3'>
                    
                    <div className="flex gap-5 items-center">
                        <div onClick={handleLike}>
                            {
                                isLoading || unlikeLoading
                                ? <Spinner size='sm' className='mx-1'/> 
                                : <MetaInfo 
                                count={likesCount}
                                Icon={likeByUser ? FcDislike : MdOutlineFavoriteBorder}
                                />
                            }
                            

                        </div>
                        <div className="">
                            {
                                isLoading || unlikeLoading
                                ? <Spinner size='sm' className='mx-1'/> 
                                : <MetaInfo 
                                count={likesCount}
                                Icon={likeByUser ? FcDislike : MdOutlineEmojiEmotions}
                                />
                            }

                        </div>
                        <Link href={`/posts/${id}`}>
                            <MetaInfo
                                count={commentsCount}
                                Icon={FaRegComment}
                            />
                        </Link>
                    </div>
                    <ErrorMessage error={error}/>
                </CardFooter>
            )
        }

        {/* Модальное окно подтверждения удаления */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Удалить пост?</ModalHeader>
                        <ModalBody>
                            <p>
                                Вы уверены, что хотите удалить {cardFor === 'comment' ? 'комментарий' : 'пост'}? 
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Отмена
                            </Button>
                            <Button 
                                color="danger" 
                                isLoading={deletePostStatus.isLoading || deleteCommentStatus.isLoading}
                                onClick={handleDelete}
                            >
                                Удалить
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </NextCard>
  )
}

export default Card