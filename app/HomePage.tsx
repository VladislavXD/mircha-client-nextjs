'use client'
import React, { useEffect } from "react"
import { useGetAllPostsQuery } from "@/src/services/post/post.service"
import { useAppSelector } from "@/src/hooks/reduxHooks"
import { selectIsAuthenticated } from "@/src/store/user/user.slice"

import Card from "./components/ui/post/Card"
import { Spinner } from "@heroui/react"
import CreatePost from "./components/ui/post/CreatePost"
import emoji from '@/public/emoji/vikostvspack_agad2zmaakpyuuo_AgAD2zMAAkPYUUo_small.gif'
import axios from "axios"


const Posts = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  // Загружаем посты только после авторизации
  const { data, isLoading, error } = useGetAllPostsQuery(undefined, {
    skip: !isAuthenticated
  })

  useEffect(()=> {
    if (!isAuthenticated) return
    
    const key = 'c3aee40fa7bd44689311929ecb336252'
    const url ='https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey='+key;
    axios.get(url).then(res=> {
      console.log('new response ', res.data.articles)
    })
  }, [isAuthenticated])

  // Показываем загрузку пока не авторизованы
  if (!isAuthenticated) {
    return <Spinner className="flex h-full"/>
  }

  if (isLoading) return <Spinner className="flex h-full"/>
  if (error) {
    return <div className="text-center text-red-500">Ошибка загрузки постов</div>
  }
  if (!data || !Array.isArray(data)) {
    return <div className="text-center">Нет постов для отображения</div>
  }



  return ( 
    <>
      <div className="mb-6 w-full pb-8">
          <CreatePost/>

      </div>

      {
        data.length > 0 
        ?
        data.map(({
          content,
          author,
          id, 
          authorId,
          comments, 
          likes,
          likeByUser,
          createdAt,
          views,
          imageUrl,
          emojiUrls,
          
        })=> {
          // Отладка данных автора
          
          return (
          <Card
            key={id}
            avatarUrl={author?.avatarUrl ?? ''}
            avatarFrameUrl={author?.avatarFrameUrl ?? ''}
            backgroundUrl={author?.backgroundUrl ?? ''}
            dateOfBirth={author?.dateOfBirth}
            bio={author?.bio ?? ''}
            authorCreatedAt={author?.createdAt}
            followersCount={author?.followers?.length ?? 0}
            followingCount={author?.following?.length ?? 0}
            isFollowing={author?.isFolow ?? false}
            content={content}
            name={author?.name ?? ''}
            likesCount={likes?.length ?? 0}
            commentsCount={comments?.length ?? 0}
            authorId={authorId}
            likeByUser={likeByUser}
            createdAt={createdAt}
            cardFor="post"
            id={id}
            views={views?.length ?? 0}
            usernameFrameUrl={author?.usernameFrameUrl ?? ''}
            imageUrl={imageUrl}
            emojiUrls={emojiUrls}
          />
        )})  
        : 
        <div className="text-center text-gray-500">Нет постов для отображения</div>
      }
    </>
  )
}

export default Posts
