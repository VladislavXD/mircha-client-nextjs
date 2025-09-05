'use client'

import React from 'react'
import { Card, CardBody, CardHeader, Chip } from '@heroui/react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import MediaThumbnail from '@/app/components/MediaThumbnail'
import type { Thread, Reply } from '@/src/types/types'

interface PostTooltipProps {
  post: Thread | Reply
  isOP?: boolean
}

const PostTooltip: React.FC<PostTooltipProps> = ({ post, isOP = false }) => {
  const isThread = 'boardId' in post
  const postNumber = isThread ? 1 : (post as Reply).postNumber

  return (
    <Card className="max-w-xs sm:max-w-md shadow-lg border">
      <CardHeader className="pb-2 px-3">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-1 flex-wrap text-xs">
            <span className="font-medium text-green-600">
              {post.authorName || 'Анон'}
            </span>
            <span className="text-gray-500 hidden sm:inline">
              {formatDistanceToNow(new Date(post.createdAt), { 
                addSuffix: true, 
                locale: ru 
              })}
            </span>
            <span className="text-gray-400 hidden md:inline">
              {new Date(post.createdAt).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className="text-blue-500 font-mono">
              #{postNumber}
            </span>
            <span className="text-gray-400 font-mono">
              {post.shortId}
            </span>
            {isOP && (
              <Chip size="sm" color="primary" variant="flat" className="text-xs">
                OP
              </Chip>
            )}
          </div>
        </div>
        
        {/* Тема треда для OP поста */}
        {isOP && isThread && (post as Thread).subject && (
          <div className="w-full mt-1">
            <h3 className="text-sm font-semibold text-blue-600">
              {(post as Thread).subject}
            </h3>
          </div>
        )}
      </CardHeader>
      
      <CardBody className="pt-0 px-3">
        <div className="flex gap-2 sm:gap-3">
          {/* Медиа превью */}
          {post.imageUrl && (
            <div className="flex-shrink-0">
              <MediaThumbnail
                url={post.imageUrl}
                thumbnailUrl={post.thumbnailUrl}
                name={post.imageName}
                size={post.imageSize}
                variant="small"
                showInfo={false}
                className="border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}
          
          {/* Содержание поста */}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm">
              <p className="line-clamp-3 sm:line-clamp-4 whitespace-pre-wrap">
                {post.content.length > 120 
                  ? post.content.substring(0, 120) + '...'
                  : post.content
                }
              </p>
            </div>
            
            {/* Информация о файле */}
            {post.imageUrl && (
              <div className="mt-2 text-xs text-gray-500">
                {post.imageName && (
                  <div className="truncate">📎 {post.imageName}</div>
                )}
                {post.imageSize && (
                  <div>{(post.imageSize / 1024).toFixed(1)} KB</div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PostTooltip
