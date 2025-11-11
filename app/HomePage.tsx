'use client'
import React, { useEffect } from "react"
import { useGetAllPostsQuery } from "@/src/services/post/post.service"
import { useAppSelector } from "@/src/hooks/reduxHooks"
import { selectCurrent, selectIsAuthenticated } from "@/src/store/user/user.slice"
import Card from "./components/ui/post/Card"
import { addToast } from "@heroui/react"
import CreatePost from "./components/ui/post/CreatePost"
import axios from "axios"
import SkeletonLoadedState from "./components/ui/post/Card/Skeleton"

const Posts = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const current = useAppSelector(selectCurrent)
  
  // Загружаем посты всегда
  const { data, isLoading, error, isSuccess } = useGetAllPostsQuery()

  useEffect(() => {
    if (!isAuthenticated) return
    
    const key = 'c3aee40fa7bd44689311929ecb336252'
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`
    
    axios.get(url).then(res => {
      console.log('news response:', res.data.articles)
    }).catch(err => {
      console.error('News API error:', err)
    })
  }, [isAuthenticated])


  if (isLoading) {
    return (
      <>

        {isAuthenticated && current && (
          <div className="mb-6 w-full pb-8">
            <CreatePost />
          </div>
        )}


        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="mb-4 flex flex-col w-full items-center">
            <SkeletonLoadedState isLoaded={false} />
          </div>
        ))}
      </>
    )
  }


  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 text-lg">Ошибка загрузки постов</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Обновить страницу
        </button>
      </div>
    )
  }


  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <>

        {isAuthenticated && current && (
          <div className="mb-6 w-full pb-8">
            <CreatePost />
          </div>
        )}

        {/* Сообщение о пустом списке */}
        <div className="text-center p-10">
          <p className="text-gray-500 text-lg">Нет постов для отображения</p>
          {isAuthenticated && (
            <p className="text-gray-400 text-sm mt-2">
              Будьте первым, кто создаст пост!
            </p>
          )}
        </div>
      </>
    )
  }

  // 4️⃣ ОСНОВНОЙ РЕНДЕР: Посты загружены успешно
  return (
    <>
      {/* Форма создания поста */}
      {isAuthenticated && current && (
        <div className="mb-6 w-full pb-8">
          <CreatePost />
        </div>
      )}

      {/* Список постов */}
      {data.map((post) => {
        const {
          id,
          content,
          author,
          authorId,
          comments,
          likes,
          likeByUser,
          createdAt,
          views,
          imageUrl,
          emojiUrls,
        } = post

        // Проверка наличия автора
        if (!author) {
          console.warn(`Пост ${id} не имеет автора`)
          return null
        }

        return (
          <Card
            key={id}
            avatarUrl={author.avatarUrl ?? ''}
            avatarFrameUrl={author.avatarFrameUrl ?? ''}
            backgroundUrl={author.backgroundUrl ?? ''}
            dateOfBirth={author.dateOfBirth}
            bio={author.bio ?? ''}
            authorCreatedAt={author.createdAt}
            followersCount={author.followers?.length ?? 0}
            followingCount={author.following?.length ?? 0}
            isFollowing={author.isFollow ?? false}
            content={content}
            name={author.name ?? ''}
            likesCount={likes?.length ?? 0}
            commentsCount={comments?.length ?? 0}
            authorId={authorId}
            likeByUser={likeByUser}
            createdAt={createdAt}
            cardFor="post"
            id={id}
            views={views?.length ?? 0}
            usernameFrameUrl={author.usernameFrameUrl ?? ''}
            imageUrl={imageUrl}
            emojiUrls={emojiUrls}
          />
        )
      })}
    </>
  )
}

export default Posts
