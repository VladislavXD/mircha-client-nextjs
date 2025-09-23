'use client'

import React, { useState } from 'react'
import { Button, Modal, ModalContent, ModalBody } from '@heroui/react'
import Image from 'next/image'

interface PostContentProps {
  content: string
  imageUrl?: string
  imageName?: string
  thumbnailUrl?: string
}

const PostContent: React.FC<PostContentProps> = ({ 
  content, 
  imageUrl, 
  imageName, 
  thumbnailUrl 
}) => {
  const [showFullImage, setShowFullImage] = useState(false)

  // Обработка текста для поддержки цитат и ссылок
  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Обработка цитат (строки, начинающиеся с >)
        if (line.startsWith('>')) {
          return (
            <div key={index} className="text-green-600 dark:text-green-400 border-l-2 border-green-500 pl-2 my-1">
              {line}
            </div>
          )
        }
        
        // Обычный текст
        return (
          <div key={index} className="my-1">
            {line}
          </div>
        )
      })
  }

  const isVideo = (url?: string) => {
    if (!url) return false
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov')
  }

  return (
    <div className="space-y-3">
      {/* Изображение/Видео */}
      {imageUrl && (
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {isVideo(imageUrl) ? (
              <video 
                controls
                className="max-w-xs max-h-64 rounded-lg"
                poster={thumbnailUrl}
              >
                <source src={imageUrl} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            ) : (
              <div className="cursor-pointer" onClick={() => setShowFullImage(true)}>
                <Image
                  src={thumbnailUrl || imageUrl}
                  alt={imageName || 'Изображение поста'}
                  width={200}
                  height={200}
                  className="max-w-xs max-h-64 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  unoptimized
                />
              </div>
            )}
            
            {imageName && (
              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                {imageName}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {formatContent(content)}
            </div>
          </div>
        </div>
      )}

      {/* Только текст */}
      {!imageUrl && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {formatContent(content)}
        </div>
      )}

      {/* Модальное окно для полноразмерного изображения */}
      {imageUrl && !isVideo(imageUrl) && (
        <Modal 
          isOpen={showFullImage} 
          onClose={() => setShowFullImage(false)}
          size="full"
          className="bg-black bg-opacity-90"
        >
          <ModalContent className="bg-transparent shadow-none">
            <ModalBody className="flex items-center justify-center p-4">
              <div className="relative max-w-full max-h-full">
                <Image
                  src={imageUrl}
                  alt={imageName || 'Изображение поста'}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  unoptimized
                />
                <Button
                  className="absolute top-4 right-4"
                  color="danger"
                  variant="flat"
                  onPress={() => setShowFullImage(false)}
                >
                  Закрыть
                </Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

export default PostContent
