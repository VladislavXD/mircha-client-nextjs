'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Chip } from '@heroui/react'
import { MdPlayArrow, MdImage, MdMovie } from 'react-icons/md'
import MediaViewer from './MediaViewer'

interface MediaThumbnailProps {
  url: string
  thumbnailUrl?: string
  type?: 'image' | 'video'
  name?: string
  size?: number
  className?: string
  width?: number
  height?: number
  showOverlay?: boolean
  showInfo?: boolean // Показывать ли информацию под превью
  variant?: 'small' | 'medium' | 'large' // Размер превью
}

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  url,
  thumbnailUrl,
  type,
  name,
  size,
  className = '',
  width,
  height,
  showOverlay = true,
  showInfo = false,
  variant = 'medium'
}) => {
  const [showViewer, setShowViewer] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Размеры по умолчанию в зависимости от варианта
  const getDefaultSize = () => {
    switch (variant) {
      case 'small':
        return { width: 100, height: 100, smWidth: 120, smHeight: 120 }
      case 'medium':
        return { width: 180, height: 180, smWidth: 200, smHeight: 200 }
      case 'large':
        return { width: 280, height: 220, smWidth: 350, smHeight: 280 }
      default:
        return { width: 180, height: 180, smWidth: 200, smHeight: 200 }
    }
  }

  const defaultSize = getDefaultSize()
  const finalWidth = width || defaultSize.width
  const finalHeight = height || defaultSize.height

  // Определяем тип медиа по URL если не указан
  const getMediaType = (url: string): 'image' | 'video' => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv']
    if (videoExtensions.some(ext => url.toLowerCase().includes(ext))) {
      return 'video'
    }
    return 'image'
  }

  const mediaType = type || getMediaType(url)
  const displayUrl = thumbnailUrl || url

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowViewer(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      <div 
        className={`relative cursor-pointer group overflow-hidden rounded-lg hover:shadow-lg transition-all duration-200 ${className}`}
        style={{ 
          width: finalWidth, 
          height: finalHeight,
          maxWidth: '100%',
          minWidth: variant === 'small' ? '100px' : variant === 'medium' ? '180px' : '280px'
        }}
        onClick={handleClick}
      >
        {/* Изображение/превью */}
        {!imageError ? (
          <Image
            src={displayUrl}
            alt={name || 'Media'}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            {mediaType === 'video' ? (
              <MdMovie className="w-8 h-8 text-gray-400" />
            ) : (
              <MdImage className="w-8 h-8 text-gray-400" />
            )}
          </div>
        )}

        {/* Оверлей с информацией */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
            {/* Тип медиа */}
            <div className="absolute top-2 left-2">
              <Chip
                size="sm"
                color={mediaType === 'video' ? 'secondary' : 'primary'}
                variant="flat"
                className="bg-black/50 text-white"
                startContent={
                  mediaType === 'video' ? 
                    <MdPlayArrow className="w-3 h-3" /> : 
                    <MdImage className="w-3 h-3" />
                }
              >
                {mediaType === 'video' ? 'Video' : 'Image'}
              </Chip>
            </div>

            {/* Размер файла */}
            {size && !showInfo && (
              <div className="absolute top-2 right-2">
                <Chip
                  size="sm"
                  color="default"
                  variant="flat"
                  className="bg-black/50 text-white text-xs"
                >
                  {formatFileSize(size)}
                </Chip>
              </div>
            )}

            {/* Центральная иконка воспроизведения для видео */}
            {mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                  <MdPlayArrow className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            )}

            {/* Название файла только если не показываем информацию отдельно */}
            {name && !showInfo && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 rounded px-2 py-1">
                  <p className="text-white text-xs truncate">{name}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Информация под превью */}
      {showInfo && (
        <div className="space-y-1 w-full max-w-full" style={{ maxWidth: finalWidth }}>
          {name && (
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
              {name}
            </p>
          )}
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <Chip
              size="sm"
              color={mediaType === 'video' ? 'secondary' : 'primary'}
              variant="flat"
              startContent={
                mediaType === 'video' ? 
                  <MdMovie className="w-3 h-3" /> : 
                  <MdImage className="w-3 h-3" />
              }
              className="text-xs"
            >
              <span className="hidden sm:inline">{mediaType === 'video' ? 'Видео' : 'Изображение'}</span>
              <span className="sm:hidden">{mediaType === 'video' ? 'Vid' : 'Img'}</span>
            </Chip>
            {size && (
              <Chip size="sm" color="default" variant="flat" className="text-xs">
                {formatFileSize(size)}
              </Chip>
            )}
          </div>
        </div>
      )}

      {/* Медиа просмотрщик */}
      <MediaViewer
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
        media={{
          url,
          thumbnailUrl,
          type: mediaType,
          name,
          size
        }}
      />
    </div>
  )
}

export default MediaThumbnail
