'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardBody, CardHeader, Chip, Tooltip } from '@heroui/react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import MediaThumbnail from '@/app/components/MediaThumbnail'
import PostTooltip from './PostTooltip'
import type { Thread, Reply } from '@/src/types/types'

interface PostContentProps {
  post: Thread | Reply
  isOP?: boolean // Является ли пост оригинальным постом треда
  showReplyTo?: boolean // Показывать ли ссылки на цитируемые посты
  onReplyToPost?: (postId: string, post?: Thread | Reply) => void // Колбек для ответа на пост
  allPosts?: (Thread | Reply)[] // Все посты в треде для тултипов
}

const PostContent: React.FC<PostContentProps> = ({ 
  post, 
  isOP = false,
  showReplyTo = true,
  onReplyToPost,
  allPosts = []
}) => {
  const [hoveredPosts, setHoveredPosts] = useState<{postId: string, timeoutId?: NodeJS.Timeout}[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const hoverTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Определение размера экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Очистка таймеров при размонтировании компонента
  useEffect(() => {
    return () => {
      hoverTimeoutRef.current.forEach(timeout => clearTimeout(timeout))
      hoverTimeoutRef.current.clear()
    }
  }, [])

  // Определяем, является ли пост Thread или Reply
  const isThread = 'boardId' in post
  const postNumber = isThread ? 1 : (post as Reply).postNumber

  // Находим пост по ID
  const findPostById = useCallback((id: string): Thread | Reply | undefined => {
    return allPosts.find(p => p.id === id)
  }, [allPosts])

  // Находим пост по shortId (для парсинга >>shortId в тексте)
  const findPostByShortId = useCallback((shortId: string): Thread | Reply | undefined => {
    return allPosts.find(p => p.shortId === shortId)
  }, [allPosts])

  // Находим пост по номеру (для обратной совместимости)
  const findPostByNumber = useCallback((num: number): Thread | Reply | undefined => {
    if (num === 1) {
      return allPosts.find(p => 'boardId' in p) as Thread
    }
    return allPosts.find(p => !('boardId' in p) && (p as Reply).postNumber === num) as Reply
  }, [allPosts])

  // Обработка наведения на ссылку поста (для >>shortId в тексте)
  const handlePostShortIdHover = useCallback((shortId: string, isEntering: boolean) => {
    const referencedPost = findPostByShortId(shortId)
    if (!referencedPost) return

    const postId = referencedPost.id
    const existingTimeout = hoverTimeoutRef.current.get(postId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
      hoverTimeoutRef.current.delete(postId)
    }

    if (isEntering) {
      setHoveredPosts(prev => {
        const existingIndex = prev.findIndex(item => item.postId === postId)
        if (existingIndex !== -1) {
          // Пост уже отображается, обновляем его позицию в цепочке
          const newPosts = [...prev]
          const [existingPost] = newPosts.splice(existingIndex, 1)
          return [...newPosts, existingPost]
        }
        // Добавляем новый пост в цепочку
        return [...prev, { postId }]
      })
    } else {
      // Устанавливаем задержку перед скрытием
      const timeoutId = setTimeout(() => {
        setHoveredPosts(prev => prev.filter(item => item.postId !== postId))
        hoverTimeoutRef.current.delete(postId)
      }, 200)
      
      hoverTimeoutRef.current.set(postId, timeoutId)
    }
  }, [findPostByShortId])

  // Обработка наведения на ссылку поста по номеру (для обратной совместимости)
  const handlePostNumberHover = useCallback((postNum: number, isEntering: boolean) => {
    const referencedPost = findPostByNumber(postNum)
    if (!referencedPost) return

    const postId = referencedPost.id
    const existingTimeout = hoverTimeoutRef.current.get(postId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
      hoverTimeoutRef.current.delete(postId)
    }

    if (isEntering) {
      setHoveredPosts(prev => {
        const existingIndex = prev.findIndex(item => item.postId === postId)
        if (existingIndex !== -1) {
          // Пост уже отображается, обновляем его позицию в цепочке
          const newPosts = [...prev]
          const [existingPost] = newPosts.splice(existingIndex, 1)
          return [...newPosts, existingPost]
        }
        // Добавляем новый пост в цепочку
        return [...prev, { postId }]
      })
    } else {
      // Устанавливаем задержку перед скрытием
      const timeoutId = setTimeout(() => {
        setHoveredPosts(prev => prev.filter(item => item.postId !== postId))
        hoverTimeoutRef.current.delete(postId)
      }, 200)
      
      hoverTimeoutRef.current.set(postId, timeoutId)
    }
  }, [findPostByNumber])

  // Обработка клика на ID поста для ответа
  const handlePostClick = useCallback((clickedPost: Thread | Reply) => {
    if (onReplyToPost) {
      onReplyToPost(clickedPost.id, clickedPost)
    }
  }, [onReplyToPost])

  // Обработка клика на номер поста в тексте (>>номер)
  const handlePostNumberClick = useCallback((postNum: number, referencedPost?: Thread | Reply) => {
    if (onReplyToPost && referencedPost) {
      onReplyToPost(referencedPost.id, referencedPost)
    }
  }, [onReplyToPost])

  // Разбираем контент для выделения цитат
  const parseContent = (content: string) => {
    // Сначала ищем новый формат >>shortId (6 символов)
    const shortIdParts = content.split(/(\>\>[a-z0-9]{6})/g)
    
    return shortIdParts.map((part, index) => {
      if (part.match(/\>\>[a-z0-9]{6}/)) {
        const shortId = part.slice(2)
        const referencedPost = findPostByShortId(shortId)
        
        return (
          <Tooltip
            key={`shortId-${index}`}
            isOpen={hoveredPosts.some(item => {
              const refPost = findPostByShortId(shortId)
              return refPost && item.postId === refPost.id
            })}
            content={
              referencedPost ? (
                <PostTooltip 
                  post={referencedPost} 
                  isOP={'boardId' in referencedPost}
                />
              ) : (
                <div className="p-2 text-sm">Пост не найден</div>
              )
            }
            placement="top"
            closeDelay={0}
            showArrow
          >
            <span 
              className={`text-blue-500 hover:text-blue-700 cursor-pointer hover:underline ${
                referencedPost ? '' : 'line-through text-gray-400'
              }`}
              onMouseEnter={() => handlePostShortIdHover(shortId, true)}
              onMouseLeave={() => handlePostShortIdHover(shortId, false)}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (referencedPost) {
                  handlePostClick(referencedPost)
                }
              }}
            >
              {part}
            </span>
          </Tooltip>
        )
      }
      
      // Обратная совместимость с номерами >>123
      const numberParts = part.split(/(\>\>\d+)/g)
      return numberParts.map((numPart, numIndex) => {
        if (numPart.match(/\>\>\d+/)) {
          const replyNum = parseInt(numPart.slice(2))
          const referencedPost = findPostByNumber(replyNum)
          
          return (
            <Tooltip
              key={`number-${index}-${numIndex}`}
              isOpen={hoveredPosts.some(item => {
                const refPost = findPostByNumber(replyNum)
                return refPost && item.postId === refPost.id
              })}
              content={
                referencedPost ? (
                  <PostTooltip 
                    post={referencedPost} 
                    isOP={replyNum === 1}
                  />
                ) : (
                  <div className="p-2 text-sm">Пост не найден</div>
                )
              }
              placement="top"
              closeDelay={0}
              showArrow
            >
              <span 
                className={`text-blue-500 hover:text-blue-700 cursor-pointer hover:underline ${
                  referencedPost ? '' : 'line-through text-gray-400'
                }`}
                onMouseEnter={() => handlePostNumberHover(replyNum, true)}
                onMouseLeave={() => handlePostNumberHover(replyNum, false)}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (referencedPost) {
                    handlePostClick(referencedPost)
                  }
                }}
              >
                {numPart}
              </span>
            </Tooltip>
          )
        }
        return numPart
      })
    }).flat()
  }

  return (
    <Card className={`${isOP ? 'border-l-4 border-l-primary' : ''} w-full`}>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap min-w-0 flex-1">
            <span className="font-medium text-green-600 text-sm sm:text-base truncate">
              {post.authorName || 'Анон'}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { 
                addSuffix: true, 
                locale: ru 
              })}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: isMobile ? '2-digit' : 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            
            <span 
              className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer hover:underline font-mono shrink-0"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handlePostClick(post)
              }}
            >
              {post.shortId}
            </span>
            {isOP && (
              <Chip size="sm" color="primary" variant="flat" className="text-xs">
                OP
              </Chip>
            )}
            <Chip color="default" size="sm" variant="flat" className="text-xs shrink-0">
              #{postNumber}
            </Chip>
          </div>
          
          <div className="flex gap-1 shrink-0 ml-2">
            {isThread && (post as Thread).isPinned && (
              <Chip size="sm" color="warning" variant="flat" className="text-xs">
                Закреплён
              </Chip>
            )}
            {isThread && (post as Thread).isLocked && (
              <Chip size="sm" color="secondary" variant="flat" className="text-xs">
                Заблокирован
              </Chip>
            )}
          </div>
        </div>
        
        {/* Тема треда для OP поста */}
        {isOP && isThread && (post as Thread).subject && (
          <div className="w-full mt-2">
            <h2 className="text-base sm:text-lg font-semibold text-blue-600 break-words">
              {(post as Thread).subject}
            </h2>
          </div>
        )}
      </CardHeader>
      
      <CardBody className="pt-0 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Медиа превью */}
          {post.imageUrl && (
            <div className="flex-shrink-0 self-start">
              <MediaThumbnail
                url={post.imageUrl}
                thumbnailUrl={post.thumbnailUrl}
                name={post.imageName}
                size={post.imageSize}
                variant={isOP ? (isMobile ? 'medium' : 'large') : 'medium'}
                showInfo={true}
                className="border border-gray-200 dark:border-gray-700 w-full sm:w-auto max-w-full"
              />
            </div>
          )}
          
          {/* Содержание поста */}
          <div className="flex-1 min-w-0">
            {/* Цитируемые посты */}
            {showReplyTo && !isThread && (post as Reply).replyTo && (post as Reply).replyTo.length > 0 && (
              <div className="mb-2 flex gap-1 flex-wrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-1 -mx-1 sm:mx-0">
                {(post as Reply).replyTo.map(shortId => {
                  const referencedPost = findPostByShortId(shortId)
                  return (
                    <Tooltip
                      key={shortId}
                      isOpen={hoveredPosts.some(item => {
                        const refPost = findPostByShortId(shortId)
                        return refPost && item.postId === refPost.id
                      })}
                      content={
                        referencedPost ? (
                          <PostTooltip 
                            post={referencedPost} 
                            isOP={'boardId' in referencedPost}
                          />
                        ) : (
                          <div className="p-2 text-sm">Пост не найден</div>
                        )
                      }
                      placement="top"
                      closeDelay={0}
                      showArrow
                    >
                      
                    </Tooltip>
                  )
                })}
              </div>
            )}
            
            {/* Основной текст */}
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm sm:text-base break-words">
                {parseContent(post.content)}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PostContent
